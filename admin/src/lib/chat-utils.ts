import type { Message, MessagePayload, ThreadMap } from '@intracom/contracts';
import type { ConversationSummary } from '@intracom/contracts';

function toMessagePayload(message: Message | MessagePayload): MessagePayload {
  if ('timestamp' in message && message.timestamp !== undefined) {
    return message;
  }

  return {
    ...message,
    timestamp: message.createdAt
      ? new Date(message.createdAt).getTime()
      : undefined,
  };
}

function messageKey(message: MessagePayload): string {
  if (message.id) {
    return message.id;
  }

  return `${message.conversationId}:${message.timestamp ?? 0}:${message.text}`;
}

export function mergeMessages(
  ...groups: MessagePayload[][]
): MessagePayload[] {
  const byKey = new Map<string, MessagePayload>();

  for (const group of groups) {
    for (const message of group) {
      byKey.set(messageKey(message), message);
    }
  }

  return Array.from(byKey.values()).sort(
    (a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0),
  );
}

export function buildThreadMap(
  conversations: ConversationSummary[],
  loadedMessages: Record<string, MessagePayload[]>,
  liveMessages: MessagePayload[],
): ThreadMap {
  const threads: ThreadMap = {};

  for (const conversation of conversations) {
    threads[conversation.id] = conversation.lastMessage
      ? [toMessagePayload(conversation.lastMessage)]
      : [];
  }

  for (const [conversationId, messages] of Object.entries(loadedMessages)) {
    threads[conversationId] = mergeMessages(
      threads[conversationId] ?? [],
      messages,
    );
  }

  for (const message of liveMessages) {
    threads[message.conversationId] = mergeMessages(
      threads[message.conversationId] ?? [],
      [message],
    );
  }

  return threads;
}

export function sortConversationIds(threads: ThreadMap): string[] {
  return Object.keys(threads).sort((leftId, rightId) => {
    const leftMessages = threads[leftId];
    const rightMessages = threads[rightId];
    const leftTimestamp = leftMessages[leftMessages.length - 1]?.timestamp ?? 0;
    const rightTimestamp = rightMessages[rightMessages.length - 1]?.timestamp ?? 0;

    return rightTimestamp - leftTimestamp;
  });
}

export function normalizeSocketMessage(payload: Record<string, unknown>): MessagePayload {
  const timestampValue = payload.timestamp;

  return {
    id: typeof payload.id === 'string' ? payload.id : undefined,
    conversationId: String(payload.conversationId),
    senderId: String(payload.senderId),
    text: String(payload.text),
    isAdmin: Boolean(payload.isAdmin),
    timestamp:
      typeof timestampValue === 'string'
        ? new Date(timestampValue).getTime()
        : typeof timestampValue === 'number'
          ? timestampValue
          : Date.now(),
  };
}
