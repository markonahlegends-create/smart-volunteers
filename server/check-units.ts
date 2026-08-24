import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const units = await prisma.unitPMR.findMany({ select: { nama_unit: true, jenis: true } });
    console.log('Unit PMR sample:');
    units.slice(0, 5).forEach(u => console.log('  ', JSON.stringify(u)));
    
    const ksr = await prisma.unitKSR.findMany();
    console.log('Unit KSR count:', ksr.length);
    ksr.slice(0, 3).forEach(u => console.log('  ', u.nama_unit, '|', u.jenis));
    
    const tsr = await prisma.unitTSR.findMany();
    console.log('Unit TSR count:', tsr.length);
    tsr.forEach(u => console.log('  ', u.nama_unit, '|', u.jenis));
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
