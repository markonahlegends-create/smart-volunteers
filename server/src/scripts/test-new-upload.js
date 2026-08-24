const axios = require('axios');
const { readFileSync } = require('fs');

const NEW_URL = 'https://script.google.com/macros/s/AKfycbyFPk7Dr9sKwWvfo-QVktmiWvLQplvzV2JKlhEMWtRnfwPwDj2mypuMe0Xs8aOxfwYH/exec';

async function testUpload() {
  try {
    const response = await axios.post(NEW_URL, {
      action: 'upload',
      sheet: 'PMR',
      data: {
        file: 'test_base64_data',
        fileName: 'test.jpg',
        mimeType: 'image/jpeg',
        profileId: '1'
      }
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 120000,
      maxRedirects: 5
    });

    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testUpload();
