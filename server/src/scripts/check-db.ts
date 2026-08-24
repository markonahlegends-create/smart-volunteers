import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const [pmr, ksr, tsr, dds] = await Promise.all([
    prisma.anggotaPMR.count(),
    prisma.anggotaKSR.count(),
    prisma.anggotaTSR.count(),
    prisma.anggotaDDS.count(),
  ]);
  console.log('PMR:', pmr);
  console.log('KSR:', ksr);
  console.log('TSR:', tsr);
  console.log('DDS:', dds);
  await prisma.$disconnect();
}

check();
