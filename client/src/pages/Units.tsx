import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/ui/Modal';
import { unitsApi } from '../services/resources';
import Header from '../components/layout/Header';

interface UnitPageProps {
  title: string;
  type: 'pmr-mula' | 'pmr-madya' | 'pmr-wira' | 'ksr' | 'tsr';
}

const normalizeUnitName = (name: string) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[\.\,\/\\]/g, ' ')
    .replace(/\b(smkn|smk negeri|smk n|sman|sma n|smps?|smp n|sdn|sd n)\b/gi, (match) => {
      const map: Record<string, string> = {
        smkn: 'smk negeri',
        'smk negeri': 'smk negeri',
        'smk n': 'smk negeri',
        sman: 'sma negeri',
        'sma n': 'sma negeri',
        smp: 'smp',
        'smp n': 'smp negeri',
        smps: 'smp',
        sdn: 'sd negeri',
        'sd n': 'sd negeri',
      };
      return map[match.toLowerCase()] || match;
    })
    .replace(/\s+/g, ' ')
    .trim();
};

const isDuplicateUnitName = (nameA: string, nameB: string) => {
  return normalizeUnitName(nameA) === normalizeUnitName(nameB);
};

export default function UnitsPage({ title, type }: UnitPageProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<any>(null);
  const [search, setSearch] = useState('');

  const getUnitsKey = () => {
    if (type === 'pmr-mula') return ['units', 'pmr', 'mula'];
    if (type === 'pmr-madya') return ['units', 'pmr', 'madya'];
    if (type === 'pmr-wira') return ['units', 'pmr', 'wira'];
    if (type === 'ksr') return ['units', 'ksr'];
    return ['units', 'tsr'];
  };

  const getApi = () => {
    if (type === 'pmr-mula') return unitsApi.getPMRMula();
    if (type === 'pmr-madya') return unitsApi.getPMRMadya();
    if (type === 'pmr-wira') return unitsApi.getPMRWira();
    if (type === 'ksr') return unitsApi.getKSR();
    return unitsApi.getTSR();
  };

  const { data: unitsRaw = [] } = useQuery({
    queryKey: getUnitsKey(),
    queryFn: getApi,
  });

  const units = (unitsRaw || []).filter((unit: any, index: number, self: any[]) =>
    index === self.findIndex((u) => isDuplicateUnitName(u.nama_unit, unit.nama_unit))
  );

  const createMutation = useMutation({
    mutationFn: (data: any) => {
      if (type === 'ksr') return unitsApi.createKSR(data);
      if (type === 'tsr') return unitsApi.createTSR(data);
      return unitsApi.createPMR({ ...data, tingkat: type.replace('pmr-', '').toUpperCase() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUnitsKey() });
      setIsModalOpen(false);
      setEditingUnit(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => {
      if (type === 'ksr') return unitsApi.updateKSR(id, data);
      if (type === 'tsr') return unitsApi.updateTSR(id, data);
      return unitsApi.updatePMR(id, { ...data, tingkat: type.replace('pmr-', '').toUpperCase() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUnitsKey() });
      setIsModalOpen(false);
      setEditingUnit(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      if (type === 'ksr') return unitsApi.deleteKSR(id);
      if (type === 'tsr') return unitsApi.deleteTSR(id);
      return unitsApi.deletePMR(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUnitsKey() });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    if (editingUnit) {
      updateMutation.mutate({ id: editingUnit.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredUnits = units.filter((unit: any) =>
    unit.nama_unit?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Header title={title} />
      <div className="space-y-4 lg:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-sm text-gray-600">Total: {filteredUnits.length} unit</p>
          <button
            onClick={() => {
              if (type === 'ksr') navigate('/units/ksr/add');
              else if (type === 'tsr') navigate('/units/tsr/add');
              else if (type === 'pmr-mula') navigate('/units/pmr/mula/add');
              else if (type === 'pmr-madya') navigate('/units/pmr/madya/add');
              else if (type === 'pmr-wira') navigate('/units/pmr/wira/add');
            }}
            className="btn-primary flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Unit</span>
          </button>
        </div>

        <div className="card overflow-hidden p-0">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari unit..."
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
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Unit</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Tingkat</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Provinsi</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Kabupaten</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUnits.map((unit: any) => (
                  <tr key={unit.id} className="table-row cursor-pointer" onClick={() => {
                  if (type === 'ksr') navigate(unit.kategori === 'PERGURUAN TINGGI' ? `/units/ksr/${unit.id}/perguruan-tinggi` : `/units/ksr/${unit.id}`);
                  else if (type === 'tsr') navigate(`/units/tsr/${unit.id}`);
                  else if (type.startsWith('pmr')) navigate(`/units/pmr/${unit.id}`);
                }}>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-900">{filteredUnits.indexOf(unit) + 1}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm font-medium text-gray-900">{unit.nama_unit}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{unit.tingkat}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">{unit.provinsi}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">{unit.kabupaten}</td>
                    <td className="px-4 lg:px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {unit.status}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditingUnit(unit); setIsModalOpen(true); }}
                          className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Hapus unit ini?')) {
                              deleteMutation.mutate(unit.id);
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
        onClose={() => { setIsModalOpen(false); setEditingUnit(null); }}
        title={editingUnit ? 'Edit Unit' : 'Tambah Unit'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Unit</label>
            <input
              type="text"
              name="nama_unit"
              defaultValue={editingUnit?.nama_unit || ''}
              className="input-field"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat</label>
              <select name="tingkat" defaultValue={editingUnit?.tingkat || 'MULA'} className="input-field">
                <option value="MULA">MULA</option>
                <option value="MADYA">MADYA</option>
                <option value="WIRA">WIRA</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" defaultValue={editingUnit?.status || 'Aktif'} className="input-field">
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi</label>
              <input
                type="text"
                name="provinsi"
                defaultValue={editingUnit?.provinsi || 'BANTEN'}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kabupaten</label>
              <input
                type="text"
                name="kabupaten"
                defaultValue={editingUnit?.kabupaten || 'KOTA CILEGON'}
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <textarea
              name="alamat"
              defaultValue={editingUnit?.alamat || ''}
              className="input-field"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                defaultValue={editingUnit?.email || ''}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No. Telpon</label>
              <input
                type="text"
                name="no_telpon"
                defaultValue={editingUnit?.no_telpon || ''}
                className="input-field"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1" disabled={createMutation.isPending || updateMutation.isPending}>
              {editingUnit ? 'Simpan Perubahan' : 'Tambah Unit'}
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
