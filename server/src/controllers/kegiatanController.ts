import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType } from 'docx';
import ExcelJS from 'exceljs';
import { downloadTemplateFromDrive } from '../services/googleDrive';
import { createReport } from 'docx-templates';
import { triggerKegiatanSync } from '../services/syncTriggers';

const prisma = new PrismaClient();

export const getKegiatan = async (req: Request, res: Response) => {
  try {
    const { semester, tahun, bidang, page, limit } = req.query;
    const where: any = {};
    if (semester) where.semester = parseInt(semester as string);
    if (tahun) where.tahun = parseInt(tahun as string);
    if (bidang) where.bidang = bidang;

    const hasPagination = page !== undefined || limit !== undefined;
    const limitNum = hasPagination ? (Number(limit) || 10) : undefined;
    const skip = hasPagination && page ? (Number(page) - 1) * (limitNum as number) : undefined;

    const [kegiatan, total] = await Promise.all([
      prisma.kegiatan.findMany({
        where,
        skip,
        take: limitNum as any,
        orderBy: [{ bulan: 'asc' }, { id: 'asc' }],
      }),
      prisma.kegiatan.count({ where }),
    ]);

    res.json({
      data: kegiatan,
      total,
      page: hasPagination ? Number(page) : 1,
      limit: limitNum,
      totalPages: hasPagination ? Math.ceil(total / (limitNum as number)) : 1,
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memuat data kegiatan' });
  }
};

export const createKegiatan = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const kegiatan = await prisma.kegiatan.create({
      data,
    });
    res.json(kegiatan);
    triggerKegiatanSync().catch(console.error);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat kegiatan' });
  }
};

export const updateKegiatan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const kegiatan = await prisma.kegiatan.update({
      where: { id: parseInt(id) },
      data,
    });
    res.json(kegiatan);
    triggerKegiatanSync().catch(console.error);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui kegiatan' });
  }
};

export const deleteKegiatan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.kegiatan.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Data berhasil dihapus' });
    triggerKegiatanSync().catch(console.error);
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus kegiatan' });
  }
};

