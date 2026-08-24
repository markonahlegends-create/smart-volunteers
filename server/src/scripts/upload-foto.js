const https = require('https');
const { readFileSync } = require('fs');

const data = JSON.parse(readFileSync('D:\\Smart Volunteers PMI Kota Cilegon\\data\\anggota_from_sheets.json', 'utf-8'));
const withFoto = data.filter(item => item.foto && item.foto !== '' && item.foto !== 'null');

if (withFoto.length === 0) {
  console.log('No photos to upload');
  process.exit(0);
}

const record = withFoto[0];
console.log(`Uploading foto for ${record.kode_anggota}...`);

const payload = JSON.stringify({
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
  path: '/macros/s/AKfycby78AqtoHPwc6rHsXcUJduP83OIMw2HM4QIohdhMOsTwKSTeuANi6hUrCweqmswTPbO/exec',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': payload.length
  }
};

const req = https.request(options, (res) => {
  let responseData = '';
  res.on('data', (chunk) => responseData += chunk);
  res.on('end', () => {
    console.log('Response:', responseData);
    try {
      const result = JSON.parse(responseData);
      if (result.foto) {
        console.log('Upload successful! Drive URL:', result.foto);
      } else if (result.error) {
        console.error('Upload failed:', result.error);
      } else {
        console.log('Response:', result);
      }
    } catch (e) {
      console.error('Invalid response:', responseData);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.write(payload);
req.end();
