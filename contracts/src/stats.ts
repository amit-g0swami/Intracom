export interface AnalyticsOverview {
  messagesToday: number;
  messagesYesterday: number;
  openConversations: number;
  resolvedConversations: number;
  avgResponseTimeMs: number | null;
}

export interface AnalyticsHourlyPoint {
  time: string;
  messages: number;
}

export interface AnalyticsDailyPoint {
  day: string;
  messages: number;
  conversations: number;
}

export interface AnalyticsStatusPoint {
  name: string;
  value: number;
}

export interface AnalyticsDashboard {
  overview: AnalyticsOverview;
  hourlyVolume: AnalyticsHourlyPoint[];
  dailyActivity: AnalyticsDailyPoint[];
  statusBreakdown: AnalyticsStatusPoint[];
}

export interface StatsApiStatus {
  statsApiEnabled: boolean;
}
