const axios = require('axios');
const { readFileSync } = require('fs');

const NEW_URL = 'https://script.google.com/macros/s/AKfycbz9PZmKFpqxgT-JVkWVHqps1nl8XlgFVbnR4wQs2lq_Ta41d7zqYa3pl77DqvHLev6A/exec';

async function testSync() {
  try {
    const data = JSON.parse(readFileSync('D:\\Smart Volunteers PMI Kota Cilegon\\data\\anggota_from_sheets.json', 'utf-8'));
    const members = data.map(item => ({
      ...item,
      foto: item.foto && item.foto.includes('localhost') ? '' : item.foto
    }));

    console.log(`Testing sync with ${members.length} members...`);
    console.log(`Sample member foto field: ${members[0].foto ? 'HAS DATA' : 'EMPTY'}`);

    const response = await axios.post(NEW_URL, {
      action: 'sync',
      sheet: 'PMR',
      type: 'member',
      data: members
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 180000,
      maxRedirects: 5
    });

    console.log('Status:', response.status);
    console.log('Response type:', typeof response.data);
    console.log('Response keys:', Object.keys(response.data || {}));
    console.log('Response preview:', JSON.stringify(response.data).substring(0, 500));
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data).substring(0, 500));
    }
  }
}

testSync();
