export type AuthMode = 'mock' | 'env' | 'database';

export interface FeatureFlags {
  authEnabled: boolean;
  authMode: AuthMode;
  socketAuthEnabled: boolean;
  chatApiEnabled: boolean;
  chatPersistenceEnabled: boolean;
  statsApiEnabled: boolean;
  defaultAppId: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  seedEmail: string;
  seedPassword: string;
  seedName: string;
}

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined || value === '') {
    return defaultValue;
  }

  return value === 'true' || value === '1';
}

function parseAuthMode(value: string | undefined): AuthMode {
  if (value === 'mock' || value === 'env' || value === 'database') {
    return value;
  }

  return 'env';
}

export function loadFeatureFlags(): FeatureFlags {
  return {
    authEnabled: parseBoolean(process.env.FEATURE_AUTH_ENABLED, true),
    authMode: parseAuthMode(process.env.AUTH_MODE),
    socketAuthEnabled: parseBoolean(process.env.FEATURE_SOCKET_AUTH, false),
    chatApiEnabled: parseBoolean(process.env.FEATURE_CHAT_API, true),
    chatPersistenceEnabled: parseBoolean(process.env.FEATURE_CHAT_PERSISTENCE, true),
    statsApiEnabled: parseBoolean(process.env.FEATURE_STATS_API, true),
    defaultAppId: process.env.DEFAULT_APP_ID || 'default',
    jwtSecret: process.env.AUTH_JWT_SECRET || 'intracom-dev-secret-change-in-production',
    jwtExpiresIn: process.env.AUTH_JWT_EXPIRES_IN || '7d',
    seedEmail: process.env.ADMIN_SEED_EMAIL || 'admin@intracom.com',
    seedPassword: process.env.ADMIN_SEED_PASSWORD || 'changeme',
    seedName: process.env.ADMIN_SEED_NAME || 'Admin User',
  };
}
