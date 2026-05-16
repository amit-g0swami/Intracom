"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { MessagePayload } from '@/types/chat.types';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  messages: MessagePayload[];
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  messages: [],
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket] = useState<Socket | null>(() => {
    if (typeof window !== 'undefined') {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';
      return io(socketUrl, {
        query: { isAdmin: 'true' },
        autoConnect: false,
      });
    }
    return null;
  });
  
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<MessagePayload[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.connect();

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onMessage = (payload: MessagePayload) => {
      setMessages((prev) => [...prev, payload]);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('admin_new_message', onMessage);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('admin_new_message', onMessage);
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, messages }}>
      {children}
    </SocketContext.Provider>
  );
};
