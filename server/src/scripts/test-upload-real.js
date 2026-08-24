const axios = require('axios');
const { readFileSync } = require('fs');

const NEW_URL = 'https://script.google.com/macros/s/AKfycbz9PZmKFpqxgT-JVkWVHqps1nl8XlgFVbnR4wQs2lq_Ta41d7zqYa3pl77DqvHLev6A/exec';

async function testUpload() {
  try {
    const data = JSON.parse(readFileSync('D:\\Smart Volunteers PMI Kota Cilegon\\data\\anggota_from_sheets.json', 'utf-8'));
    const record = data.find(item => item.foto && item.foto !== '' && item.foto !== 'null');

    if (!record) {
      console.log('No photo to upload');
      return;
    }

    let base64Data = record.foto;
    if (base64Data.includes(',')) {
      base64Data = base64Data.split(',')[1];
    }

    console.log(`Uploading foto for ${record.kode_anggota}...`);
    console.log(`Base64 length: ${base64Data.length}`);

    const response = await axios.post(NEW_URL, {
      action: 'upload',
      sheet: 'PMR',
      data: {
        file: base64Data,
        fileName: `${record.kode_anggota}_${record.nama.replace(/\s+/g, '_')}.jpg`,
        mimeType: 'image/jpeg',
        profileId: record.id.toString()
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
