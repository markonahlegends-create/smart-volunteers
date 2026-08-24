import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw`
    SELECT jenis, COUNT(*) as count 
    FROM anggota_pmr 
    GROUP BY jenis
  `;
  console.log('PMR jenis breakdown:', result);
  
  const total = await prisma.anggotaPMR.count();
  console.log('Total PMR:', total);
  
  await prisma.$disconnect();
}

main().catch(console.error);
