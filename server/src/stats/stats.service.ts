import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import type {
  AnalyticsDashboard,
  AnalyticsDailyPoint,
  AnalyticsHourlyPoint,
  StatsApiStatus,
} from '@intracom/contracts';
import { loadFeatureFlags } from '../config/features';
import { StatsRepository } from './stats.repository';

const HOUR_BUCKETS = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'] as const;
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

@Injectable()
export class StatsService {
  private readonly features = loadFeatureFlags();

  constructor(private readonly statsRepository: StatsRepository) {}

  getStatus(): StatsApiStatus {
    return { statsApiEnabled: this.features.statsApiEnabled };
  }

  private assertEnabled(): void {
    if (!this.features.statsApiEnabled) {
      throw new ServiceUnavailableException('Stats API is disabled');
    }
  }

  async getDashboard(): Promise<AnalyticsDashboard> {
    this.assertEnabled();

    const now = new Date();
    const startOfToday = this.startOfDay(now);
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [
      messagesToday,
      messagesYesterday,
      openConversations,
      resolvedConversations,
      recentMessages,
      recentConversations,
    ] = await Promise.all([
      this.statsRepository.countMessagesSince(startOfToday),
      this.statsRepository.countMessagesSince(startOfYesterday).then(async (total) => {
        const throughToday = await this.statsRepository.countMessagesSince(startOfToday);
        return total - throughToday;
      }),
      this.statsRepository.countConversationsByStatus('open'),
      this.statsRepository.countConversationsByStatus('resolved'),
      this.statsRepository.messagesSince(twentyFourHoursAgo),
      this.statsRepository.conversationsSince(sevenDaysAgo),
    ]);

    const weekMessages = await this.statsRepository.messagesSince(sevenDaysAgo);

    return {
      overview: {
        messagesToday,
        messagesYesterday,
        openConversations,
        resolvedConversations,
        avgResponseTimeMs: this.computeAvgResponseTimeMs(weekMessages),
      },
      hourlyVolume: this.buildHourlyVolume(recentMessages),
      dailyActivity: this.buildDailyActivity(weekMessages, recentConversations),
      statusBreakdown: [
        { name: 'Open', value: openConversations },
        { name: 'Resolved', value: resolvedConversations },
      ],
    };
  }

  private startOfDay(date: Date): Date {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
  }

  private computeAvgResponseTimeMs(
    messages: { conversationId: string; isAdmin: boolean; createdAt: Date }[],
  ): number | null {
    const deltas: number[] = [];
    let currentConversationId = '';
    let lastVisitorAt: Date | null = null;

    for (const message of messages) {
      if (message.conversationId !== currentConversationId) {
        currentConversationId = message.conversationId;
        lastVisitorAt = null;
      }

      if (!message.isAdmin) {
        lastVisitorAt = message.createdAt;
        continue;
      }

      if (lastVisitorAt) {
        deltas.push(message.createdAt.getTime() - lastVisitorAt.getTime());
        lastVisitorAt = null;
      }
    }

    if (deltas.length === 0) {
      return null;
    }

    return Math.round(deltas.reduce((sum, value) => sum + value, 0) / deltas.length);
  }

  private buildHourlyVolume(
    messages: { createdAt: Date }[],
  ): AnalyticsHourlyPoint[] {
    const counts = new Map<string, number>(
      HOUR_BUCKETS.map((time) => [time, 0]),
    );

    for (const message of messages) {
      const hour = message.createdAt.getHours();
      const bucket = HOUR_BUCKETS[Math.floor(hour / 4)] ?? HOUR_BUCKETS[0];
      counts.set(bucket, (counts.get(bucket) ?? 0) + 1);
    }

    return HOUR_BUCKETS.map((time) => ({
      time,
      messages: counts.get(time) ?? 0,
    }));
  }

  private buildDailyActivity(
    messages: { createdAt: Date }[],
    conversations: { createdAt: Date }[],
  ): AnalyticsDailyPoint[] {
    const days: AnalyticsDailyPoint[] = [];

    for (let offset = 6; offset >= 0; offset -= 1) {
      const dayStart = this.startOfDay(new Date());
      dayStart.setDate(dayStart.getDate() - offset);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const label = DAY_LABELS[dayStart.getDay()];
      const messageCount = messages.filter(
        (message) =>
          message.createdAt >= dayStart && message.createdAt < dayEnd,
      ).length;
      const conversationCount = conversations.filter(
        (conversation) =>
          conversation.createdAt >= dayStart && conversation.createdAt < dayEnd,
      ).length;

      days.push({
        day: label,
        messages: messageCount,
        conversations: conversationCount,
      });
    }

    return days;
  }
}
