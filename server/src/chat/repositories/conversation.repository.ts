import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ConversationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async ensureExists(conversationId: string, appId: string) {
    return this.prisma.conversation.upsert({
      where: { id: conversationId },
      create: {
        id: conversationId,
        appId,
      },
      update: {},
    });
  }

  async listInbox(limit: number, status?: 'open' | 'resolved') {
    return this.prisma.conversation.findMany({
      where: status ? { status } : undefined,
      take: limit,
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        _count: {
          select: { messages: true },
        },
      },
    });
  }

  async findById(conversationId: string) {
    return this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });
  }

  async updateStatus(conversationId: string, status: 'open' | 'resolved') {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { status },
    });
  }

  async linkVisitor(conversationId: string, visitorId: string) {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { visitorId },
    });
  }
}
