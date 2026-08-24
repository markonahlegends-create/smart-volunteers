import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Building2, Mail, Phone, MapPin, Edit } from 'lucide-react';
import { useState } from 'react';
import Modal from '../components/ui/Modal';
import { markasApi } from '../services/resources';
import Header from '../components/layout/Header';

export default function Markas() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: markas, isLoading } = useQuery({
    queryKey: ['markas-pmi'],
    queryFn: () => markasApi.get(),
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => markasApi.update(markas?.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markas-pmi'] });
      setIsModalOpen(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div>
        <Header title="Markas PMI" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Markas PMI" />
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex flex-col sm:flex-row items-start gap-4 lg:gap-6">
            <div className="bg-primary-50 p-4 rounded-xl flex-shrink-0">
              <Building2 className="h-12 w-12 lg:h-16 lg:w-16 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">
                    {markas?.nama_pmi || 'PMI Kota Cilegon'}
                  </h2>
                  <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                    {markas?.level_pmi || 'KOTA'}
                  </span>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-secondary flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-4">Informasi Kontak</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-gray-600">
                <Building2 className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm lg:text-base break-words">{markas?.nama_kepala_markas || 'Ujang Samsul'}</span>
              </div>
              <div className="flex items-start gap-3 text-gray-600">
                <Phone className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm lg:text-base">{markas?.no_telpon || '254394617'}</span>
              </div>
              <div className="flex items-start gap-3 text-gray-600">
                <Mail className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm lg:text-base break-words">{markas?.email || 'markas@pmicilegon.or.id'}</span>
              </div>
              <div className="flex items-start gap-3 text-gray-600">
                <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm lg:text-base break-words">{markas?.alamat || 'Kota Cilegon, Banten'}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-4">Statistik</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700 text-sm lg:text-base">Unit PMR</span>
                <span className="font-bold text-blue-600">72</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700 text-sm lg:text-base">Unit KSR</span>
                <span className="font-bold text-green-600">1</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-gray-700 text-sm lg:text-base">Unit TSR</span>
                <span className="font-bold text-purple-600">1</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Markas PMI"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama PMI</label>
            <input
              type="text"
              name="nama_pmi"
              defaultValue={markas?.nama_pmi || ''}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kepala Markas</label>
            <input
              type="text"
              name="nama_kepala_markas"
              defaultValue={markas?.nama_kepala_markas || ''}
              className="input-field"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                defaultValue={markas?.email || ''}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No. Telpon</label>
              <input
                type="text"
                name="no_telpon"
                defaultValue={markas?.no_telpon || ''}
                className="input-field"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <textarea
              name="alamat"
              defaultValue={markas?.alamat || ''}
              className="input-field"
              rows={3}
              required
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1" disabled={updateMutation.isPending}>
              Simpan Perubahan
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
