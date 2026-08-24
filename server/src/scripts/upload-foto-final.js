const https = require('https');

const data = JSON.parse(require('fs').readFileSync('D:\\Smart Volunteers PMI Kota Cilegon\\data\\anggota_from_sheets.json', 'utf-8'));
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

const postData = JSON.stringify({
  action: 'upload',
  sheet: 'PMR',
  data: {
    file: base64Data,
    fileName: `${record.kode_anggota}_${record.nama.replace(/\s+/g, '_')}.jpg`,
    mimeType: 'image/jpeg',
    profileId: record.id.toString()
  }
});

const NEW_URL = 'https://script.google.com/macros/s/AKfycbwj9fcf95YpE0XZfY1tP3hxyKuZPr3CEgIOS6OqnN39lhXUI-8HcN_KpMGQXqVliDRs/exec';

function makeRequest(url, postBody) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postBody)
      }
    };

    const req = https.request(options, (res) => {
      console.log(`Status: ${res.statusCode}`);
      
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        console.log(`Following redirect to: ${res.headers.location}`);
        res.resume(); // Consume response data
        resolve(makeRequest(res.headers.location, postBody));
      } else {
        let responseData = '';
        res.on('data', (chunk) => responseData += chunk);
        res.on('end', () => {
          resolve({ status: res.statusCode, data: responseData });
        });
      }
    });

    req.on('error', reject);
    req.write(postBody);
    req.end();
  });
}

makeRequest(NEW_URL, postData).then(result => {
  console.log(`\nFinal status: ${result.status}`);
  console.log(`Response length: ${result.data.length}`);
  
  if (result.data.length > 0) {
    try {
      const response = JSON.parse(result.data);
      console.log('Response:', response);
      if (response.foto) {
        console.log('\n✅ Upload successful! Drive URL:', response.foto);
      } else if (response.error) {
        console.error('\n❌ Upload failed:', response.error);
      } else {
        console.log('\n⚠️ Unexpected response format');
      }
    } catch (e) {
      console.error('\n❌ Invalid JSON response');
      console.log('Response preview:', result.data.substring(0, 500));
    }
  } else {
    console.log('\n⚠️ Empty response');
  }
}).catch(err => {
  console.error('\n❌ Error:', err.message);
});
