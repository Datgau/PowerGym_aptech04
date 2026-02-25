// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// OAuth Configuration
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
export const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || '';

// App Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ADMIN: '/admin',
  MESSAGES: '/messages',
  NOTIFICATIONS: '/notifications',
  DATA_DELETION: '/data-deletion',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    OAUTH_GOOGLE: '/auth/oauth/google',
    OAUTH_FACEBOOK: '/auth/oauth/facebook',
  },
  USER: {
    PROFILE: '/users/profile',
    UPDATE: '/users/update',
  },
  POST: {
    LIST: '/posts',
    CREATE: '/posts',
    UPDATE: (id: number) => `/posts/${id}`,
    DELETE: (id: number) => `/posts/${id}`,
  },
} as const;
