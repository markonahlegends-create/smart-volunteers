import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Trash2, Search, ArrowLeft, Phone, Mail, MapPin, Building2, Eye, Edit, Upload, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Modal from '../components/ui/Modal';
import { membersApi, unitsApi } from '../services/resources';
import Header from '../components/layout/Header';

type KategoriTab = 'Anggota' | 'Koordinator' | 'Calon Anggota' | 'Anggota Tidak Aktif';

export default function UnitDetailKSRPerguruanTinggi() {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<KategoriTab>('Anggota');
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [unitForm, setUnitForm] = useState({
    nama_unit: '',
    kategori: 'PERGURUAN TINGGI',
    email: '',
    no_telpon: '',
    status: 'Aktif',
    catatan: '',
    provinsi: 'BANTEN',
    kabupaten: 'KOTA CILEGON',
    alamat: '',
    lat: null as number | null,
    lng: null as number | null,
  });
  const [geocoding, setGeocoding] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedSkFile, setSelectedSkFile] = useState<File | null>(null);
  const [uploadedSkFilename, setUploadedSkFilename] = useState<string | null>(null);

  const { data: unit, isLoading: unitLoading, error } = useQuery({
    queryKey: ['unit-ksr-pt', id],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }
      const res = await fetch(`/api/units/ksr/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Gagal memuat data unit' }));
        throw new Error(error.message || 'Gagal memuat data unit');
      }
      return res.json();
    },
    enabled: !!id,
  });

  const { data: members = [] } = useQuery({
    queryKey: ['members-ksr-pt', id, activeTab],
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
      queryClient.invalidateQueries({ queryKey: ['members-ksr-pt', id] });
    },
  });

  const updateUnitMutation = useMutation({
    mutationFn: (data: any) => unitsApi.updateKSR(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unit-ksr-pt', id] });
      setIsUnitModalOpen(false);
      setUploadedSkFilename(null);
    },
  });

  useEffect(() => {
    if (unit) {
      setUnitForm({
        nama_unit: unit.nama_unit || '',
        kategori: unit.kategori || 'PERGURUAN TINGGI',
        email: unit.email || '',
        no_telpon: unit.no_telpon || '',
        status: unit.status || 'Aktif',
        catatan: unit.catatan || '',
        provinsi: unit.provinsi || 'BANTEN',
        kabupaten: unit.kabupaten || 'KOTA CILEGON',
        alamat: unit.alamat || '',
        lat: unit.lat ?? null,
        lng: unit.lng ?? null,
      });
    }
  }, [unit]);

  const geocodeAddress = async (query: string) => {
    if (!query) return;
    setGeocoding(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=id&limit=1&addressdetails=1`, {
        headers: { 'Accept': 'application/json', 'User-Agent': 'SmartVolunteersPMI/1.0' },
      });
      const data = await res.json();
      if (data && data[0]) {
        setUnitForm(prev => ({
          ...prev,
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        }));
      }
    } catch (e) {
      console.error('Geocoding failed:', e);
    } finally {
      setGeocoding(false);
    }
  };

  const handleSearchLocation = () => {
    if (locationSearch.trim()) {
      geocodeAddress(locationSearch.trim());
    }
  };

  const handleSkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Hanya file PDF yang diizinkan');
      e.target.value = '';
      return;
    }
    setSelectedSkFile(file);
    setUploadedSkFilename(null);
  };

  const uploadSk = async () => {
    if (!selectedSkFile) return;
    try {
      const formData = new FormData();
      formData.append('file', selectedSkFile);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/units/ksr/${id}/upload-sk`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setUploadedSkFilename(data.sk || 'File SK');
      alert('File SK berhasil diupload');
      setSelectedSkFile(null);
      queryClient.invalidateQueries({ queryKey: ['unit-ksr-pt', id] });
    } catch (err) {
      alert('Gagal upload SK');
    }
  };

  const handleUnitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUnitMutation.mutateAsync(unitForm);
    if (selectedSkFile) {
      await uploadSk();
    }
  };

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

  if (!unit && !unitLoading) {
    const errorMessage = error instanceof Error ? error.message : 'Unit tidak ditemukan';
    const isAuthError = errorMessage.includes('token') || errorMessage.includes('login') || errorMessage.includes('Unauthorized');
    
    return (
      <div>
        <Header title="Detail Unit KSR" />
        <div className="text-center py-12">
          <p className="text-gray-500">{errorMessage}</p>
          {isAuthError ? (
            <Link to="/login" className="btn-primary mt-4 inline-block">Login</Link>
          ) : (
            <Link to="/units/ksr" className="btn-primary mt-4 inline-block">Kembali ke Daftar Unit</Link>
          )}
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
              <button onClick={() => setIsUnitModalOpen(true)} className="btn-secondary flex items-center gap-2 text-sm">
                <Edit className="h-4 w-4" />
                <span>Update Unit</span>
              </button>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h3 className="text-base font-semibold text-gray-800 mb-4">Data Lokasi</h3>
            <div className="border border-gray-300 rounded-lg overflow-hidden h-64">
              <iframe
                title="Map"
                src={`https://www.openstreetmap.org/export/embed.html?marker=${unit.lat ?? -6.05},${unit.lng ?? 106.1}&bbox=${(unit.lng ?? 106.1) - 0.01},${(unit.lat ?? -6.05) - 0.01},${(unit.lng ?? 106.1) + 0.01},${(unit.lat ?? -6.05) + 0.01}&layer=mapnik`}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Provinsi</p>
                <p className="font-medium text-gray-900">{unit.provinsi || 'BANTEN'}</p>
              </div>
              <div>
                <p className="text-gray-500">Kabupaten</p>
                <p className="font-medium text-gray-900">{unit.kabupaten || 'KOTA CILEGON'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Alamat</p>
                <p className="font-medium text-gray-900">{unit.alamat || '-'}</p>
              </div>
              {(unit.lat || unit.lng) && (
                <div className="col-span-2">
                  <p className="text-gray-500">Koordinat</p>
                  <p className="font-medium text-gray-900">{unit.lat?.toFixed(6)}, {unit.lng?.toFixed(6)}</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <h3 className="text-base font-semibold text-gray-800 mb-4">Upload SK</h3>
            <div className="space-y-3">
              {unit.sk ? (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <FileText className="h-8 w-8 text-primary-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">Surat Keputusan</p>
                    <a href={unit.sk} target="_blank" rel="noreferrer" className="text-sm text-primary-600 hover:underline">Lihat file</a>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Belum ada file SK yang diupload.</p>
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
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

        <Modal
          isOpen={isUnitModalOpen}
          onClose={() => setIsUnitModalOpen(false)}
          title="Update Unit"
        >
          <form onSubmit={handleUnitSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select name="kategori" value={unitForm.kategori} onChange={(e) => setUnitForm({ ...unitForm, kategori: e.target.value })} className="input-field">
                <option value="PERGURUAN TINGGI">PERGURUAN TINGGI</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kode Unit</label>
              <input type="text" value={unit?.id || ''} disabled className="input-field bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Unit</label>
              <input type="text" name="nama_unit" value={unitForm.nama_unit} onChange={(e) => setUnitForm({ ...unitForm, nama_unit: e.target.value })} className="input-field" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={unitForm.email} onChange={(e) => setUnitForm({ ...unitForm, email: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No Telpon</label>
                <input type="text" name="no_telpon" value={unitForm.no_telpon} onChange={(e) => setUnitForm({ ...unitForm, no_telpon: e.target.value })} className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={unitForm.status} onChange={(e) => setUnitForm({ ...unitForm, status: e.target.value })} className="input-field">
                <option value="Aktif">Active</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
              <textarea name="catatan" value={unitForm.catatan} onChange={(e) => setUnitForm({ ...unitForm, catatan: e.target.value })} className="input-field" rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Lokasi</label>
              <div className="border border-gray-300 rounded-lg overflow-hidden h-48">
                <iframe
                  title="Map Picker"
                  key={`${unitForm.lat}-${unitForm.lng}`}
                  src={`https://www.openstreetmap.org/export/embed.html?marker=${unitForm.lat ?? -6.05},${unitForm.lng ?? 106.1}&bbox=${(unitForm.lng ?? 106.1) - 0.01},${(unitForm.lat ?? -6.05) - 0.01},${(unitForm.lng ?? 106.1) + 0.01},${(unitForm.lat ?? -6.05) + 0.01}&layer=mapnik`}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cari Lokasi</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    placeholder="Cari nama gedung, kantor, instansi, rumah, toko, pabrik..."
                    className="input-field flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchLocation()}
                  />
                  <button
                    type="button"
                    onClick={handleSearchLocation}
                    disabled={geocoding}
                    className="btn-secondary"
                  >
                    {geocoding ? 'Mencari...' : 'Cari'}
                  </button>
                </div>
                {(unitForm.lat || unitForm.lng) && (
                  <p className="text-xs text-gray-500 mt-1">
                    Koordinat: {unitForm.lat?.toFixed(6)}, {unitForm.lng?.toFixed(6)}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi</label>
                <select name="provinsi" value={unitForm.provinsi} onChange={(e) => setUnitForm({ ...unitForm, provinsi: e.target.value })} className="input-field">
                  <option value="BANTEN">BANTEN</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kabupaten</label>
                <select name="kabupaten" value={unitForm.kabupaten} onChange={(e) => setUnitForm({ ...unitForm, kabupaten: e.target.value })} className="input-field">
                  <option value="KOTA CILEGON">KOTA CILEGON</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
              <textarea name="alamat" value={unitForm.alamat} onChange={(e) => setUnitForm({ ...unitForm, alamat: e.target.value })} className="input-field" rows={2} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload SK</label>
              <div
                className="border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary-400 transition-colors"
                onClick={() => document.getElementById('sk-upload-modal')?.click()}
              >
                <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Klik untuk upload atau drag file ke sini</p>
                <p className="text-xs text-gray-400 mt-1">Hanya file PDF yang diizinkan</p>
                <input
                  id="sk-upload-modal"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleSkFileChange}
                />
              </div>
              {selectedSkFile && (
                <p className="text-sm text-gray-600 mt-2">
                  File dipilih: <span className="font-medium">{selectedSkFile.name}</span>
                </p>
              )}
              {uploadedSkFilename && !selectedSkFile && (
                <p className="text-sm text-gray-600 mt-2">
                  SK: <span className="font-medium">{uploadedSkFilename}</span>
                </p>
              )}
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn-primary flex-1" disabled={updateUnitMutation.isPending}>
                {updateUnitMutation.isPending ? 'Menyimpan...' : 'Update'}
              </button>
              <button type="button" onClick={() => { setIsUnitModalOpen(false); setUploadedSkFilename(null); }} className="btn-secondary">
                Batal
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
