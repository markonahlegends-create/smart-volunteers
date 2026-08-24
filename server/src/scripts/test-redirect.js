const https = require('https');

const options = {
  hostname: 'script.google.com',
  path: '/macros/s/AKfycby78AqtoHPwc6rHsXcUJduP83OIMw2HM4QIohdhMOsTwKSTeuANi6hUrCweqmswTPbO/exec?sheet=PMR&action=get',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
};

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));
  
  if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
    console.log('Redirecting to:', res.headers.location);
    // Follow redirect
    const redirectUrl = new URL(res.headers.location);
    const redirectOptions = {
      hostname: redirectUrl.hostname,
      path: redirectUrl.pathname + redirectUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };
    
    const redirectReq = https.request(redirectOptions, (redirectRes) => {
      let responseData = '';
      redirectRes.on('data', (chunk) => responseData += chunk);
      redirectRes.on('end', () => {
        console.log('Redirect response length:', responseData.length);
        console.log('Redirect response preview:', responseData.substring(0, 500));
      });
    });
    
    redirectReq.on('error', (e) => {
      console.error('Redirect error:', e.message);
    });
    
    redirectReq.end();
  } else {
    let responseData = '';
    res.on('data', (chunk) => responseData += chunk);
    res.on('end', () => {
      console.log('Response length:', responseData.length);
      console.log('Response preview:', responseData.substring(0, 500));
    });
  }
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.end();
