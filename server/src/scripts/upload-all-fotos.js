const axios = require('axios');
const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const { join } = require('path');

const NEW_URL = 'https://script.google.com/macros/s/AKfycbxoALvYyflVd89ePMaBUgvEJ5NglMwmPL70vG_YIyutXbcTg8na_2NJTbExK9giAgXK/exec';
const UPLOADS_DIR = 'D:\\Smart Volunteers PMI Kota Cilegon\\server\\uploads';

async function uploadPhoto(record) {
  let base64Data = record.foto;
  if (base64Data.includes(',')) {
    base64Data = base64Data.split(',')[1];
  }

  console.log(`Uploading foto for ${record.kode_anggota} - ${record.nama}...`);
  console.log(`  Base64 length: ${base64Data.length}`);

  try {
    const response = await axios.post(NEW_URL, {
      action: 'upload',
      sheet: record.sheet_type || 'PMR',
      data: {
        file: base64Data,
        fileName: `${record.kode_anggota}_${record.nama.replace(/\s+/g, '_')}.jpg`,
        mimeType: 'image/jpeg',
        profileId: String(record.id)
      }
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 120000,
      maxRedirects: 5
    });

    if (response.data.foto) {
      console.log(`  ✅ Upload successful! Drive URL: ${response.data.foto}`);
      return response.data.foto;
    } else if (response.data.error) {
      console.error(`  ❌ Upload failed: ${response.data.error}`);
      return null;
    } else {
      console.error(`  ❌ Unexpected response:`, JSON.stringify(response.data));
      return null;
    }
  } catch (error) {
    console.error(`  ❌ Error:`, error.message);
    return null;
  }
}

async function downloadPhoto(driveUrl, filePath) {
  try {
    const response = await axios.get(driveUrl, {
      responseType: 'stream',
      timeout: 60000
    });

    return new Promise((resolve, reject) => {
      const writer = require('fs').createWriteStream(filePath);
      response.data.pipe(writer);
      writer.on('finish', () => resolve(filePath));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`  ❌ Download failed:`, error.message);
    return null;
  }
}

async function main() {
  const dataFiles = [
    { path: 'D:\\Smart Volunteers PMI Kota Cilegon\\data\\anggota_from_sheets.json', type: 'pmr' },
    { path: 'D:\\Smart Volunteers PMI Kota Cilegon\\data\\ksr_from_sheets.json', type: 'ksr' },
    { path: 'D:\\Smart Volunteers PMI Kota Cilegon\\data\\tsr_from_sheets.json', type: 'tsr' },
  ];

  const recordsWithFoto = [];

  for (const file of dataFiles) {
    try {
      const raw = readFileSync(file.path, 'utf-8');
      const members = JSON.parse(raw);
      const withFoto = members.filter(item => item.foto && item.foto !== '' && item.foto !== 'null');
      
      console.log(`\n${file.type.toUpperCase()}: Found ${withFoto.length} records with foto`);
      
      withFoto.forEach(item => {
        recordsWithFoto.push({
          ...item,
          sheet_type: file.type === 'pmr' ? 'PMR' : file.type === 'ksr' ? 'KSR' : 'TSR'
        });
      });
    } catch (error) {
      console.error(`Error reading ${file.path}:`, error.message);
    }
  }

  console.log(`\nTotal records to upload: ${recordsWithFoto.length}`);

  if (recordsWithFoto.length === 0) {
    console.log('No photos to upload.');
    return;
  }

  mkdirSync(UPLOADS_DIR, { recursive: true });

  for (const record of recordsWithFoto) {
    const driveUrl = await uploadPhoto(record);
    if (!driveUrl) continue;

    const fileName = `${record.kode_anggota}_${record.nama.replace(/\s+/g, '_')}.jpg`;
    const localPath = join(UPLOADS_DIR, fileName);
    
    console.log(`  Downloading to ${localPath}...`);
    await downloadPhoto(driveUrl, localPath);
    console.log(`  ✅ Downloaded to ${localPath}`);
  }

  console.log('\n✅ All uploads completed!');
  console.log('\nNext step: Update database records with local URLs');
  console.log('Run: npx tsx src/scripts/update-foto-urls.ts');
}

main().catch(console.error);
