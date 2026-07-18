export type ConversationStatus = 'open' | 'resolved';

/** Canonical message shape returned by REST APIs. */
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  isAdmin: boolean;
  createdAt: string;
}

/** Client/socket message — supports optimistic UI fields. */
export interface MessagePayload {
  id?: string;
  conversationId: string;
  senderId: string;
  text: string;
  isAdmin: boolean;
  createdAt?: string;
  timestamp?: number;
}

export type ThreadMap = Record<string, MessagePayload[]>;

export interface ConversationSummary {
  id: string;
  appId: string;
  status: ConversationStatus | string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessage?: Message;
}

export interface ChatApiStatus {
  chatApiEnabled: boolean;
  chatPersistenceEnabled: boolean;
}

export interface SendMessagePayload {
  conversationId: string;
  senderId: string;
  text: string;
  isAdmin: boolean;
  appId?: string;
  visitorId?: string;
  visitorAttributes?: Record<string, unknown>;
}
