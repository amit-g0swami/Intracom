import api from './axios';
import type {
  UpdateVisitorPayload,
  VisitorProfile,
  VisitorSummary,
} from '@intracom/contracts';

export async function fetchVisitors(
  search?: string,
  limit = 50,
): Promise<VisitorSummary[]> {
  const { data } = await api.get<VisitorSummary[]>('/visitors', {
    params: { search, limit },
  });

  return data;
}

export async function fetchVisitor(visitorId: string): Promise<VisitorProfile> {
  const { data } = await api.get<VisitorProfile>(`/visitors/${visitorId}`);
  return data;
}

export async function updateVisitor(
  visitorId: string,
  payload: UpdateVisitorPayload,
): Promise<VisitorSummary> {
  const { data } = await api.patch<VisitorSummary>(
    `/visitors/${visitorId}`,
    payload,
  );

  return data;
}
