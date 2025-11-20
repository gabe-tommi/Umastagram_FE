import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';

export const storage = {
  // Auth helpers
  async saveAuth(token: string, userId: number, username: string, email: string) {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.AUTH.TOKEN, token],
      [STORAGE_KEYS.AUTH.USER_ID, String(userId)],
      [STORAGE_KEYS.AUTH.USERNAME, username],
      [STORAGE_KEYS.AUTH.EMAIL, email],
    ]);
  },

  async getAuth() {
    const [token, userId, username, email] = await AsyncStorage.multiGet([
      STORAGE_KEYS.AUTH.TOKEN,
      STORAGE_KEYS.AUTH.USER_ID,
      STORAGE_KEYS.AUTH.USERNAME,
      STORAGE_KEYS.AUTH.EMAIL,
    ]);
    
    return {
      token: token[1],
      userId: userId[1] ? parseInt(userId[1]) : null,
      username: username[1],
      email: email[1],
    };
  },

  async clearAuth() {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH.TOKEN,
      STORAGE_KEYS.AUTH.USER_ID,
      STORAGE_KEYS.AUTH.USERNAME,
      STORAGE_KEYS.AUTH.EMAIL,
    ]);
  },

  async isAuthenticated() {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH.TOKEN);
    return !!token;
  },

  // Generic helpers
  async setItem(key: string, value: any) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage setItem error:', error);
    }
  },

  async getItem(key: string) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  },

  async removeItem(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage removeItem error:', error);
    }
  },

  // Cache with expiration
  async setCache(key: string, data: any, expiryMinutes: number = 60) {
    const cacheData = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + (expiryMinutes * 60 * 1000),
    };
    await this.setItem(key, cacheData);
  },

  async getCache(key: string) {
    const cached = await this.getItem(key);
    if (!cached) return null;
    
    // Check if expired
    if (Date.now() > cached.expiresAt) {
      await this.removeItem(key);
      return null;
    }
    
    return cached.data;
  },

  // Clear all data (logout)
  async clearAll() {
    await AsyncStorage.clear();
  },
};
