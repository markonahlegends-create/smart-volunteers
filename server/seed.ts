import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const pmrUnits = [
    { nama_unit: 'SDN CILEGON VII', tingkat: 'MULA', provinsi: 'Banten', kabupaten: 'Kota Cilegon', alamat: 'Jl. Sultan Agung No. 1', email: '', no_telpon: '', status: 'Aktif' },
    { nama_unit: 'SD Islam Al-Khairiyah', tingkat: 'MULA', provinsi: 'Banten', kabupaten: 'Kota Cilegon', alamat: 'Jl. KH. Hasyim Asyari No. 23', email: '', no_telpon: '', status: 'Aktif' },
    { nama_unit: 'SDN 1 Cibeber', tingkat: 'MULA', provinsi: 'Banten', kabupaten: 'Kota Cilegon', alamat: 'Jl. Raya Cibeber Km. 2', email: '', no_telpon: '', status: 'Aktif' },
    { nama_unit: 'SDN 2 Cibeber', tingkat: 'MULA', provinsi: 'Banten', kabupaten: 'Kota Cilegon', alamat: 'Jl. Raya Cibeber Km. 3', email: '', no_telpon: '', status: 'Aktif' },
    { nama_unit: 'SDN 3 Cibeber', tingkat: 'MULA', provinsi: 'Banten', kabupaten: 'Kota Cilegon', alamat: 'Jl. Raya Cibeber Km. 4', email: '', no_telpon: '', status: 'Aktif' },
    { nama_unit: 'SDN 4 Cibeber', tingkat: 'MULA', provinsi: 'Banten', kabupaten: 'Kota Cilegon', alamat: 'Jl. Raya Cibeber Km. 5', email: '', no_telpon: '', status: 'Aktif' },
    { nama_unit: 'SDN 5 Cibeber', tingkat: 'MULA', provinsi: 'Banten', kabupaten: 'Kota Cilegon', alamat: 'Jl. Raya Cibeber Km. 6', email: '', no_telpon: '', status: 'Aktif' },
  ];

  for (const unit of pmrUnits) {
    await prisma.unitPMR.create({ data: unit });
  }
  console.log('Unit PMR Mula seeded');

  const madyaUnits = [
    { nama_unit: 'SMP ISLAM DAARUL FALAH', tingkat: 'MADYA', provinsi: 'Banten', kabupaten: 'Kota Cilegon', alamat: 'Jl. Raya Cilegon Km. 5', email: '', no_telpon: '', status: 'Aktif' },
    { nama_unit: 'SMP NEGERI 1 CILEGON', tingkat: 'MADYA', provinsi: 'Banten', kabupaten: 'Kota Cilegon', alamat: 'Jl. Sultan Agung No. 10', email: '', no_telpon: '', status: 'Aktif' },
    { nama_unit: 'SMP NEGERI 2 CILEGON', tingkat: 'MADYA', provinsi: 'Banten', kabupaten: 'Kota Cilegon', alamat: 'Jl. KH. Hasyim Asyari No. 15', email: '', no_telpon: '', status: 'Aktif' },
    { nama_unit: 'SMP NEGERI 3 CILEGON', tingkat: 'MADYA', provinsi: 'Banten', kabupaten: 'Kota Cilegon', alamat: 'Jl. Raya Cibeber Km. 2', email: '', no_telpon: '', status: 'Aktif' },
    { nama_unit: 'SMP NEGERI 4 CILEGON', tingkat: 'MADYA', provinsi: 'Banten', kabupaten: 'Kota Cilegon', alamat: 'Jl. Raya Cibeber Km. 3', email: '', no_telpon: '', status: 'Aktif' },
  ];
  for (const unit of madyaUnits) {
    await prisma.unitPMR.create({ data: unit });
  }
  console.log('Unit PMR Madya seeded');

  const wiraUnits = [
    { nama_unit: 'SMK ISLAM DAARUL FALAH', tingkat: 'WIRA', provinsi: 'Banten', kabupaten: 'Kota Cilegon', alamat: 'Jl. Raya Cilegon Km. 5', email: '', no_telpon: '', status: 'Aktif' },
    { nama_unit: 'SMKN 1 Kota Cilegon', tingkat: 'WIRA', provinsi: 'Banten', kabupaten: 'Kota Cilegon', alamat: 'Jl. Sultan Agung No. 20', email: '', no_telpon: '', status: 'Aktif' },
    { nama_unit: 'SMKN 2 Kota Cilegon', tingkat: 'WIRA', provinsi: 'Banten', kabupaten: 'Kota Cilegon', alamat: 'Jl. KH. Hasyim Asyari No. 25', email: '', no_telpon: '', status: 'Aktif' },
    { nama_unit: 'SMKN 3 Kota Cilegon', tingkat: 'WIRA', provinsi: 'Banten', kabupaten: 'Kota Cilegon', alamat: 'Jl. Raya Cibeber Km. 4', email: '', no_telpon: '', status: 'Aktif' },
    { nama_unit: 'SMKN 4 Kota Cilegon', tingkat: 'WIRA', provinsi: 'Banten', kabupaten: 'Kota Cilegon', alamat: 'Jl. Raya Cibeber Km. 5', email: '', no_telpon: '', status: 'Aktif' },
  ];
  for (const unit of wiraUnits) {
    await prisma.unitPMR.create({ data: unit });
  }
  console.log('Unit PMR Wira seeded');

  const ksrUnit = {
    nama_unit: 'KSR PMI Kota Cilegon',
    jenis: 'KORPS SUKARELA',
    kategori: 'MARKAS',
    provinsi: 'Banten',
    kabupaten: 'Kota Cilegon',
    alamat: 'Jl. Belibis No. 1 Perumnas Cibeber Kencana, Cibebe',
    email: 'markas@pmicilegon.or.id',
    no_telpon: '62254394617',
    status: 'Aktif'
  };
  await prisma.unitKSR.create({ data: ksrUnit });
  console.log('Unit KSR seeded');

  const tsrUnit = {
    nama_unit: 'TSR PMI KOTA CILEGON',
    jenis: 'TENAGA SUKARELA',
    provinsi: 'Banten',
    kabupaten: 'Kota Cilegon',
    alamat: 'Jl. Belibis Raya Blok E21 No.1 Perumnas Cibeber',
    email: '',
    no_telpon: '0254394617',
    status: 'Aktif'
  };
  await prisma.unitTSR.create({ data: tsrUnit });
  console.log('Unit TSR seeded');

  const bencanaData = [
    { jenis_bencana: 'KEBAKARAN', nama_kejadian: 'Kebakaran di Kota Cilegon', tanggal_kejadian: '2026-08-15', level: 'KOTA', status: 'Tanggap darurat' },
    { jenis_bencana: 'KEKERINGAN', nama_kejadian: 'Kekeringan di Kota Cilegon', tanggal_kejadian: '2026-07-28', level: 'KOTA', status: 'Tanggap darurat' },
    { jenis_bencana: 'GEMPA BUMI', nama_kejadian: 'Gempa Bumi di NTT', tanggal_kejadian: '2026-08-15', level: 'PROVINSI', status: 'Tanggap darurat' },
    { jenis_bencana: 'KEKERINGAN', nama_kejadian: 'Kekeringan di Jawa Barat', tanggal_kejadian: '2026-07-24', level: 'PROVINSI', status: 'Tanggap darurat' },
    { jenis_bencana: 'KEKERINGAN', nama_kejadian: 'Kekeringan di DI Yogyakarta', tanggal_kejadian: '2026-08-01', level: 'PROVINSI', status: 'Tanggap darurat' },
  ];
  for (const bencana of bencanaData) {
    await prisma.bencana.create({ data: bencana });
  }
  console.log('Bencana seeded');

  const pmrAnggota = [
    { provinsi: 'Banten', kabupaten: 'Kota Cilegon', angkatan: 2026, kode_anggota: 'PMR001', nama: 'ANINDI FEBRIYANTI', kelamin: 'P', status: 'Aktif', kategori: 'Anggota', nama_unit: 'SDN CILEGON VII', jenis: 'PMR', jenis_identitas: 'KTP', no_nik: '3275012345678901', tempat_lahir: 'Cilegon', tanggal_lahir: '2005-01-15', agama: 'Islam', golongan_darah: 'O', email: 'anindi@example.com', no_hp: '081234567890', alamat_ktp: 'Jl. Sultan Agung No. 1', ktp_provinsi: 'Banten', ktp_kabupaten: 'Kota Cilegon', ktp_kecamatan: 'Cilegon', ktp_desa: 'Cilegon', dom_is_alamat_ktp: true, dom_provinsi: 'Banten', dom_kabupaten: 'Kota Cilegon', dom_kecamatan: 'Cilegon', dom_desa: 'Cilegon', alamat: 'Jl. Sultan Agung No. 1', rt: '01', rw: '02', kode_pos: '42400', no_telp: '081234567890', dom_status_kepemilikan: 'Milik Sendiri', dom_status_tinggal: 'Tetap', dom_catatan: '', id_provinsi: '01', id_kabupaten: '01', id_kecamatan: '01', id_desa: '01', id_alamat: '01', id_rt: '01', id_rw: '02', id_kode_pos: '42400', id_status_kepemilikan: '1', foto: '', kontak_darurat_nama: 'Orang Tua', kontak_darurat_hubungan: 'Ayah', kontak_darurat_hp: '081234567891', kontak_darurat_alamat: 'Jl. Sultan Agung No. 1', riwayat_tahun_bergabung: '2020', riwayat_unit_asal: 'SDN CILEGON VII', riwayat_jabatan: 'Anggota', riwayat_keterangan: '', pendidikan_tingkat: 'SMA', pendidikan_institusi: 'SMA Negeri 1 Cilegon', pendidikan_jurusan: 'IPA', pendidikan_tahun_lulus: '2023', pendidikan_ijazah: '', diklat_nama: '', diklat_penyelenggara: '', diklat_tempat: '', diklat_tahun: '', diklat_sertifikat: '', sertifikasi_nama: '', sertifikasi_penerbit: '', sertifikasi_nomor: '', sertifikasi_tahun: '', sertifikasi_berlaku: '', keahlian: '', keterampilan: '', keahlian_kategori: '', organisasi_nama: '', organisasi_jabatan: '', organisasi_periode: '', organisasi_keterangan: '', penghargaan_nama: '', penghargaan_pemberi: '', penghargaan_tahun: '', penghargaan_keterangan: '' },
    { provinsi: 'Banten', kabupaten: 'Kota Cilegon', angkatan: 2026, kode_anggota: 'PMR002', nama: 'JIHAN NATASYA', kelamin: 'P', status: 'Aktif', kategori: 'Anggota', nama_unit: 'SD Islam Al-Khairiyah', jenis: 'PMR', jenis_identitas: 'KTP', no_nik: '3275012345678902', tempat_lahir: 'Cilegon', tanggal_lahir: '2006-03-20', agama: 'Islam', golongan_darah: 'A', email: 'jihan@example.com', no_hp: '081234567892', alamat_ktp: 'Jl. KH. Hasyim Asyari No. 23', ktp_provinsi: 'Banten', ktp_kabupaten: 'Kota Cilegon', ktp_kecamatan: 'Cilegon', ktp_desa: 'Cilegon', dom_is_alamat_ktp: true, dom_provinsi: 'Banten', dom_kabupaten: 'Kota Cilegon', dom_kecamatan: 'Cilegon', dom_desa: 'Cilegon', alamat: 'Jl. KH. Hasyim Asyari No. 23', rt: '02', rw: '03', kode_pos: '42401', no_telp: '081234567892', dom_status_kepemilikan: 'Milik Sendiri', dom_status_tinggal: 'Tetap', dom_catatan: '', id_provinsi: '01', id_kabupaten: '01', id_kecamatan: '01', id_desa: '01', id_alamat: '01', id_rt: '02', id_rw: '03', id_kode_pos: '42401', id_status_kepemilikan: '1', foto: '', kontak_darurat_nama: 'Orang Tua', kontak_darurat_hubungan: 'Ibu', kontak_darurat_hp: '081234567893', kontak_darurat_alamat: 'Jl. KH. Hasyim Asyari No. 23', riwayat_tahun_bergabung: '2021', riwayat_unit_asal: 'SD Islam Al-Khairiyah', riwayat_jabatan: 'Anggota', riwayat_keterangan: '', pendidikan_tingkat: 'SMA', pendidikan_institusi: 'SMA Negeri 2 Cilegon', pendidikan_jurusan: 'IPS', pendidikan_tahun_lulus: '2024', pendidikan_ijazah: '', diklat_nama: '', diklat_penyelenggara: '', diklat_tempat: '', diklat_tahun: '', diklat_sertifikat: '', sertifikasi_nama: '', sertifikasi_penerbit: '', sertifikasi_nomor: '', sertifikasi_tahun: '', sertifikasi_berlaku: '', keahlian: '', keterampilan: '', keahlian_kategori: '', organisasi_nama: '', organisasi_jabatan: '', organisasi_periode: '', organisasi_keterangan: '', penghargaan_nama: '', penghargaan_pemberi: '', penghargaan_tahun: '', penghargaan_keterangan: '' },
    { provinsi: 'Banten', kabupaten: 'Kota Cilegon', angkatan: 2026, kode_anggota: 'PMR003', nama: 'KANAYA ALIVIA ZAHRA', kelamin: 'P', status: 'Aktif', kategori: 'Anggota', nama_unit: 'SDN 1 Cibeber', jenis: 'PMR', jenis_identitas: 'KTP', no_nik: '3275012345678903', tempat_lahir: 'Cilegon', tanggal_lahir: '2007-05-10', agama: 'Islam', golongan_darah: 'B', email: 'kanaya@example.com', no_hp: '081234567894', alamat_ktp: 'Jl. Raya Cibeber Km. 2', ktp_provinsi: 'Banten', ktp_kabupaten: 'Kota Cilegon', ktp_kecamatan: 'Cibeber', ktp_desa: 'Cibeber', dom_is_alamat_ktp: true, dom_provinsi: 'Banten', dom_kabupaten: 'Kota Cilegon', dom_kecamatan: 'Cibeber', dom_desa: 'Cibeber', alamat: 'Jl. Raya Cibeber Km. 2', rt: '03', rw: '04', kode_pos: '42402', no_telp: '081234567894', dom_status_kepemilikan: 'Milik Sendiri', dom_status_tinggal: 'Tetap', dom_catatan: '', id_provinsi: '01', id_kabupaten: '01', id_kecamatan: '02', id_desa: '01', id_alamat: '01', id_rt: '03', id_rw: '04', id_kode_pos: '42402', id_status_kepemilikan: '1', foto: '', kontak_darurat_nama: 'Orang Tua', kontak_darurat_hubungan: 'Ayah', kontak_darurat_hp: '081234567895', kontak_darurat_alamat: 'Jl. Raya Cibeber Km. 2', riwayat_tahun_bergabung: '2022', riwayat_unit_asal: 'SDN 1 Cibeber', riwayat_jabatan: 'Anggota', riwayat_keterangan: '', pendidikan_tingkat: 'SMP', pendidikan_institusi: 'SMP Negeri 1 Cilegon', pendidikan_jurusan: '', pendidikan_tahun_lulus: '2024', pendidikan_ijazah: '', diklat_nama: '', diklat_penyelenggara: '', diklat_tempat: '', diklat_tahun: '', diklat_sertifikat: '', sertifikasi_nama: '', sertifikasi_penerbit: '', sertifikasi_nomor: '', sertifikasi_tahun: '', sertifikasi_berlaku: '', keahlian: '', keterampilan: '', keahlian_kategori: '', organisasi_nama: '', organisasi_jabatan: '', organisasi_periode: '', organisasi_keterangan: '', penghargaan_nama: '', penghargaan_pemberi: '', penghargaan_tahun: '', penghargaan_keterangan: '' },
  ];
  for (const anggota of pmrAnggota) {
    await prisma.anggotaPMR.create({ data: anggota });
  }
  console.log('Anggota PMR seeded');

  const ksrAnggota = [
    { provinsi: 'Banten', kabupaten: 'Kota Cilegon', angkatan: 2026, kode_anggota: 'KSR001', nama: 'MUTIARA AKBAR', kelamin: 'P', status: 'Aktif', kategori: 'Anggota', nama_unit: 'KSR PMI Kota Cilegon', jenis: 'KSR', jenis_identitas: 'KTP', no_nik: '3275012345678904', tempat_lahir: 'Cilegon', tanggal_lahir: '1995-08-12', agama: 'Islam', golongan_darah: 'AB', email: 'mutiara@example.com', no_hp: '081234567896', alamat_ktp: 'Jl. Belibis No. 1', ktp_provinsi: 'Banten', ktp_kabupaten: 'Kota Cilegon', ktp_kecamatan: 'Cibebe', ktp_desa: 'Cibebe', dom_is_alamat_ktp: true, dom_provinsi: 'Banten', dom_kabupaten: 'Kota Cilegon', dom_kecamatan: 'Cibebe', dom_desa: 'Cibebe', alamat: 'Jl. Belibis No. 1', rt: '01', rw: '01', kode_pos: '42403', no_telp: '081234567896', dom_status_kepemilikan: 'Milik Sendiri', dom_status_tinggal: 'Tetap', dom_catatan: '', id_provinsi: '01', id_kabupaten: '01', id_kecamatan: '03', id_desa: '01', id_alamat: '01', id_rt: '01', id_rw: '01', id_kode_pos: '42403', id_status_kepemilikan: '1', foto: '', kontak_darurat_nama: 'Keluarga', kontak_darurat_hubungan: 'Suami', kontak_darurat_hp: '081234567897', kontak_darurat_alamat: 'Jl. Belibis No. 1', riwayat_tahun_bergabung: '2018', riwayat_unit_asal: 'KSR PMI Kota Cilegon', riwayat_jabatan: 'Anggota', riwayat_keterangan: '', pendidikan_tingkat: 'S1', pendidikan_institusi: 'Universitas Banten', pendidikan_jurusan: 'Keperawatan', pendidikan_tahun_lulus: '2018', pendidikan_ijazah: '', diklat_nama: '', diklat_penyelenggara: '', diklat_tempat: '', diklat_tahun: '', diklat_sertifikat: '', sertifikasi_nama: '', sertifikasi_penerbit: '', sertifikasi_nomor: '', sertifikasi_tahun: '', sertifikasi_berlaku: '', keahlian: '', keterampilan: '', keahlian_kategori: '', organisasi_nama: '', organisasi_jabatan: '', organisasi_periode: '', organisasi_keterangan: '', penghargaan_nama: '', penghargaan_pemberi: '', penghargaan_tahun: '', penghargaan_keterangan: '' },
    { provinsi: 'Banten', kabupaten: 'Kota Cilegon', angkatan: 2026, kode_anggota: 'KSR002', nama: 'FEBI ANGGRAENI', kelamin: 'P', status: 'Aktif', kategori: 'Anggota', nama_unit: 'Politeknik Krakatau', jenis: 'KSR', jenis_identitas: 'KTP', no_nik: '3275012345678905', tempat_lahir: 'Cilegon', tanggal_lahir: '1998-12-05', agama: 'Islam', golongan_darah: 'O', email: 'febi@example.com', no_hp: '081234567898', alamat_ktp: 'Jl. Krakatau No. 10', ktp_provinsi: 'Banten', ktp_kabupaten: 'Kota Cilegon', ktp_kecamatan: 'Ciwandang', ktp_desa: 'Ciwandang', dom_is_alamat_ktp: true, dom_provinsi: 'Banten', dom_kabupaten: 'Kota Cilegon', dom_kecamatan: 'Ciwandang', dom_desa: 'Ciwandang', alamat: 'Jl. Krakatau No. 10', rt: '02', rw: '05', kode_pos: '42404', no_telp: '081234567898', dom_status_kepemilikan: 'Milik Sendiri', dom_status_tinggal: 'Tetap', dom_catatan: '', id_provinsi: '01', id_kabupaten: '01', id_kecamatan: '04', id_desa: '01', id_alamat: '01', id_rt: '02', id_rw: '05', id_kode_pos: '42404', id_status_kepemilikan: '1', foto: '', kontak_darurat_nama: 'Keluarga', kontak_darurat_hubungan: 'Ibu', kontak_darurat_hp: '081234567899', kontak_darurat_alamat: 'Jl. Krakatau No. 10', riwayat_tahun_bergabung: '2019', riwayat_unit_asal: 'Politeknik Krakatau', riwayat_jabatan: 'Anggota', riwayat_keterangan: '', pendidikan_tingkat: 'D3', pendidikan_institusi: 'Politeknik Krakatau', pendidikan_jurusan: 'Teknik Mesin', pendidikan_tahun_lulus: '2020', pendidikan_ijazah: '', diklat_nama: '', diklat_penyelenggara: '', diklat_tempat: '', diklat_tahun: '', diklat_sertifikat: '', sertifikasi_nama: '', sertifikasi_penerbit: '', sertifikasi_nomor: '', sertifikasi_tahun: '', sertifikasi_berlaku: '', keahlian: '', keterampilan: '', keahlian_kategori: '', organisasi_nama: '', organisasi_jabatan: '', organisasi_periode: '', organisasi_keterangan: '', penghargaan_nama: '', penghargaan_pemberi: '', penghargaan_tahun: '', penghargaan_keterangan: '' },
  ];
  for (const anggota of ksrAnggota) {
    await prisma.anggotaKSR.create({ data: anggota });
  }
  console.log('Anggota KSR seeded');

  const tsrAnggota = [
    { provinsi: 'Banten', kabupaten: 'Kota Cilegon', angkatan: 2026, kode_anggota: 'TSR001', nama: 'SUPRIHATIN', kelamin: 'P', status: 'Aktif', kategori: 'Anggota', nama_unit: 'TSR PMI KOTA CILEGON', jenis: 'TSR', jenis_identitas: 'KTP', no_nik: '3275012345678906', tempat_lahir: 'Cilegon', tanggal_lahir: '1990-06-18', agama: 'Islam', golongan_darah: 'A', email: 'suprihatin@example.com', no_hp: '081234567900', alamat_ktp: 'Jl. Belibis Raya Blok E21 No.1', ktp_provinsi: 'Banten', ktp_kabupaten: 'Kota Cilegon', ktp_kecamatan: 'Cibebe', ktp_desa: 'Cibebe', dom_is_alamat_ktp: true, dom_provinsi: 'Banten', dom_kabupaten: 'Kota Cilegon', dom_kecamatan: 'Cibebe', dom_desa: 'Cibebe', alamat: 'Jl. Belibis Raya Blok E21 No.1', rt: '01', rw: '02', kode_pos: '42405', no_telp: '081234567900', dom_status_kepemilikan: 'Milik Sendiri', dom_status_tinggal: 'Tetap', dom_catatan: '', id_provinsi: '01', id_kabupaten: '01', id_kecamatan: '03', id_desa: '02', id_alamat: '01', id_rt: '01', id_rw: '02', id_kode_pos: '42405', id_status_kepemilikan: '1', foto: '', kontak_darurat_nama: 'Keluarga', kontak_darurat_hubungan: 'Suami', kontak_darurat_hp: '081234567901', kontak_darurat_alamat: 'Jl. Belibis Raya Blok E21 No.1', riwayat_tahun_bergabung: '2015', riwayat_unit_asal: 'TSR PMI KOTA CILEGON', riwayat_jabatan: 'Anggota', riwayat_keterangan: '', pendidikan_tingkat: 'S1', pendidikan_institusi: 'Universitas Banten', pendidikan_jurusan: 'Keperawatan', pendidikan_tahun_lulus: '2012', pendidikan_ijazah: '', diklat_nama: '', diklat_penyelenggara: '', diklat_tempat: '', diklat_tahun: '', diklat_sertifikat: '', sertifikasi_nama: '', sertifikasi_penerbit: '', sertifikasi_nomor: '', sertifikasi_tahun: '', sertifikasi_berlaku: '', keahlian: '', keterampilan: '', keahlian_kategori: '', organisasi_nama: '', organisasi_jabatan: '', organisasi_periode: '', organisasi_keterangan: '', penghargaan_nama: '', penghargaan_pemberi: '', penghargaan_tahun: '', penghargaan_keterangan: '' },
    { provinsi: 'Banten', kabupaten: 'Kota Cilegon', angkatan: 2026, kode_anggota: 'TSR002', nama: 'AFINA AGHNIYA HASYA', kelamin: 'P', status: 'Aktif', kategori: 'Anggota', nama_unit: 'TSR PMI KOTA CILEGON', jenis: 'TSR', jenis_identitas: 'KTP', no_nik: '3275012345678907', tempat_lahir: 'Cilegon', tanggal_lahir: '1992-09-25', agama: 'Islam', golongan_darah: 'O', email: 'afina@example.com', no_hp: '081234567902', alamat_ktp: 'Jl. Belibis Raya Blok E21 No.1', ktp_provinsi: 'Banten', ktp_kabupaten: 'Kota Cilegon', ktp_kecamatan: 'Cibebe', ktp_desa: 'Cibebe', dom_is_alamat_ktp: true, dom_provinsi: 'Banten', dom_kabupaten: 'Kota Cilegon', dom_kecamatan: 'Cibebe', dom_desa: 'Cibebe', alamat: 'Jl. Belibis Raya Blok E21 No.1', rt: '02', rw: '03', kode_pos: '42406', no_telp: '081234567902', dom_status_kepemilikan: 'Milik Sendiri', dom_status_tinggal: 'Tetap', dom_catatan: '', id_provinsi: '01', id_kabupaten: '01', id_kecamatan: '03', id_desa: '02', id_alamat: '01', id_rt: '02', id_rw: '03', id_kode_pos: '42406', id_status_kepemilikan: '1', foto: '', kontak_darurat_nama: 'Keluarga', kontak_darurat_hubungan: 'Ibu', kontak_darurat_hp: '081234567903', kontak_darurat_alamat: 'Jl. Belibis Raya Blok E21 No.1', riwayat_tahun_bergabung: '2016', riwayat_unit_asal: 'TSR PMI KOTA CILEGON', riwayat_jabatan: 'Anggota', riwayat_keterangan: '', pendidikan_tingkat: 'S1', pendidikan_institusi: 'Universitas Banten', pendidikan_jurusan: 'Kesehatan Masyarakat', pendidikan_tahun_lulus: '2014', pendidikan_ijazah: '', diklat_nama: '', diklat_penyelenggara: '', diklat_tempat: '', diklat_tahun: '', diklat_sertifikat: '', sertifikasi_nama: '', sertifikasi_penerbit: '', sertifikasi_nomor: '', sertifikasi_tahun: '', sertifikasi_berlaku: '', keahlian: '', keterampilan: '', keahlian_kategori: '', organisasi_nama: '', organisasi_jabatan: '', organisasi_periode: '', organisasi_keterangan: '', penghargaan_nama: '', penghargaan_pemberi: '', penghargaan_tahun: '', penghargaan_keterangan: '' },
  ];
  for (const anggota of tsrAnggota) {
    await prisma.anggotaTSR.create({ data: anggota });
  }
  console.log('Anggota TSR seeded');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
