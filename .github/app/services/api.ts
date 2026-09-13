import axios from 'axios';
import { API_CONFIG } from '../constants/config';
import { User, Quest } from '../types';

// Create an axios instance to handle JWT tokens automatically
const client = axios.create({
  baseURL: API_CONFIG.BASE_URL,
});

// Interceptor to attach JWT token to every request
client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

import AsyncStorage from '@react-native-async-storage/async-storage';

export const api = {
  async login(email: string, password: string) {
    const { data } = await client.post('/auth/login', { email, password });
    // Save token for future requests
    await AsyncStorage.setItem('token', data.token);
    return data; 
  },

  async register(username: string, email: string, password: string) {
    const { data } = await client.post('/auth/register', { username, email, password });
    await AsyncStorage.setItem('token', data.token);
    return data;
  },

  async getUserProfile(_id?: string) {
    const { data } = await client.get('/user/profile');
    return data as User;
  },

  async completeSession(duration: number, _userId?: string) {
    const { data } = await client.post('/focus/complete', { duration });
    return data;
  },

  async getQuests() {
    const { data } = await client.get('/quests');
    return data as Quest[];
  },
};
