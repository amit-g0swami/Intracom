export type VisitorAttributes = Record<string, unknown>;

export interface VisitorSummary {
  id: string;
  appId: string;
  email: string | null;
  name: string | null;
  attributes: VisitorAttributes;
  lastSeenAt: string;
  createdAt: string;
  conversationCount: number;
}

export interface VisitorProfile extends VisitorSummary {
  conversations: VisitorConversationRef[];
}

export interface VisitorConversationRef {
  id: string;
  status: string;
  updatedAt: string;
  messageCount: number;
}

export interface VisitorsApiStatus {
  visitorsApiEnabled: boolean;
}

export interface UpdateVisitorPayload {
  email?: string | null;
  name?: string | null;
  attributes?: VisitorAttributes;
}
