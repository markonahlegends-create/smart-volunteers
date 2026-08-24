import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const ksr = await prisma.anggotaKSR.findMany({
      select: { nama: true, jenis: true, nama_unit: true }
    });
    console.log('Local KSR members:', ksr.length);
    ksr.forEach(k => {
      console.log(`  - ${k.nama} | jenis: ${k.jenis} | unit: ${k.nama_unit}`);
    });
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
