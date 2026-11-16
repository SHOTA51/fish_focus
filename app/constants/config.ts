import Constants from 'expo-constants';

const hostUri = Constants.expoConfig?.hostUri ?? 'localhost:3000';
const devHost = hostUri.split(':').slice(0, -1).join(':') || 'localhost';

/**
 * URL ของเซิร์ฟเวอร์ Backend
 * - โหมด Production: ชี้ไปยัง URL เซิร์ฟเวอร์ Backend ที่ Deploy แล้วจริงบน Cloud
 *   (สามารถกำหนดผ่าน Environment Variable EXPO_PUBLIC_API_URL หรือแก้ไข URL ด้านล่างนี้)
 * - โหมด Development: ชี้ไปยังเครื่อง Localhost / Dev machine ของคุณ
 */
const PRODUCTION_API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://fish-focus-backend.onrender.com/api';

export const API_CONFIG = {
  BASE_URL: __DEV__
    ? (process.env.EXPO_PUBLIC_API_URL || `http://${devHost}:3000/api`)
    : PRODUCTION_API_URL,
};
