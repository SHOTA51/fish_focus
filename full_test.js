const axios = require('axios');
const jwt = require('jsonwebtoken');

async function run() {
  const BASE_URL = 'http://localhost:3000/api';
  const SECRET = 'super-secret-fish-key-12345';
  
  try {
    // 1. Register
    await axios.post(`${BASE_URL}/auth/register`, {
      username: 'verify_user',
      email: 'verify@example.com',
      password: 'password123'
    }).catch(e => console.log('Reg skipped/failed'));

    // 2. Login
    const login = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'verify@example.com',
      password: 'password123'
    });
    const token = login.data.token;
    console.log('Auth Success. Token obtained.');

    // 3. Request Stats
    const stats = await axios.get(`${BASE_URL}/statistics`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('STATS_RESPONSE:' + JSON.stringify(stats.data));
  } catch (e) {
    console.error('Error:', e.response?.data || e.message);
  }
}
run();
