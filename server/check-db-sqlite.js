const Database = require('sqlite3').Database;
const db = new Database('prisma/dev.db');

const tables = [
  'anggota_pmr',
  'anggota_ksr',
  'anggota_tsr',
  'unit_pmr',
  'unit_ksr',
  'unit_tsr',
  'bencana',
  'kegiatan'
];

let completed = 0;

tables.forEach(table => {
  db.get(`SELECT COUNT(*) as count FROM ${table}`, (err, row) => {
    if (err) {
      console.error(`Error counting ${table}:`, err.message);
    } else {
      console.log(`${table}: ${row.count}`);
    }
    completed++;
    if (completed === tables.length) {
      db.close();
    }
  });
});
