import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateFotoToLocal() {
  const localUrl = 'http://localhost:3000/uploads/foto_36043220025002.jpg';
  
  const result = await prisma.anggotaPMR.updateMany({
    where: { kode_anggota: '36043220025002' },
    data: { foto: localUrl }
  });
  
  console.log('Updated records:', result.count);
  
  const record = await prisma.anggotaPMR.findFirst({
    where: { kode_anggota: '36043220025002' },
    select: { kode_anggota: true, nama: true, foto: true }
  });
  
  console.log('Record:', record);
  await prisma.$disconnect();
}

updateFotoToLocal();
