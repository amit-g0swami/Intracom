import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsRepository {
  constructor(private readonly prisma: PrismaService) {}

  countMessagesSince(since: Date) {
    return this.prisma.message.count({
      where: { createdAt: { gte: since } },
    });
  }

  countConversationsByStatus(status: 'open' | 'resolved') {
    return this.prisma.conversation.count({ where: { status } });
  }

  messagesSince(since: Date) {
    return this.prisma.message.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, conversationId: true, isAdmin: true },
      orderBy: [{ conversationId: 'asc' }, { createdAt: 'asc' }],
    });
  }

  conversationsSince(since: Date) {
    return this.prisma.conversation.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    });
  }
}
