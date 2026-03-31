import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SendMessageDto } from '../dto/send-message.dto';

@Injectable()
export class MessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(dto: SendMessageDto) {
    return this.prisma.message.create({
      data: {
        text: dto.text,
        senderId: dto.senderId,
        isAdmin: dto.isAdmin,
        conversation: {
          connect: { id: dto.conversationId }
        }
      },
    });
  }

  async getConversationHistory(conversationId: string) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
