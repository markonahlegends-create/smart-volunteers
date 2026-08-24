const https = require('https');

const NEW_URL = 'https://script.google.com/macros/s/AKfycbw76AaDqcPzNalOEgBnQWRqF2SSr8CHnKl7du8CV8N8oic2t53wC3bqTxSxNUVcNWoq/exec';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      console.log(`Status: ${res.statusCode}`);
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data: responseData });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function test() {
  const result = await makeRequest(NEW_URL);
  console.log(`Response length: ${result.data.length}`);
  console.log(`Response preview: ${result.data.substring(0, 200)}`);
}

test();
