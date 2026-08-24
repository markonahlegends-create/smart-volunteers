import { PrismaClient } from '@prisma/client';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

type MemberType = 'pmr' | 'ksr' | 'tsr' | 'dds';

interface RawAnggota {
  id: number;
  provinsi: string;
  kabupaten: string;
  angkatan: number | string;
  kode_anggota: string | number;
  nama: string;
  kelamin: string;
  status: string;
  kategori: string;
  nama_unit: string;
  jenis: string;
  foto?: string;
  [key: string]: any;
}

const MODEL_MAP: Record<string, MemberType> = {
  'PMR': 'pmr',
  'MADYA': 'pmr',
  'WIRA': 'pmr',
  'KSR': 'ksr',
  'TSR': 'tsr',
  'DDS': 'dds',
};

function normalizeCase(value: string): string {
  if (!value || typeof value !== 'string') return value;
  const upper = value.toUpperCase();
  const map: Record<string, string> = {
    'BANTEN': 'Banten',
    'KOTA CILEGON': 'Kota Cilegon',
    'KAB. CILEGON': 'Kab. Cilegon',
    'KABUPATEN CILEGON': 'Kab. Cilegon',
    'PROVINSI BANTEN': 'Banten',
  };
  return map[upper] || value;
}

function cleanValue(value: any): any {
  if (value === '' || value === undefined) return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}

const PHONE_FIELDS = [
  'no_hp', 'no_telp', 'kontak_darurat_hp',
];

const ID_FIELDS = [
  'id_provinsi', 'id_kabupaten', 'id_kecamatan', 'id_desa', 'id_alamat',
  'id_rt', 'id_rw', 'id_kode_pos', 'id_status_kepemilikan',
];

const STRING_FIELDS_WITH_NUMERIC_DATA = [
  'no_nik', 'rt', 'rw', 'kode_pos', ...ID_FIELDS
];

function normalizeMember(raw: RawAnggota): any {
  const jenisUpper = (raw.jenis || '').toUpperCase();
  const type = MODEL_MAP[jenisUpper];
  
  if (!type) {
    console.warn(`Skip unknown jenis: ${raw.jenis} (kode: ${raw.kode_anggota})`);
    return null;
  }

  const kode = String(raw.kode_anggota || '').trim();
  if (!kode) {
    console.warn(`Skip empty kode_anggota for id: ${raw.id}`);
    return null;
  }

  const data: any = {
    provinsi: normalizeCase(String(raw.provinsi || '')),
    kabupaten: normalizeCase(String(raw.kabupaten || '')),
    angkatan: parseInt(String(raw.angkatan || '')) || new Date().getFullYear(),
    kode_anggota: kode,
    nama: String(raw.nama || ''),
    kelamin: String(raw.kelamin || ''),
    status: String(raw.status || 'Aktif'),
    kategori: String(raw.kategori || 'Anggota'),
    nama_unit: String(raw.nama_unit || ''),
    jenis: jenisUpper,
    jenis_identitas: cleanValue(raw.jenis_identitas),
    no_nik: raw.no_nik !== null && raw.no_nik !== undefined ? String(raw.no_nik) : null,
    tempat_lahir: cleanValue(raw.tempat_lahir),
    tanggal_lahir: cleanValue(raw.tanggal_lahir),
    agama: cleanValue(raw.agama),
    golongan_darah: cleanValue(raw.golongan_darah),
    email: cleanValue(raw.email),
    no_hp: raw.no_hp !== null && raw.no_hp !== undefined ? String(raw.no_hp) : null,
    alamat_ktp: cleanValue(raw.alamat_ktp),
    ktp_provinsi: cleanValue(raw.ktp_provinsi),
    ktp_kabupaten: cleanValue(raw.ktp_kabupaten),
    ktp_kecamatan: cleanValue(raw.ktp_kecamatan),
    ktp_desa: cleanValue(raw.ktp_desa),
    dom_is_alamat_ktp: Boolean(raw.dom_is_alamat_ktp),
    dom_provinsi: cleanValue(raw.dom_provinsi),
    dom_kabupaten: cleanValue(raw.dom_kabupaten),
    dom_kecamatan: cleanValue(raw.dom_kecamatan),
    dom_desa: cleanValue(raw.dom_desa),
    alamat: cleanValue(raw.alamat),
    rt: raw.rt !== null && raw.rt !== undefined ? String(raw.rt) : null,
    rw: raw.rw !== null && raw.rw !== undefined ? String(raw.rw) : null,
    kode_pos: raw.kode_pos !== null && raw.kode_pos !== undefined ? String(raw.kode_pos) : null,
    no_telp: raw.no_telp !== null && raw.no_telp !== undefined ? String(raw.no_telp) : null,
    dom_status_kepemilikan: cleanValue(raw.dom_status_kepemilikan),
    dom_status_tinggal: cleanValue(raw.dom_status_tinggal),
    dom_catatan: cleanValue(raw.dom_catatan),
    foto: cleanValue(raw.foto),
    kontak_darurat_nama: cleanValue(raw.kontak_darurat_nama),
    kontak_darurat_hubungan: cleanValue(raw.kontak_darurat_hubungan),
    kontak_darurat_hp: raw.kontak_darurat_hp !== null && raw.kontak_darurat_hp !== undefined ? String(raw.kontak_darurat_hp) : null,
    kontak_darurat_alamat: cleanValue(raw.kontak_darurat_alamat),
    riwayat_tahun_bergabung: raw.riwayat_tahun_bergabung !== null && raw.riwayat_tahun_bergabung !== undefined ? String(raw.riwayat_tahun_bergabung) : null,
    riwayat_unit_asal: cleanValue(raw.riwayat_unit_asal),
    riwayat_jabatan: cleanValue(raw.riwayat_jabatan),
    riwayat_keterangan: cleanValue(raw.riwayat_keterangan),
    pendidikan_tingkat: cleanValue(raw.pendidikan_tingkat),
    pendidikan_institusi: cleanValue(raw.pendidikan_institusi),
    pendidikan_jurusan: cleanValue(raw.pendidikan_jurusan),
    pendidikan_tahun_lulus: raw.pendidikan_tahun_lulus !== null && raw.pendidikan_tahun_lulus !== undefined ? String(raw.pendidikan_tahun_lulus) : null,
    pendidikan_ijazah: cleanValue(raw.pendidikan_ijazah),
    diklat_nama: cleanValue(raw.diklat_nama),
    diklat_penyelenggara: cleanValue(raw.diklat_penyelenggara),
    diklat_tempat: cleanValue(raw.diklat_tempat),
    diklat_tahun: cleanValue(raw.diklat_tahun),
    diklat_sertifikat: cleanValue(raw.diklat_sertifikat),
    sertifikasi_nama: cleanValue(raw.sertifikasi_nama),
    sertifikasi_penerbit: cleanValue(raw.sertifikasi_penerbit),
    sertifikasi_nomor: cleanValue(raw.sertifikasi_nomor),
    sertifikasi_tahun: cleanValue(raw.sertifikasi_tahun),
    sertifikasi_berlaku: cleanValue(raw.sertifikasi_berlaku),
    keahlian: cleanValue(raw.keahlian),
    keterampilan: cleanValue(raw.keterampilan),
    keahlian_kategori: cleanValue(raw.keahlian_kategori),
    organisasi_nama: cleanValue(raw.organisasi_nama),
    organisasi_jabatan: cleanValue(raw.organisasi_jabatan),
    organisasi_periode: cleanValue(raw.organisasi_periode),
    organisasi_keterangan: cleanValue(raw.organisasi_keterangan),
    penghargaan_nama: cleanValue(raw.penghargaan_nama),
    penghargaan_pemberi: cleanValue(raw.penghargaan_pemberi),
    penghargaan_tahun: cleanValue(raw.penghargaan_tahun),
    penghargaan_keterangan: cleanValue(raw.penghargaan_keterangan),
  };

  for (const field of ID_FIELDS) {
    if (data[field] !== null && data[field] !== undefined) {
      data[field] = String(data[field]);
    }
  }

  return { type, data };
}

