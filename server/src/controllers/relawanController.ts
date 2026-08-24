import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { triggerMemberSync } from '../services/syncTriggers';

const prisma = new PrismaClient();

export const getRelawan = async (req: Request, res: Response) => {
  try {
    const { page, limit, jenis, nama_unit, search } = req.query;
    const hasPagination = page !== undefined || limit !== undefined;
    const limitNum = hasPagination ? (Number(limit) || 10) : undefined;
    const skip = hasPagination && page ? (Number(page) - 1) * (limitNum as number) : undefined;
    const where: any = {};
    if (jenis) where.jenis = jenis;
    if (nama_unit) where.nama_unit = nama_unit;
    if (search) {
      where.OR = [
        { nama: { contains: search as string } },
        { kode_anggota: { contains: search as string } },
        { nama_unit: { contains: search as string } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.relawan.findMany({ skip, take: limitNum as any, orderBy: { id: 'desc' }, where }),
      prisma.relawan.count({ where }),
    ]);
    res.json({
      data,
      total,
      page: hasPagination ? Number(page) : 1,
      limit: limitNum,
      totalPages: hasPagination ? Math.ceil(total / (limitNum as number)) : 1,
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat data relawan' });
  }
};

export const getRelawanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const relawan = await prisma.relawan.findUnique({
      where: { id: parseInt(id) },
    });
    if (!relawan) return res.status(404).json({ message: 'Relawan tidak ditemukan' });
    res.json(relawan);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat data relawan' });
  }
};

export const createRelawan = async (req: Request, res: Response) => {
  try {
    const {
      provinsi, kabupaten, angkatan, kode_anggota, nama, kelamin, status, nama_unit, jenis, kategori,
      jenis_identitas, no_nik, tempat_lahir, tanggal_lahir, agama, golongan_darah, email, no_hp,
      alamat_ktp, ktp_provinsi, ktp_kabupaten, ktp_kecamatan, ktp_desa, dom_is_alamat_ktp,
      dom_provinsi, dom_kabupaten, dom_kecamatan, dom_desa, alamat, rt, rw, kode_pos, no_telp,
      dom_status_kepemilikan, dom_status_tinggal, dom_catatan,
      id_provinsi, id_kabupaten, id_kecamatan, id_desa, id_alamat, id_rt, id_rw, id_kode_pos, id_status_kepemilikan,
      foto,
      kontak_darurat_nama, kontak_darurat_hubungan, kontak_darurat_hp, kontak_darurat_alamat,
      riwayat_tahun_bergabung, riwayat_unit_asal, riwayat_jabatan, riwayat_keterangan,
      pendidikan_tingkat, pendidikan_institusi, pendidikan_jurusan, pendidikan_tahun_lulus, pendidikan_ijazah,
      diklat_nama, diklat_penyelenggara, diklat_tempat, diklat_tahun, diklat_sertifikat,
      sertifikasi_nama, sertifikasi_penerbit, sertifikasi_nomor, sertifikasi_tahun, sertifikasi_berlaku,
      keahlian, keterampilan, keahlian_kategori,
      organisasi_nama, organisasi_jabatan, organisasi_periode, organisasi_keterangan,
      penghargaan_nama, penghargaan_pemberi, penghargaan_tahun, penghargaan_keterangan
    } = req.body;

    if (!provinsi || !kabupaten || !kode_anggota || !nama || !kelamin || !nama_unit || !jenis) {
      return res.status(400).json({ message: 'Data tidak lengkap. Pastikan semua field required terisi.' });
    }

    const relawan = await prisma.relawan.create({
      data: {
        provinsi, kabupaten, angkatan: angkatan || new Date().getFullYear(), kode_anggota, nama, kelamin, status: status || 'Aktif', nama_unit, jenis, kategori: kategori || 'Anggota',
        jenis_identitas, no_nik, tempat_lahir, tanggal_lahir, agama, golongan_darah, email, no_hp,
        alamat_ktp, ktp_provinsi, ktp_kabupaten, ktp_kecamatan, ktp_desa, dom_is_alamat_ktp,
        dom_provinsi, dom_kabupaten, dom_kecamatan, dom_desa, alamat, rt, rw, kode_pos, no_telp,
        dom_status_kepemilikan, dom_status_tinggal, dom_catatan,
        id_provinsi, id_kabupaten, id_kecamatan, id_desa, id_alamat, id_rt, id_rw, id_kode_pos, id_status_kepemilikan,
        foto,
        kontak_darurat_nama, kontak_darurat_hubungan, kontak_darurat_hp, kontak_darurat_alamat,
        riwayat_tahun_bergabung, riwayat_unit_asal, riwayat_jabatan, riwayat_keterangan,
        pendidikan_tingkat, pendidikan_institusi, pendidikan_jurusan, pendidikan_tahun_lulus, pendidikan_ijazah,
        diklat_nama, diklat_penyelenggara, diklat_tempat, diklat_tahun, diklat_sertifikat,
        sertifikasi_nama, sertifikasi_penerbit, sertifikasi_nomor, sertifikasi_tahun, sertifikasi_berlaku,
        keahlian, keterampilan, keahlian_kategori,
        organisasi_nama, organisasi_jabatan, organisasi_periode, organisasi_keterangan,
        penghargaan_nama, penghargaan_pemberi, penghargaan_tahun, penghargaan_keterangan
      },
    });
    res.json(relawan);
    triggerMemberSync().catch(console.error);
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'Kode relawan sudah terdaftar. Gunakan kode lain.' });
    }
    res.status(500).json({ message: 'Gagal menambah relawan', error: error.message });
  }
};

