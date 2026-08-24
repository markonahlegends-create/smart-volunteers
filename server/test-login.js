const http = require('http');

const data = JSON.stringify({
  login: 'cuklay@gmail.com',
  password: 'admin123',
  captcha: '1234'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
    try {
      const json = JSON.parse(body);
      if (json.token) {
        console.log('TOKEN:', json.token);
      }
    } catch (e) {
      console.log('Not JSON');
    }
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();
