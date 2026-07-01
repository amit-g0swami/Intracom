"use client";

import { useState } from 'react';
import {
  Button,
  Input,
  Label,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  FormField,
  PasswordInput,
  Spinner,
  Alert,
  AlertTitle,
  AlertDescription,
} from 'intracom-ui';
import { MessageSquare, ShieldCheck, Globe, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { loginWithApi } from '@/lib/auth-api';
import { features } from '@/lib/features';

const inputClassName =
  'h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-[var(--sp-color-grey-600)] focus:border-[var(--sp-border-focus)] focus:ring-[var(--sp-ring-color)]';

const labelClassName =
  'text-xs font-bold uppercase tracking-wider text-[var(--sp-color-grey-300)]';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginWithApi(email, password);
      login(response.accessToken, response.user);
    } catch {
      setError('Invalid email or password. Check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-[var(--sp-color-black)]">
      <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-[var(--sp-color-primary-600)]/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-[var(--sp-color-primary-700)]/20 blur-[120px]" />

      <div className="z-10 flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-[440px] space-y-8">
          <div className="space-y-4 text-center">
            <div className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--sp-color-primary-500)] to-[var(--sp-color-primary-700)] shadow-xl shadow-[var(--sp-color-primary-500)]/20">
              <MessageSquare className="text-white" size={32} />
            </div>
            <Typography variant="h1" className="m-0 border-0 text-3xl font-extrabold tracking-tight text-white">
              Intracom Admin
            </Typography>
            <Typography className="text-base text-[var(--sp-text-muted)]">
              The command center for your customer relationships
            </Typography>
          </div>

          {features.mockAuth && (
            <Alert variant="warning">
              <AlertTitle>Mock auth enabled</AlertTitle>
              <AlertDescription>
                Login uses local mock credentials. Set NEXT_PUBLIC_FEATURE_MOCK_AUTH=false to use the API.
              </AlertDescription>
            </Alert>
          )}

          <Card className="overflow-hidden rounded-3xl border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-2xl">
            <CardHeader className="px-6 pb-2 pt-8">
              <Typography variant="h4" className="m-0 border-0 font-bold tracking-tight text-white">Sign In</Typography>
              <Typography className="text-sm text-[var(--sp-text-muted)]">
                Enter your credentials to access the dashboard
              </Typography>
            </CardHeader>
            <CardContent className="space-y-5 p-6">
              <form onSubmit={handleLogin} className="space-y-5">
                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Sign in failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <FormField
                  label="Email Address"
                  className="[&_label]:text-xs [&_label]:font-bold [&_label]:uppercase [&_label]:tracking-wider [&_label]:text-[var(--sp-color-grey-300)]"
                >
                  <Input
                    type="email"
                    placeholder="admin@intracom.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className={inputClassName}
                  />
                </FormField>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className={labelClassName}>
                      Password
                    </Label>
                    <a href="#" className="text-xs font-bold text-[var(--sp-color-primary-400)] transition-colors hover:text-[var(--sp-color-primary-300)]">
                      Forgot?
                    </a>
                  </div>
                  <PasswordInput
                    id="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className={inputClassName}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="mt-4 h-12 w-full rounded-xl font-bold shadow-lg shadow-[var(--sp-color-primary-500)]/20 transition-all active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Spinner size="sm" className="text-white" />
                      Authenticating...
                    </span>
                  ) : (
                    'Sign In to Dashboard'
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 border-t border-white/5 p-6 pt-2">
              <div className="grid grid-cols-3 gap-4">
                <Feature icon={<ShieldCheck size={16} />} label="Secure" />
                <Feature icon={<Globe size={16} />} label="Global" />
                <Feature icon={<Zap size={16} />} label="Real-time" />
              </div>
            </CardFooter>
          </Card>

          <div className="text-center">
            <Typography className="text-sm text-[var(--sp-text-muted)]">
              Don&apos;t have an account?{' '}
              <span className="cursor-pointer font-bold text-[var(--sp-color-primary-400)] hover:underline">Contact Support</span>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex cursor-default flex-col items-center gap-1.5 opacity-40 transition-opacity hover:opacity-100">
      <div className="text-white">{icon}</div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-white">{label}</span>
    </div>
  );
}
