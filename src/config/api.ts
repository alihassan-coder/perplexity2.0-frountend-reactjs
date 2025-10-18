// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  ENDPOINTS: {
    CHAT: '/chat',
    CHAT_STREAM: '/chat/stream',
    HEALTH: '/',
  },
} as const;

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string, params?: Record<string, string>) => {
  const url = new URL(endpoint, API_CONFIG.BASE_URL);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  
  return url.toString();
};
