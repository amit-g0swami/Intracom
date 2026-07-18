import api from './axios';
import type {
  ChatApiStatus,
  ConversationSummary,
  Message,
  MessagePayload,
} from '@intracom/contracts';

function toMessagePayload(message: Message): MessagePayload {
  return {
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    text: message.text,
    isAdmin: message.isAdmin,
    createdAt: message.createdAt,
    timestamp: new Date(message.createdAt).getTime(),
  };
}

export async function fetchChatApiStatus(): Promise<ChatApiStatus> {
  const { data } = await api.get<ChatApiStatus>('/conversations/status');
  return data;
}

export async function fetchConversations(
  status?: 'open' | 'resolved',
  limit = 50,
): Promise<ConversationSummary[]> {
  const { data } = await api.get<ConversationSummary[]>('/conversations', {
    params: { status, limit },
  });

  return data;
}

export async function fetchConversationMessages(
  conversationId: string,
  limit = 100,
): Promise<MessagePayload[]> {
  const { data } = await api.get<Message[]>(`/conversations/${conversationId}/messages`, {
    params: { limit },
  });

  return data.map(toMessagePayload);
}

export async function updateConversationStatus(
  conversationId: string,
  status: 'open' | 'resolved',
) {
  const { data } = await api.patch(`/conversations/${conversationId}/status`, {
    status,
  });

  return data;
}
