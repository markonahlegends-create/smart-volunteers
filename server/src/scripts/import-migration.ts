import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const DATA_DIR = path.join(__dirname, '..', 'migration-data');

interface MemberRow {
  provinsi: string;
  kabupaten: string;
  angkatan: string;
  kode_anggota: string;
  nama: string;
  kelamin: string;
  status: string;
  nama_unit: string;
  jenis: string;
  kategori?: string;
  jenis_identitas?: string;
  no_nik?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  agama?: string;
  golongan_darah?: string;
  email?: string;
  no_hp?: string;
  alamat_ktp?: string;
  ktp_provinsi?: string;
  ktp_kabupaten?: string;
  ktp_kecamatan?: string;
  ktp_desa?: string;
  dom_is_alamat_ktp?: boolean;
  dom_provinsi?: string;
  dom_kabupaten?: string;
  dom_kecamatan?: string;
  dom_desa?: string;
  alamat?: string;
  rt?: string;
  rw?: string;
  kode_pos?: string;
  no_telp?: string;
  dom_status_kepemilikan?: string;
  dom_status_tinggal?: string;
  dom_catatan?: string;
  id_provinsi?: string;
  id_kabupaten?: string;
  id_kecamatan?: string;
  id_desa?: string;
  id_alamat?: string;
  id_rt?: string;
  id_rw?: string;
  id_kode_pos?: string;
  id_status_kepemilikan?: string;
  foto?: string;
  kontak_darurat_nama?: string;
  kontak_darurat_hubungan?: string;
  kontak_darurat_hp?: string;
  kontak_darurat_alamat?: string;
  riwayat_tahun_bergabung?: string;
  riwayat_unit_asal?: string;
  riwayat_jabatan?: string;
  riwayat_keterangan?: string;
  pendidikan_tingkat?: string;
  pendidikan_institusi?: string;
  pendidikan_jurusan?: string;
  pendidikan_tahun_lulus?: string;
  pendidikan_ijazah?: string;
  diklat_nama?: string;
  diklat_penyelenggara?: string;
  diklat_tempat?: string;
  diklat_tahun?: string;
  diklat_sertifikat?: string;
  sertifikasi_nama?: string;
  sertifikasi_penerbit?: string;
  sertifikasi_nomor?: string;
  sertifikasi_tahun?: string;
  sertifikasi_berlaku?: string;
  keahlian?: string;
  keterampilan?: string;
  keahlian_kategori?: string;
  organisasi_nama?: string;
  organisasi_jabatan?: string;
  organisasi_periode?: string;
  organisasi_keterangan?: string;
  penghargaan_nama?: string;
  penghargaan_pemberi?: string;
  penghargaan_tahun?: string;
  penghargaan_keterangan?: string;
}

interface BencanaRow {
  jenis_bencana: string;
  nama_kejadian: string;
  tanggal_kejadian: string;
  id_provinsi?: string;
  level: string;
  status: string;
}

interface UnitRow {
  nama_unit: string;
  tingkat?: string;
  provinsi?: string;
  kabupaten?: string;
  alamat?: string;
  email?: string;
  no_telpon?: string;
  status?: string;
  catatan?: string;
  jenis?: string;
  kategori?: string;
}

function parseMemberRow(row: string[], offset = 0): MemberRow {
  return {
    provinsi: row[offset] || '',
    kabupaten: row[offset + 1] || '',
    angkatan: row[offset + 2] || new Date().getFullYear().toString(),
    kode_anggota: row[offset + 3] || '',
    nama: row[offset + 4] || '',
    kelamin: row[offset + 5] || '',
    status: row[offset + 6] || 'Aktif',
    nama_unit: row[offset + 7] || '',
    jenis: row[offset + 8] || '',
    kategori: row[offset + 9] || 'Anggota',
  };
}

function parseBencanaRow(row: string[]): BencanaRow {
  return {
    jenis_bencana: row[0] || '',
    nama_kejadian: row[1] || '',
    tanggal_kejadian: row[2] || '',
    id_provinsi: row[3] || undefined,
    level: row[4] || '',
    status: row[5] || 'Kejadian',
  };
}

function parseUnitRow(row: string[], type: 'pmr' | 'ksr' | 'tsr'): UnitRow {
  const base: UnitRow = {
    nama_unit: row[0] || '',
    status: row[1] || 'Aktif',
  };

  if (type === 'pmr') {
    return { ...base, tingkat: row[2] || '', provinsi: row[3] || '', kabupaten: row[4] || '', alamat: row[5] || '', email: row[6] || '', no_telpon: row[7] || '' };
  } else if (type === 'ksr') {
    return { ...base, jenis: row[2] || '', kategori: row[3] || '', tingkat: row[4] || '', provinsi: row[5] || '', kabupaten: row[6] || '', alamat: row[7] || '', email: row[8] || '', no_telpon: row[9] || '', catatan: row[10] || '' };
  } else {
    return { ...base, jenis: row[2] || '', kategori: row[3] || '', tingkat: row[4] || '', provinsi: row[5] || '', kabupaten: row[6] || '', alamat: row[7] || '', email: row[8] || '', no_telpon: row[9] || '', catatan: row[10] || '' };
  }
}

