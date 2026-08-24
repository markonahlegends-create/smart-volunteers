const https = require('https');

const payload = JSON.stringify({
  action: 'upload',
  sheet: 'PMR',
  data: {
    file: 'test_base64_data',
    fileName: 'test.jpg',
    mimeType: 'image/jpeg',
    profileId: '1'
  }
});

const options = {
  hostname: 'script.google.com',
  path: '/macros/s/AKfycby78AqtoHPwc6rHsXcUJduP83OIMw2HM4QIohdhMOsTwKSTeuANi6hUrCweqmswTPbO/exec?action=upload&sheet=PMR&file=test&fileName=test.jpg&mimeType=image/jpeg&profileId=1',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': payload.length
  }
};

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  let responseData = '';
  res.on('data', (chunk) => responseData += chunk);
  res.on('end', () => {
    console.log('Response:', responseData);
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.write(payload);
req.end();
