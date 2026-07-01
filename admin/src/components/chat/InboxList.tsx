"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ThreadMap } from '@/types/chat.types';
import {
  Badge,
  Avatar,
  AvatarFallback,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemTitle,
  ListItemDescription,
  SearchInput,
  EmptyState,
  ScrollArea,
} from 'intracom-ui';
import { Inbox } from 'lucide-react';

interface InboxListProps {
  isConnected: boolean;
  threads: ThreadMap;
  activeConversationIds: string[];
  activeThreadId: string | null;
  isLoading?: boolean;
}

function formatRelativeTime(timestamp?: number): string {
  if (!timestamp) {
    return '';
  }

  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) {
    return 'Just now';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  return `${Math.floor(diffHours / 24)}d ago`;
}

export function InboxList({
  isConnected,
  threads,
  activeConversationIds,
  activeThreadId,
  isLoading = false,
}: InboxListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIds = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return activeConversationIds;
    }

    return activeConversationIds.filter((id) => {
      const messages = threads[id] ?? [];
      const haystack = [
        id,
        `visitor #${id.substring(0, 6)}`,
        ...messages.map((message) => message.text),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [activeConversationIds, searchQuery, threads]);

  const emptyTitle =
    activeConversationIds.length === 0 ? 'No conversations' : 'No matches';
  const emptyDescription =
    activeConversationIds.length === 0
      ? 'New visitor threads will appear here.'
      : 'Try a different search term.';

  return (
    <aside className="z-10 flex w-[320px] shrink-0 flex-col border-r border-[var(--sp-border-base)] bg-[var(--sp-bg-base)] shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <Typography variant="h3" className="m-0 border-0 text-xl font-bold tracking-tight">Inbox</Typography>
          <Badge
            variant={isConnected ? 'success' : 'destructive'}
            className="h-5 rounded-full px-2 py-0 text-[10px] font-bold uppercase tracking-wider"
          >
            {isConnected ? 'Online' : 'Offline'}
          </Badge>
        </div>

        <SearchInput
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="h-10 rounded-lg border-[var(--sp-border-base)] bg-[var(--sp-bg-surface)] transition-all focus:bg-[var(--sp-bg-base)]"
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3 pb-4">
        <Typography variant="muted" className="mb-2 px-3 text-[11px] font-bold uppercase tracking-widest opacity-70">
          Active Conversations
        </Typography>

        <ScrollArea className="flex-1">
          {isLoading ? (
            <Typography variant="muted" className="px-3 py-8 text-center text-xs">
              Loading conversations...
            </Typography>
          ) : filteredIds.length === 0 ? (
            <EmptyState
              icon={<Inbox className="h-5 w-5" />}
              title={emptyTitle}
              description={emptyDescription}
              className="mx-1 border-0 bg-transparent py-8 shadow-none"
            />
          ) : (
            <List className="gap-1 pr-3">
              {filteredIds.map((id) => {
                const thread = threads[id] ?? [];
                const latestMessage = thread[thread.length - 1];
                if (!latestMessage) {
                  return null;
                }
                const isActive = activeThreadId === id;

                return (
                  <Link key={id} href={`/chat/${id}`} className="block">
                    <ListItem
                      className={`flex cursor-pointer gap-3 rounded-xl border border-transparent p-3 transition-all duration-200 ${
                        isActive
                          ? 'border-[var(--sp-color-primary-100)] bg-[var(--sp-color-primary-50)]/80 shadow-sm'
                          : 'hover:bg-[var(--sp-bg-surface)] active:scale-[0.98]'
                      }`}
                    >
                      <ListItemIcon className="relative">
                        <Avatar className="h-11 w-11 border-2 border-[var(--sp-bg-base)] shadow-sm">
                          <AvatarFallback className="bg-gradient-to-br from-[var(--sp-color-grey-100)] to-[var(--sp-color-grey-200)] text-xs font-bold text-[var(--sp-color-grey-600)]">
                            {id.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {isConnected && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[var(--sp-bg-base)] bg-[var(--sp-color-success-500)] shadow-sm" />
                        )}
                      </ListItemIcon>
                      <ListItemText className="flex-1 overflow-hidden">
                        <div className="mb-0.5 flex items-start justify-between">
                          <ListItemTitle className={`truncate text-sm ${isActive ? 'font-bold text-[var(--sp-color-primary-700)]' : 'font-semibold text-[var(--sp-text-base)]'}`}>
                            Visitor #{id.substring(0, 6)}
                          </ListItemTitle>
                          <span className="ml-2 whitespace-nowrap text-[10px] font-medium text-[var(--sp-text-muted)]">
                            {formatRelativeTime(latestMessage.timestamp)}
                          </span>
                        </div>
                        <ListItemDescription className={`truncate text-xs leading-relaxed ${isActive ? 'text-[var(--sp-color-primary-600)]/70' : 'text-[var(--sp-text-muted)]'}`}>
                          {latestMessage.text}
                        </ListItemDescription>
                      </ListItemText>
                    </ListItem>
                  </Link>
                );
              })}
            </List>
          )}
        </ScrollArea>
      </div>
    </aside>
  );
}
