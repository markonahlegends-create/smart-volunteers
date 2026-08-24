import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Trash2, Search, ArrowLeft, Phone, Mail, MapPin, Building2, Eye, Edit } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { membersApi } from '../services/resources';
import Header from '../components/layout/Header';

type KategoriTab = 'Koordinator' | 'Anggota' | 'Calon Anggota' | 'Anggota Tidak Aktif';

export default function UnitDetailKSR() {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<KategoriTab>('Anggota');

  const { data: unit, isLoading: unitLoading } = useQuery({
    queryKey: ['unit-ksr', id],
    queryFn: async () => {
      const res = await fetch(`/api/units/ksr/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error('Unit not found');
      return res.json();
    },
    enabled: !!id,
  });

  const { data: members = [] } = useQuery({
    queryKey: ['members-ksr-unit', id, activeTab],
    queryFn: async () => {
      const res = await fetch(`/api/units/ksr/${id}/anggota/${encodeURIComponent(activeTab)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: (memberId: number) => membersApi.deleteKSR(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members-ksr-unit', id] });
    },
  });

  const filteredMembers = members.filter((member: any) =>
    member.nama?.toLowerCase().includes(search.toLowerCase()) ||
    member.kode_anggota?.includes(search)
  );

  const tabs: { key: KategoriTab; label: string }[] = [
    { key: 'Koordinator', label: 'Koordinator' },
    { key: 'Anggota', label: 'Anggota' },
    { key: 'Calon Anggota', label: 'Calon Anggota' },
    { key: 'Anggota Tidak Aktif', label: 'Anggota Tidak Aktif' },
  ];

  if (unitLoading) {
    return (
      <div>
        <Header title="Detail Unit KSR" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!unit) {
    return (
      <div>
        <Header title="Detail Unit KSR" />
        <div className="text-center py-12">
          <p className="text-gray-500">Unit tidak ditemukan</p>
          <Link to="/units/ksr" className="btn-primary mt-4 inline-block">Kembali ke Daftar Unit</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Detail Unit KSR" />
      <div className="space-y-4 lg:space-y-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button onClick={() => navigate('/units/ksr')} className="flex items-center gap-1 hover:text-primary-600">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Unit
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="text-xs font-medium text-gray-500">Kode Unit</span>
                <span className="text-xs font-medium text-gray-900">{unit.id}</span>
              </div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-800">{unit.nama_unit}</h2>
              {unit.kategori && (
                <p className="text-sm text-gray-600 mt-1">Nama Kategori Detail: {unit.kategori}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {unit.jenis || 'KSR'}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${unit.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {unit.status}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate(`/members/ksr/add?unitId=${id}`)} className="btn-primary flex items-center gap-2 text-sm">
                <Plus className="h-4 w-4" />
                <span>Tambah Anggota</span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h3 className="text-base font-semibold text-gray-800 mb-4">Informasi Unit</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Nama Unit</p>
                  <p className="text-sm font-medium text-gray-900">{unit.nama_unit}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Alamat</p>
                  <p className="text-sm font-medium text-gray-900">{unit.alamat || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{unit.email || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">No. Telpon</p>
                  <p className="text-sm font-medium text-gray-900">{unit.no_telpon || '-'}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h3 className="text-base font-semibold text-gray-800 mb-4">Detail</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-sm font-medium text-gray-900">{unit.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Jenis</p>
                <p className="text-sm font-medium text-gray-900">{unit.jenis || 'KSR'}</p>
              </div>
              {unit.kategori && (
                <div>
                  <p className="text-sm text-gray-500">Kategori</p>
                  <p className="text-sm font-medium text-gray-900">{unit.kategori}</p>
                </div>
              )}
              {unit.catatan && (
                <div>
                  <p className="text-sm text-gray-500">Catatan</p>
                  <p className="text-sm font-medium text-gray-900">{unit.catatan}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="card overflow-hidden p-0">
          <div className="border-b border-gray-200">
            <nav className="flex gap-1 px-4 pt-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === tab.key
                      ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10 text-sm w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-12">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode Anggota</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelamin</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Angkatan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No HP</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMembers.map((member: any, index: number) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">{member.kode_anggota}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{member.nama}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${member.kelamin === 'Laki-laki' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                        {member.kelamin}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{member.angkatan}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{member.no_hp || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{member.email || '-'}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => navigate(`/members/ksr/${member.id}`)}
                          className="p-1 text-primary-600 hover:bg-primary-50 rounded"
                          title="Lihat Detail"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => navigate(`/members/ksr/add/${member.id}?unitId=${id}`)}
                          className="p-1 text-primary-600 hover:bg-primary-50 rounded"
                          title="Edit Anggota"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Hapus anggota ini?')) {
                              deleteMutation.mutate(member.id);
                            }
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                      Tidak ada data anggota
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
