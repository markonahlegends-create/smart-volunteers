import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  await prisma.kegiatan.createMany({
    data: [
      {
        tanggal_kejadian: '2026-01-02',
        nama_kegiatan: 'Respon Bencana Banjir di Kota Cilegon',
        tempat: 'Kec. Citangkil, Cilegon',
        bidang: 'BIDANG PENANGGULANGAN BENCANA',
        bulan: 'Januari',
        semester: 1,
        tahun: 2026,
        ks_count: 30,
        tsr_count: 8,
        pengurus_count: 6,
        staf_count: 6,
        pmr_count: 0,
        penerima_laki: 5457,
        penerima_perempuan: 7543,
        penerima_kk: 4300,
        penerima_jiwa: 13000,
        keterangan: 'PMI kota Cilegon Respon Bencana Banjir dengan Mobilisasi Tim Satgana',
        anggaran: '113,463,400',
      },
      {
        tanggal_kejadian: '2026-01-24',
        nama_kegiatan: 'Diklat PMR Unit SMKN 1 Kota Cilegon',
        tempat: 'Aula SMKN 1 Kota Cilegon',
        bidang: 'BIDANG RELAWAN',
        bulan: 'Januari',
        semester: 1,
        tahun: 2026,
        ks_count: 0,
        tsr_count: 0,
        pengurus_count: 1,
        staf_count: 1,
        pmr_count: 0,
        penerima_laki: 6,
        penerima_perempuan: 9,
        penerima_kk: 0,
        penerima_jiwa: 15,
        keterangan: 'Kadiv PB Alim Memberikan Materi ASB',
        anggaran: '-',
      },
    ],
  });
  console.log('Seeded kegiatan');
}

seed()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
