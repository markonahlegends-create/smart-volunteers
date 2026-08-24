const https = require('https');

const options = {
  hostname: 'script.google.com',
  path: '/macros/s/AKfycby78AqtoHPwc6rHsXcUJduP83OIMw2HM4QIohdhMOsTwKSTeuANi6hUrCweqmswTPbO/exec?sheet=PMR&action=get',
  method: 'GET'
};

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  let responseData = '';
  res.on('data', (chunk) => responseData += chunk);
  res.on('end', () => {
    console.log('Response length:', responseData.length);
    try {
      const result = JSON.parse(responseData);
      console.log('Records:', result.length);
    } catch (e) {
      console.log('Response preview:', responseData.substring(0, 200));
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.end();
