"use client";

import { InboxList } from '@/components/chat/InboxList';
import { useChat } from '@/providers/ChatProvider';
import { EmptyState } from 'intracom-ui';
import { MessageSquare } from 'lucide-react';

export default function ChatRootPage() {
  const {
    isConnected,
    threads,
    activeConversationIds,
    isLoadingInbox,
  } = useChat();

  return (
    <>
      <InboxList
        isConnected={isConnected}
        threads={threads}
        activeConversationIds={activeConversationIds}
        activeThreadId={null}
        isLoading={isLoadingInbox}
      />
      <div className="flex flex-1 items-center justify-center bg-[var(--sp-bg-surface)]/50 p-8">
        <EmptyState
          icon={<MessageSquare className="h-6 w-6" />}
          title="Select a conversation"
          description="Choose a visitor thread from the list to start messaging."
          className="max-w-md border-0 bg-transparent shadow-none"
        />
      </div>
    </>
  );
}
