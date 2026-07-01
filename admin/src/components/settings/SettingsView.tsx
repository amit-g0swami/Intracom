"use client";

import { useAuth } from '@/contexts/AuthContext';
import { features } from '@/lib/features';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Typography,
  Badge,
  Button,
} from 'intracom-ui';
import { LogOut, Settings } from 'lucide-react';

export function SettingsView() {
  const { user, logout } = useAuth();

  const flags = [
    { label: 'Mock auth', enabled: features.mockAuth },
    { label: 'Socket JWT', enabled: features.socketAuth },
    { label: 'Chat REST API', enabled: features.chatApi },
    { label: 'Stats API', enabled: features.statsApi },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--sp-bg-surface)] p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <Typography variant="h2" className="mb-2">Settings</Typography>
          <Typography variant="muted">
            Account, environment, and feature flags for this admin session
          </Typography>
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Typography variant="muted" className="text-xs uppercase tracking-wide">
                Name
              </Typography>
              <Typography>{user?.name ?? '—'}</Typography>
            </div>
            <div>
              <Typography variant="muted" className="text-xs uppercase tracking-wide">
                Email
              </Typography>
              <Typography>{user?.email ?? '—'}</Typography>
            </div>
            <div>
              <Typography variant="muted" className="text-xs uppercase tracking-wide">
                Role
              </Typography>
              <Typography>{user?.role ?? 'admin'}</Typography>
            </div>
            <Button variant="outline" onClick={logout} className="mt-2 gap-2">
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Environment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <EnvRow label="API URL" value={features.apiUrl} />
            <EnvRow label="Socket URL" value={features.socketUrl} />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Feature flags (admin)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {flags.map((flag) => (
              <Badge
                key={flag.label}
                variant={flag.enabled ? 'success' : 'secondary'}
                className="px-3 py-1"
              >
                {flag.label}: {flag.enabled ? 'on' : 'off'}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Typography variant="muted" className="text-xs">
          Server-side flags live in <code>server/.env</code>. Full setup: see{' '}
          <code>docs/DEVELOPMENT.md</code> in the repository.
        </Typography>
      </div>
    </div>
  );
}

function EnvRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Typography variant="muted" className="text-xs uppercase tracking-wide">
        {label}
      </Typography>
      <Typography className="break-all font-mono text-sm">{value}</Typography>
    </div>
  );
}
