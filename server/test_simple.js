const http = require('http');

function request(method, path, token) {
  return new Promise((resolve, reject) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers,
    }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        console.log('STATUS:', res.statusCode);
        console.log('BODY:', body);
        resolve({ status: res.statusCode, body });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  const login = await request('POST', '/api/auth/login', null);
  // This will fail without body, but let's see what happens
})();