export const downloadSemesterReport = async (req: Request, res: Response) => {
  try {
    const { semester = '1', tahun = '2026' } = req.body;
    const semesterNum = parseInt(semester);
    const tahunNum = parseInt(tahun);

    const pmrMulaL = await prisma.anggotaPMR.count({ where: { kategori: 'MULA', kelamin: 'Laki-laki' } });
    const pmrMulaP = await prisma.anggotaPMR.count({ where: { kategori: 'MULA', kelamin: 'Wanita' } });
    const pmrMadyaL = await prisma.anggotaPMR.count({ where: { kategori: 'MADYA', kelamin: 'Laki-laki' } });
    const pmrMadyaP = await prisma.anggotaPMR.count({ where: { kategori: 'MADYA', kelamin: 'Wanita' } });
    const pmrWiraL = await prisma.anggotaPMR.count({ where: { kategori: 'WIRA', kelamin: 'Laki-laki' } });
    const pmrWiraP = await prisma.anggotaPMR.count({ where: { kategori: 'WIRA', kelamin: 'Wanita' } });
    const ksrTsrL = await prisma.anggotaKSR.count({ where: { kelamin: 'Laki-laki' } });
    const ksrTsrP = await prisma.anggotaKSR.count({ where: { kelamin: 'Wanita' } });
    const ddsL = await prisma.anggotaDDS.count({ where: { kelamin: 'Laki-laki' } });
    const ddsP = await prisma.anggotaDDS.count({ where: { kelamin: 'Wanita' } });
    const stafL = await prisma.anggotaKSR.count({ where: { kategori: { not: 'Anggota' } } });
    const stafP = await prisma.anggotaKSR.count({ where: { kategori: { not: 'Anggota' } } });
    const penerimaIndividu = await prisma.kegiatan.aggregate({ _sum: { penerima_laki: true, penerima_perempuan: true, penerima_kk: true } });
    const penerimaKK = await prisma.kegiatan.aggregate({ _sum: { penerima_kk: true } });
    const pelayananKesehatan = await prisma.kegiatan.aggregate({ _sum: { penerima_laki: true, penerima_perempuan: true } });
    const pelayananSosial = await prisma.kegiatan.aggregate({ _sum: { penerima_laki: true, penerima_perempuan: true } });
    const pemberdayaanMasyarakat = await prisma.kegiatan.aggregate({ _sum: { penerima_laki: true, penerima_perempuan: true } });
    const jumlahPmiKecamatan = await prisma.unitKSR.count();

    const data = {
      nomor_surat: req.body.nomor_surat || '',
      lampiran_surat: req.body.lampiran_surat || '',
      perihal_surat: req.body.perihal_surat || `Laporan Semester ${semesterNum} Tahun ${tahunNum}`,
      tujuan_surat: req.body.tujuan_surat || '\n\t\tPengurus PMI Provinsi Banten, di Bandung',
      semester_romawi: semesterNum === 1 ? 'I' : 'II',
      text_semester: semesterNum === 1 ? 'Januari - Juni' : 'Juli - Desember',
      tahun: tahunNum,
      pmr_mula_l: pmrMulaL,
      pmr_mula_p: pmrMulaP,
      pmr_mula_total: pmrMulaL + pmrMulaP,
      pmr_madya_l: pmrMadyaL,
      pmr_madya_p: pmrMadyaP,
      pmr_madya_total: pmrMadyaL + pmrMadyaP,
      pmr_wira_l: pmrWiraL,
      pmr_wira_p: pmrWiraP,
      pmr_wira_total: pmrWiraL + pmrWiraP,
      ksr_tsr_l: ksrTsrL,
      ksr_tsr_p: ksrTsrP,
      ksr_tsr_total: ksrTsrL + ksrTsrP,
      dds_l: ddsL,
      dds_p: ddsP,
      dds_total: ddsL + ddsP,
      staf_l: stafL,
      staff_p: stafP,
      staf_total: stafL + stafP,
      penerima_manfaat_individu_l: (penerimaIndividu as any)?._sum?.penerima_laki || 0,
      penerima_manfaat_individu_p: (penerimaIndividu as any)?._sum?.penerima_perempuan || 0,
      penerima_manfaat_individu_total: ((penerimaIndividu as any)?._sum?.penerima_laki || 0) + ((penerimaIndividu as any)?._sum?.penerima_perempuan || 0),
      penerima_manfaat_kk_total: (penerimaKK as any)?._sum?.penerima_kk || 0,
      pelayanan_kesehatan_l: (pelayananKesehatan as any)?._sum?.penerima_laki || 0,
      pelayanan_kesehatan_p: (pelayananKesehatan as any)?._sum?.penerima_perempuan || 0,
      pelayanan_kesehatan_total: ((pelayananKesehatan as any)?._sum?.penerima_laki || 0) + ((pelayananKesehatan as any)?._sum?.penerima_perempuan || 0),
      pelayanan_sosial_l: (pelayananSosial as any)?._sum?.penerima_laki || 0,
      pelayanan_sosial_p: (pelayananSosial as any)?._sum?.penerima_perempuan || 0,
      pelayanan_sosial_total: ((pelayananSosial as any)?._sum?.penerima_laki || 0) + ((pelayananSosial as any)?._sum?.penerima_perempuan || 0),
      pemberdayaan_masyarakat_l: (pemberdayaanMasyarakat as any)?._sum?.penerima_laki || 0,
      pemberdayaan_masyarakat_p: (pemberdayaanMasyarakat as any)?._sum?.penerima_perempuan || 0,
      pemberdayaan_masyarakat_total: ((pemberdayaanMasyarakat as any)?._sum?.penerima_laki || 0) + ((pemberdayaanMasyarakat as any)?._sum?.penerima_perempuan || 0),
      total_dana_diperoleh: 0,
      total_dana_dibelanjakan: 0,
      jumlah_pmi_kecamatan: jumlahPmiKecamatan,
    };

    const templateBuffer = await downloadTemplateFromDrive('template_laporan_semester.docx');
    const template = await createReport({ template: templateBuffer, data });
    const filledBuffer = await Packer.toBuffer(template as any);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=Laporan-Semester-${semesterNum}-${tahunNum}.docx`);
    res.send(filledBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal generate laporan semester' });
  }
};

export const downloadKegiatanReport = async (req: Request, res: Response) => {
  try {
    const { semester, tahun, bidang } = req.query;
    const where: any = {};
    if (semester) where.semester = parseInt(semester as string);
    if (tahun) where.tahun = parseInt(tahun as string);
    if (bidang) where.bidang = bidang;

    const kegiatan = await prisma.kegiatan.findMany({
      where,
      orderBy: [{ bidang: 'asc' }, { bulan: 'asc' }, { id: 'asc' }],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan Kegiatan');

    worksheet.columns = [
      { header: 'NO', key: 'no', width: 8 },
      { header: 'TGL,BLN,TH', key: 'tanggal', width: 20 },
      { header: 'KEGIATAN', key: 'kegiatan', width: 50 },
      { header: 'TEMPAT', key: 'tempat', width: 40 },
      { header: 'KSR', key: 'ksr', width: 10 },
      { header: 'TSR', key: 'tsr', width: 10 },
      { header: 'PENGURUS', key: 'pengurus', width: 12 },
      { header: 'STAF', key: 'staf', width: 10 },
      { header: 'PMR', key: 'pmr', width: 10 },
      { header: 'L', key: 'l', width: 8 },
      { header: 'P', key: 'p', width: 8 },
      { header: 'KK', key: 'kk', width: 8 },
      { header: 'JIWA', key: 'jiwa', width: 10 },
      { header: 'KETERANGAN', key: 'keterangan', width: 50 },
      { header: 'ANGGARAN', key: 'anggaran', width: 20 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { horizontal: 'center' };

    const bulanOrder = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const grouped = kegiatan.reduce((acc: any, k) => {
      if (!acc[k.bidang]) acc[k.bidang] = {};
      if (!acc[k.bidang][k.bulan]) acc[k.bidang][k.bulan] = [];
      acc[k.bidang][k.bulan].push(k);
      return acc;
    }, {});

    let globalRow = 2;
    const bidangNames = Object.keys(grouped);

    for (const bidangName of bidangNames) {
      const bidangRow = worksheet.getRow(globalRow);
      bidangRow.getCell(1).value = bidangName;
      bidangRow.getCell(1).font = { bold: true };
      bidangRow.getCell(2).value = `Tahun ${tahun || '2026'}   PMI Kota Cilegon`;
      bidangRow.getCell(2).font = { bold: true };
      globalRow++;

      const headerRow = worksheet.getRow(globalRow);
      headerRow.values = ['NO', 'TGL,BLN,TH', 'KEGIATAN', 'TEMPAT', 'KSR', 'TSR', 'PENGURUS', 'STAF', 'PMR', 'L', 'P', 'KK', 'JIWA', 'KETERANGAN', 'ANGGARAN'];
      headerRow.font = { bold: true };
      globalRow++;

      const bulanList = Object.keys(grouped[bidangName]).sort((a, b) => bulanOrder.indexOf(a) - bulanOrder.indexOf(b));

      for (const bulan of bulanList) {
        const bulanRow = worksheet.getRow(globalRow);
        bulanRow.getCell(2).value = bulan;
        bulanRow.getCell(2).font = { bold: true };
        globalRow++;

        const items = grouped[bidangName][bulan];
        items.forEach((k: any, idx: number) => {
          const row = worksheet.getRow(globalRow);
          row.values = [
            idx + 1,
            k.tanggal_kejadian,
            k.nama_kegiatan,
            k.tempat,
            k.ks_count,
            k.tsr_count,
            k.pengurus_count,
            k.staf_count,
            k.pmr_count,
            k.penerima_laki,
            k.penerima_perempuan,
            k.penerima_kk,
            k.penerima_jiwa,
            k.keterangan || '',
            k.anggaran || '',
          ];
          globalRow++;
        });

        const subtotalRow = worksheet.getRow(globalRow);
        subtotalRow.getCell(2).value = `JUMLAH ANGGARAN BULAN ${bulan.toUpperCase()}`;
        subtotalRow.getCell(2).font = { bold: true };
        const sumKs = items.reduce((a: number, b: any) => a + (b.ks_count || 0), 0);
        const sumTsr = items.reduce((a: number, b: any) => a + (b.tsr_count || 0), 0);
        const sumPengurus = items.reduce((a: number, b: any) => a + (b.pengurus_count || 0), 0);
        const sumStaf = items.reduce((a: number, b: any) => a + (b.staf_count || 0), 0);
        const sumPmr = items.reduce((a: number, b: any) => a + (b.pmr_count || 0), 0);
        const sumL = items.reduce((a: number, b: any) => a + (b.penerima_laki || 0), 0);
        const sumP = items.reduce((a: number, b: any) => a + (b.penerima_perempuan || 0), 0);
        const sumKk = items.reduce((a: number, b: any) => a + (b.penerima_kk || 0), 0);
        const sumJiwa = items.reduce((a: number, b: any) => a + (b.penerima_jiwa || 0), 0);
        subtotalRow.getCell(5).value = sumKs;
        subtotalRow.getCell(6).value = sumTsr;
        subtotalRow.getCell(7).value = sumPengurus;
        subtotalRow.getCell(8).value = sumStaf;
        subtotalRow.getCell(9).value = sumPmr;
        subtotalRow.getCell(10).value = sumL;
        subtotalRow.getCell(11).value = sumP;
        subtotalRow.getCell(12).value = sumKk;
        subtotalRow.getCell(13).value = sumJiwa;
        globalRow++;
      }

      globalRow++;
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Laporan-Kegiatan-Semester-${semester || '1'}-${tahun || '2026'}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal generate laporan kegiatan' });
  }
};
