import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMarkas = async (req: Request, res: Response) => {
  try {
    const markas = await prisma.markasPMI.findFirst();
    res.json(markas);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat data' });
  }
};

export const createMarkas = async (req: Request, res: Response) => {
  try {
    const markas = await prisma.markasPMI.create({
      data: req.body,
    });
    res.json(markas);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat data' });
  }
};

export const updateMarkas = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const markas = await prisma.markasPMI.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json(markas);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui data' });
  }
};

export const deleteMarkas = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.markasPMI.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Data berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus data' });
  }
};
