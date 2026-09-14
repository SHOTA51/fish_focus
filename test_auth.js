const axios = require('axios');
async function run() {
  try {
    const reg = await axios.post('http://localhost:3000/api/auth/register', {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Registered');
    const login = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('TOKEN:' + login.data.token);
  } catch (e) {
    console.error(e.response?.data || e.message);
  }
}
run();
