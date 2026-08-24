import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { syncToGoogleSheets } from '../services/googleSheets';

const prisma = new PrismaClient();

const cleanFotoForSheets = (data: any[]) => {
  return data.map(item => {
    if (!item.foto) return item
    const foto = String(item.foto)
    if (foto.startsWith('data:image') || foto.includes('localhost') || foto.includes('127.0.0.1')) {
      return { ...item, foto: '' }
    }
    return item
  })
}

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

const uniqueByUnitName = (data: any[]) => {
  const seen = new Set<string>()
  return data.filter(item => {
    const key = normalizeUnitName(item.nama_unit || '')
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const uniqueByKey = (data: any[], key: string) => {
  const seen = new Set<string | number>()
  return data.filter(item => {
    const value = item[key]
    if (seen.has(value)) return false
    seen.add(value)
    return true
  })
}

const syncAnggotaData = async () => {
  const [pmr, ksr, tsr, dds] = await Promise.all([
    prisma.anggotaPMR.findMany(),
    prisma.anggotaKSR.findMany(),
    prisma.anggotaTSR.findMany(),
    prisma.anggotaDDS.findMany(),
  ]);

  const members = cleanFotoForSheets([...pmr, ...ksr, ...tsr, ...dds]);
  const uniqueMembers = uniqueByKey(members, 'kode_anggota');
  await syncToGoogleSheets({ sheet: 'PMR', data: uniqueMembers, action: 'sync', type: 'member' });
};

const syncUnitData = async () => {
  const [unitPmr, unitKsr, unitTsr] = await Promise.all([
    prisma.unitPMR.findMany(),
    prisma.unitKSR.findMany(),
    prisma.unitTSR.findMany(),
  ]);
  const units = cleanFotoForSheets([
    ...unitPmr.map((u: any) => ({ ...u, _tipe: 'pmr' })),
    ...unitKsr.map((u: any) => ({ ...u, _tipe: 'ksr' })),
    ...unitTsr.map((u: any) => ({ ...u, _tipe: 'tsr' })),
  ]);
  const uniqueUnits = uniqueByUnitName(units);
  await syncToGoogleSheets({ sheet: 'Unit_PMR', data: uniqueUnits, action: 'sync', type: 'unit' });
};

const syncRelawanData = async () => {
  const relawan = await prisma.relawan.findMany({
    orderBy: { id: 'desc' }
  });
  const uniqueRelawan = uniqueByKey(cleanFotoForSheets(relawan as any), 'id');
  await syncToGoogleSheets({ sheet: 'Relawan', data: uniqueRelawan, action: 'sync', type: 'relawan' });
};

const syncBencanaData = async () => {
  const bencana = await prisma.bencana.findMany();
  const uniqueBencana = uniqueByKey(cleanFotoForSheets(bencana as any), 'id');
  await syncToGoogleSheets({ sheet: 'Laporan_Semester', data: uniqueBencana, action: 'sync', type: 'bencana' });
};

const syncKegiatanData = async () => {
  const kegiatan = await prisma.kegiatan.findMany();
  const uniqueKegiatan = uniqueByKey(cleanFotoForSheets(kegiatan as any), 'id');
  await syncToGoogleSheets({ sheet: 'Laporan_Kegiatan', data: uniqueKegiatan, action: 'sync', type: 'kegiatan' });
};

export const syncAnggotaToSheets = async (_req: Request, res: Response) => {
  try {
    await syncAnggotaData();
    res.json({ message: 'Sync anggota ke Google Sheets berhasil' });
  } catch (error: any) {
    res.status(500).json({ message: 'Gagal sync ke Google Sheets', error: error.message });
  }
};

export const syncUnitToSheets = async (_req: Request, res: Response) => {
  try {
    await syncUnitData();
    res.json({ message: 'Sync unit ke Google Sheets berhasil' });
  } catch (error: any) {
    res.status(500).json({ message: 'Gagal sync unit ke Google Sheets', error: error.message });
  }
};

export const syncBencanaToSheets = async (_req: Request, res: Response) => {
  try {
    await syncBencanaData();
    res.json({ message: 'Sync bencana ke Google Sheets berhasil' });
  } catch (error: any) {
    res.status(500).json({ message: 'Gagal sync bencana ke Google Sheets', error: error.message });
  }
};

export const syncKegiatanToSheets = async (_req: Request, res: Response) => {
  try {
    await syncKegiatanData();
    res.json({ message: 'Sync kegiatan ke Google Sheets berhasil' });
  } catch (error: any) {
    res.status(500).json({ message: 'Gagal sync kegiatan ke Google Sheets', error: error.message });
  }
};

export const syncRelawanToSheets = async (_req: Request, res: Response) => {
  try {
    await syncRelawanData();
    res.json({ message: 'Sync relawan ke Google Sheets berhasil' });
  } catch (error: any) {
    res.status(500).json({ message: 'Gagal sync relawan ke Google Sheets', error: error.message });
  }
};

export const syncAllToSheets = async (_req: Request, res: Response) => {
  try {
    await syncAnggotaData();
    await syncUnitData();
    await syncRelawanData();
    await syncBencanaData();
    await syncKegiatanData();
    res.json({ message: 'Sync seluruh data ke Google Sheets berhasil' });
  } catch (error: any) {
    res.status(500).json({ message: 'Gagal sync seluruh data', error: error.message });
  }
};
