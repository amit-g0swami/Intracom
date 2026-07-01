export type AuthMode = 'mock' | 'env' | 'database';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface AuthStatus {
  authEnabled: boolean;
  authMode: AuthMode | string;
  socketAuthEnabled: boolean;
}
