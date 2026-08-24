const { execSync } = require('child_process');
const path = require('path');

// Tiny 1x1 red pixel JPEG in base64
const tinyBase64 = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA==';

const body = JSON.stringify({
  action: 'upload',
  sheet: 'PMR',
  data: {
    file: tinyBase64,
    fileName: 'test_tiny.jpg',
    mimeType: 'image/jpeg',
    profileId: '999'
  }
});

const psScript = `
$body = '${body.replace(/'/g, "''")}'
try {
    $r = Invoke-RestMethod -Uri 'https://script.google.com/macros/s/AKfycby78AqtoHPwc6rHsXcUJduP83OIMw2HM4QIohdhMOsTwKSTeuANi6hUrCweqmswTPbO/exec' -Method Post -Body $body -ContentType 'application/json' -MaximumRedirection 5
    Write-Host 'SUCCESS:' ($r | ConvertTo-Json -Depth 10)
} catch {
    Write-Host 'ERROR:' $_.Exception.Message
}
`;

const psPath = path.join(__dirname, 'upload-tiny.ps1');
require('fs').writeFileSync(psPath, psScript);

try {
  const result = execSync(`powershell -ExecutionPolicy Bypass -File "${psPath}"`, {
    encoding: 'utf-8',
    maxBuffer: 10 * 1024 * 1024,
    timeout: 60000
  });
  console.log('PowerShell output:', result);
} catch (e) {
  console.error('Script error:', e.message);
  if (e.stdout) console.log('stdout:', e.stdout);
  if (e.stderr) console.error('stderr:', e.stderr);
}
