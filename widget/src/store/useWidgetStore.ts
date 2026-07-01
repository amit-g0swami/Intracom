import { create } from 'zustand'
import { SOCKET_EVENTS, type SocketMessagePayload } from '@intracom/contracts'
import { initSocket, getSocket } from '../services/socket'

export interface Message {
  id: string
  text: string
  senderId: string
  timestamp: number
  isAdmin: boolean
}

interface WidgetState {
  isOpen: boolean
  unreadCount: number
  messages: Message[]
  isConnected: boolean
  conversationId: string | null
  visitorId: string | null

  toggleWidget: () => void
  setUnreadCount: (count: number) => void
  addMessage: (msg: Message) => void
  setConnectionStatus: (status: boolean) => void
  initChat: (url?: string) => void
  sendMessage: (text: string) => void
}

function socketPayloadToMessage(payload: SocketMessagePayload): Message {
  return {
    id: payload.id,
    text: payload.text,
    senderId: payload.senderId,
    timestamp: new Date(payload.timestamp).getTime(),
    isAdmin: payload.isAdmin,
  }
}

function getOrCreateStorageKey(key: string): string {
  let value = localStorage.getItem(key)
  if (!value) {
    value = crypto.randomUUID()
    localStorage.setItem(key, value)
  }
  return value
}

export const useWidgetStore = create<WidgetState>((set, get) => ({
  isOpen: false,
  unreadCount: 0,
  messages: [],
  isConnected: false,
  conversationId: null,
  visitorId: null,

  toggleWidget: () => set((state) => ({ isOpen: !state.isOpen })),

  setUnreadCount: (count) => set({ unreadCount: count }),

  addMessage: (msg) => set((state) => {
    if (state.messages.find(m => m.id === msg.id)) return state;

    const newUnreadCount = !state.isOpen && msg.isAdmin ? state.unreadCount + 1 : state.unreadCount;
    return {
      messages: [...state.messages, msg],
      unreadCount: newUnreadCount
    };
  }),

  setConnectionStatus: (status) => set({ isConnected: status }),

  initChat: (url = 'http://localhost:3000') => {
    const state = get();
    if (state.isConnected) return;

    const visitorId = getOrCreateStorageKey('intracom_visitor_id');
    const conversationId = getOrCreateStorageKey('intracom_conversation_id');

    set({ conversationId, visitorId });

    const socket = initSocket(url, conversationId);

    socket.on('connect', () => {
      set({ isConnected: true });
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
    });

    socket.on(SOCKET_EVENTS.NEW_MESSAGE, (payload: SocketMessagePayload) => {
      get().addMessage(socketPayloadToMessage(payload));
    });
  },

  sendMessage: (text: string) => {
    const { conversationId, visitorId } = get();
    const socket = getSocket();

    if (!socket || !conversationId || !visitorId) return;

    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, {
      conversationId,
      visitorId,
      senderId: 'visitor',
      text,
      isAdmin: false,
      visitorAttributes: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        pageUrl: window.location.href,
      },
    });

    get().addMessage({
      id: crypto.randomUUID(),
      text,
      senderId: 'visitor',
      timestamp: Date.now(),
      isAdmin: false
    });
  }
}))
