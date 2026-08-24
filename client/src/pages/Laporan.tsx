import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Download, Plus, Search, FileText, FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import { kegiatanApi } from '../services/resources';

interface KegiatanItem {
  id: number;
  tanggal_kejadian: string;
  nama_kegiatan: string;
  tempat: string;
  bidang: string;
  bulan: string;
  semester: number;
  tahun: number;
  ks_count: number;
  tsr_count: number;
  pengurus_count: number;
  staf_count: number;
  pmr_count: number;
  penerima_laki: number;
  penerima_perempuan: number;
  penerima_kk: number;
  penerima_jiwa: number;
  keterangan: string;
  anggaran: string;
}

export default function Laporan() {
  const queryClient = useQueryClient();
  const [semester, setSemester] = useState('1');
  const [tahun, setTahun] = useState('2026');
  const [bidang, setBidang] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKegiatan, setEditingKegiatan] = useState<KegiatanItem | null>(null);
  const [search, setSearch] = useState('');

  const { data: kegiatanData } = useQuery({
    queryKey: ['kegiatan', semester, tahun, bidang],
    queryFn: () => kegiatanApi.get({ semester, tahun, bidang }),
  });

  const kegiatanList = kegiatanData?.data?.filter((kegiatan: any, index: number, self: any[]) =>
    index === self.findIndex((k) => k.id === kegiatan.id)
  ) || [];

  const createMutation = useMutation({
    mutationFn: (data: any) => kegiatanApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kegiatan'] });
      setIsModalOpen(false);
      setEditingKegiatan(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => kegiatanApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kegiatan'] });
      setIsModalOpen(false);
      setEditingKegiatan(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => kegiatanApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kegiatan'] });
    },
  });

  const handleDownloadSemester = async () => {
    const blob = await kegiatanApi.downloadSemester(parseInt(semester), parseInt(tahun));
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan-Semester-${semester}-${tahun}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadKegiatan = async () => {
    const blob = await kegiatanApi.downloadKegiatan(parseInt(semester), parseInt(tahun), bidang || undefined);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan-Kegiatan-Semester-${semester}-${tahun}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    const parsedData = {
      ...data,
      semester: parseInt(semester),
      tahun: parseInt(tahun),
      ks_count: parseInt(data.ks_count as string) || 0,
      tsr_count: parseInt(data.tsr_count as string) || 0,
      pengurus_count: parseInt(data.pengurus_count as string) || 0,
      staf_count: parseInt(data.staf_count as string) || 0,
      pmr_count: parseInt(data.pmr_count as string) || 0,
      penerima_laki: parseInt(data.penerima_laki as string) || 0,
      penerima_perempuan: parseInt(data.penerima_perempuan as string) || 0,
      penerima_kk: parseInt(data.penerima_kk as string) || 0,
      penerima_jiwa: parseInt(data.penerima_jiwa as string) || 0,
    };

    if (editingKegiatan) {
      updateMutation.mutate({ id: editingKegiatan.id, data: parsedData });
    } else {
      createMutation.mutate(parsedData);
    }
  };

  const filteredKegiatan = kegiatanList.filter((k: KegiatanItem) =>
    k.nama_kegiatan.toLowerCase().includes(search.toLowerCase()) ||
    k.tempat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Header title="Laporan" />
      <div className="space-y-4 lg:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Laporan Semester</h3>
                <p className="text-sm text-gray-500">Download laporan semester dalam format Word</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="input-field"
                >
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                <input
                  type="number"
                  value={tahun}
                  onChange={(e) => setTahun(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            <button
              onClick={handleDownloadSemester}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Laporan Semester (Word)
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <FileSpreadsheet className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Laporan Kegiatan</h3>
                <p className="text-sm text-gray-500">Download laporan kegiatan dalam format Excel</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="input-field"
                >
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                <input
                  type="number"
                  value={tahun}
                  onChange={(e) => setTahun(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bidang</label>
              <select
                value={bidang}
                onChange={(e) => setBidang(e.target.value)}
                className="input-field"
              >
                <option value="">Semua Bidang</option>
                <option value="BIDANG PENANGGULANGAN BENCANA">BIDANG PENANGGULANGAN BENCANA</option>
                <option value="BIDANG RELAWAN">BIDANG RELAWAN</option>
              </select>
            </div>
            <button
              onClick={handleDownloadKegiatan}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Laporan Kegiatan (Excel)
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h3 className="text-base lg:text-lg font-semibold text-gray-800">Daftar Kegiatan</h3>
            <button
              onClick={() => { setEditingKegiatan(null); setIsModalOpen(true); }}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Kegiatan</span>
            </button>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari kegiatan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10 text-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kegiatan</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tempat</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bidang</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredKegiatan.map((kegiatan: KegiatanItem) => (
                  <tr key={kegiatan.id} className="table-row">
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-900">{filteredKegiatan.indexOf(kegiatan) + 1}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">{kegiatan.tanggal_kejadian}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm font-medium text-gray-900">{kegiatan.nama_kegiatan}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">{kegiatan.tempat}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">{kegiatan.bidang}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditingKegiatan(kegiatan); setIsModalOpen(true); }}
                          className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Hapus data kegiatan ini?')) {
                              deleteMutation.mutate(kegiatan.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">{editingKegiatan ? 'Edit Kegiatan' : 'Tambah Kegiatan'}</h3>
              <button
                onClick={() => { setIsModalOpen(false); setEditingKegiatan(null); }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    name="tanggal_kejadian"
                    defaultValue={editingKegiatan?.tanggal_kejadian || ''}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
                  <select name="bulan" defaultValue={editingKegiatan?.bulan || 'Januari'} className="input-field">
                    <option value="Januari">Januari</option>
                    <option value="Februari">Februari</option>
                    <option value="Maret">Maret</option>
                    <option value="April">April</option>
                    <option value="Mei">Mei</option>
                    <option value="Juni">Juni</option>
                    <option value="Juli">Juli</option>
                    <option value="Agustus">Agustus</option>
                    <option value="September">September</option>
                    <option value="Oktober">Oktober</option>
                    <option value="November">November</option>
                    <option value="Desember">Desember</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kegiatan</label>
                <input
                  type="text"
                  name="nama_kegiatan"
                  defaultValue={editingKegiatan?.nama_kegiatan || ''}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tempat</label>
                <input
                  type="text"
                  name="tempat"
                  defaultValue={editingKegiatan?.tempat || ''}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bidang</label>
                <select name="bidang" defaultValue={editingKegiatan?.bidang || 'BIDANG PENANGGULANGAN BENCANA'} className="input-field">
                  <option value="BIDANG PENANGGULANGAN BENCANA">BIDANG PENANGGULANGAN BENCANA</option>
                  <option value="BIDANG RELAWAN">BIDANG RELAWAN</option>
                </select>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">KSR</label>
                  <input type="number" name="ks_count" defaultValue={editingKegiatan?.ks_count || 0} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">TSR</label>
                  <input type="number" name="tsr_count" defaultValue={editingKegiatan?.tsr_count || 0} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pengurus</label>
                  <input type="number" name="pengurus_count" defaultValue={editingKegiatan?.pengurus_count || 0} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Staf</label>
                  <input type="number" name="staf_count" defaultValue={editingKegiatan?.staf_count || 0} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PMR</label>
                  <input type="number" name="pmr_count" defaultValue={editingKegiatan?.pmr_count || 0} className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Penerima L</label>
                  <input type="number" name="penerima_laki" defaultValue={editingKegiatan?.penerima_laki || 0} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Penerima P</label>
                  <input type="number" name="penerima_perempuan" defaultValue={editingKegiatan?.penerima_perempuan || 0} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">KK</label>
                  <input type="number" name="penerima_kk" defaultValue={editingKegiatan?.penerima_kk || 0} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jiwa</label>
                  <input type="number" name="penerima_jiwa" defaultValue={editingKegiatan?.penerima_jiwa || 0} className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                <textarea
                  name="keterangan"
                  defaultValue={editingKegiatan?.keterangan || ''}
                  className="input-field"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Anggaran</label>
                <input
                  type="text"
                  name="anggaran"
                  defaultValue={editingKegiatan?.anggaran || ''}
                  className="input-field"
                  placeholder="Rp 0"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingKegiatan ? 'Simpan Perubahan' : 'Tambah Kegiatan'}
                </button>
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingKegiatan(null); }} className="btn-secondary">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
