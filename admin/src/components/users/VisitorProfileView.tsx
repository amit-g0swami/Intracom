"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { VisitorProfile } from '@intracom/contracts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Typography,
  Badge,
  Button,
  Input,
  FormField,
  Spinner,
  EmptyState,
} from 'intracom-ui';
import { ArrowLeft, MessageSquare, User } from 'lucide-react';
import { fetchVisitor, updateVisitor } from '@/lib/visitors-api';
import { features } from '@/lib/features';

export function VisitorProfileView() {
  const { id } = useParams();
  const visitorId = (Array.isArray(id) ? id[0] : id) || '';

  const [profile, setProfile] = useState<VisitorProfile | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visitorId || !features.visitorsApi) {
      setIsLoading(false);
      return;
    }

    fetchVisitor(visitorId)
      .then((data) => {
        setProfile(data);
        setName(data.name ?? '');
        setEmail(data.email ?? '');
      })
      .catch(() => setError('Visitor not found.'))
      .finally(() => setIsLoading(false));
  }, [visitorId]);

  const handleSave = async () => {
    if (!visitorId) return;

    setIsSaving(true);

    try {
      const updated = await updateVisitor(visitorId, {
        name: name || null,
        email: email || null,
      });
      setProfile((current) =>
        current ? { ...current, ...updated } : current,
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!profile || error) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <EmptyState
          icon={<User className="h-6 w-6" />}
          title="Visitor not found"
          description={error ?? 'This profile does not exist.'}
        />
      </div>
    );
  }

  const attributeEntries = Object.entries(profile.attributes ?? {});

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--sp-bg-surface)] p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link href="/users">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to visitors
          </Button>
        </Link>

        <div>
          <Typography variant="h2" className="mb-1">
            {profile.name || `Visitor #${profile.id.substring(0, 8)}`}
          </Typography>
          <Typography variant="muted" className="font-mono text-xs">
            {profile.id}
          </Typography>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Name">
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </FormField>
              <FormField label="Email">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormField>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save changes'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <MetaRow label="App ID" value={profile.appId} />
              <MetaRow label="Last seen" value={new Date(profile.lastSeenAt).toLocaleString()} />
              <MetaRow label="First seen" value={new Date(profile.createdAt).toLocaleString()} />
              <MetaRow label="Conversations" value={String(profile.conversationCount)} />
            </CardContent>
          </Card>
        </div>

        {attributeEntries.length > 0 ? (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Custom attributes (JSONB)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {attributeEntries.map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-lg border border-[var(--sp-border-base)] px-3 py-2"
                >
                  <Typography className="font-mono text-xs">{key}</Typography>
                  <Typography variant="muted" className="text-xs">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </Typography>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profile.conversations.length === 0 ? (
              <Typography variant="muted" className="text-sm">
                No linked conversations yet.
              </Typography>
            ) : (
              profile.conversations.map((conversation) => (
                <Link
                  key={conversation.id}
                  href={`/chat/${conversation.id}`}
                  className="flex items-center justify-between rounded-lg border border-[var(--sp-border-base)] px-4 py-3 transition-colors hover:bg-[var(--sp-bg-base)]"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-[var(--sp-text-muted)]" />
                    <Typography className="font-mono text-xs">
                      {conversation.id.substring(0, 12)}…
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={conversation.status === 'open' ? 'success' : 'secondary'}>
                      {conversation.status}
                    </Badge>
                    <Typography variant="muted" className="text-xs">
                      {conversation.messageCount} msgs
                    </Typography>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Typography variant="muted" className="text-[10px] uppercase tracking-wide">
        {label}
      </Typography>
      <Typography className="text-sm">{value}</Typography>
    </div>
  );
}
