"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useAuth } from '@/contexts/AuthContext';
import { fetchConversationMessages, fetchConversations } from '@/lib/chat-api';
import {
  buildThreadMap,
  normalizeSocketMessage,
  sortConversationIds,
} from '@/lib/chat-utils';
import { SOCKET_EVENTS } from '@intracom/contracts';
import type { ConversationSummary, MessagePayload, ThreadMap } from '@intracom/contracts';
import { features } from '@/lib/features';

interface ChatContextType {
  socket: Socket | null;
  isConnected: boolean;
  threads: ThreadMap;
  activeConversationIds: string[];
  conversations: ConversationSummary[];
  isLoadingInbox: boolean;
  isLoadingMessages: boolean;
  loadConversationMessages: (conversationId: string) => Promise<void>;
  refreshInbox: () => Promise<void>;
  sendReply: (conversationId: string, text: string) => void;
}

const ChatContext = createContext<ChatContextType>({
  socket: null,
  isConnected: false,
  threads: {},
  activeConversationIds: [],
  conversations: [],
  isLoadingInbox: false,
  isLoadingMessages: false,
  loadConversationMessages: async () => {},
  refreshInbox: async () => {},
  sendReply: () => {},
});

export const useChat = () => useContext(ChatContext);

/** @deprecated Use useChat instead */
export const useSocket = () => {
  const { socket, isConnected, threads } = useChat();
  const messages = useMemo(
    () => Object.values(threads).flat(),
    [threads],
  );

  return { socket, isConnected, messages };
};

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [socket] = useState<Socket | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const token = Cookies.get('token');

    return io(features.socketUrl, {
      query: { isAdmin: 'true' },
      auth: features.socketAuth && token ? { token } : undefined,
      autoConnect: false,
    });
  });

  const [isConnected, setIsConnected] = useState(false);
  const [liveMessages, setLiveMessages] = useState<MessagePayload[]>([]);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loadedMessages, setLoadedMessages] = useState<Record<string, MessagePayload[]>>({});
  const [isLoadingInbox, setIsLoadingInbox] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const refreshInbox = useCallback(async () => {
    if (!features.chatApi || !user) {
      return;
    }

    setIsLoadingInbox(true);

    try {
      const data = await fetchConversations('open');
      setConversations(data);
    } catch {
      setConversations([]);
    } finally {
      setIsLoadingInbox(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    void refreshInbox();
  }, [isAuthLoading, refreshInbox]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.connect();

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onMessage = (payload: Record<string, unknown>) => {
      setLiveMessages((previous) => [
        ...previous,
        normalizeSocketMessage(payload),
      ]);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on(SOCKET_EVENTS.ADMIN_NEW_MESSAGE, onMessage);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off(SOCKET_EVENTS.ADMIN_NEW_MESSAGE, onMessage);
      socket.disconnect();
    };
  }, [socket]);

  const threads = useMemo(
    () => buildThreadMap(conversations, loadedMessages, liveMessages),
    [conversations, loadedMessages, liveMessages],
  );

  const activeConversationIds = useMemo(
    () => sortConversationIds(threads),
    [threads],
  );

  const loadConversationMessages = useCallback(
    async (conversationId: string) => {
      if (!features.chatApi || !user) {
        return;
      }

      setIsLoadingMessages(true);

      try {
        const messages = await fetchConversationMessages(conversationId);
        setLoadedMessages((previous) => ({
          ...previous,
          [conversationId]: messages,
        }));
      } catch {
        setLoadedMessages((previous) => ({
          ...previous,
          [conversationId]: previous[conversationId] ?? [],
        }));
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [user],
  );

  const sendReply = useCallback(
    (conversationId: string, text: string) => {
      if (!socket) {
        return;
      }

      socket.emit(SOCKET_EVENTS.SEND_MESSAGE, {
        conversationId,
        senderId: 'admin',
        text,
        isAdmin: true,
      });
    },
    [socket],
  );

  const value = useMemo(
    () => ({
      socket,
      isConnected,
      threads,
      activeConversationIds,
      conversations,
      isLoadingInbox,
      isLoadingMessages,
      loadConversationMessages,
      refreshInbox,
      sendReply,
    }),
    [
      socket,
      isConnected,
      threads,
      activeConversationIds,
      conversations,
      isLoadingInbox,
      isLoadingMessages,
      loadConversationMessages,
      refreshInbox,
      sendReply,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
