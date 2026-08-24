import { PrismaClient } from '@prisma/client';
import { syncToGoogleSheets } from '../services/googleSheets';

const prisma = new PrismaClient();
const BATCH_SIZE = 50;

async function main() {
  console.log('Starting Relawan sync to Google Sheets...\n');

  try {
    const relawan = await prisma.relawan.findMany({
      orderBy: { id: 'desc' }
    });

    console.log(`Syncing ${relawan.length} relawan...`);
    await syncToGoogleSheets({ sheet: 'Relawan', data: relawan as any, action: 'insert' });

    console.log('\n=== Relawan Sync Complete ===');
  } catch (error: any) {
    console.error('Sync error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
