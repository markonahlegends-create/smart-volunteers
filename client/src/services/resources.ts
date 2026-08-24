import api from './api';

export const markasApi = {
  get: async () => (await api.get('/markas-pmi')).data,
  create: async (data: any) => (await api.post('/markas-pmi', data)).data,
  update: async (id: number, data: any) => (await api.put(`/markas-pmi/${id}`, data)).data,
  delete: async (id: number) => (await api.delete(`/markas-pmi/${id}`)).data,
};

export const unitsApi = {
  getPMRMula: async () => (await api.get('/units/pmr/mula')).data,
  getPMRMadya: async () => (await api.get('/units/pmr/madya')).data,
  getPMRWira: async () => (await api.get('/units/pmr/wira')).data,
  getKSR: async () => (await api.get('/units/ksr')).data,
  getTSR: async () => (await api.get('/units/tsr')).data,

  createPMR: async (data: any) => (await api.post('/units/pmr', data)).data,
  updatePMR: async (id: number, data: any) => (await api.put(`/units/pmr/${id}`, data)).data,
  deletePMR: async (id: number) => (await api.delete(`/units/pmr/${id}`)).data,

  createKSR: async (data: any) => (await api.post('/units/ksr', data)).data,
  updateKSR: async (id: number, data: any) => (await api.put(`/units/ksr/${id}`, data)).data,
  deleteKSR: async (id: number) => (await api.delete(`/units/ksr/${id}`)).data,

  createTSR: async (data: any) => (await api.post('/units/tsr', data)).data,
  updateTSR: async (id: number, data: any) => (await api.put(`/units/tsr/${id}`, data)).data,
  deleteTSR: async (id: number) => (await api.delete(`/units/tsr/${id}`)).data,
};

export const membersApi = {
  getPMR: async (params?: any) => (await api.get('/members/pmr', { params })).data,
  getPMRById: async (id: number) => (await api.get(`/members/pmr/${id}`)).data,
  getKSR: async (params?: any) => (await api.get('/members/ksr', { params })).data,
  getKSRById: async (id: number) => (await api.get(`/members/ksr/${id}`)).data,
  getTSR: async (params?: any) => (await api.get('/members/tsr', { params })).data,
  getTSRById: async (id: number) => (await api.get(`/members/tsr/${id}`)).data,
  getDDS: async (params?: any) => (await api.get('/members/dds', { params })).data,
  getDDSById: async (id: number) => (await api.get(`/members/dds/${id}`)).data,

  createPMR: async (data: any) => (await api.post('/members/pmr', data)).data,
  updatePMR: async (id: number, data: any) => (await api.put(`/members/pmr/${id}`, data)).data,
  deletePMR: async (id: number) => (await api.delete(`/members/pmr/${id}`)).data,

  createKSR: async (data: any) => (await api.post('/members/ksr', data)).data,
  updateKSR: async (id: number, data: any) => (await api.put(`/members/ksr/${id}`, data)).data,
  deleteKSR: async (id: number) => (await api.delete(`/members/ksr/${id}`)).data,

  createTSR: async (data: any) => (await api.post('/members/tsr', data)).data,
  updateTSR: async (id: number, data: any) => (await api.put(`/members/tsr/${id}`, data)).data,
  deleteTSR: async (id: number) => (await api.delete(`/members/tsr/${id}`)).data,

  createDDS: async (data: any) => (await api.post('/members/dds', data)).data,
  updateDDS: async (id: number, data: any) => (await api.put(`/members/dds/${id}`, data)).data,
  deleteDDS: async (id: number) => (await api.delete(`/members/dds/${id}`)).data,
};

export const bencanaApi = {
  get: async (params?: any) => (await api.get('/bencana', { params })).data,
  create: async (data: any) => (await api.post('/bencana', data)).data,
  update: async (id: number, data: any) => (await api.put(`/bencana/${id}`, data)).data,
  delete: async (id: number) => (await api.delete(`/bencana/${id}`)).data,
};

export const rosterApi = {
  register: async (kode_anggota: string) => (await api.post('/roster/register', { kode_anggota })).data,
  get: async () => (await api.get('/roster')).data,
};

export const kegiatanApi = {
  get: async (params?: any) => (await api.get('/kegiatan', { params })).data,
  create: async (data: any) => (await api.post('/kegiatan', data)).data,
  update: async (id: number, data: any) => (await api.put(`/kegiatan/${id}`, data)).data,
  delete: async (id: number) => (await api.delete(`/kegiatan/${id}`)).data,
  downloadSemester: async (semester?: number, tahun?: number) => {
    const response = await api.get(`/kegiatan/download/semester`, {
      params: { semester, tahun },
      responseType: 'blob',
    });
    return response.data;
  },
  downloadKegiatan: async (semester?: number, tahun?: number, bidang?: string) => {
    const response = await api.get(`/kegiatan/download/kegiatan`, {
      params: { semester, tahun, bidang },
      responseType: 'blob',
    });
    return response.data;
  },
};
