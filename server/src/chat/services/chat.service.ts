import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessageRepository } from '../repositories/message.repository';
import { SendMessageDto } from '../dto/send-message.dto';
import { MessageSentEvent } from '../events/message-sent.event';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async processIncomingMessage(dto: SendMessageDto) {
    // 1. Validate / Apply business rules (e.g. is user banned?)
    
    // 2. Persist to Postgres via Repository
    const savedMessage = await this.messageRepository.save(dto);

    this.logger.log(`Message saved in conversation ${dto.conversationId}`);

    // 3. Emit Domain Event so the Gateway (or other systems like Email notifications) can react
    this.eventEmitter.emit(
      'message.sent',
      new MessageSentEvent(
        savedMessage.id,
        savedMessage.conversationId,
        savedMessage.text,
        savedMessage.senderId,
        savedMessage.isAdmin,
      ),
    );

    return savedMessage;
  }
}
