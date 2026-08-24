import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import { triggerUnitSync } from '../services/syncTriggers';

const prisma = new PrismaClient();

const normalizeUnitName = (name: string) => {
  if (!name) return '';
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
      };
      return map[match.toLowerCase()] || match;
    })
    .replace(/\s+/g, ' ')
    .trim();
};

const isDuplicateUnitName = (nameA: string, nameB: string) => {
  return normalizeUnitName(nameA) === normalizeUnitName(nameB);
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'sk-' + uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  },
});

export const getPMRMula = async (req: Request, res: Response) => {
  try {
    const units = await prisma.unitPMR.findMany({ where: { tingkat: 'MULA' } });
    const unique = units.filter((unit, index, self) => index === self.findIndex(u => u.nama_unit === unit.nama_unit));
    res.json(unique);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat data' });
  }
};

export const getPMRMadya = async (req: Request, res: Response) => {
  try {
    const units = await prisma.unitPMR.findMany({ where: { tingkat: 'MADYA' } });
    const unique = units.filter((unit, index, self) => index === self.findIndex(u => u.nama_unit === unit.nama_unit));
    res.json(unique);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat data' });
  }
};

export const getPMRWira = async (req: Request, res: Response) => {
  try {
    const units = await prisma.unitPMR.findMany({ where: { tingkat: 'WIRA' } });
    const unique = units.filter((unit, index, self) => index === self.findIndex(u => u.nama_unit === unit.nama_unit));
    res.json(unique);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat data' });
  }
};

export const getKSR = async (req: Request, res: Response) => {
  try {
    const units = await prisma.unitKSR.findMany();
    const unique = units.filter((unit, index, self) => index === self.findIndex(u => u.nama_unit === unit.nama_unit));
    res.json(unique);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat data' });
  }
};

export const getUnitKSRById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const unit = await prisma.unitKSR.findUnique({
      where: { id: parseInt(id) },
    });
    if (!unit) {
      return res.status(404).json({ message: 'Unit tidak ditemukan' });
    }
    res.json(unit);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat data' });
  }
};

export const getUnitPMRById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const unit = await prisma.unitPMR.findUnique({
      where: { id: parseInt(id) },
    });
    if (!unit) {
      return res.status(404).json({ message: 'Unit tidak ditemukan' });
    }
    res.json(unit);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat data' });
  }
};

export const getUnitTSRById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const unit = await prisma.unitTSR.findUnique({
      where: { id: parseInt(id) },
    });
    if (!unit) {
      return res.status(404).json({ message: 'Unit tidak ditemukan' });
    }
    res.json(unit);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat data' });
  }
};

export const getMembersByUnitKSR = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { kategori = 'Anggota' } = req.query;
    const unit = await prisma.unitKSR.findUnique({
      where: { id: parseInt(id) },
    });
    if (!unit) {
      return res.status(404).json({ message: 'Unit tidak ditemukan' });
    }
    const where: any = { nama_unit: unit.nama_unit };
    if (kategori) {
      where.kategori = kategori as string;
    }
    const members = await prisma.anggotaKSR.findMany({
      where,
      orderBy: { id: 'desc' },
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat anggota' });
  }
};

export const getMembersByUnitPMR = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { kategori = 'Anggota' } = req.query;
    const unit = await prisma.unitPMR.findUnique({
      where: { id: parseInt(id) },
    });
    if (!unit) {
      return res.status(404).json({ message: 'Unit tidak ditemukan' });
    }
    const where: any = { nama_unit: unit.nama_unit };
    if (kategori) {
      where.kategori = kategori as string;
    }
    const members = await prisma.anggotaPMR.findMany({
      where,
      orderBy: { id: 'desc' },
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat anggota' });
  }
};

export const getMembersByUnitTSR = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { kategori = 'Anggota' } = req.query;
    const unit = await prisma.unitTSR.findUnique({
      where: { id: parseInt(id) },
    });
    if (!unit) {
      return res.status(404).json({ message: 'Unit tidak ditemukan' });
    }
    const where: any = { nama_unit: unit.nama_unit };
    if (kategori) {
      where.kategori = kategori as string;
    }
    const members = await prisma.anggotaTSR.findMany({
      where,
      orderBy: { id: 'desc' },
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat anggota' });
  }
};

export const getTSR = async (req: Request, res: Response) => {
  try {
    const units = await prisma.unitTSR.findMany();
    const unique = units.filter((unit, index, self) => index === self.findIndex(u => u.nama_unit === unit.nama_unit));
    res.json(unique);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat data' });
  }
};

export const createUnitPMR = async (req: Request, res: Response) => {
  try {
    const { nama_unit, tingkat, provinsi, kabupaten, alamat, email, no_telpon, status, kode_unit, sk, lat, lng } = req.body;
    const allUnits = await prisma.unitPMR.findMany();
    const existing = allUnits.find(u => isDuplicateUnitName(u.nama_unit, nama_unit));
    if (existing) {
      return res.status(409).json({ message: 'Unit PMR dengan nama tersebut sudah ada' });
    }
    const unit = await prisma.unitPMR.create({
      data: { nama_unit, tingkat: tingkat || 'MULA', provinsi, kabupaten, alamat, email, no_telpon, status, kode_unit, sk, lat, lng },
    });
    res.json(unit);
    triggerUnitSync().catch(console.error);
  } catch (error) {
    res.status(500).json({ message: 'Gagal upload SK' });
  }
};

