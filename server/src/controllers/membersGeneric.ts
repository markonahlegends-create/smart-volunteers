import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { triggerMemberSync } from '../services/syncTriggers';

const prisma = new PrismaClient();

type MemberModel = 'anggotaPMR' | 'anggotaKSR' | 'anggotaTSR' | 'anggotaDDS';
type MemberType = 'pmr' | 'ksr' | 'tsr' | 'dds';

const MODEL_MAP: Record<MemberType, MemberModel> = {
  pmr: 'anggotaPMR',
  ksr: 'anggotaKSR',
  tsr: 'anggotaTSR',
  dds: 'anggotaDDS',
};

const REQUIRED_FIELDS = [
  'provinsi', 'kabupaten', 'kode_anggota', 'nama', 'kelamin', 'nama_unit', 'jenis'
];

const MEMBER_FIELDS = [
  'provinsi', 'kabupaten', 'angkatan', 'kode_anggota', 'nama', 'kelamin', 'status', 'nama_unit', 'jenis', 'kategori',
  'jenis_identitas', 'no_nik', 'tempat_lahir', 'tanggal_lahir', 'agama', 'golongan_darah', 'email', 'no_hp',
  'alamat_ktp', 'ktp_provinsi', 'ktp_kabupaten', 'ktp_kecamatan', 'ktp_desa', 'dom_is_alamat_ktp',
  'dom_provinsi', 'dom_kabupaten', 'dom_kecamatan', 'dom_desa', 'alamat', 'rt', 'rw', 'kode_pos', 'no_telp',
  'dom_status_kepemilikan', 'dom_status_tinggal', 'dom_catatan',
  'id_provinsi', 'id_kabupaten', 'id_kecamatan', 'id_desa', 'id_alamat', 'id_rt', 'id_rw', 'id_kode_pos', 'id_status_kepemilikan',
  'foto',
  'kontak_darurat_nama', 'kontak_darurat_hubungan', 'kontak_darurat_hp', 'kontak_darurat_alamat',
  'riwayat_tahun_bergabung', 'riwayat_unit_asal', 'riwayat_jabatan', 'riwayat_keterangan',
  'pendidikan_tingkat', 'pendidikan_institusi', 'pendidikan_jurusan', 'pendidikan_tahun_lulus', 'pendidikan_ijazah',
  'diklat_nama', 'diklat_penyelenggara', 'diklat_tempat', 'diklat_tahun', 'diklat_sertifikat',
  'sertifikasi_nama', 'sertifikasi_penerbit', 'sertifikasi_nomor', 'sertifikasi_tahun', 'sertifikasi_berlaku',
  'keahlian', 'keterampilan', 'keahlian_kategori',
  'organisasi_nama', 'organisasi_jabatan', 'organisasi_periode', 'organisasi_keterangan',
  'penghargaan_nama', 'penghargaan_pemberi', 'penghargaan_tahun', 'penghargaan_keterangan'
];

function getModel(type: MemberType) {
  return MODEL_MAP[type];
}

function buildMemberData(body: any) {
  const data: any = {};
  MEMBER_FIELDS.forEach(field => {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  });
  data.status = body.status || 'Aktif';
  data.kategori = body.kategori || 'Anggota';
  if (body.angkatan) data.angkatan = parseInt(body.angkatan) || new Date().getFullYear();
  return data;
}

function validateRequired(body: any): string | null {
  for (const field of REQUIRED_FIELDS) {
    if (!body[field]) return `Field ${field} harus diisi`;
  }
  return null;
}

export const getMembers = async (req: Request, res: Response, type: MemberType) => {
  try {
    const { page, limit } = req.query;
    const model = getModel(type);
    const hasPagination = page !== undefined || limit !== undefined;
    const limitNum = hasPagination ? (Number(limit) || 10) : undefined;
    const skip = hasPagination && page ? (Number(page) - 1) * (limitNum as number) : undefined;
    const [data, total] = await Promise.all([
      (prisma as any)[model].findMany({
        skip,
        take: limitNum as any,
        orderBy: { id: 'desc' },
      }),
      (prisma as any)[model].count(),
    ]);
    res.json({
      data,
      total,
      page: hasPagination ? Number(page) : 1,
      limit: limitNum,
      totalPages: hasPagination ? Math.ceil(total / (limitNum as number)) : 1,
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat data' });
  }
};

export const getMemberById = async (req: Request, res: Response, type: MemberType) => {
  try {
    const { id } = req.params;
    const model = getModel(type);
    const anggota = await prisma[model].findUnique({
      where: { id: parseInt(id) },
    });
    if (!anggota) return res.status(404).json({ message: `Anggota ${type.toUpperCase()} tidak ditemukan` });
    res.json(anggota);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat data anggota' });
  }
};

export const createMember = async (req: Request, res: Response, type: MemberType) => {
  try {
    const validationError = validateRequired(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    const model = getModel(type);
    const data = buildMemberData(req.body);
    const anggota = await prisma[model].create({ data });
    res.json(anggota);
    triggerMemberSync().catch(console.error);
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'Kode anggota sudah terdaftar. Gunakan kode lain.' });
    }
    res.status(500).json({ message: `Gagal menambah anggota ${type.toUpperCase()}`, error: error.message });
  }
};

export const updateMember = async (req: Request, res: Response, type: MemberType) => {
  try {
    const { id } = req.params;
    const validationError = validateRequired(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    const model = getModel(type);
    const data = buildMemberData(req.body);
    const anggota = await prisma[model].update({
      where: { id: parseInt(id) },
      data,
    });
    res.json(anggota);
    triggerMemberSync().catch(console.error);
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'Kode anggota sudah terdaftar. Gunakan kode lain.' });
    }
    res.status(500).json({ message: `Gagal memperbarui anggota ${type.toUpperCase()}`, error: error.message });
  }
};

export const deleteMember = async (req: Request, res: Response, type: MemberType) => {
  try {
    const { id } = req.params;
    const model = getModel(type);
    await prisma[model].delete({ where: { id: parseInt(id) } });
    res.json({ message: `Anggota ${type.toUpperCase()} berhasil dihapus` });
    triggerMemberSync().catch(console.error);
  } catch (error) {
    res.status(500).json({ message: `Gagal menghapus anggota ${type.toUpperCase()}` });
  }
};
