export const SOCKET_EVENTS = {
  SEND_MESSAGE: 'send_message',
  NEW_MESSAGE: 'new_message',
  ADMIN_NEW_MESSAGE: 'admin_new_message',
} as const;

export type SocketEventName =
  (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];

/** Payload broadcast over Socket.IO after a message is processed. */
export interface SocketMessagePayload {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  isAdmin: boolean;
  timestamp: string;
}
