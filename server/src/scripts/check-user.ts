import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUser() {
  const user = await prisma.user.findFirst({
    where: { email: 'cuklay@gmail.com' },
    select: { id: true, email: true, nama: true, role: true }
  });
  
  console.log('User:', user);
  await prisma.$disconnect();
}

checkUser();
