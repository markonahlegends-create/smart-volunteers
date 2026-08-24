import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const normalizeUnitName = (name: string) => {
  if (!name) return ''
  return name
    .toLowerCase()
    .replace(/[\.\,\/\\]/g, ' ')
    .replace(/\b(smkn|smk negeri|smk n|sman|sma n|smps?|smp n|sdn|sd n)\b/gi, (match) => {
      const map: Record<string, string> = {
        smkn: 'smk negeri',
        'smk negeri': 'smk negeri',
        'smk n': 'smk negeri',
        sman: 'sma negeri',
        'sma n': 'sma negeri',
        smp: 'smp',
        'smp n': 'smp negeri',
        smps: 'smp',
        sdn: 'sd negeri',
        'sd n': 'sd negeri',
      }
      return map[match.toLowerCase()] || match
    })
    .replace(/\s+/g, ' ')
    .trim()
}

const countUniqueUnits = async () => {
  const [pmr, ksr, tsr] = await Promise.all([
    prisma.unitPMR.findMany({ select: { nama_unit: true } }),
    prisma.unitKSR.findMany({ select: { nama_unit: true } }),
    prisma.unitTSR.findMany({ select: { nama_unit: true } }),
  ]);
  const allUnits = [...pmr, ...ksr, ...tsr];
  const uniqueNames = new Set(allUnits.map(u => normalizeUnitName(u.nama_unit)).filter(Boolean));
  return uniqueNames.size;
}

export const getStats = async (req: Request, res: Response) => {
  try {
    const totalPmr = await prisma.anggotaPMR.count();
    const totalKsr = await prisma.anggotaKSR.count();
    const totalTsr = await prisma.anggotaTSR.count();
    const totalUnits = await countUniqueUnits();
    const totalBencana = await prisma.bencana.count();
    const totalKegiatan = await prisma.kegiatan.count();
    const totalPenerimaManfaat = await prisma.kegiatan.aggregate({
      _sum: { penerima_jiwa: true },
    });

    res.json({
      total_pmr: totalPmr,
      total_ksr: totalKsr,
      total_tsr: totalTsr,
      total_relawan: totalPmr + totalKsr + totalTsr,
      total_units: totalUnits,
      total_bencana: totalBencana,
      total_kegiatan: totalKegiatan,
      total_penerima_manfaat: totalPenerimaManfaat._sum.penerima_jiwa || 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat statistik' });
  }
};

export const getPublicStats = async (req: Request, res: Response) => {
  try {
    const totalPmr = await prisma.anggotaPMR.count();
    const totalKsr = await prisma.anggotaKSR.count();
    const totalTsr = await prisma.anggotaTSR.count();
    const totalUnits = await countUniqueUnits();
    const totalBencana = await prisma.bencana.count();
    const totalKegiatan = await prisma.kegiatan.count();
    const totalPenerimaManfaat = await prisma.kegiatan.aggregate({
      _sum: { penerima_jiwa: true },
    });

    res.json({
      total_pmr: totalPmr,
      total_ksr: totalKsr,
      total_tsr: totalTsr,
      total_relawan: totalPmr + totalKsr + totalTsr,
      total_units: totalUnits,
      total_bencana: totalBencana,
      total_kegiatan: totalKegiatan,
      total_penerima_manfaat: totalPenerimaManfaat._sum.penerima_jiwa || 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat statistik' });
  }
};

export const getCharts = async (req: Request, res: Response) => {
  try {
    const membersByUnit = await prisma.anggotaPMR.groupBy({
      by: ['nama_unit'],
      _count: { id: true },
    });

    res.json({ membersByUnit });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat chart' });
  }
};

export const getPmrBreakdown = async (req: Request, res: Response) => {
  try {
    const [mula, madya, wira] = await Promise.all([
      prisma.anggotaPMR.count({ where: { jenis: 'PMR' } }),
      prisma.anggotaPMR.count({ where: { jenis: 'MADYA' } }),
      prisma.anggotaPMR.count({ where: { jenis: 'WIRA' } }),
    ]);

    res.json({ mula, madya, wira, total: mula + madya + wira });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat breakdown PMR' });
  }
};

export const getGrowthData = async (req: Request, res: Response) => {
  try {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const currentDate = new Date();
    const growthData: Record<string, { pmr: number; ksr: number; tsr: number }> = {};

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      growthData[monthKey] = { pmr: 0, ksr: 0, tsr: 0 };
    }

    const sixMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1);

    const pmrMembers = await prisma.anggotaPMR.findMany({
      where: { created_at: { gte: sixMonthsAgo } },
      select: { created_at: true },
    });

    const ksrMembers = await prisma.anggotaKSR.findMany({
      where: { created_at: { gte: sixMonthsAgo } },
      select: { created_at: true },
    });

    const tsrMembers = await prisma.anggotaTSR.findMany({
      where: { created_at: { gte: sixMonthsAgo } },
      select: { created_at: true },
    });

    pmrMembers.forEach((m) => {
      const monthKey = `${m.created_at.getFullYear()}-${String(m.created_at.getMonth() + 1).padStart(2, '0')}`;
      if (growthData[monthKey]) growthData[monthKey].pmr += 1;
    });

    ksrMembers.forEach((m) => {
      const monthKey = `${m.created_at.getFullYear()}-${String(m.created_at.getMonth() + 1).padStart(2, '0')}`;
      if (growthData[monthKey]) growthData[monthKey].ksr += 1;
    });

    tsrMembers.forEach((m) => {
      const monthKey = `${m.created_at.getFullYear()}-${String(m.created_at.getMonth() + 1).padStart(2, '0')}`;
      if (growthData[monthKey]) growthData[monthKey].tsr += 1;
    });

    const result = Object.entries(growthData).map(([key, values]) => {
      const [year, month] = key.split('-');
      return {
        month: months[parseInt(month) - 1],
        ...values,
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat data pertumbuhan' });
  }
};
