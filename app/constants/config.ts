import Constants from 'expo-constants';

const hostUri = Constants.expoConfig?.hostUri ?? 'localhost:3000';
const devHost = hostUri.split(':').slice(0, -1).join(':') || 'localhost';

export const API_CONFIG = {
  BASE_URL: __DEV__
    ? `http://${devHost}:3000/api`
    : 'https://api.fishfocus.app/api',
};
