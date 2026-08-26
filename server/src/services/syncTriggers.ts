import { PrismaClient } from '@prisma/client';
import { syncToGoogleSheets } from './googleSheets';

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
    const name = item.nama_unit || item.Nama_Unit || ''
    if (!name) {
      const key = `__id__${item.id}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    }
    const key = normalizeUnitName(name)
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

export async function triggerMemberSync() {
  try {
    const [pmr, ksr, tsr, dds] = await Promise.all([
      prisma.anggotaPMR.findMany(),
      prisma.anggotaKSR.findMany(),
      prisma.anggotaTSR.findMany(),
      prisma.anggotaDDS.findMany(),
    ]);

    const members = cleanFotoForSheets([...pmr, ...ksr, ...tsr, ...dds]);
    const uniqueMembers = uniqueByKey(members, 'kode_anggota');
    await syncToGoogleSheets({ sheet: 'PMR', data: uniqueMembers as any, action: 'sync', type: 'member' });
  } catch (error) {
    console.error('Auto-sync members failed:', error);
  }
}

export async function triggerRelawanSync() {
  try {
    const [pmr, ksr, tsr, dds] = await Promise.all([
      prisma.anggotaPMR.findMany(),
      prisma.anggotaKSR.findMany(),
      prisma.anggotaTSR.findMany(),
      prisma.anggotaDDS.findMany(),
    ]);

    const relawan = cleanFotoForSheets([
      ...pmr.map((item: any) => ({ ...item, _tipe: 'PMR' })),
      ...ksr.map((item: any) => ({ ...item, _tipe: 'KSR' })),
      ...tsr.map((item: any) => ({ ...item, _tipe: 'TSR' })),
      ...dds.map((item: any) => ({ ...item, _tipe: 'DDS' })),
    ]);
    const uniqueRelawan = uniqueByKey(relawan, 'kode_anggota');
    await syncToGoogleSheets({ sheet: 'Relawan', data: uniqueRelawan as any, action: 'sync', type: 'relawan' });
  } catch (error) {
    console.error('Auto-sync relawan failed:', error);
  }
}

export async function triggerUnitSync() {
  try {
    const [unitPmr, unitKsr, unitTsr] = await Promise.all([
      prisma.unitPMR.findMany(),
      prisma.unitKSR.findMany(),
      prisma.unitTSR.findMany(),
    ]);
    const units = cleanFotoForSheets([
      ...unitPmr.map(u => ({ ...u, _tipe: 'pmr' })),
      ...unitKsr.map(u => ({ ...u, _tipe: 'ksr' })),
      ...unitTsr.map(u => ({ ...u, _tipe: 'tsr' })),
    ]);
    const uniqueUnits = uniqueByUnitName(units);
    await syncToGoogleSheets({ sheet: 'Unit_PMR', data: uniqueUnits as any, action: 'sync', type: 'unit' });
  } catch (error) {
    console.error('Auto-sync units failed:', error);
  }
}

export async function triggerBencanaSync() {
  try {
    const bencana = await prisma.bencana.findMany();
    const uniqueBencana = uniqueByKey(cleanFotoForSheets(bencana as any), 'id');
    await syncToGoogleSheets({ sheet: 'Laporan_Semester', data: uniqueBencana, action: 'sync', type: 'bencana' });
  } catch (error) {
    console.error('Auto-sync bencana failed:', error);
  }
}

export async function triggerKegiatanSync() {
  try {
    const kegiatan = await prisma.kegiatan.findMany();
    const uniqueKegiatan = uniqueByKey(cleanFotoForSheets(kegiatan as any), 'id');
    await syncToGoogleSheets({ sheet: 'Laporan_Kegiatan', data: uniqueKegiatan, action: 'sync', type: 'kegiatan' });
  } catch (error) {
    console.error('Auto-sync kegiatan failed:', error);
  }
}
