import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Search, Download, Upload } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/ui/Modal';
import { PROVINSI_OPTIONS, KABUPATEN_OPTIONS } from '../data/regions';
import { membersApi } from '../services/resources';
import api from '../services/api';
import Header from '../components/layout/Header';

interface MembersPageProps {
  title: string;
  type: 'pmr' | 'ksr' | 'tsr' | 'dds';
}

export default function MembersPage({ title, type }: MembersPageProps) {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalProvinsi, setModalProvinsi] = useState('BANTEN');
  const [modalKabupaten, setModalKabupaten] = useState('KOTA CILEGON');

  useEffect(() => {
    if (editingMember) {
      setModalProvinsi(editingMember.provinsi || 'BANTEN');
      setModalKabupaten(editingMember.kabupaten || 'KOTA CILEGON');
    } else {
      setModalProvinsi('BANTEN');
      setModalKabupaten('KOTA CILEGON');
    }
  }, [editingMember]);

  const { data: membersData } = useQuery({
    queryKey: ['members', type],
    queryFn: () => {
      if (type === 'pmr') return membersApi.getPMR();
      if (type === 'ksr') return membersApi.getKSR();
      return membersApi.getTSR();
    },
  });

  const { data: unitOptions = [] } = useQuery({
    queryKey: ['units', 'autocomplete'],
    queryFn: async () => {
      const response = await api.get('/units/autocomplete');
      return response.data;
    },
  });

  const members = membersData?.data?.filter((member: any, index: number, self: any[]) =>
    index === self.findIndex((m) => m.id === member.id)
  ) || [];

  const createMutation = useMutation({
    mutationFn: (data: any) => {
      if (type === 'pmr') return membersApi.createPMR(data);
      if (type === 'ksr') return membersApi.createKSR(data);
      return membersApi.createTSR(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', type] });
      setIsModalOpen(false);
      setEditingMember(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => {
      if (type === 'pmr') return membersApi.updatePMR(id, data);
      if (type === 'ksr') return membersApi.updateKSR(id, data);
      return membersApi.updateTSR(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', type] });
      setIsModalOpen(false);
      setEditingMember(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      if (type === 'pmr') return membersApi.deletePMR(id);
      if (type === 'ksr') return membersApi.deleteKSR(id);
      return membersApi.deleteTSR(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', type] });
    },
  });

  const handleImport = async () => {
    if (!importFile) return;
    setImporting(true);
    try {
      const text = await importFile.text();
      const rows = text.split('\n').filter(row => row.trim());
      const headers = rows[0].split('\t').map(h => h.trim().toLowerCase());
      
      for (let i = 1; i < rows.length; i++) {
        const cols = rows[i].split('\t').map(c => c.trim());
        const row: any = {};
        headers.forEach((h, idx) => {
          if (h === 'provinsi') row.provinsi = cols[idx];
          if (h === 'kabupaten') row.kabupaten = cols[idx];
          if (h === 'angkatan') row.angkatan = parseInt(cols[idx]) || new Date().getFullYear();
          if (h === 'kode anggota') row.kode_anggota = cols[idx];
          if (h === 'nama') row.nama = cols[idx];
          if (h === 'kelamin') row.kelamin = cols[idx];
          if (h === 'status') row.status = cols[idx];
          if (h === 'nama unit') row.nama_unit = cols[idx];
          if (h === 'jenis') row.jenis = cols[idx];
        });
        
        if (row.kode_anggota && row.nama) {
          if (type === 'pmr') await membersApi.createPMR(row);
          else if (type === 'ksr') await membersApi.createKSR(row);
          else await membersApi.createTSR(row);
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ['members', type] });
      setImportFile(null);
      setImporting(false);
      alert('Import berhasil');
    } catch (e) {
      console.error(e);
      setImporting(false);
      alert('Import gagal');
    }
  };

  const handleExport = () => {
    const headers = ['No', 'Provinsi', 'Kabupaten/Kota', 'Angkatan', 'Kode Anggota', 'Nama', 'Kelamin', 'Status', 'Nama Unit', 'Jenis'];
    const rows = members.map((m: any, i: number) => [
      i + 1, m.provinsi || '', m.kabupaten || '', m.angkatan || '', m.kode_anggota || '', m.nama || '', m.kelamin || '', m.status || '', m.nama_unit || '', m.jenis || ''
    ]);
    const csv = [headers, ...rows].map(r => r.join('\t')).join('\n');
    const blob = new Blob([csv], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anggota_${type}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    if (editingMember) {
      updateMutation.mutate({ id: editingMember.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredMembers = members.filter((member: any) =>
    member.nama?.toLowerCase().includes(search.toLowerCase()) ||
    member.kode_anggota?.includes(search)
  );

  return (
    <div>
      <Header title={title} />
      <div className="space-y-4 lg:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-sm text-gray-600">Total: {membersData?.total?.toLocaleString() || 0} anggota</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.csv"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <Link to={`/members/${type}/add`} className="btn-primary flex items-center gap-2 text-sm">
              <Plus className="h-4 w-4" />
              <span>Tambah</span>
            </Link>
          </div>
        </div>

        {importFile && (
          <div className="card flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">File: {importFile.name}</p>
              <p className="text-xs text-gray-500">Format: No, Provinsi, Kabupaten/Kota, Angkatan, Kode Anggota, Nama, Kelamin, Status, Nama Unit, Jenis</p>
            </div>
            <button onClick={handleImport} disabled={importing} className="btn-primary text-sm">
              {importing ? 'Mengimport...' : 'Import'}
            </button>
          </div>
        )}

        <div className="card overflow-hidden p-0">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama atau kode anggota..."
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
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provinsi</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kabupaten/Kota</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Angkatan</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode Anggota</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMembers.map((member: any, index: number) => (
                  <tr key={member.id} className="table-row">
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">{member.provinsi}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">{member.kabupaten}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{member.angkatan}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm font-medium text-gray-900">{member.nama}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-600 font-mono">{member.kode_anggota}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">{member.nama_unit}</td>
                    <td className="px-4 lg:px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {member.jenis}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <Link to={`/members/${type}/${member.id}`} className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                          <Edit className="h-4 w-4" />
                          Detail
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm('Hapus anggota ini?')) {
                              deleteMutation.mutate(member.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingMember(null); }}
        title={editingMember ? 'Edit Anggota' : 'Tambah Anggota'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap<span className="text-red-500 ml-1">*</span></label>
            <input
              type="text"
              name="nama"
              defaultValue={editingMember?.nama || ''}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kode Anggota<span className="text-red-500 ml-1">*</span></label>
            <input
              type="text"
              name="kode_anggota"
              defaultValue={editingMember?.kode_anggota || ''}
              className="input-field font-mono"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kelamin<span className="text-red-500 ml-1">*</span></label>
            <select name="kelamin" defaultValue={editingMember?.kelamin || 'Pria'} className="input-field">
                <option value="Pria">Pria</option>
                <option value="Wanita">Wanita</option>
              </select>
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Angkatan<span className="text-red-500 ml-1">*</span></label>
            <input
              type="number"
              name="angkatan"
              defaultValue={editingMember?.angkatan || new Date().getFullYear()}
              className="input-field"
            />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi<span className="text-red-500 ml-1">*</span></label>
              <select
                name="provinsi"
                value={modalProvinsi}
                onChange={(e) => { setModalProvinsi(e.target.value); setModalKabupaten(''); }}
                className="input-field"
              >
                <option value="">Pilih Provinsi</option>
                {PROVINSI_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kabupaten/Kota<span className="text-red-500 ml-1">*</span></label>
              <select
                name="kabupaten"
                value={modalKabupaten}
                onChange={(e) => setModalKabupaten(e.target.value)}
                className="input-field"
              >
                <option value="">Pilih Kabupaten/Kota</option>
                {(KABUPATEN_OPTIONS[modalProvinsi] || []).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Unit<span className="text-red-500 ml-1">*</span></label>
            <input
              type="text"
              name="nama_unit"
              defaultValue={editingMember?.nama_unit || ''}
              className="input-field"
              list="unit-list"
            />
            <datalist id="unit-list">
              {unitOptions.map((unit: string) => (
                <option key={unit} value={unit} />
              ))}
            </datalist>
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis<span className="text-red-500 ml-1">*</span></label>
            <select name="jenis" defaultValue={editingMember?.jenis || 'PMR'} className="input-field">
                <option value="PMR">PMR</option>
                <option value="KSR">KSR</option>
                <option value="TSR">TSR</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status<span className="text-red-500 ml-1">*</span></label>
            <select name="status" defaultValue={editingMember?.status || 'Aktif'} className="input-field">
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
              <option value="Suspend">Suspend</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1" disabled={createMutation.isPending || updateMutation.isPending}>
              {editingMember ? 'Simpan Perubahan' : 'Tambah Anggota'}
            </button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
              Batal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