export const updateRelawan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      provinsi, kabupaten, angkatan, kode_anggota, nama, kelamin, status, nama_unit, jenis, kategori,
      jenis_identitas, no_nik, tempat_lahir, tanggal_lahir, agama, golongan_darah, email, no_hp,
      alamat_ktp, ktp_provinsi, ktp_kabupaten, ktp_kecamatan, ktp_desa, dom_is_alamat_ktp,
      dom_provinsi, dom_kabupaten, dom_kecamatan, dom_desa, alamat, rt, rw, kode_pos, no_telp,
      dom_status_kepemilikan, dom_status_tinggal, dom_catatan,
      id_provinsi, id_kabupaten, id_kecamatan, id_desa, id_alamat, id_rt, id_rw, id_kode_pos, id_status_kepemilikan,
      foto,
      kontak_darurat_nama, kontak_darurat_hubungan, kontak_darurat_hp, kontak_darurat_alamat,
      riwayat_tahun_bergabung, riwayat_unit_asal, riwayat_jabatan, riwayat_keterangan,
      pendidikan_tingkat, pendidikan_institusi, pendidikan_jurusan, pendidikan_tahun_lulus, pendidikan_ijazah,
      diklat_nama, diklat_penyelenggara, diklat_tempat, diklat_tahun, diklat_sertifikat,
      sertifikasi_nama, sertifikasi_penerbit, sertifikasi_nomor, sertifikasi_tahun, sertifikasi_berlaku,
      keahlian, keterampilan, keahlian_kategori,
      organisasi_nama, organisasi_jabatan, organisasi_periode, organisasi_keterangan,
      penghargaan_nama, penghargaan_pemberi, penghargaan_tahun, penghargaan_keterangan
    } = req.body;

    if (!provinsi || !kabupaten || !kode_anggota || !nama || !kelamin || !nama_unit || !jenis) {
      return res.status(400).json({ message: 'Data tidak lengkap. Pastikan semua field required terisi.' });
    }

    const relawan = await prisma.relawan.update({
      where: { id: parseInt(id) },
      data: {
        provinsi, kabupaten, angkatan: angkatan || new Date().getFullYear(), kode_anggota, nama, kelamin, status: status || 'Aktif', nama_unit, jenis, kategori: kategori || 'Anggota',
        jenis_identitas, no_nik, tempat_lahir, tanggal_lahir, agama, golongan_darah, email, no_hp,
        alamat_ktp, ktp_provinsi, ktp_kabupaten, ktp_kecamatan, ktp_desa, dom_is_alamat_ktp,
        dom_provinsi, dom_kabupaten, dom_kecamatan, dom_desa, alamat, rt, rw, kode_pos, no_telp,
        dom_status_kepemilikan, dom_status_tinggal, dom_catatan,
        id_provinsi, id_kabupaten, id_kecamatan, id_desa, id_alamat, id_rt, id_rw, id_kode_pos, id_status_kepemilikan,
        foto,
        kontak_darurat_nama, kontak_darurat_hubungan, kontak_darurat_hp, kontak_darurat_alamat,
        riwayat_tahun_bergabung, riwayat_unit_asal, riwayat_jabatan, riwayat_keterangan,
        pendidikan_tingkat, pendidikan_institusi, pendidikan_jurusan, pendidikan_tahun_lulus, pendidikan_ijazah,
        diklat_nama, diklat_penyelenggara, diklat_tempat, diklat_tahun, diklat_sertifikat,
        sertifikasi_nama, sertifikasi_penerbit, sertifikasi_nomor, sertifikasi_tahun, sertifikasi_berlaku,
        keahlian, keterampilan, keahlian_kategori,
        organisasi_nama, organisasi_jabatan, organisasi_periode, organisasi_keterangan,
        penghargaan_nama, penghargaan_pemberi, penghargaan_tahun, penghargaan_keterangan
      },
    });
    res.json(relawan);
    triggerMemberSync().catch(console.error);
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'Kode relawan sudah terdaftar. Gunakan kode lain.' });
    }
    res.status(500).json({ message: 'Gagal memperbarui relawan', error: error.message });
  }
};

export const deleteRelawan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.relawan.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Relawan berhasil dihapus' });
    triggerMemberSync().catch(console.error);
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus relawan' });
  }
};
