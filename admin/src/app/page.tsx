"use client";

import { useSocket } from '@/components/SocketProvider';
import { useState } from 'react';
import { ThreadMap, MessagePayload } from '@/types/chat.types';

import { SidebarNav } from '@/components/layout/SidebarNav';
import { InboxList } from '@/components/chat/InboxList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { StatsView } from '@/components/stats/StatsView';

export default function Dashboard() {
  const { socket, isConnected, messages } = useSocket();
  const [activeTab, setActiveTab] = useState('chat');
  
  // Group messages by conversation ID
  const threads: ThreadMap = messages.reduce((acc: ThreadMap, msg: MessagePayload) => {
    if (!acc[msg.conversationId]) acc[msg.conversationId] = [];
    acc[msg.conversationId].push(msg);
    return acc;
  }, {});

  const activeConversationIds = Object.keys(threads);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  const activeMessages = activeThreadId ? threads[activeThreadId] : [];

  const handleReply = (text: string) => {
    if (!socket || !activeThreadId) return;

    socket.emit('send_message', {
      conversationId: activeThreadId,
      senderId: 'admin',
      text,
      isAdmin: true
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'chat' ? (
        <>
          <InboxList 
            isConnected={isConnected}
            threads={threads}
            activeConversationIds={activeConversationIds}
            activeThreadId={activeThreadId}
            setActiveThreadId={setActiveThreadId}
          />
          <ChatWindow 
            activeThreadId={activeThreadId}
            activeMessages={activeMessages}
            isConnected={isConnected}
            handleReply={handleReply}
          />
        </>
      ) : (
        <StatsView />
      )}
    </div>
  );
}
