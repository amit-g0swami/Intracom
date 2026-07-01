"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { VisitorSummary } from '@intracom/contracts';
import {
  Typography,
  SearchInput,
  DataTable,
  Badge,
  EmptyState,
} from 'intracom-ui';
import { Users } from 'lucide-react';
import { fetchVisitors } from '@/lib/visitors-api';
import { features } from '@/lib/features';

type VisitorRow = VisitorSummary & Record<string, unknown>;

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return `${Math.floor(hours / 24)}d ago`;
}

export function UsersListView() {
  const [visitors, setVisitors] = useState<VisitorSummary[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!features.visitorsApi) {
      setIsLoading(false);
      return;
    }

    const timeout = setTimeout(() => {
      setIsLoading(true);

      fetchVisitors(search || undefined)
        .then(setVisitors)
        .catch(() => setError('Unable to load visitors.'))
        .finally(() => setIsLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const rows = useMemo<VisitorRow[]>(
    () => visitors.map((visitor) => ({ ...visitor })),
    [visitors],
  );

  if (!features.visitorsApi || error) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[var(--sp-bg-surface)] p-8">
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="Visitors unavailable"
          description={error ?? 'Enable NEXT_PUBLIC_FEATURE_VISITORS_API and PostgreSQL persistence.'}
          className="max-w-md border-0 bg-transparent shadow-none"
        />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--sp-bg-surface)] p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Typography variant="h2" className="mb-2">Visitors</Typography>
            <Typography variant="muted">
              Profiles created when widget visitors send messages
            </Typography>
          </div>
          <SearchInput
            placeholder="Search name, email, or id..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-10 w-full max-w-sm"
          />
        </div>

        <DataTable<VisitorRow>
          loading={isLoading}
          data={rows}
          emptyTitle="No visitors yet"
          emptyDescription="Visitors appear after the widget sends a persisted message."
          getRowKey={(row) => row.id}
          columns={[
            {
              key: 'name',
              header: 'Visitor',
              sortable: true,
              render: (row) => (
                <Link
                  href={`/users/${row.id}`}
                  className="font-medium text-[var(--sp-color-primary-600)] hover:underline"
                >
                  {row.name || `Visitor #${row.id.substring(0, 8)}`}
                </Link>
              ),
            },
            {
              key: 'email',
              header: 'Email',
              sortable: true,
              render: (row) => row.email || '—',
            },
            {
              key: 'conversationCount',
              header: 'Chats',
              sortable: true,
            },
            {
              key: 'lastSeenAt',
              header: 'Last seen',
              sortable: true,
              render: (row) => formatRelativeTime(row.lastSeenAt),
            },
            {
              key: 'appId',
              header: 'App',
              render: (row) => (
                <Badge variant="secondary" className="font-mono text-[10px]">
                  {row.appId}
                </Badge>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
