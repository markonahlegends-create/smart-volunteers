import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateFotoUrl() {
  const oldUrl = 'https://drive.google.com/uc?id=1HvHyFN8k9rbOZcXHjaM3cgiuVyQOsmSm';
  const newUrl = 'https://drive.google.com/uc?export=view&id=1HvHyFN8k9rbOZcXHjaM3cgiuVyQOsmSm';
  
  const result = await prisma.anggotaPMR.updateMany({
    where: { kode_anggota: '36043220025002' },
    data: { foto: newUrl }
  });
  
  console.log('Updated records:', result.count);
  
  const record = await prisma.anggotaPMR.findFirst({
    where: { kode_anggota: '36043220025002' },
    select: { kode_anggota: true, nama: true, foto: true }
  });
  
  console.log('Record:', record);
  await prisma.$disconnect();
}

updateFotoUrl();
