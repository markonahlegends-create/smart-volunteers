import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkFoto() {
  const pmr = await prisma.anggotaPMR.findMany({
    where: { foto: { not: null } },
    select: { kode_anggota: true, nama: true, foto: true }
  });
  
  const ksr = await prisma.anggotaKSR.findMany({
    where: { foto: { not: null } },
    select: { kode_anggota: true, nama: true, foto: true }
  });
  
  const tsr = await prisma.anggotaTSR.findMany({
    where: { foto: { not: null } },
    select: { kode_anggota: true, nama: true, foto: true }
  });
  
  console.log('PMR with foto:', pmr.length);
  pmr.forEach(r => console.log('  -', r.kode_anggota, r.nama, r.foto));
  
  console.log('\nKSR with foto:', ksr.length);
  ksr.forEach(r => console.log('  -', r.kode_anggota, r.nama, r.foto));
  
  console.log('\nTSR with foto:', tsr.length);
  tsr.forEach(r => console.log('  -', r.kode_anggota, r.nama, r.foto));
  
  await prisma.$disconnect();
}

checkFoto();