async function importMembers() {
  try {
    const dataFiles = [
      { path: join(__dirname, '..', '..', '..', 'data', 'anggota_from_sheets.json'), label: 'PMR' },
      { path: join(__dirname, '..', '..', '..', 'data', 'ksr_from_sheets.json'), label: 'KSR' },
      { path: join(__dirname, '..', '..', '..', 'data', 'tsr_from_sheets.json'), label: 'TSR' },
    ];

    const seen = new Set<string>();
    const skipped = new Set<string>();
    const byType: Record<string, any[]> = { pmr: [], ksr: [], tsr: [], dds: [] };

    for (const file of dataFiles) {
      console.log(`Loading ${file.label} data from: ${file.path}`);
      
      try {
        const raw = readFileSync(file.path, 'utf-8');
        const members: RawAnggota[] = JSON.parse(raw);
        console.log(`  Total ${file.label} members: ${members.length}`);

        for (const raw of members) {
          const normalized = normalizeMember(raw);
          if (!normalized) continue;

          const { type, data } = normalized;
          const kode = data.kode_anggota;

          if (seen.has(kode)) {
            console.warn(`  Duplicate kode_anggota: ${kode} (id: ${raw.id})`);
            skipped.add(kode);
            continue;
          }
          seen.add(kode);

          if (skipped.has(kode)) {
            console.warn(`  Skipping duplicate: ${kode} (id: ${raw.id})`);
            continue;
          }

          byType[type].push(data);
        }
      } catch (error: any) {
        console.error(`  Error loading ${file.label} data: ${error.message}`);
      }
    }

    console.log('\nSummary:');
    for (const [type, items] of Object.entries(byType)) {
      console.log(`  ${type.toUpperCase()}: ${items.length} members`);
    }
    console.log(`  Skipped duplicates: ${skipped.size}`);

    for (const [type, items] of Object.entries(byType)) {
      if (items.length === 0) continue;

      const modelMap: Record<string, string> = {
        pmr: 'anggotaPMR',
        ksr: 'anggotaKSR',
        tsr: 'anggotaTSR',
        dds: 'anggotaDDS',
      };

      const model = modelMap[type];
      console.log(`\nImporting ${items.length} ${type.toUpperCase()}...`);

      let imported = 0;
      let errors = 0;

      for (const data of items) {
        try {
          const existing = await prisma[model].findFirst({
            where: { kode_anggota: data.kode_anggota },
          });

          if (existing) {
            await prisma[model].update({
              where: { id: existing.id },
              data,
            });
          } else {
            await prisma[model].create({ data });
          }
          imported++;
        } catch (error: any) {
          errors++;
          if (errors <= 5) {
            console.error(`  Error importing ${data.kode_anggota}: ${error.message}`);
          }
        }
      }

      console.log(`  Imported: ${imported}, Errors: ${errors}`);
    }

    console.log('\nImport completed!');
  } catch (error: any) {
    console.error('Failed to import:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

importMembers();
