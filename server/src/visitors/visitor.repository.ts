import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface EnsureVisitorInput {
  id: string;
  appId: string;
  attributes?: Record<string, unknown>;
}

@Injectable()
export class VisitorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async ensureExists(input: EnsureVisitorInput) {
    const attributes = (input.attributes ?? {}) as Prisma.InputJsonValue;

    return this.prisma.visitor.upsert({
      where: { id: input.id },
      create: {
        id: input.id,
        appId: input.appId,
        attributes,
        lastSeenAt: new Date(),
      },
      update: {
        lastSeenAt: new Date(),
        attributes:
          Object.keys(input.attributes ?? {}).length > 0
            ? attributes
            : undefined,
      },
    });
  }

  async touchLastSeen(visitorId: string) {
    return this.prisma.visitor.update({
      where: { id: visitorId },
      data: { lastSeenAt: new Date() },
    });
  }

  async listVisitors(limit: number, search?: string) {
    const where: Prisma.VisitorWhereInput = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' } },
            { name: { contains: search, mode: 'insensitive' } },
            { id: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    return this.prisma.visitor.findMany({
      where,
      take: limit,
      orderBy: { lastSeenAt: 'desc' },
      include: {
        _count: {
          select: { conversations: true },
        },
      },
    });
  }

  async findById(visitorId: string) {
    return this.prisma.visitor.findUnique({
      where: { id: visitorId },
      include: {
        conversations: {
          orderBy: { updatedAt: 'desc' },
          include: {
            _count: {
              select: { messages: true },
            },
          },
        },
        _count: {
          select: { conversations: true },
        },
      },
    });
  }

  async update(
    visitorId: string,
    data: {
      email?: string | null;
      name?: string | null;
      attributes?: Record<string, unknown>;
    },
  ) {
    return this.prisma.visitor.update({
      where: { id: visitorId },
      data: {
        email: data.email,
        name: data.name,
        attributes: data.attributes as Prisma.InputJsonValue | undefined,
      },
      include: {
        _count: {
          select: { conversations: true },
        },
      },
    });
  }
}
