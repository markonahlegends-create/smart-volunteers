import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Search, Download } from 'lucide-react';
import { useState } from 'react';
import Modal from '../components/ui/Modal';
import { bencanaApi } from '../services/resources';
import Header from '../components/layout/Header';

export default function Bencana() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBencana, setEditingBencana] = useState<any>(null);
  const [search, setSearch] = useState('');

  const { data: bencanaData } = useQuery({
    queryKey: ['bencana'],
    queryFn: () => bencanaApi.get(),
  });

  const bencanas = bencanaData?.data?.filter((bencana: any, index: number, self: any[]) =>
    index === self.findIndex((b) => b.id === bencana.id)
  ) || [];

  const createMutation = useMutation({
    mutationFn: (data: any) => bencanaApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bencana'] });
      setIsModalOpen(false);
      setEditingBencana(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => bencanaApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bencana'] });
      setIsModalOpen(false);
      setEditingBencana(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => bencanaApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bencana'] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    if (editingBencana) {
      updateMutation.mutate({ id: editingBencana.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredBencanas = bencanas.filter((bencana: any) =>
    bencana.nama_kejadian?.toLowerCase().includes(search.toLowerCase()) ||
    bencana.jenis_bencana?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Header title="Kejadian Bencana" />
      <div className="space-y-4 lg:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-sm text-gray-600">Total: {bencanaData?.total?.toLocaleString() || 0} kejadian</p>
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary flex items-center gap-2 text-sm">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={() => { setEditingBencana(null); setIsModalOpen(true); }}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah</span>
            </button>
          </div>
        </div>

        <div className="card overflow-hidden p-0">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari kejadian bencana..."
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
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Kejadian</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lokasi</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBencanas.map((bencana: any) => (
                  <tr key={bencana.id} className="table-row">
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-900">{filteredBencanas.indexOf(bencana) + 1}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm font-medium text-gray-900">{bencana.jenis_bencana}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">{bencana.nama_kejadian}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">{bencana.tanggal_kejadian}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">{bencana.level}</td>
                    <td className="px-4 lg:px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {bencana.status}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditingBencana(bencana); setIsModalOpen(true); }}
                          className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Hapus data bencana ini?')) {
                              deleteMutation.mutate(bencana.id);
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
        onClose={() => { setIsModalOpen(false); setEditingBencana(null); }}
        title={editingBencana ? 'Edit Bencana' : 'Tambah Bencana'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Bencana</label>
            <input
              type="text"
              name="jenis_bencana"
              defaultValue={editingBencana?.jenis_bencana || ''}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kejadian</label>
            <input
              type="text"
              name="nama_kejadian"
              defaultValue={editingBencana?.nama_kejadian || ''}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kejadian</label>
            <input
              type="date"
              name="tanggal_kejadian"
              defaultValue={editingBencana?.tanggal_kejadian || ''}
              className="input-field"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select name="level" defaultValue={editingBencana?.level || 'Kabupaten/Kota'} className="input-field">
                <option value="Nasional">Nasional</option>
                <option value="Provinsi">Provinsi</option>
                <option value="Kabupaten/Kota">Kabupaten/Kota</option>
                <option value="Kecamatan">Kecamatan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" defaultValue={editingBencana?.status || 'Kejadian'} className="input-field">
                <option value="Kejadian">Kejadian</option>
                <option value="Tanggap darurat">Tanggap darurat</option>
                <option value="Pemulihan">Pemulihan</option>
                <option value="Peringatan dini">Peringatan dini</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1" disabled={createMutation.isPending || updateMutation.isPending}>
              {editingBencana ? 'Simpan Perubahan' : 'Tambah Bencana'}
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
