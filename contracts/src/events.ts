export const DOMAIN_EVENTS = {
  MESSAGE_SENT: 'message.sent',
} as const;

export type DomainEventName =
  (typeof DOMAIN_EVENTS)[keyof typeof DOMAIN_EVENTS];

export interface MessageSentEventPayload {
  messageId: string;
  conversationId: string;
  text: string;
  senderId: string;
  isAdmin: boolean;
  createdAt: string;
}
