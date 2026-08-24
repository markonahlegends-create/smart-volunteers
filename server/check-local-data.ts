import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const tsr = await prisma.anggotaTSR.findMany({
      select: { nama: true, jenis: true, nama_unit: true }
    });
    console.log('Local TSR members:', tsr.length);
    tsr.forEach(t => {
      console.log(`  - ${t.nama} | jenis: ${t.jenis} | unit: ${t.nama_unit}`);
    });

    const unitPmr = await prisma.unitPMR.findMany({
      select: { nama_unit: true, jenis: true }
    });
    console.log('\nLocal Unit PMR:', unitPmr.length);
    unitPmr.slice(0, 5).forEach(u => {
      console.log(`  - ${u.nama_unit} | jenis: ${u.jenis}`);
    });

    const unitKsr = await prisma.unitKSR.findMany({
      select: { nama_unit: true, jenis: true }
    });
    console.log('\nLocal Unit KSR:', unitKsr.length);
    unitKsr.forEach(u => {
      console.log(`  - ${u.nama_unit} | jenis: ${u.jenis}`);
    });

    const unitTsr = await prisma.unitTSR.findMany({
      select: { nama_unit: true, jenis: true }
    });
    console.log('\nLocal Unit TSR:', unitTsr.length);
    unitTsr.forEach(u => {
      console.log(`  - ${u.nama_unit} | jenis: ${u.jenis}`);
    });

  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
