import { Message } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConversationRepository } from './conversation.repository';
import { SendMessageDto } from '../dto/send-message.dto';
import { loadFeatureFlags } from '../../config/features';

@Injectable()
export class MessageRepository {
  private readonly features = loadFeatureFlags();

  constructor(
    private readonly prisma: PrismaService,
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async save(dto: SendMessageDto) {
    if (this.features.chatPersistenceEnabled) {
      await this.conversationRepository.ensureExists(
        dto.conversationId,
        dto.appId ?? this.features.defaultAppId,
      );
    }

    return this.prisma.message.create({
      data: {
        text: dto.text,
        senderId: dto.senderId,
        isAdmin: dto.isAdmin,
        conversation: {
          connect: { id: dto.conversationId },
        },
      },
    });
  }

  async getConversationHistory(conversationId: string, limit = 100) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }

  toDto(message: Message) {
    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      text: message.text,
      isAdmin: message.isAdmin,
      createdAt: message.createdAt.toISOString(),
    };
  }
}
