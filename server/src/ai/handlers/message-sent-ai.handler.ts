import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { DOMAIN_EVENTS } from '@intracom/contracts';
import { MessageSentEvent } from '../../chat/events/message-sent.event';

@Injectable()
export class MessageSentAiHandler {
  private readonly logger = new Logger(MessageSentAiHandler.name);

  constructor(
    @InjectQueue('ai') private readonly aiQueue: Queue,
  ) {}

  @OnEvent(DOMAIN_EVENTS.MESSAGE_SENT)
  async handleMessageSent(event: MessageSentEvent) {
    // Only process messages from visitors, not admins or the AI itself.
    if (event.isAdmin) {
      return;
    }

    try {
      await this.aiQueue.add('generate-reply', {
        conversationId: event.conversationId,
      }, {
        attempts: 1, // Don't retry AI generation too aggressively
      });
      this.logger.log(`Enqueued AI generation job for conversation ${event.conversationId}`);
    } catch (error) {
      this.logger.error(`Failed to enqueue AI generation job: ${error.message}`, error.stack);
    }
  }
}
