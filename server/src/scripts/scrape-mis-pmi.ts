import { chromium } from 'playwright';
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://mis.pmi.or.id';
const DATA_DIR = path.join(__dirname, '..', 'migration-data');
const STATE_FILE = path.join(DATA_DIR, 'login-state.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

interface PageConfig {
  name: string;
  url: string;
  total: number;
  pageSize?: number;
  columns?: string[];
}

const PAGES: PageConfig[] = [
  { name: 'pmr', url: '/pmi/anggota/pmr', total: 4959, pageSize: 20 },
  { name: 'ksr', url: '/pmi/anggota/ksr', total: 243, pageSize: 20 },
  { name: 'tsr', url: '/pmi/anggota/tsr', total: 193, pageSize: 20 },
  { name: 'unit-pmr-mula', url: '/pmi/pmr/mula', total: 7, pageSize: 20 },
  { name: 'unit-pmr-madya', url: '/pmi/pmr/madya', total: 35, pageSize: 20 },
  { name: 'unit-pmr-wira', url: '/ppi/pmr/wira', total: 30, pageSize: 20 },
  { name: 'unit-ksr', url: '/pmi/ksr/markas', total: 1, pageSize: 20 },
  { name: 'unit-tsr', url: '/pmi/tsr/index', total: 1, pageSize: 20 },
  { name: 'bencana', url: '/pmi/bencana/index', total: 995, pageSize: 20 },
];

async function saveLoginState(page: any) {
  const state = await page.context().storageState();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  console.log('Login state saved.\n');
}

async function loadLoginState(): Promise<boolean> {
  if (!fs.existsSync(STATE_FILE)) return false;
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
  await context.addCookies(state.cookies);
  
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/index.php`, { waitUntil: 'networkidle' });
  
  const isLoggedIn = await page.evaluate(() => {
    return !document.querySelector('input[name="LoginForm[username]"]');
  });
  
  await browser.close();
  return isLoggedIn;
}

async function performLogin(): Promise<void> {
  console.log('=== MIS PMI Login ===\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('1. Opening login page...');
  await page.goto(`${BASE_URL}/index.php?r=user%2Fsecurity%2Flogin`, { waitUntil: 'networkidle' });

  console.log('\n2. Please login manually:');
  console.log('   - Email: cuklay@gmail.com');
  console.log('   - Password: U80SAYAOWK');
  console.log('   - Complete CAPTCHA');
  console.log('   - Press ENTER here after successful login...\n');

  await new Promise<void>(resolve => process.stdin.once('data', () => resolve()));

  await saveLoginState(page);
  await browser.close();
}

async function scrapeWithAxios(): Promise<void> {
  console.log('\n=== Starting Data Migration ===\n');

  if (!fs.existsSync(STATE_FILE)) {
    console.log('No login state found. Starting login process...\n');
    await performLogin();
  }

  const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
  const cookieHeader = state.cookies
    .map((c: any) => `${c.name}=${c.value}`)
    .join('; ');

  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { Cookie: cookieHeader },
  });

  for (const pageConfig of PAGES) {
    console.log(`Scraping ${pageConfig.name}...`);
    try {
      const allItems: any[] = [];
      const totalPages = Math.ceil(pageConfig.total / pageConfig.pageSize!);

      for (let p = 1; p <= totalPages; p++) {
        console.log(`  Page ${p}/${totalPages}...`);
        const response = await axiosInstance.get(pageConfig.url, {
          params: { page: p },
        });

        const $ = cheerio.load(response.data);
        const rows = $('table tbody tr');
        
        rows.each((_, row) => {
          const cells = $(row).find('td');
          if (cells.length > 0) {
            const rowData = cells.map((_, cell) => $(cell).text().trim()).get();
            allItems.push(rowData);
          }
        });

        console.log(`    Got ${rows.length} items (total: ${allItems.length})`);
      }

      const outputPath = path.join(DATA_DIR, `${pageConfig.name}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(allItems, null, 2));
      console.log(`  Saved to ${outputPath}\n`);
    } catch (error: any) {
      console.error(`  Error scraping ${pageConfig.name}:`, error.message);
      if (error.response?.status === 403) {
        console.log('  Session expired. Please run again to re-login.\n');
      }
    }
  }

  console.log('\n=== Scraping Complete ===');
  console.log(`Data saved to: ${DATA_DIR}`);
}

async function main() {
  const hasValidSession = await loadLoginState();
  
  if (hasValidSession) {
    console.log('Valid session found. Starting scraping...\n');
    await scrapeWithAxios();
  } else {
    console.log('No valid session. Starting login...\n');
    await performLogin();
    await scrapeWithAxios();
  }
}

main().catch(console.error);
