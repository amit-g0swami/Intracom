"use client";

import { MessagePayload } from '@/types/chat.types';
import { ChatInput } from './ChatInput';
import { Phone, Video, Info, MoreVertical } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';
import { List, ListItem, Typography, Avatar, AvatarFallback, Button, ScrollArea, Badge } from 'intracom-ui';

interface ChatWindowProps {
  activeThreadId: string | null;
  activeMessages: MessagePayload[];
  isConnected: boolean;
  isLoadingMessages?: boolean;
  conversationStatus?: string;
  handleReply: (text: string) => void;
  onResolve?: () => void;
}

export function ChatWindow({
  activeThreadId,
  activeMessages,
  isConnected,
  isLoadingMessages = false,
  conversationStatus = 'open',
  handleReply,
  onResolve,
}: ChatWindowProps) {
  if (!activeThreadId) return null;

  return (
    <main className="flex flex-1 flex-col bg-[var(--sp-bg-base)]">
      <header className="sticky top-0 z-10 flex h-[72px] items-center justify-between border-b border-[var(--sp-border-base)] bg-[var(--sp-bg-base)]/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border shadow-sm">
            <AvatarFallback className="bg-[var(--sp-color-primary-50)] text-xs font-bold text-[var(--sp-color-primary-600)]">V</AvatarFallback>
          </Avatar>
          <div>
            <Typography variant="h4" className="m-0 border-0 text-sm font-bold">
              Visitor #{activeThreadId.substring(0, 8)}
            </Typography>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--sp-color-success-500)]" />
              <Typography variant="muted" className="text-[11px] font-medium">
                {conversationStatus === 'resolved' ? 'Resolved' : 'Active now'}
              </Typography>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {conversationStatus !== 'resolved' && onResolve ? (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={onResolve}
            >
              <CheckCircle2 className="h-4 w-4" />
              Resolve
            </Button>
          ) : conversationStatus === 'resolved' ? (
            <Badge variant="secondary">Resolved</Badge>
          ) : null}
          <HeaderAction icon={<Phone size={18} />} />
          <HeaderAction icon={<Video size={18} />} />
          <HeaderAction icon={<Info size={18} />} />
          <div className="mx-2 h-6 w-px bg-[var(--sp-border-base)]" />
          <HeaderAction icon={<MoreVertical size={18} />} />
        </div>
      </header>

      <ScrollArea className="flex-1 bg-[var(--sp-bg-surface)]/30">
        <div className="space-y-6 p-6">
          <div className="mb-8 flex justify-center">
            <span className="rounded-full border border-[var(--sp-border-base)] bg-[var(--sp-bg-base)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--sp-text-muted)] shadow-sm">
              Today
            </span>
          </div>

          {isLoadingMessages && activeMessages.length === 0 ? (
            <Typography variant="muted" className="text-center text-xs">
              Loading messages...
            </Typography>
          ) : null}

          <List className="gap-6">
            {activeMessages.map((msg: MessagePayload) => {
              const isAdmin = msg.isAdmin;
              return (
                <ListItem
                  key={msg.id ?? `${msg.timestamp}-${msg.text}`}
                  className={`flex flex-col bg-transparent p-0 hover:bg-transparent dark:hover:bg-transparent ${isAdmin ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex max-w-[80%] items-end gap-2">
                    {!isAdmin && (
                      <Avatar className="mb-1 h-6 w-6 border shadow-xs">
                        <AvatarFallback className="bg-[var(--sp-color-grey-200)] text-[8px]">V</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-sm ${
                        isAdmin
                          ? 'rounded-br-none bg-[var(--sp-bg-interactive)] font-medium text-[var(--sp-text-inverse)] shadow-[var(--sp-color-primary-200)]'
                          : 'rounded-bl-none border border-[var(--sp-border-base)] bg-[var(--sp-bg-base)] text-[var(--sp-text-base)]'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                  <span className="mt-1.5 px-1 text-[10px] font-medium text-[var(--sp-text-muted)]">
                    {isAdmin ? 'Delivered' : '10:24 AM'}
                  </span>
                </ListItem>
              );
            })}
          </List>
        </div>
      </ScrollArea>

      <div className="border-t border-[var(--sp-border-base)] bg-[var(--sp-bg-base)] p-6">
        <ChatInput isConnected={isConnected} onSubmit={handleReply} />
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-4">
            <Typography variant="muted" className="cursor-pointer text-[10px] transition-colors hover:text-[var(--sp-color-primary-600)]">
              Quick Replies (Cmd+K)
            </Typography>
            <Typography variant="muted" className="cursor-pointer text-[10px] transition-colors hover:text-[var(--sp-color-primary-600)]">
              Attach Files
            </Typography>
          </div>
          <Typography variant="muted" className="text-[10px]">
            Press Enter to send
          </Typography>
        </div>
      </div>
    </main>
  );
}

function HeaderAction({ icon }: { icon: React.ReactNode }) {
  return (
    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-[var(--sp-text-muted)] transition-all hover:bg-[var(--sp-color-primary-50)] hover:text-[var(--sp-color-primary-600)]">
      {icon}
    </Button>
  );
}
