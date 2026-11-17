import Constants from 'expo-constants';

/**
 * URL ของเซิร์ฟเวอร์ Backend
 * - เชื่อมต่อกับ Render Web Service (https://fish-focus.onrender.com/api)
 * - สามารถ override ได้ผ่าน EXPO_PUBLIC_API_URL ใน .env
 */
const LIVE_API_URL = 'https://fish-focus.onrender.com/api';

export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || LIVE_API_URL,
};

