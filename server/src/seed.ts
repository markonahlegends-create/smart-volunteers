import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'cuklay@gmail.com' },
    update: {},
    create: {
      email: 'cuklay@gmail.com',
      password_hash: hashedPassword,
      nama: 'Admin PMI Kota Cilegon',
      role: 'admin',
    },
  });

  const pmrUnits = [
    { nama_unit: 'SMP Negeri 5 Kota Cilegon', tingkat: 'MADYA', provinsi: 'BANTEN', kabupaten: 'KOTA CILEGON', alamat: 'Kota Cilegon', email: '', no_telpon: '', status: 'Aktif' },
    { nama_unit: 'SMK Negeri 2 Kota Cilegon', tingkat: 'WIRA', provinsi: 'BANTEN', kabupaten: 'KOTA CILEGON', alamat: 'Kota Cilegon', email: '', no_telpon: '', status: 'Aktif' },
    { nama_unit: 'SMK Negeri 3 Kota Cilegon', tingkat: 'WIRA', provinsi: 'BANTEN', kabupaten: 'KOTA CILEGON', alamat: 'Kota Cilegon', email: '', no_telpon: '', status: 'Aktif' },
  ];

  const ksrUnits = [
    { nama_unit: 'Politeknik Krakatau', jenis: 'KSR', kategori: 'PERGURUAN TINGGI', provinsi: 'BANTEN', kabupaten: 'KOTA CILEGON', alamat: 'Komplek Bonakarta Blok B07 Jl. SA. Tirtayasa No.49 Kota Cilegon', email: 'politeknikkrakatau@gmail.com', no_telpon: '0254388830', status: 'Aktif', catatan: '' },
  ];

  for (const unit of pmrUnits) {
    await prisma.unitPMR.create({ data: unit });
  }

  for (const unit of ksrUnits) {
    await prisma.unitKSR.create({ data: unit });
  }

  const pmrMembers = [
    { provinsi: 'BANTEN', kabupaten: 'KOTA CILEGON', angkatan: 2026, kode_anggota: '367201100126004', nama: 'ANINDI FEBRIYANTI', kelamin: 'Wanita', status: 'Aktif', nama_unit: 'SMP Negeri 5 Kota Cilegon', jenis: 'MADYA' },
    { provinsi: 'BANTEN', kabupaten: 'KOTA CILEGON', angkatan: 2026, kode_anggota: '367201100226001', nama: 'JIHAN NATASYA', kelamin: 'Wanita', status: 'Aktif', nama_unit: 'SMP Negeri 5 Kota Cilegon', jenis: 'MADYA' },
    { provinsi: 'BANTEN', kabupaten: 'KOTA CILEGON', angkatan: 2026, kode_anggota: '367202100126001', nama: 'KANAYA ALIVIA ZAHRA', kelamin: 'Wanita', status: 'Aktif', nama_unit: 'SMP Negeri 5 Kota Cilegon', jenis: 'MADYA' },
    { provinsi: 'BANTEN', kabupaten: 'KOTA CILEGON', angkatan: 2026, kode_anggota: '367201100126002', nama: 'NAJWA ADILLA SYAKIRA', kelamin: 'Wanita', status: 'Aktif', nama_unit: 'SMP Negeri 5 Kota Cilegon', jenis: 'MADYA' },
    { provinsi: 'BANTEN', kabupaten: 'KOTA CILEGON', angkatan: 2026, kode_anggota: '367201100126001', nama: 'NATTASHA APRILLY SUSANTO', kelamin: 'Wanita', status: 'Aktif', nama_unit: 'SMP Negeri 5 Kota Cilegon', jenis: 'MADYA' },
    { provinsi: 'BANTEN', kabupaten: 'KOTA CILEGON', angkatan: 2026, kode_anggota: '367206100326002', nama: 'KARINA VIDYA RAMADANI', kelamin: 'Wanita', status: 'Aktif', nama_unit: 'SMK Negeri 2 Kota Cilegon', jenis: 'WIRA' },
    { provinsi: 'BANTEN', kabupaten: 'KOTA CILEGON', angkatan: 2026, kode_anggota: '367206100326001', nama: 'KARINA VIDYA RAMADANI', kelamin: 'Wanita', status: 'Aktif', nama_unit: 'SMK Negeri 2 Kota Cilegon', jenis: 'WIRA' },
    { provinsi: 'BANTEN', kabupaten: 'KOTA CILEGON', angkatan: 2026, kode_anggota: '367205100326003', nama: 'ULIFIA IFANI RAMADHANTI', kelamin: 'Wanita', status: 'Aktif', nama_unit: 'SMK Negeri 2 Kota Cilegon', jenis: 'WIRA' },
    { provinsi: 'BANTEN', kabupaten: 'KOTA CILEGON', angkatan: 2026, kode_anggota: '367206100426003', nama: 'TALITHA AMIRA ARIANI', kelamin: 'Wanita', status: 'Aktif', nama_unit: 'SMK Negeri 2 Kota Cilegon', jenis: 'WIRA' },
    { provinsi: 'BANTEN', kabupaten: 'KOTA CILEGON', angkatan: 2026, kode_anggota: '367205100426001', nama: 'OLIVIAH PUTRI', kelamin: 'Wanita', status: 'Aktif', nama_unit: 'SMK Negeri 3 Kota Cilegon', jenis: 'WIRA' },
  ];

  const ksrMembers = [
    { provinsi: 'BANTEN', kabupaten: 'KOTA CILEGON', angkatan: 2024, kode_anggota: '36720510024023', nama: 'Zaenal Arifin', kelamin: 'Laki-laki', status: 'Aktif', kategori: 'Anggota', nama_unit: 'Politeknik Krakatau', jenis: 'KSR' },
    { provinsi: 'BANTEN', kabupaten: 'KOTA CILEGON', angkatan: 2024, kode_anggota: '36720810024041', nama: 'Cahya Suci Ramadona', kelamin: 'Perempuan', status: 'Aktif', kategori: 'Anggota', nama_unit: 'Politeknik Krakatau', jenis: 'KSR' },
    { provinsi: 'BANTEN', kabupaten: 'KOTA CILEGON', angkatan: 2024, kode_anggota: '36720610024042', nama: 'Mutia Nur Wahidah', kelamin: 'Perempuan', status: 'Aktif', kategori: 'Anggota', nama_unit: 'Politeknik Krakatau', jenis: 'KSR' },
    { provinsi: 'BANTEN', kabupaten: 'KOTA CILEGON', angkatan: 2024, kode_anggota: '36720610024043', nama: 'Uchtya Nufus', kelamin: 'Perempuan', status: 'Aktif', kategori: 'Anggota', nama_unit: 'Politeknik Krakatau', jenis: 'KSR' },
    { provinsi: 'BANTEN', kabupaten: 'KOTA CILEGON', angkatan: 2025, kode_anggota: '36040520024018', nama: 'Ragil Setia Permana', kelamin: 'Laki-laki', status: 'Aktif', kategori: 'Anggota', nama_unit: 'Politeknik Krakatau', jenis: 'KSR' },
    { provinsi: 'BANTEN', kabupaten: 'KOTA CILEGON', angkatan: 2024, kode_anggota: '36720210024004', nama: 'Mohamad Yudhi Syafiq', kelamin: 'Laki-laki', status: 'Aktif', kategori: 'Anggota', nama_unit: 'Politeknik Krakatau', jenis: 'KSR' },
    { provinsi: 'BANTEN', kabupaten: 'KOTA CILEGON', angkatan: 2025, kode_anggota: '36720810025001', nama: 'Wulan Ramdhani', kelamin: 'Perempuan', status: 'Aktif', kategori: 'Koordinator', nama_unit: 'Politeknik Krakatau', jenis: 'KSR' },
    { provinsi: 'BANTEN', kabupaten: 'KOTA CILEGON', angkatan: 2025, kode_anggota: '36043220025002', nama: 'Irma Ocktavianii', kelamin: 'Perempuan', status: 'Aktif', kategori: 'Anggota', nama_unit: 'Politeknik Krakatau', jenis: 'KSR' },
    { provinsi: 'BANTEN', kabupaten: 'KOTA CILEGON', angkatan: 2025, kode_anggota: '367201100125007', nama: 'Fikri Rosyaad', kelamin: 'Laki-laki', status: 'Aktif', kategori: 'Calon Anggota', nama_unit: 'Politeknik Krakatau', jenis: 'KSR' },
  ];

  for (const member of pmrMembers) {
    await prisma.anggotaPMR.upsert({
      where: { kode_anggota: member.kode_anggota },
      update: {},
      create: member,
    });
  }

  for (const member of ksrMembers) {
    await prisma.anggotaKSR.upsert({
      where: { kode_anggota: member.kode_anggota },
      update: {},
      create: member,
    });
  }

  console.log('Seed completed with', pmrMembers.length + ksrMembers.length, 'members and', pmrUnits.length + ksrUnits.length, 'units');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
