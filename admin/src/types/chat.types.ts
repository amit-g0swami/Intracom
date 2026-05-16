export interface MessagePayload {
  id?: string;
  conversationId: string;
  senderId: string;
  text: string;
  isAdmin: boolean;
  timestamp?: number;
}

export type ThreadMap = Record<string, MessagePayload[]>;
