import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI, Type, Schema } from '@google/genai';
import { Message as MessageDto } from '@intracom/contracts';

export interface RouterDecision {
  intent: 'support' | 'sales' | 'escalate';
  confidence: number;
}

@Injectable()
export class AiRouterService {
  private readonly logger = new Logger(AiRouterService.name);
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  /**
   * Analyzes the conversation and outputs a strict JSON routing decision.
   */
  async determineIntent(history: MessageDto[]): Promise<RouterDecision> {
    if (!process.env.GEMINI_API_KEY || history.length === 0) {
      return { intent: 'escalate', confidence: 1 };
    }

    const lastMessage = history[history.length - 1];

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        intent: {
          type: Type.STRING,
          description: 'The classified intent of the user. "escalate" if they want a human, are very angry, or ask a complex technical issue.',
          enum: ['support', 'sales', 'escalate']
        },
        confidence: {
          type: Type.NUMBER,
          description: 'Confidence score from 0.0 to 1.0'
        }
      },
      required: ['intent', 'confidence'],
    };

    try {
      this.logger.log('Routing conversation...');
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: `User message: ${lastMessage.text}` }] }],
        config: {
          systemInstruction: 'You are an intelligent router. Classify the user\'s message intent. Output strict JSON.',
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        },
      });

      if (!response.text) {
        throw new Error('No text returned from Gemini Router');
      }

      const decision: RouterDecision = JSON.parse(response.text);
      this.logger.log(`Routed as: ${decision.intent} (confidence: ${decision.confidence})`);
      return decision;
    } catch (error) {
      this.logger.error('Failed to route conversation, falling back to escalate', error);
      return { intent: 'escalate', confidence: 1 };
    }
  }
}
