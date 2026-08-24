const https = require('https');

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
  path: '/macros/s/AKfycby78AqtoHPwc6rHsXcUJduP83OIMw2HM4QIohdhMOsTwKSTeuANi6hUrCweqmswTPbO/exec',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log('Status:', res.statusCode);
      
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        console.log('Following redirect to:', res.headers.location);
        const redirectUrl = new URL(res.headers.location);
        const redirectOptions = {
          hostname: redirectUrl.hostname,
          path: redirectUrl.pathname + redirectUrl.search,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };
        
        makeRequest(redirectOptions, postData).then(resolve).catch(reject);
      } else {
        let responseData = '';
        res.on('data', (chunk) => responseData += chunk);
        res.on('end', () => {
          resolve({ status: res.statusCode, data: responseData });
        });
      }
    });

    req.on('error', reject);
    
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

makeRequest(options, postData).then(result => {
  console.log('Final status:', result.status);
  console.log('Response length:', result.data.length);
  
  if (result.data.length > 0) {
    try {
      const response = JSON.parse(result.data);
      console.log('Response:', response);
      if (response.foto) {
        console.log('Upload successful! Drive URL:', response.foto);
      } else if (response.error) {
        console.error('Upload failed:', response.error);
      }
    } catch (e) {
      console.error('Invalid JSON response');
      console.log('Response preview:', result.data.substring(0, 500));
    }
  }
}).catch(err => {
  console.error('Error:', err.message);
});
