import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Populating Relawan table from all anggota sources...\n');

  try {
    const [pmr, ksr, tsr, dds] = await Promise.all([
      prisma.anggotaPMR.findMany(),
      prisma.anggotaKSR.findMany(),
      prisma.anggotaTSR.findMany(),
      prisma.anggotaDDS.findMany(),
    ]);

    const allMembers = [...pmr, ...ksr, ...tsr, ...dds];
    console.log(`Found ${allMembers.length} total members`);

    let created = 0;
    let skipped = 0;

    for (const member of allMembers) {
      try {
        await prisma.relawan.create({
          data: {
            provinsi: member.provinsi,
            kabupaten: member.kabupaten,
            angkatan: member.angkatan,
            kode_anggota: member.kode_anggota,
            nama: member.nama,
            kelamin: member.kelamin,
            status: member.status,
            nama_unit: member.nama_unit,
            jenis: member.jenis,
            kategori: member.kategori,
            jenis_identitas: member.jenis_identitas,
            no_nik: member.no_nik,
            tempat_lahir: member.tempat_lahir,
            tanggal_lahir: member.tanggal_lahir,
            agama: member.agama,
            golongan_darah: member.golongan_darah,
            email: member.email,
            no_hp: member.no_hp,
            alamat_ktp: member.alamat_ktp,
            ktp_provinsi: member.ktp_provinsi,
            ktp_kabupaten: member.ktp_kabupaten,
            ktp_kecamatan: member.ktp_kecamatan,
            ktp_desa: member.ktp_desa,
            dom_is_alamat_ktp: member.dom_is_alamat_ktp,
            dom_provinsi: member.dom_provinsi,
            dom_kabupaten: member.dom_kabupaten,
            dom_kecamatan: member.dom_kecamatan,
            dom_desa: member.dom_desa,
            alamat: member.alamat,
            rt: member.rt,
            rw: member.rw,
            kode_pos: member.kode_pos,
            no_telp: member.no_telp,
            dom_status_kepemilikan: member.dom_status_kepemilikan,
            dom_status_tinggal: member.dom_status_tinggal,
            dom_catatan: member.dom_catatan,
            id_provinsi: member.id_provinsi,
            id_kabupaten: member.id_kabupaten,
            id_kecamatan: member.id_kecamatan,
            id_desa: member.id_desa,
            id_alamat: member.id_alamat,
            id_rt: member.id_rt,
            id_rw: member.id_rw,
            id_kode_pos: member.id_kode_pos,
            id_status_kepemilikan: member.id_status_kepemilikan,
            foto: member.foto,
            kontak_darurat_nama: member.kontak_darurat_nama,
            kontak_darurat_hubungan: member.kontak_darurat_hubungan,
            kontak_darurat_hp: member.kontak_darurat_hp,
            kontak_darurat_alamat: member.kontak_darurat_alamat,
            riwayat_tahun_bergabung: member.riwayat_tahun_bergabung,
            riwayat_unit_asal: member.riwayat_unit_asal,
            riwayat_jabatan: member.riwayat_jabatan,
            riwayat_keterangan: member.riwayat_keterangan,
            pendidikan_tingkat: member.pendidikan_tingkat,
            pendidikan_institusi: member.pendidikan_institusi,
            pendidikan_jurusan: member.pendidikan_jurusan,
            pendidikan_tahun_lulus: member.pendidikan_tahun_lulus,
            pendidikan_ijazah: member.pendidikan_ijazah,
            diklat_nama: member.diklat_nama,
            diklat_penyelenggara: member.diklat_penyelenggara,
            diklat_tempat: member.diklat_tempat,
            diklat_tahun: member.diklat_tahun,
            diklat_sertifikat: member.diklat_sertifikat,
            sertifikasi_nama: member.sertifikasi_nama,
            sertifikasi_penerbit: member.sertifikasi_penerbit,
            sertifikasi_nomor: member.sertifikasi_nomor,
            sertifikasi_tahun: member.sertifikasi_tahun,
            sertifikasi_berlaku: member.sertifikasi_berlaku,
            keahlian: member.keahlian,
            keterampilan: member.keterampilan,
            keahlian_kategori: member.keahlian_kategori,
            organisasi_nama: member.organisasi_nama,
            organisasi_jabatan: member.organisasi_jabatan,
            organisasi_periode: member.organisasi_periode,
            organisasi_keterangan: member.organisasi_keterangan,
            penghargaan_nama: member.penghargaan_nama,
            penghargaan_pemberi: member.penghargaan_pemberi,
            penghargaan_tahun: member.penghargaan_tahun,
            penghargaan_keterangan: member.penghargaan_keterangan,
          },
        });
        created++;
      } catch (error: any) {
        if (error.code === 'P2002') {
          skipped++;
        } else {
          console.error(`Error creating relawan for ${member.kode_anggota}:`, error.message);
        }
      }
    }

    console.log(`\nCreated: ${created}`);
    console.log(`Skipped (duplicates): ${skipped}`);

    const count = await prisma.relawan.count();
    console.log(`Total relawan in database: ${count}`);
    console.log('\n=== Population Complete ===');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
