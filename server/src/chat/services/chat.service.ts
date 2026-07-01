import { randomUUID } from 'crypto';
import {
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { DOMAIN_EVENTS } from '@intracom/contracts';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { loadFeatureFlags } from '../../config/features';
import { ListConversationsQueryDto } from '../dto/list-conversations-query.dto';
import { SendMessageDto } from '../dto/send-message.dto';
import {
  ChatApiStatusDto,
  ConversationSummaryDto,
  MessageDto,
} from '../dto/chat-response.dto';
import { MessageSentEvent } from '../events/message-sent.event';
import { ConversationRepository } from '../repositories/conversation.repository';
import { MessageRepository } from '../repositories/message.repository';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly features = loadFeatureFlags();

  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  getStatus(): ChatApiStatusDto {
    return {
      chatApiEnabled: this.features.chatApiEnabled,
      chatPersistenceEnabled: this.features.chatPersistenceEnabled,
    };
  }

  private assertChatApiEnabled(): void {
    if (!this.features.chatApiEnabled) {
      throw new ServiceUnavailableException('Chat API is disabled');
    }
  }

  async listConversations(
    query: ListConversationsQueryDto,
  ): Promise<ConversationSummaryDto[]> {
    this.assertChatApiEnabled();

    const conversations = await this.conversationRepository.listInbox(
      query.limit ?? 50,
      query.status,
    );

    return conversations.map((conversation) => ({
      id: conversation.id,
      appId: conversation.appId,
      status: conversation.status,
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString(),
      messageCount: conversation._count.messages,
      lastMessage: conversation.messages[0]
        ? this.messageRepository.toDto(conversation.messages[0])
        : undefined,
    }));
  }

  async getConversation(conversationId: string): Promise<ConversationSummaryDto> {
    this.assertChatApiEnabled();

    const conversation = await this.conversationRepository.findById(conversationId);

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return {
      id: conversation.id,
      appId: conversation.appId,
      status: conversation.status,
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString(),
      messageCount: conversation._count.messages,
    };
  }

  async getConversationMessages(
    conversationId: string,
    limit = 100,
  ): Promise<MessageDto[]> {
    this.assertChatApiEnabled();

    const conversation = await this.conversationRepository.findById(conversationId);

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const messages = await this.messageRepository.getConversationHistory(
      conversationId,
      limit,
    );

    return messages.map((message) => this.messageRepository.toDto(message));
  }

  async updateConversationStatus(
    conversationId: string,
    status: 'open' | 'resolved',
  ): Promise<ConversationSummaryDto> {
    this.assertChatApiEnabled();

    await this.getConversation(conversationId);
    const updated = await this.conversationRepository.updateStatus(
      conversationId,
      status,
    );

    return {
      id: updated.id,
      appId: updated.appId,
      status: updated.status,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      messageCount: 0,
    };
  }

  async processIncomingMessage(dto: SendMessageDto) {
    if (!this.features.chatPersistenceEnabled) {
      const createdAt = new Date();
      const messageId = randomUUID();

      this.logger.log(
        `Message relayed (persistence off) in conversation ${dto.conversationId}`,
      );

      this.eventEmitter.emit(
        DOMAIN_EVENTS.MESSAGE_SENT,
        new MessageSentEvent(
          messageId,
          dto.conversationId,
          dto.text,
          dto.senderId,
          dto.isAdmin,
          createdAt,
        ),
      );

      return {
        id: messageId,
        conversationId: dto.conversationId,
        text: dto.text,
        senderId: dto.senderId,
        isAdmin: dto.isAdmin,
        createdAt,
      };
    }

    const savedMessage = await this.messageRepository.save(dto);

    this.logger.log(`Message saved in conversation ${dto.conversationId}`);

    this.eventEmitter.emit(
      DOMAIN_EVENTS.MESSAGE_SENT,
      new MessageSentEvent(
        savedMessage.id,
        savedMessage.conversationId,
        savedMessage.text,
        savedMessage.senderId,
        savedMessage.isAdmin,
        savedMessage.createdAt,
      ),
    );

    return savedMessage;
  }
}
