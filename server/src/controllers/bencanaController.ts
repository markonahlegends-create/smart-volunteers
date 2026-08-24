import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { triggerBencanaSync } from '../services/syncTriggers';

const prisma = new PrismaClient();

export const getBencana = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [bencanas, total] = await Promise.all([
      prisma.bencana.findMany({
        skip,
        take: Number(limit),
        orderBy: { id: 'desc' },
      }),
      prisma.bencana.count(),
    ]);

    res.json({
      data: bencanas,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat data' });
  }
};

export const createBencana = async (req: Request, res: Response) => {
  try {
    const bencana = await prisma.bencana.create({
      data: req.body,
    });
    res.json(bencana);
    triggerBencanaSync().catch(console.error);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat data' });
  }
};

export const updateBencana = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bencana = await prisma.bencana.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json(bencana);
    triggerBencanaSync().catch(console.error);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui data' });
  }
};

export const deleteBencana = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.bencana.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Data berhasil dihapus' });
    triggerBencanaSync().catch(console.error);
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus data' });
  }
};
