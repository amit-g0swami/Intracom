"use client";

import { useCallback, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { InboxList } from '@/components/chat/InboxList';
import { updateConversationStatus } from '@/lib/chat-api';
import { useChat } from '@/providers/ChatProvider';

export default function ChatDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const activeThreadId = (Array.isArray(id) ? id[0] : id) || null;

  const {
    isConnected,
    threads,
    activeConversationIds,
    conversations,
    isLoadingInbox,
    isLoadingMessages,
    loadConversationMessages,
    refreshInbox,
    sendReply,
  } = useChat();

  useEffect(() => {
    if (!activeThreadId) {
      return;
    }

    void loadConversationMessages(activeThreadId);
  }, [activeThreadId, loadConversationMessages]);

  const activeMessages = activeThreadId ? threads[activeThreadId] || [] : [];
  const conversationStatus =
    conversations.find((conversation) => conversation.id === activeThreadId)?.status ?? 'open';

  const handleReply = (text: string) => {
    if (!activeThreadId) {
      return;
    }

    sendReply(activeThreadId, text);
  };

  const handleResolve = useCallback(async () => {
    if (!activeThreadId) {
      return;
    }

    await updateConversationStatus(activeThreadId, 'resolved');
    await refreshInbox();
    router.push('/chat');
  }, [activeThreadId, refreshInbox, router]);

  return (
    <>
      <InboxList
        isConnected={isConnected}
        threads={threads}
        activeConversationIds={activeConversationIds}
        activeThreadId={activeThreadId}
        isLoading={isLoadingInbox}
      />
      <ChatWindow
        activeThreadId={activeThreadId}
        activeMessages={activeMessages}
        isConnected={isConnected}
        isLoadingMessages={isLoadingMessages}
        conversationStatus={conversationStatus}
        handleReply={handleReply}
        onResolve={handleResolve}
      />
    </>
  );
}
