import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI, Type, FunctionDeclaration, GenerateContentResponse, Content } from '@google/genai';
import { Message as MessageDto } from '@intracom/contracts';
import { KnowledgeBaseService } from './knowledge-base.service';

export interface AgentResult {
  text?: string;
  escalate: boolean;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private ai: GoogleGenAI;

  constructor(private readonly kbService: KnowledgeBaseService) {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  // Tool: Search Knowledge Base
  private readonly searchKbTool: FunctionDeclaration = {
    name: 'searchKnowledgeBase',
    description: 'Search the company knowledge base for policies, SLA, shipping, or business hours.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: {
          type: Type.STRING,
          description: 'The search query or keywords (e.g. "refund policy").',
        },
      },
      required: ['query'],
    },
  };

  /**
   * The ReAct Loop: Reason + Act.
   * The agent can loop up to 3 times to gather information before answering.
   */
  async generateReply(history: MessageDto[], intent: string): Promise<AgentResult> {
    if (!process.env.GEMINI_API_KEY) {
      this.logger.warn('GEMINI_API_KEY is not set. Escalating.');
      return { escalate: true };
    }

    const contents: Content[] = history.map((msg) => ({
      role: msg.isAdmin ? 'model' : 'user',
      parts: [{ text: msg.text }],
    }));

    let loopCount = 0;
    const maxLoops = 3;

    while (loopCount < maxLoops) {
      loopCount++;
      this.logger.log(`ReAct Loop iteration ${loopCount}/${maxLoops}`);

      try {
        const response = await this.ai.models.generateContent({
          model: 'gemini-2.5-pro',
          contents,
          config: {
            systemInstruction: `You are a helpful tier-1 customer ${intent} agent for Intracom.
You must use the searchKnowledgeBase tool if you are unsure about a company policy.
If you cannot help the user, or they demand a human, say exactly: "ESCALATE_TO_HUMAN".`,
            tools: [{ functionDeclarations: [this.searchKbTool] }],
          },
        });

        // 1. Check if AI wants to call a tool
        if (response.functionCalls && response.functionCalls.length > 0) {
          const call = response.functionCalls[0];
          this.logger.log(`[Thought -> Action] Calling tool: ${call.name} with ${JSON.stringify(call.args)}`);
          
          let toolResultStr = '';
          if (call.name === 'searchKnowledgeBase') {
            const query = call.args?.query as string;
            toolResultStr = await this.kbService.search(query);
          } else {
            toolResultStr = 'Tool not found.';
          }

          this.logger.log(`[Observation] Tool returned: ${toolResultStr.substring(0, 50)}...`);

          // Append AI's function call request to history
          contents.push({
            role: 'model',
            parts: [{ functionCall: call }],
          });

          // Append the function result (observation) to history
          contents.push({
            role: 'user',
            parts: [{ functionResponse: { name: call.name, response: { result: toolResultStr } } }],
          });

          // Loop continues... AI will look at this observation and try again
          continue; 
        }

        // 2. Check if AI wants to escalate
        if (response.text && response.text.includes('ESCALATE_TO_HUMAN')) {
          this.logger.warn('AI decided to escalate to a human.');
          return { escalate: true };
        }

        // 3. Final answer reached
        if (response.text) {
          this.logger.log(`[Final Answer] ${response.text.substring(0, 50)}...`);
          return { text: response.text, escalate: false };
        }

      } catch (error) {
        this.logger.error('Failed to generate AI content in loop', error);
        return { escalate: true };
      }
    }

    this.logger.warn('ReAct Loop max exceeded. Escalating to human.');
    return { escalate: true };
  }
}
