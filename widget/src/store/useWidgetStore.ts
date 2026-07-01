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

export const useWidgetStore = create<WidgetState>((set, get) => ({
  isOpen: false,
  unreadCount: 0,
  messages: [],
  isConnected: false,
  conversationId: null,

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
    
    let savedId = localStorage.getItem('intracom_conversation_id');
    if (!savedId) {
        savedId = crypto.randomUUID();
        localStorage.setItem('intracom_conversation_id', savedId);
    }
    
    set({ conversationId: savedId });

    const socket = initSocket(url, savedId);

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
    const { conversationId } = get();
    const socket = getSocket();
    
    if (!socket || !conversationId) return;

    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, {
      conversationId,
      senderId: 'visitor',
      text,
      isAdmin: false
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
