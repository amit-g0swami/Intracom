"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  clearAuthSession,
  fetchCurrentUser,
  persistAuthSession,
} from '@/lib/auth-api';
import type { AuthUser } from '@/types/auth.types';

interface AuthContextType {
  user: AuthUser | null;
  login: (token: string, userData: AuthUser) => void;
  logout: () => void;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const profile = await fetchCurrentUser();
    setUser(profile);
  }, []);

  useEffect(() => {
    let mounted = true;

    fetchCurrentUser()
      .then((profile) => {
        if (mounted) {
          setUser(profile);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const login = (token: string, userData: AuthUser) => {
    persistAuthSession({ accessToken: token, user: userData });
    setUser(userData);

    if (typeof window !== 'undefined') {
      window.location.href = '/chat';
    }
  };

  const logout = () => {
    clearAuthSession();
    setUser(null);

    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
