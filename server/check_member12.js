const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const member = await prisma.anggotaKSR.findUnique({
    where: { id: 12 },
    select: { id: true, nama: true, foto: true },
  });
  console.log('Member 12:', JSON.stringify(member, null, 2));
  await prisma.$disconnect();
}

check().catch(console.error);
