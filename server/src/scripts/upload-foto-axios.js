const axios = require('axios');
const { readFileSync } = require('fs');

const data = JSON.parse(readFileSync('D:\\Smart Volunteers PMI Kota Cilegon\\data\\anggota_from_sheets.json', 'utf-8'));
const record = data.find(item => item.foto && item.foto !== '' && item.foto !== 'null');

if (!record) {
  console.log('No photo to upload');
  process.exit(0);
}

let base64Data = record.foto;
if (base64Data.includes(',')) {
  base64Data = base64Data.split(',')[1];
}

console.log(`Uploading foto for ${record.kode_anggota}...`);
console.log(`Base64 length: ${base64Data.length}`);

const NEW_URL = 'https://script.google.com/macros/s/AKfycbwj9fcf95YpE0XZfY1tP3hxyKuZPr3CEgIOS6OqnN39lhXUI-8HcN_KpMGQXqVliDRs/exec';

axios.post(NEW_URL, {
  action: 'upload',
  sheet: 'PMR',
  data: {
    file: base64Data,
    fileName: `${record.kode_anggota}_${record.nama.replace(/\s+/g, '_')}.jpg`,
    mimeType: 'image/jpeg',
    profileId: record.id.toString()
  }
}, {
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 120000,
  maxRedirects: 5
}).then(response => {
  console.log(`\nStatus: ${response.status}`);
  console.log('Response:', JSON.stringify(response.data, null, 2));
  
  if (response.data.foto) {
    console.log('\n✅ Upload successful! Drive URL:', response.data.foto);
  } else if (response.data.error) {
    console.error('\n❌ Upload failed:', response.data.error);
  }
}).catch(error => {
  console.error('\n❌ Error:', error.message);
  if (error.response) {
    console.error('Response status:', error.response.status);
    console.error('Response data:', error.response.data);
  }
});
