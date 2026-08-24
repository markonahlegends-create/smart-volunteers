import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkFoto() {
  const record = await prisma.anggotaPMR.findFirst({
    where: { kode_anggota: '36043220025002' },
    select: { kode_anggota: true, nama: true, foto: true }
  });
  
  console.log('Record:', record);
  
  if (record && record.foto) {
    console.log('Has foto data');
    console.log('Foto length:', record.foto.length);
    console.log('Foto preview:', record.foto.substring(0, 100));
  } else {
    console.log('No foto data');
  }
  
  await prisma.$disconnect();
}

checkFoto();
