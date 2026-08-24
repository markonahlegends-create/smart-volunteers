import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
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
  };
  return map[upper] || value;
}

function cleanValue(value: any): any {
  if (value === '' || value === undefined) return null;
  return value;
}

function normalizeMember(raw: RawAnggota): any {
  const jenisUpper = (raw.jenis || '').toUpperCase();
  const type = MODEL_MAP[jenisUpper];
  if (!type) return null;

  const kode = String(raw.kode_anggota || '').trim();
  if (!kode) return null;

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
    no_nik: cleanValue(raw.no_nik),
    tempat_lahir: cleanValue(raw.tempat_lahir),
    tanggal_lahir: cleanValue(raw.tanggal_lahir),
    agama: cleanValue(raw.agama),
    golongan_darah: cleanValue(raw.golongan_darah),
    email: cleanValue(raw.email),
    no_hp: raw.no_hp != null ? String(raw.no_hp) : null,
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
    rt: cleanValue(raw.rt),
    rw: cleanValue(raw.rw),
    kode_pos: cleanValue(raw.kode_pos),
    no_telp: raw.no_telp != null ? String(raw.no_telp) : null,
    dom_status_kepemilikan: cleanValue(raw.dom_status_kepemilikan),
    dom_status_tinggal: cleanValue(raw.dom_status_tinggal),
    dom_catatan: cleanValue(raw.dom_catatan),
    foto: cleanValue(raw.foto),
    kontak_darurat_nama: cleanValue(raw.kontak_darurat_nama),
    kontak_darurat_hubungan: cleanValue(raw.kontak_darurat_hubungan),
    kontak_darurat_hp: raw.kontak_darurat_hp != null ? String(raw.kontak_darurat_hp) : null,
    kontak_darurat_alamat: cleanValue(raw.kontak_darurat_alamat),
    riwayat_tahun_bergabung: cleanValue(raw.riwayat_tahun_bergabung),
    riwayat_unit_asal: cleanValue(raw.riwayat_unit_asal),
    riwayat_jabatan: cleanValue(raw.riwayat_jabatan),
    riwayat_keterangan: cleanValue(raw.riwayat_keterangan),
    pendidikan_tingkat: cleanValue(raw.pendidikan_tingkat),
    pendidikan_institusi: cleanValue(raw.pendidikan_institusi),
    pendidikan_jurusan: cleanValue(raw.pendidikan_jurusan),
    pendidikan_tahun_lulus: cleanValue(raw.pendidikan_tahun_lulus),
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

  return { type, data };
}

async function importTest() {
  try {
    const dataPath = join(__dirname, '..', '..', '..', 'data', 'test_import.json');
    console.log('Loading test data from:', dataPath);
    
    const raw = readFileSync(dataPath, 'utf-8');
    const members: RawAnggota[] = JSON.parse(raw);

    console.log(`Total test members: ${members.length}`);

    for (const raw of members) {
      const normalized = normalizeMember(raw);
      if (!normalized) continue;

      const { type, data } = normalized;
      const modelMap: Record<string, string> = {
        pmr: 'anggotaPMR',
        ksr: 'anggotaKSR',
        tsr: 'anggotaTSR',
        dds: 'anggotaDDS',
      };

      const model = modelMap[type];
      try {
        const existing = await prisma[model].findFirst({
          where: { kode_anggota: data.kode_anggota },
        });

        if (existing) {
          await prisma[model].update({
            where: { id: existing.id },
            data,
          });
          console.log(`Updated ${data.kode_anggota} (${type})`);
        } else {
          await prisma[model].create({ data });
          console.log(`Created ${data.kode_anggota} (${type})`);
        }
      } catch (error: any) {
        console.error(`Error importing ${data.kode_anggota}: ${error.message}`);
      }
    }

    console.log('\nTest import completed!');
  } catch (error: any) {
    console.error('Failed to import:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

importTest();
