import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const registerRoster = async (req: Request, res: Response) => {
  try {
    const { kode_anggota } = req.body;

    const anggota = await prisma.anggotaPMR.findFirst({
      where: { kode_anggota },
    });

    if (!anggota) {
      return res.status(404).json({ message: 'Kode anggota tidak ditemukan' });
    }

    const existing = await prisma.roster.findFirst({
      where: { kode_anggota: anggota.kode_anggota },
    });

    if (existing) {
      return res.status(400).json({ message: 'Anggota sudah terdaftar di roster' });
    }

    const roster = await prisma.roster.create({
      data: {
        kode_anggota: anggota.kode_anggota,
        nama: anggota.nama,
        unit: anggota.nama_unit,
        jenis: anggota.jenis,
      },
    });

    res.json(roster);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mendaftar roster' });
  }
};

export const getRoster = async (req: Request, res: Response) => {
  try {
    const rosters = await prisma.roster.findMany({
      orderBy: { id: 'desc' },
    });
    res.json(rosters);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat data' });
  }
};

export const deleteRoster = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.roster.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Berhasil dihapus dari roster' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus roster' });
  }
};
