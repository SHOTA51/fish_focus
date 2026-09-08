import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const api = {
  async login(email, password) {
    const { data } = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    return data;
  },

  async register(username, email, password) {
    const { data } = await axios.post(`${API_BASE_URL}/auth/register`, { username, email, password });
    return data;
  },

  async getUserProfile(userId) {
    const { data } = await axios.get(`${API_BASE_URL}/user/${userId}`);
    return data;
  },

  async completeSession(userId, duration) {
    const { data } = await axios.post(`${API_BASE_URL}/focus/complete`, { userId, duration });
    return data;
  },

  async getQuests(userId) {
    const { data } = await axios.get(`${API_BASE_URL}/quests/${userId}`);
    return data;
  },
};
