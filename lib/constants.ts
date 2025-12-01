// API base URL
export const API_URL = 'https://beuma-64bbab9df83e.herokuapp.com';

// Storage keys for AsyncStorage
export const STORAGE_KEYS = {
  AUTH: {
    TOKEN: '@auth:token',
    USER_ID: '@auth:userId',
    USERNAME: '@auth:username',
    EMAIL: '@auth:email',
  },
  SETTINGS: {
    THEME: '@settings:theme',
    NOTIFICATIONS: '@settings:notifications',
  },
  CACHE: {
    POSTS: '@cache:posts',
    USER: (id: number) => `@cache:user:${id}`,
  },
} as const;
