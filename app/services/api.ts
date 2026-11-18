import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../constants/config';
import { User, Quest, Statistics } from '../types';

// Create an axios instance to handle JWT tokens automatically
const client = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 30000, // 30s timeout to gracefully accommodate Render cold-starts
});

// Interceptor to attach JWT token to every request
client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to clear invalid/expired token on 401 or 403
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      await AsyncStorage.multiRemove(['token', 'userId']);
    }
    return Promise.reject(error);
  }
);

export const api = {
  async login(identifier: string, password: string) {
    const cleanId = identifier.trim();
    const { data } = await client.post('/auth/login', {
      email: cleanId,
      username: cleanId,
      identifier: cleanId,
      password,
    });
    // Save token and userId for future requests
    if (data.token) {
      await AsyncStorage.setItem('token', data.token);
    }
    if (data.userId) {
      await AsyncStorage.setItem('userId', data.userId);
    }
    return data; 
  },

  async register(username: string, email: string, password: string) {
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();
    const { data } = await client.post('/auth/register', {
      username: cleanUsername,
      email: cleanEmail,
      password,
    });
    if (data.token) {
      await AsyncStorage.setItem('token', data.token);
    }
    if (data.userId) {
      await AsyncStorage.setItem('userId', data.userId);
    }
    return data;
  },

  async getUserProfile(_id?: string) {
    const { data } = await client.get('/user/profile');
    return data as User;
  },

  async completeSession(
    duration: number,
    _userId?: string,
    extra?: { earnedExp?: number; clientLevel?: number; clientStage?: string }
  ) {
    const { data } = await client.post('/focus/complete', {
      duration,
      ...extra,
    });
    return data;
  },

  async syncFish(fishData: { level?: number; experience?: number; stage?: string; name?: string }) {
    try {
      const { data } = await client.put('/user/fish', fishData);
      return data;
    } catch (err) {
      // Graceful fallback if backend route is not deployed yet
      return null;
    }
  },

  async getQuests() {
    const { data } = await client.get('/quests');
    return data as Quest[];
  },

  async getStatistics() {
    const { data } = await client.get('/statistics');
    return data as Statistics;
  },
};

