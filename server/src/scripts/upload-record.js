const { readFileSync } = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const data = JSON.parse(readFileSync('D:\\Smart Volunteers PMI Kota Cilegon\\data\\anggota_from_sheets.json', 'utf-8'));
const record = data.find(item => item.foto && item.foto !== '' && item.foto !== 'null');

if (!record) {
  console.log('No photo to upload');
  process.exit(0);
}

console.log(`Uploading foto for ${record.kode_anggota}...`);

const body = JSON.stringify({
  action: 'upload',
  sheet: 'PMR',
  data: {
    file: record.foto,
    fileName: `${record.kode_anggota}_${record.nama.replace(/\s+/g, '_')}.jpg`,
    mimeType: 'image/jpeg',
    profileId: record.id.toString()
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

const psPath = path.join(__dirname, 'upload-record.ps1');
require('fs').writeFileSync(psPath, psScript);

try {
  const result = execSync(`powershell -ExecutionPolicy Bypass -File "${psPath}"`, {
    encoding: 'utf-8',
    maxBuffer: 50 * 1024 * 1024,
    timeout: 60000
  });
  console.log('PowerShell output:', result);
} catch (e) {
  console.error('Script error:', e.message);
  if (e.stdout) console.log('stdout:', e.stdout);
  if (e.stderr) console.error('stderr:', e.stderr);
}
