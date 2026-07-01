import api from './axios';
import type { AnalyticsDashboard } from '@intracom/contracts';

export async function fetchAnalyticsDashboard(): Promise<AnalyticsDashboard> {
  const { data } = await api.get<AnalyticsDashboard>('/stats/dashboard');
  return data;
}
