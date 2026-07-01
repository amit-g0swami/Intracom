import Cookies from 'js-cookie';
import api from './axios';
import { features } from './features';
import type { AuthStatus, AuthUser, LoginResponse } from '@/types/auth.types';

const MOCK_TOKEN = 'mock_jwt_token_local';

export async function fetchAuthStatus(): Promise<AuthStatus | null> {
  if (features.mockAuth) {
    return {
      authEnabled: false,
      authMode: 'mock',
      socketAuthEnabled: false,
    };
  }

  try {
    const { data } = await api.get<AuthStatus>('/auth/status');
    return data;
  } catch {
    return null;
  }
}

export async function loginWithApi(
  email: string,
  password: string,
): Promise<LoginResponse> {
  if (features.mockAuth) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      accessToken: MOCK_TOKEN,
      user: {
        id: 'mock-admin',
        email,
        name: 'Admin User',
        role: 'admin',
      },
    };
  }

  const { data } = await api.post<LoginResponse>('/auth/login', {
    email,
    password,
  });

  return data;
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const token = Cookies.get('token');

  if (!token) {
    return null;
  }

  if (features.mockAuth || token === MOCK_TOKEN) {
    return {
      id: 'mock-admin',
      name: 'Admin User',
      email: 'admin@intracom.com',
      role: 'admin',
    };
  }

  try {
    const { data } = await api.get<AuthUser>('/auth/me');
    return data;
  } catch {
    Cookies.remove('token');
    return null;
  }
}

export function persistAuthSession(response: LoginResponse): void {
  Cookies.set('token', response.accessToken, { expires: 7 });
}

export function clearAuthSession(): void {
  Cookies.remove('token');
}

export function getAuthToken(): string | undefined {
  return Cookies.get('token');
}
