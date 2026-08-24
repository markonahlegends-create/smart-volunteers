import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { triggerBencanaSync } from '../services/syncTriggers';

const prisma = new PrismaClient();

export const getBencana = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const hasPagination = page !== undefined || limit !== undefined;
    const limitNum = hasPagination ? (Number(limit) || 10) : undefined;
    const skip = hasPagination && page ? (Number(page) - 1) * (limitNum as number) : undefined;
    const [bencanas, total] = await Promise.all([
      prisma.bencana.findMany({
        skip,
        take: limitNum as any,
        orderBy: { id: 'desc' },
      }),
      prisma.bencana.count(),
    ]);

    res.json({
      data: bencanas,
      total,
      page: hasPagination ? Number(page) : 1,
      limit: limitNum,
      totalPages: hasPagination ? Math.ceil(total / (limitNum as number)) : 1,
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
