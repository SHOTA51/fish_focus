const axios = require('axios');
const jwt = require('jsonwebtoken');

async function run() {
  const BASE_URL = 'http://localhost:3000/api';
  
  try {
    await axios.post(`${BASE_URL}/auth/register`, {
      username: 'verify_user',
      email: 'verify@example.com',
      password: 'password123'
    }).catch(e => {});

    const login = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'verify@example.com',
      password: 'password123'
    });
    const token = login.data.token;

    const stats = await axios.get(`${BASE_URL}/statistics`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('STATS_RESPONSE:' + JSON.stringify(stats.data));
  } catch (e) {
    console.error('Error:', e.response?.data || e.message);
  }
}
run();
