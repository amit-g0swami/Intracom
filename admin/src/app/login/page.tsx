"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Label, Typography, Card, CardHeader, CardContent, CardFooter } from 'intracom-ui';
import { MessageSquare } from 'lucide-react';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Mock login for now:
      // In production, you would call api.post('/auth/login', { email, password })
      setTimeout(() => {
        Cookies.set('token', 'mock_jwt_token_123', { expires: 7 });
        router.push('/');
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error('Login failed', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50/50 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-xl">
        <CardHeader className="space-y-3 pb-6 text-center pt-8">
          <div className="mx-auto bg-blue-600 w-12 h-12 flex items-center justify-center rounded-xl shadow-lg shadow-blue-600/20 mb-2">
             <MessageSquare className="text-white" size={24} />
          </div>
          <Typography variant="h3" className="font-bold tracking-tight text-gray-900 border-0">
            Welcome back
          </Typography>
          <Typography variant="muted">
            Sign in to your Intracom workspace
          </Typography>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-500 font-medium">Forgot password?</a>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <Button type="submit" className="w-full h-12 text-base font-medium mt-6" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="pb-8 pt-4 flex justify-center border-t border-gray-100 mt-6">
          <Typography variant="muted">
            Secure admin dashboard
          </Typography>
        </CardFooter>
      </Card>
    </div>
  );
}
