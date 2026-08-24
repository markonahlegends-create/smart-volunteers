export interface User {
  id: number;
  email: string;
  nama: string;
  role: string;
}

export interface MarkasPMI {
  id: number;
  nama_pmi: string;
  level_pmi: string;
  nama_kepala_markas: string;
  no_telpon: string;
  email: string;
  kode_pos: string;
  alamat: string;
}

export interface UnitPMR {
  id: number;
  id_provinsi: number;
  id_kabupaten: number;
  nama_unit: string;
  alamat: string;
  email: string;
  no_telpon: string;
  status: string;
  tingkat: 'MULA' | 'MADYA' | 'WIRA';
}

export interface UnitKSR {
  id: number;
  id_provinsi: number;
  id_kabupaten: number;
  nama_unit: string;
  alamat: string;
  email: string;
  no_telpon: string;
  status: string;
  jenis: 'MARKAS' | 'PERGURUAN_TINGGI';
}

export interface UnitTSR {
  id: number;
  id_provinsi: number;
  id_kabupaten: number;
  nama_unit: string;
  alamat: string;
  email: string;
  no_telpon: string;
  status: string;
  jenis: string;
}

export interface AnggotaPMR {
  id: number;
  domisili_id_provinsi: number;
  domisili_id_kabupaten: number;
  angkatan: number;
  kode_anggota: string;
  nama: string;
  kelamin: string;
  status: string;
  id_unit: number;
  nama_pmi: string;
  nama_unit: string;
  jenis: string;
}

export interface AnggotaKSR {
  id: number;
  domisili_id_provinsi: number;
  domisili_id_kabupaten: number;
  angkatan: number;
  kode_anggota: string;
  nama: string;
  kelamin: string;
  status: string;
  id_unit: number;
  nama_pmi: string;
  nama_unit: string;
  jenis: string;
  jenis_identitas?: string;
  no_nik?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  agama?: string;
  golongan_darah?: string;
  email?: string;
  no_hp?: string;
  alamat_ktp?: string;
  ktp_provinsi?: string;
  ktp_kabupaten?: string;
  ktp_kecamatan?: string;
  ktp_desa?: string;
  dom_is_alamat_ktp?: boolean;
  dom_provinsi?: string;
  dom_kabupaten?: string;
  dom_kecamatan?: string;
  dom_desa?: string;
  alamat?: string;
  rt?: string;
  rw?: string;
  kode_pos?: string;
  no_telp?: string;
  dom_status_kepemilikan?: string;
  dom_status_tinggal?: string;
  dom_catatan?: string;
  id_provinsi?: string;
  id_kabupaten?: string;
  id_kecamatan?: string;
  id_desa?: string;
  id_alamat?: string;
  id_rt?: string;
  id_rw?: string;
  id_kode_pos?: string;
  id_status_kepemilikan?: string;
  foto?: string;
}

export interface AnggotaTSR {
  id: number;
  domisili_id_provinsi: number;
  domisili_id_kabupaten: number;
  angkatan: number;
  kode_anggota: string;
  nama: string;
  kelamin: string;
  status: string;
  id_unit: number;
  nama_pmi: string;
  nama_unit: string;
  jenis: string;
}

export interface Bencana {
  id: number;
  jenis_bencana: string;
  nama_kejadian: string;
  tanggal_kejadian: string;
  id_provinsi: number;
  level: string;
  status: string;
}

export interface Roster {
  id: number;
  kode_anggota: string;
  nama: string;
  unit: string;
  jenis: string;
  created_at: string;
}

export interface DashboardStats {
  total_pmr: number;
  total_ksr: number;
  total_tsr: number;
  total_units: number;
  total_bencana: number;
}
