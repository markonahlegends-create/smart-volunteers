import { PrismaClient } from '@prisma/client';
import { syncToGoogleSheets } from '../services/googleSheets';

const prisma = new PrismaClient();
const BATCH_SIZE = 50;

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

async function main() {
  console.log('Starting full sync to Google Sheets...\n');

  try {
    const [pmr, ksr, tsr, dds, unitPmr, unitKsr, unitTsr, bencana, kegiatan, relawan] = await Promise.all([
      prisma.anggotaPMR.findMany(),
      prisma.anggotaKSR.findMany(),
      prisma.anggotaTSR.findMany(),
      prisma.anggotaDDS.findMany(),
      prisma.unitPMR.findMany(),
      prisma.unitKSR.findMany(),
      prisma.unitTSR.findMany(),
      prisma.bencana.findMany(),
      prisma.kegiatan.findMany(),
      prisma.relawan.findMany(),
    ]);

    // Clear all member sheets first
    console.log('Clearing all member sheets...');
    await Promise.all([
      syncToGoogleSheets({ sheet: 'PMR', action: 'clear' }),
      syncToGoogleSheets({ sheet: 'KSR_Markas', action: 'clear' }),
      syncToGoogleSheets({ sheet: 'KSR_Perguruan_Tinggi', action: 'clear' }),
      syncToGoogleSheets({ sheet: 'TSR', action: 'clear' }),
    ]);

    // Sync members with routing
    const members = uniqueByKey([...pmr, ...ksr, ...tsr, ...dds], 'kode_anggota');
    console.log(`Syncing ${members.length} members with routing...`);
    await syncInBatchesRouted('PMR', members, 'insert-routed');

    // Clear all unit sheets first
    console.log('Clearing all unit sheets...');
    await Promise.all([
      syncToGoogleSheets({ sheet: 'Unit_PMR', action: 'clear' }),
      syncToGoogleSheets({ sheet: 'Unit_KSR', action: 'clear' }),
      syncToGoogleSheets({ sheet: 'Unit_TSR', action: 'clear' }),
    ]);

    // Sync units directly to their respective sheets
    console.log(`Syncing ${unitPmr.length} Unit PMR...`);
    await clearAndSync('Unit_PMR', uniqueByUnitName(unitPmr));

    console.log(`Syncing ${unitKsr.length} Unit KSR...`);
    await clearAndSync('Unit_KSR', uniqueByUnitName(unitKsr));

    console.log(`Syncing ${unitTsr.length} Unit TSR...`);
    await clearAndSync('Unit_TSR', uniqueByUnitName(unitTsr));

    // Sync bencana
    console.log(`Syncing ${bencana.length} bencana records...`);
    await clearAndSync('Laporan_Semester', bencana);

    // Sync kegiatan
    console.log(`Syncing ${kegiatan.length} kegiatan records...`);
    await clearAndSync('Laporan_Kegiatan', kegiatan);

    // Sync relawan
    console.log(`Syncing ${relawan.length} relawan records...`);
    await clearAndSync('Relawan', relawan);

    console.log('\n=== Sync Complete ===');
  } catch (error: any) {
    console.error('Sync error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

async function clearAndSync(sheet: string, data: any[]) {
  console.log(`  Clearing ${sheet}...`);
  await syncToGoogleSheets({ sheet, action: 'clear' });
  await syncInBatches(sheet, data);
}

async function clearAndSyncRouted(sheet: string, data: any[], action: string) {
  console.log(`  Clearing ${sheet}...`);
  await syncToGoogleSheets({ sheet, action: 'clear' });
  await syncInBatchesRouted(sheet, data, action);
}

async function syncInBatches(sheet: string, data: any[]) {
  const batches = [];
  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    batches.push(data.slice(i, i + BATCH_SIZE));
  }

  console.log(`  Sending ${batches.length} batches...`);
  
  for (let i = 0; i < batches.length; i++) {
    try {
      await syncToGoogleSheets({
        sheet,
        data: batches[i],
        action: 'insert',
      });
      console.log(`    Batch ${i + 1}/${batches.length} synced`);
    } catch (error: any) {
      console.error(`    Batch ${i + 1} failed:`, error.message);
    }
  }
}

async function syncInBatchesRouted(sheet: string, data: any[], action: string) {
  const batches = [];
  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    batches.push(data.slice(i, i + BATCH_SIZE));
  }

  console.log(`  Sending ${batches.length} routed batches...`);
  
  for (let i = 0; i < batches.length; i++) {
    try {
      await syncToGoogleSheets({
        sheet,
        data: batches[i],
        action: action as any,
      });
      console.log(`    Batch ${i + 1}/${batches.length} synced`);
    } catch (error: any) {
      console.error(`    Batch ${i + 1} failed:`, error.message);
    }
  }
}

main();
