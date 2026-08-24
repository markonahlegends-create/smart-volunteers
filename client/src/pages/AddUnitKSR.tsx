import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { unitsApi } from '../services/resources';
import Header from '../components/layout/Header';

const KATEGORI_OPTIONS = ['PERGURUAN TINGGI', 'SMA', 'SMK', 'SEDERAJAT'];
const PROVINSI_OPTIONS = ['BANTEN'];
const KABUPATEN_OPTIONS = ['KOTA CILEGON', 'LEBAK', 'PANDEGLANG', 'SERANG', 'KABUPATEN SERANG'];

export default function AddUnitKSR() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    kode_unit: '',
    nama_unit: '',
    kategori: 'PERGURUAN TINGGI',
    email: '',
    no_telpon: '',
    status: 'Aktif',
    catatan: '',
    provinsi: '',
    kabupaten: '',
    alamat: '',
    lat: null as number | null,
    lng: null as number | null,
  });
  const [locationSearch, setLocationSearch] = useState('');
  const [geocoding, setGeocoding] = useState(false);
  const [selectedSkFile, setSelectedSkFile] = useState<File | null>(null);
  const [uploadedSkFilename, setUploadedSkFilename] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await unitsApi.createKSR(data);
      return res;
    },
    onSuccess: async (data) => {
      if (selectedSkFile) {
        const formData = new FormData();
        formData.append('file', selectedSkFile);
        const token = localStorage.getItem('token');
        await fetch(`/api/units/ksr/${data.id}/upload-sk`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }
      queryClient.invalidateQueries({ queryKey: ['units', 'ksr'] });
      navigate('/units/ksr');
    },
  });

  const geocodeAddress = async (query: string) => {
    if (!query) return;
    setGeocoding(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=id&limit=1&addressdetails=1`, {
        headers: { 'Accept': 'application/json', 'User-Agent': 'SmartVolunteersPMI/1.0' },
      });
      const data = await res.json();
      if (data && data[0]) {
        setForm(prev => ({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync(form);
  };

  return (
    <div>
      <Header title="Tambah Unit KSR" />
      <div className="space-y-4 lg:space-y-6">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/units/ksr')} className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select name="kategori" value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} className="input-field">
                {KATEGORI_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kode Unit</label>
              <input
                type="text"
                name="kode_unit"
                value={form.kode_unit}
                onChange={(e) => setForm({ ...form, kode_unit: e.target.value })}
                className="input-field"
                placeholder="Masukkan kode unit"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Unit</label>
              <input
                type="text"
                name="nama_unit"
                value={form.nama_unit}
                onChange={(e) => setForm({ ...form, nama_unit: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No Telpon</label>
              <input
                type="text"
                name="no_telpon"
                value={form.no_telpon}
                onChange={(e) => setForm({ ...form, no_telpon: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                <option value="Aktif">Active</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
              <textarea
                name="catatan"
                value={form.catatan}
                onChange={(e) => setForm({ ...form, catatan: e.target.value })}
                className="input-field"
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Lokasi</label>
              <div className="border border-gray-300 rounded-lg overflow-hidden h-48">
                <iframe
                  title="Map Picker"
                  key={`${form.lat}-${form.lng}`}
                  src={`https://www.openstreetmap.org/export/embed.html?marker=${form.lat ?? -6.05},${form.lng ?? 106.1}&bbox=${(form.lng ?? 106.1) - 0.01},${(form.lat ?? -6.05) - 0.01},${(form.lng ?? 106.1) + 0.01},${(form.lat ?? -6.05) + 0.01}&layer=mapnik`}
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
                {(form.lat || form.lng) && (
                  <p className="text-xs text-gray-500 mt-1">
                    Koordinat: {form.lat?.toFixed(6)}, {form.lng?.toFixed(6)}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi</label>
              <select name="provinsi" value={form.provinsi} onChange={(e) => setForm({ ...form, provinsi: e.target.value })} className="input-field">
                <option value="">Pilih Regional</option>
                {PROVINSI_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kabupaten</label>
              <select name="kabupaten" value={form.kabupaten} onChange={(e) => setForm({ ...form, kabupaten: e.target.value })} className="input-field">
                <option value="">Pilih Kabupaten/Kota</option>
                {KABUPATEN_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
              <textarea
                name="alamat"
                value={form.alamat}
                onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                className="input-field"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload SK</label>
              <div
                className="border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary-400 transition-colors"
                onClick={() => document.getElementById('sk-upload-add')?.click()}
              >
                <MapPin className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Klik untuk upload atau drag file ke sini</p>
                <p className="text-xs text-gray-400 mt-1">Hanya file PDF yang diizinkan</p>
                <input
                  id="sk-upload-add"
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
          </div>

          <div className="lg:col-span-2 flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Menyimpan...' : 'Create'}
            </button>
            <button type="button" onClick={() => navigate('/units/ksr')} className="btn-secondary">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
