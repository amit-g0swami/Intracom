export interface FeatureFlags {
  mockAuth: boolean;
  socketAuth: boolean;
  chatApi: boolean;
  statsApi: boolean;
  apiUrl: string;
  socketUrl: string;
}

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined || value === '') {
    return defaultValue;
  }

  return value === 'true' || value === '1';
}

export const features: FeatureFlags = {
  mockAuth: parseBoolean(process.env.NEXT_PUBLIC_FEATURE_MOCK_AUTH, false),
  socketAuth: parseBoolean(process.env.NEXT_PUBLIC_FEATURE_SOCKET_AUTH, false),
  chatApi: parseBoolean(process.env.NEXT_PUBLIC_FEATURE_CHAT_API, true),
  statsApi: parseBoolean(process.env.NEXT_PUBLIC_FEATURE_STATS_API, true),
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000',
};
