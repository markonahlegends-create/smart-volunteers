import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

(async () => {
  try {
    const pmr = await prisma.anggotaPMR.count();
    const ksr = await prisma.anggotaKSR.count();
    const tsr = await prisma.anggotaTSR.count();
    const unitPmr = await prisma.unitPMR.count();
    const unitKsr = await prisma.unitKSR.count();
    const unitTsr = await prisma.unitTSR.count();
    const bencana = await prisma.bencana.count();
    const kegiatan = await prisma.kegiatan.count();

    console.log('=== DATABASE COUNTS ===');
    console.log('Anggota PMR:', pmr);
    console.log('Anggota KSR:', ksr);
    console.log('Anggota TSR:', tsr);
    console.log('Total Anggota:', pmr + ksr + tsr);
    console.log('Unit PMR:', unitPmr);
    console.log('Unit KSR:', unitKsr);
    console.log('Unit TSR:', unitTsr);
    console.log('Bencana:', bencana);
    console.log('Kegiatan:', kegiatan);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
})();
