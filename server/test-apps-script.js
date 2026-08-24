const https = require('https');

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzkvO9RWDj3MbESVFTCaSacs-PtJfJmeM4-Y6hDNf0vJRLKapOagNmNntHU5bC4Fqo9/exec';

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(APPS_SCRIPT_URL);
    url.pathname += path;
    
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        console.log(`\n=== ${method} ${path} ===`);
        console.log('Status:', res.statusCode);
        console.log('Response:', body.substring(0, 500));
        resolve();
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testAppsScript() {
  console.log('Testing Google Apps Script...');
  
  // Test insert sample data
  await makeRequest('?sheet=PMR&action=insert', 'POST', {
    sheet: 'PMR',
    action: 'insert',
    data: [{
      id: 'test_' + Date.now(),
      provinsi: 'Banten',
      kabupaten: 'Kota Cilegon',
      nama: 'Test User',
      kelamin: 'L',
      status: 'Aktif',
      nama_unit: 'Test Unit',
      jenis: 'PMR',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]
  });
  
  // Test get data
  await makeRequest('?sheet=PMR&action=get', 'GET');
  
  console.log('\n=== Apps Script test completed ===');
}

testAppsScript().catch(console.error);