export const getAllUnits = async (req: Request, res: Response) => {
  try {
    const [pmr, ksr, tsr] = await Promise.all([
      prisma.unitPMR.findMany({ select: { nama_unit: true } }),
      prisma.unitKSR.findMany({ select: { nama_unit: true } }),
      prisma.unitTSR.findMany({ select: { nama_unit: true } }),
    ]);
    const units = [...pmr, ...ksr, ...tsr]
      .map(u => u.nama_unit)
      .filter((name): name is string => Boolean(name));
    const uniqueUnits = Array.from(new Set(units));
    res.json(uniqueUnits);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat data unit' });
  }
};

export const updateUnitPMR = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nama_unit, tingkat, provinsi, kabupaten, alamat, email, no_telpon, status, kode_unit, sk, lat, lng } = req.body;
    const unit = await prisma.unitPMR.update({
      where: { id: parseInt(id) },
      data: { nama_unit, tingkat, provinsi, kabupaten, alamat, email, no_telpon, status, kode_unit, sk, lat, lng },
    });
    res.json(unit);
    triggerUnitSync().catch(console.error);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui unit' });
  }
};

export const deleteUnitPMR = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.unitPMR.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Unit berhasil dihapus' });
    triggerUnitSync().catch(console.error);
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus unit' });
  }
};

export const createUnitKSR = async (req: Request, res: Response) => {
  try {
    const { kategori, catatan, ...data } = req.body;
    const allUnits = await prisma.unitKSR.findMany();
    const existing = allUnits.find(u => isDuplicateUnitName(u.nama_unit, data.nama_unit));
    if (existing) {
      return res.status(409).json({ message: 'Unit KSR dengan nama tersebut sudah ada' });
    }
    const unit = await prisma.unitKSR.create({
      data: { ...data, jenis: 'KSR', kategori, catatan },
    });
    res.json(unit);
    triggerUnitSync().catch(console.error);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat unit KSR' });
  }
};

export const updateUnitKSR = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { kategori, catatan, ...data } = req.body;
    const unit = await prisma.unitKSR.update({
      where: { id: parseInt(id) },
      data: { ...data, kategori, catatan },
    });
    res.json(unit);
    triggerUnitSync().catch(console.error);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui unit KSR' });
  }
};

export const deleteUnitKSR = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.unitKSR.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Unit KSR berhasil dihapus' });
    triggerUnitSync().catch(console.error);
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus unit KSR' });
  }
};

export const createUnitTSR = async (req: Request, res: Response) => {
  try {
    const { nama_unit, jenis, provinsi, kabupaten, alamat, email, no_telpon, status, kode_unit, sk, lat, lng } = req.body;
    const allUnits = await prisma.unitTSR.findMany();
    const existing = allUnits.find(u => isDuplicateUnitName(u.nama_unit, nama_unit));
    if (existing) {
      return res.status(409).json({ message: 'Unit TSR dengan nama tersebut sudah ada' });
    }
    const unit = await prisma.unitTSR.create({
      data: { nama_unit, jenis, provinsi, kabupaten, alamat, email, no_telpon, status, kode_unit, sk, lat, lng },
    });
    res.json(unit);
    triggerUnitSync().catch(console.error);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat unit TSR' });
  }
};

export const updateUnitTSR = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nama_unit, jenis, provinsi, kabupaten, alamat, email, no_telpon, status, kode_unit, sk, lat, lng } = req.body;
    const unit = await prisma.unitTSR.update({
      where: { id: parseInt(id) },
      data: { nama_unit, jenis, provinsi, kabupaten, alamat, email, no_telpon, status, kode_unit, sk, lat, lng },
    });
    res.json(unit);
    triggerUnitSync().catch(console.error);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui unit TSR' });
  }
};

export const deleteUnitTSR = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.unitTSR.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Unit TSR berhasil dihapus' });
    triggerUnitSync().catch(console.error);
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus unit TSR' });
  }
};

export const uploadUnitSK = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'File SK belum diupload' });
    }
    const unit = await prisma.unitKSR.update({
      where: { id: parseInt(id) },
      data: { sk: '/uploads/' + file.filename },
    });
    res.json(unit);
    triggerUnitSync().catch(console.error);
  } catch (error) {
    res.status(500).json({ message: 'Gagal upload SK' });
  }
};

export const uploadUnitSKPMR = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'File SK belum diupload' });
    }
    const unit = await prisma.unitPMR.update({
      where: { id: parseInt(id) },
      data: { sk: '/uploads/' + file.filename },
    });
    res.json(unit);
    triggerUnitSync().catch(console.error);
  } catch (error) {
    res.status(500).json({ message: 'Gagal upload SK' });
  }
};

export const uploadUnitSKTSR = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'File SK belum diupload' });
    }
    const unit = await prisma.unitTSR.update({
      where: { id: parseInt(id) },
      data: { sk: '/uploads/' + file.filename },
    });
    res.json(unit);
  } catch (error) {
    res.status(500).json({ message: 'Gagal upload SK' });
  }
};
