import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AiService } from '../services/ai.service';
import { AiRouterService } from '../services/ai-router.service';
import { ChatService } from '../../chat/services/chat.service';
import { MessageRepository } from '../../chat/repositories/message.repository';

@Processor('ai')
export class AiProcessor extends WorkerHost {
  private readonly logger = new Logger(AiProcessor.name);
  
  // A dedicated user ID to represent the AI agent in the database
  private readonly AI_AGENT_ID = 'system-ai-agent';

  constructor(
    private readonly aiService: AiService,
    private readonly aiRouterService: AiRouterService,
    private readonly chatService: ChatService,
    private readonly messageRepository: MessageRepository,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    if (job.name !== 'generate-reply') {
      this.logger.warn(`Unknown job name: ${job.name}`);
      return;
    }

    const { conversationId } = job.data;
    this.logger.log(`Processing AI reply for conversation ${conversationId}`);

    // Fetch context
    const messages = await this.messageRepository.getConversationHistory(conversationId, 15);
    const historyDtos = messages.map(m => this.messageRepository.toDto(m));

    // 1. Route the conversation (Structured Output JSON)
    const route = await this.aiRouterService.determineIntent(historyDtos);
    
    if (route.intent === 'escalate') {
      this.logger.log('Router escalated the conversation to a human.');
      await this.chatService.updateConversationStatus(conversationId, 'open'); // Ensure it's in the inbox
      return;
    }

    // 2. Delegate to the specialized Agent (ReAct Loop)
    const result = await this.aiService.generateReply(historyDtos, route.intent);

    if (result.escalate || !result.text) {
      this.logger.log('Agent failed to answer or decided to escalate.');
      await this.chatService.processIncomingMessage({
        conversationId,
        text: "I'm having trouble assisting you right now. I will escalate this to a human agent who will be with you shortly.",
        senderId: this.AI_AGENT_ID,
        isAdmin: true,
      });
      return;
    }

    // 3. Deliver final answer
    this.logger.log(`AI generated reply: "${result.text.substring(0, 50)}..."`);
    await this.chatService.processIncomingMessage({
      conversationId,
      text: result.text,
      senderId: this.AI_AGENT_ID,
      isAdmin: true,
    });
  }
}