async function importPMR() {
  const filePath = path.join(DATA_DIR, 'pmr.json');
  if (!fs.existsSync(filePath)) {
    console.log('pmr.json not found, skipping...');
    return;
  }

  const data: string[][] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`Importing ${data.length} PMR members...`);

  for (const row of data) {
    try {
      const member = parseMemberRow(row);
      await prisma.anggotaPMR.create({
        data: {
          ...member,
          angkatan: parseInt(member.angkatan) || new Date().getFullYear(),
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') continue; // Skip duplicates
      console.error('Error importing PMR:', error.message);
    }
  }

  console.log('PMR import complete.');
}

async function importKSR() {
  const filePath = path.join(DATA_DIR, 'ksr.json');
  if (!fs.existsSync(filePath)) {
    console.log('ksr.json not found, skipping...');
    return;
  }

  const data: string[][] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`Importing ${data.length} KSR members...`);

  for (const row of data) {
    try {
      const member = parseMemberRow(row);
      await prisma.anggotaKSR.create({
        data: {
          ...member,
          angkatan: parseInt(member.angkatan) || new Date().getFullYear(),
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') continue;
      console.error('Error importing KSR:', error.message);
    }
  }

  console.log('KSR import complete.');
}

async function importTSR() {
  const filePath = path.join(DATA_DIR, 'tsr.json');
  if (!fs.existsSync(filePath)) {
    console.log('tsr.json not found, skipping...');
    return;
  }

  const data: string[][] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`Importing ${data.length} TSR members...`);

  for (const row of data) {
    try {
      const member = parseMemberRow(row);
      await prisma.anggotaTSR.create({
        data: {
          ...member,
          angkatan: parseInt(member.angkatan) || new Date().getFullYear(),
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') continue;
      console.error('Error importing TSR:', error.message);
    }
  }

  console.log('TSR import complete.');
}

async function importUnits() {
  console.log('Importing units...');

  // Unit PMR Mula
  const mulaPath = path.join(DATA_DIR, 'unit-pmr-mula.json');
  if (fs.existsSync(mulaPath)) {
    const data: string[][] = JSON.parse(fs.readFileSync(mulaPath, 'utf-8'));
    for (const row of data) {
      try {
        const unit = parseUnitRow(row, 'pmr');
        await prisma.unitPMR.create({ data: { ...unit, tingkat: 'Mula' } });
      } catch (error: any) {
        if (error.code === 'P2002') continue;
      }
    }
  }

  // Unit PMR Madya
  const madyaPath = path.join(DATA_DIR, 'unit-pmr-madya.json');
  if (fs.existsSync(madyaPath)) {
    const data: string[][] = JSON.parse(fs.readFileSync(madyaPath, 'utf-8'));
    for (const row of data) {
      try {
        const unit = parseUnitRow(row, 'pmr');
        await prisma.unitPMR.create({ data: { ...unit, tingkat: 'Madya' } });
      } catch (error: any) {
        if (error.code === 'P2002') continue;
      }
    }
  }

  // Unit PMR Wira
  const wiraPath = path.join(DATA_DIR, 'unit-pmr-wira.json');
  if (fs.existsSync(wiraPath)) {
    const data: string[][] = JSON.parse(fs.readFileSync(wiraPath, 'utf-8'));
    for (const row of data) {
      try {
        const unit = parseUnitRow(row, 'pmr');
        await prisma.unitPMR.create({ data: { ...unit, tingkat: 'Wira' } });
      } catch (error: any) {
        if (error.code === 'P2002') continue;
      }
    }
  }

  // Unit KSR
  const ksrPath = path.join(DATA_DIR, 'unit-ksr.json');
  if (fs.existsSync(ksrPath)) {
    const data: string[][] = JSON.parse(fs.readFileSync(ksrPath, 'utf-8'));
    for (const row of data) {
      try {
        const unit = parseUnitRow(row, 'ksr');
        await prisma.unitKSR.create({ data: unit });
      } catch (error: any) {
        if (error.code === 'P2002') continue;
      }
    }
  }

  // Unit TSR
  const tsrPath = path.join(DATA_DIR, 'unit-tsr.json');
  if (fs.existsSync(tsrPath)) {
    const data: string[][] = JSON.parse(fs.readFileSync(tsrPath, 'utf-8'));
    for (const row of data) {
      try {
        const unit = parseUnitRow(row, 'tsr');
        await prisma.unitTSR.create({ data: unit });
      } catch (error: any) {
        if (error.code === 'P2002') continue;
      }
    }
  }

  console.log('Units import complete.');
}

async function importBencana() {
  const filePath = path.join(DATA_DIR, 'bencana.json');
  if (!fs.existsSync(filePath)) {
    console.log('bencana.json not found, skipping...');
    return;
  }

  const data: string[][] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`Importing ${data.length} bencana records...`);

  for (const row of data) {
    try {
      const bencana = parseBencanaRow(row);
      await prisma.bencana.create({ data: bencana });
    } catch (error: any) {
      if (error.code === 'P2002') continue;
      console.error('Error importing bencana:', error.message);
    }
  }

  console.log('Bencana import complete.');
}

async function main() {
  console.log('=== Starting Data Import ===\n');

  try {
    await importPMR();
    await importKSR();
    await importTSR();
    await importUnits();
    await importBencana();

    // Print summary
    const counts = await Promise.all([
      prisma.anggotaPMR.count(),
      prisma.anggotaKSR.count(),
      prisma.anggotaTSR.count(),
      prisma.unitPMR.count(),
      prisma.unitKSR.count(),
      prisma.unitTSR.count(),
      prisma.bencana.count(),
    ]);

    console.log('\n=== Import Summary ===');
    console.log(`Anggota PMR: ${counts[0]}`);
    console.log(`Anggota KSR: ${counts[1]}`);
    console.log(`Anggota TSR: ${counts[2]}`);
    console.log(`Unit PMR: ${counts[3]}`);
    console.log(`Unit KSR: ${counts[4]}`);
    console.log(`Unit TSR: ${counts[5]}`);
    console.log(`Bencana: ${counts[6]}`);
    console.log('\n=== Import Complete ===');
  } catch (error) {
    console.error('Import error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
