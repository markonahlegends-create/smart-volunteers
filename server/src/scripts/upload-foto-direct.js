const https = require('https');
const querystring = require('querystring');

const data = JSON.parse(require('fs').readFileSync('D:\\Smart Volunteers PMI Kota Cilegon\\data\\anggota_from_sheets.json', 'utf-8'));
const record = data.find(item => item.foto && item.foto !== '' && item.foto !== 'null');

if (!record) {
  console.log('No photo to upload');
  process.exit(0);
}

console.log(`Uploading foto for ${record.kode_anggota}...`);

const postData = JSON.stringify({
  action: 'upload',
  sheet: 'PMR',
  data: {
    file: record.foto,
    fileName: `${record.kode_anggota}_${record.nama.replace(/\s+/g, '_')}.jpg`,
    mimeType: 'image/jpeg',
    profileId: record.id.toString()
  }
});

const options = {
  hostname: 'script.google.com',
  path: '/macros/s/AKfycbwj9fcf95YpE0XZfY1tP3hxyKuZPr3CEgIOS6OqnN39lhXUI-8HcN_KpMGQXqVliDRs/exec',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  
  let responseData = '';
  res.on('data', (chunk) => responseData += chunk);
  res.on('end', () => {
    console.log('Response length:', responseData.length);
    console.log('Response:', responseData);
    
    if (responseData.length > 0) {
      try {
        const result = JSON.parse(responseData);
        if (result.foto) {
          console.log('Upload successful! Drive URL:', result.foto);
        } else if (result.error) {
          console.error('Upload failed:', result.error);
        }
      } catch (e) {
        console.error('Invalid JSON response');
      }
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.write(postData);
req.end();
