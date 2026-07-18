import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import type {
  VisitorAttributes,
  VisitorProfile,
  VisitorSummary,
  VisitorsApiStatus,
} from '@intracom/contracts';
import { Visitor } from '@prisma/client';
import { loadFeatureFlags } from '../config/features';
import { ListVisitorsQueryDto } from './dto/list-visitors-query.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { VisitorRepository } from './visitor.repository';

@Injectable()
export class VisitorsService {
  private readonly features = loadFeatureFlags();

  constructor(private readonly visitorRepository: VisitorRepository) {}

  getStatus(): VisitorsApiStatus {
    return { visitorsApiEnabled: this.features.visitorsApiEnabled };
  }

  private assertEnabled(): void {
    if (!this.features.visitorsApiEnabled) {
      throw new ServiceUnavailableException('Visitors API is disabled');
    }
  }

  async listVisitors(query: ListVisitorsQueryDto): Promise<VisitorSummary[]> {
    this.assertEnabled();

    const visitors = await this.visitorRepository.listVisitors(
      query.limit ?? 50,
      query.search,
    );

    return visitors.map((visitor) => this.toSummary(visitor));
  }

  async getVisitor(visitorId: string): Promise<VisitorProfile> {
    this.assertEnabled();

    const visitor = await this.visitorRepository.findById(visitorId);

    if (!visitor) {
      throw new NotFoundException('Visitor not found');
    }

    return {
      ...this.toSummary(visitor),
      conversations: visitor.conversations.map((conversation) => ({
        id: conversation.id,
        status: conversation.status,
        updatedAt: conversation.updatedAt.toISOString(),
        messageCount: conversation._count.messages,
      })),
    };
  }

  async updateVisitor(
    visitorId: string,
    dto: UpdateVisitorDto,
  ): Promise<VisitorSummary> {
    this.assertEnabled();

    await this.getVisitor(visitorId);

    const updated = await this.visitorRepository.update(visitorId, dto);

    return this.toSummary(updated);
  }

  async trackFromMessage(input: {
    visitorId?: string;
    appId: string;
    conversationId: string;
    visitorAttributes?: Record<string, unknown>;
  }): Promise<void> {
    if (!this.features.chatPersistenceEnabled || !input.visitorId) {
      return;
    }

    await this.visitorRepository.ensureExists({
      id: input.visitorId,
      appId: input.appId,
      attributes: input.visitorAttributes,
    });

    await this.visitorRepository.touchLastSeen(input.visitorId);
  }

  private toSummary(
    visitor: Visitor & { _count: { conversations: number } },
  ): VisitorSummary {
    return {
      id: visitor.id,
      appId: visitor.appId,
      email: visitor.email,
      name: visitor.name,
      attributes: visitor.attributes as VisitorAttributes,
      lastSeenAt: visitor.lastSeenAt.toISOString(),
      createdAt: visitor.createdAt.toISOString(),
      conversationCount: visitor._count.conversations,
    };
  }
}
