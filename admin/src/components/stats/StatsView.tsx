"use client";

import { useEffect, useMemo, useState } from 'react';
import type { AnalyticsDashboard } from '@intracom/contracts';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  LineChart,
  BarChart,
  PieChart,
  Typography,
  StatCard,
  Spinner,
  EmptyState,
} from 'intracom-ui';
import { MessageSquare, Users, Clock, BarChart3 } from 'lucide-react';
import { fetchAnalyticsDashboard } from '@/lib/stats-api';
import { features } from '@/lib/features';

function formatDuration(ms: number | null): string {
  if (ms === null) {
    return '—';
  }

  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }

  return `${minutes}m ${seconds}s`;
}

function formatTrend(today: number, yesterday: number): { value: string; positive: boolean } {
  if (yesterday === 0) {
    return { value: today > 0 ? 'new' : '0%', positive: today >= 0 };
  }

  const change = ((today - yesterday) / yesterday) * 100;
  const positive = change >= 0;

  return {
    value: `${positive ? '+' : ''}${change.toFixed(1)}%`,
    positive,
  };
}

export function StatsView() {
  const [dashboard, setDashboard] = useState<AnalyticsDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!features.statsApi) {
      setIsLoading(false);
      return;
    }

    fetchAnalyticsDashboard()
      .then(setDashboard)
      .catch(() => setError('Unable to load analytics. Check server and database.'))
      .finally(() => setIsLoading(false));
  }, []);

  const hourlyChartData = useMemo(
    () =>
      dashboard?.hourlyVolume.map((row) => ({
        time: row.time,
        chats: row.messages,
      })) ?? [],
    [dashboard],
  );

  const dailyChartData = useMemo(
    () =>
      dashboard?.dailyActivity.map((row) => ({
        day: row.day,
        active: row.messages,
        closed: row.conversations,
      })) ?? [],
    [dashboard],
  );

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[var(--sp-bg-surface)]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!features.statsApi || error || !dashboard) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[var(--sp-bg-surface)] p-8">
        <EmptyState
          icon={<BarChart3 className="h-6 w-6" />}
          title="Analytics unavailable"
          description={error ?? 'Enable NEXT_PUBLIC_FEATURE_STATS_API and ensure PostgreSQL is running.'}
          className="max-w-md border-0 bg-transparent shadow-none"
        />
      </div>
    );
  }

  const messageTrend = formatTrend(
    dashboard.overview.messagesToday,
    dashboard.overview.messagesYesterday,
  );

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--sp-bg-surface)] p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <Typography variant="h2" className="mb-2">Analytics Overview</Typography>
          <Typography variant="muted">Live metrics from persisted conversations and messages</Typography>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            title="Messages today"
            value={dashboard.overview.messagesToday.toLocaleString()}
            description="vs yesterday"
            trend={messageTrend}
            icon={<MessageSquare className="h-4 w-4" />}
          />
          <StatCard
            title="Open conversations"
            value={dashboard.overview.openConversations.toLocaleString()}
            description={`${dashboard.overview.resolvedConversations} resolved`}
            icon={<Users className="h-4 w-4" />}
          />
          <StatCard
            title="Avg. response time"
            value={formatDuration(dashboard.overview.avgResponseTimeMs)}
            description="last 7 days"
            icon={<Clock className="h-4 w-4" />}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Message volume (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={hourlyChartData} dataKeyX="time" dataKeyY="chats" height={200} />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Conversation status</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart
                data={dashboard.statusBreakdown.map((item) => ({ ...item }))}
                nameKey="name"
                dataKey="value"
                height={200}
              />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Daily messages</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={dailyChartData} dataKeyX="day" dataKeyY="active" height={200} />
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Weekly activity</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart data={dailyChartData} dataKeyX="day" dataKeyY="active" height={300} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
