const https = require('https');
const http = require('http');

const options = {
  hostname: 'script.google.com',
  path: '/macros/s/AKfycby78AqtoHPwc6rHsXcUJduP83OIMw2HM4QIohdhMOsTwKSTeuANi6hUrCweqmswTPbO/exec?sheet=PMR&action=get',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
};

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  let responseData = '';
  res.on('data', (chunk) => responseData += chunk);
  res.on('end', () => {
    console.log('Response length:', responseData.length);
    if (responseData.length > 0) {
      try {
        const result = JSON.parse(responseData);
        console.log('Records:', result.length);
      } catch (e) {
        console.log('Response preview:', responseData.substring(0, 200));
      }
    } else {
      console.log('Empty response');
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.end();
