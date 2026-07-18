import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { DOMAIN_EVENTS } from '@intracom/contracts';
import { MessageSentEvent } from '../../chat/events/message-sent.event';

@Injectable()
export class MessageSentEmailHandler {
  private readonly logger = new Logger(MessageSentEmailHandler.name);

  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) {}

  @OnEvent(DOMAIN_EVENTS.MESSAGE_SENT)
  async handleMessageSent(event: MessageSentEvent) {
    // Only send notification if it's from a visitor (not admin) 
    // to notify the admin about an incoming customer message.
    if (event.isAdmin) {
      return;
    }

    try {
      await this.emailQueue.add('new-message-email', {
        messageId: event.messageId,
        conversationId: event.conversationId,
        text: event.text,
        senderId: event.senderId,
        isAdmin: event.isAdmin,
      }, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      });
      this.logger.log(`Enqueued email notification job for message ${event.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to enqueue email notification job: ${error.message}`, error.stack);
    }
  }
}
