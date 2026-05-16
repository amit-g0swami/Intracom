"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      // In a real app, you would fetch user data from an API here
      // For now, we mock it based on token presence
      Promise.resolve().then(() => {
        setUser({ id: '1', name: 'Admin User', email: 'admin@intracom.com' });
        setIsLoading(false);
      });
    } else {
      Promise.resolve().then(() => {
        setIsLoading(false);
      });
    }
  }, []);

  const login = (token: string, userData: User) => {
    Cookies.set('token', token, { expires: 7 }); // 7 days expiration
    setUser(userData);
    if (typeof window !== 'undefined') {
       window.location.href = '/';
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    if (typeof window !== 'undefined') {
       window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
