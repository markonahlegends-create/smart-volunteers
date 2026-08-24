const { readFileSync } = require('fs');
const data = JSON.parse(readFileSync('D:\\Smart Volunteers PMI Kota Cilegon\\data\\anggota_from_sheets.json', 'utf-8'));
const withFoto = data.filter(item => item.foto && item.foto !== '' && item.foto !== 'null');
console.log('Total records:', data.length);
console.log('Records with foto:', withFoto.length);
withFoto.forEach(item => {
  console.log(`  ${item.kode_anggota}: ${item.foto.substring(0, 50)}...`);
});
