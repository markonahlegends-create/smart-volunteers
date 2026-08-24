const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function getToken() {
  const response = await axios.post(`${API_URL}/auth/login`, {
    login: 'cuklay@gmail.com',
    password: 'admin123',
    captcha: 'test123'
  });
  return response.data.token;
}

async function testSync(token) {
  try {
    const response = await axios.post(`${API_URL}/sync/members`, null, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 180000
    });

    console.log('Sync Status:', response.status);
    console.log('Sync Response:', response.data);
  } catch (error) {
    console.error('Sync Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

async function main() {
  try {
    const token = await getToken();
    console.log('Got token');
    await testSync(token);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
