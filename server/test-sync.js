const http = require('http');

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJjdWtsYXlAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzg3NTAzNjM5LCJleHAiOjE3ODgxMDg0Mzl9.LNEzOjYLfsIWMkD_QE6OsH32gG0u77e5aUdonCwizxE';

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        console.log(`\n=== ${path} ===`);
        console.log('Status:', res.statusCode);
        console.log('Response:', body.substring(0, 500));
        resolve();
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function testSync() {
  console.log('Testing sync endpoints...');
  
  await makeRequest('/api/sync/members');
  await makeRequest('/api/sync/units');
  await makeRequest('/api/sync/bencana');
  await makeRequest('/api/sync/kegiatan');
  await makeRequest('/api/sync/all');
  
  console.log('\n=== All sync tests completed ===');
}

testSync().catch(console.error);
