import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const units = await prisma.unitPMR.findMany({ select: { nama_unit: true } });
    console.log('Unit PMR sample:');
    units.slice(0, 10).forEach(u => console.log('  ', u.nama_unit));
    
    const ksr = await prisma.unitKSR.findMany({ select: { nama_unit: true, jenis: true } });
    console.log('\nUnit KSR:');
    ksr.forEach(u => console.log('  ', u.nama_unit, '|', u.jenis));
    
    const tsr = await prisma.unitTSR.findMany({ select: { nama_unit: true, jenis: true } });
    console.log('\nUnit TSR:');
    tsr.forEach(u => console.log('  ', u.nama_unit, '|', u.jenis));
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
