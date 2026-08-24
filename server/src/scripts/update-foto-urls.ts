import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const fotoUpdates = [
  { kode_anggota: '36043220025002', fileName: '36043220025002_Hawa.jpg', table: 'anggotaPMR' as const },
  { kode_anggota: '3670123456', fileName: '3670123456_Amira_Updated.jpg', table: 'anggotaKSR' as const },
];

async function updateFotoUrls() {
  for (const update of fotoUpdates) {
    const localUrl = `http://localhost:3000/uploads/${update.fileName}`;
    
    const result = await prisma[update.table].updateMany({
      where: { kode_anggota: update.kode_anggota },
      data: { foto: localUrl }
    });
    
    console.log(`Updated ${update.kode_anggota} (${update.table}): ${result.count} records -> ${localUrl}`);
  }

  await prisma.$disconnect();
}

updateFotoUrls();
