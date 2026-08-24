import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Mail, Phone, MapPin, Calendar, User, FileText, Home, Shield, GraduationCap, Award, Briefcase, Heart } from 'lucide-react';
import { membersApi } from '../services/resources';
import Header from '../components/layout/Header';

type SidebarTab = 'profile' | 'domisili' | 'identitas_id' | 'kontak_darurat' | 'riwayat_keanggotaan' | 'pendidikan_formal' | 'diklat_pmi' | 'sertifikasi' | 'keahlian' | 'riwayat_organisasi' | 'riwayat_penghargaan';

const sidebarTabs: { key: SidebarTab; label: string; icon: any }[] = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'domisili', label: 'Domisili', icon: Home },
  { key: 'identitas_id', label: 'Identitas ID', icon: Shield },
  { key: 'kontak_darurat', label: 'Kontak Darurat', icon: Phone },
  { key: 'riwayat_keanggotaan', label: 'Riwayat Keanggotaan', icon: FileText },
  { key: 'pendidikan_formal', label: 'Pendidikan Formal', icon: GraduationCap },
  { key: 'diklat_pmi', label: 'Diklat PMI', icon: Award },
  { key: 'sertifikasi', label: 'Sertifikasi', icon: Shield },
  { key: 'keahlian', label: 'Keahlian/Keterampilan', icon: Heart },
  { key: 'riwayat_organisasi', label: 'Riwayat Organisasi', icon: Briefcase },
  { key: 'riwayat_penghargaan', label: 'Riwayat Penghargaan', icon: Award },
];

export default function MemberProfile() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SidebarTab>('profile');
  const [brokenFoto, setBrokenFoto] = useState(false);

  const memberType = type || 'ksr';

  const apiMap: any = {
    pmr: membersApi.getPMRById,
    ksr: membersApi.getKSRById,
    tsr: membersApi.getTSRById,
    dds: membersApi.getDDSById,
  };
  const getById = apiMap[memberType] || membersApi.getKSRById;

  const { data: member, isLoading } = useQuery({
    queryKey: ['member', memberType, id],
    queryFn: async () => {
      const data = await getById(Number(id));
      return data;
    },
    enabled: !!id,
  });

  const handleEdit = () => {
    navigate(`/members/${memberType}/add/${id}`);
  };

  if (isLoading) {
    return (
      <div>
        <Header title={`Profil Anggota ${memberType.toUpperCase()}`} />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div>
        <Header title={`Profil Anggota ${memberType.toUpperCase()}`} />
        <div className="text-center py-12">
          <p className="text-gray-500">Anggota tidak ditemukan</p>
          <button onClick={() => navigate(-1)} className="btn-primary mt-4">Kembali</button>
        </div>
      </div>
    );
  }

  const getInitials = (nama: string) => {
    return nama.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const renderProfileContent = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="bg-primary-100 p-4 rounded-full flex-shrink-0">
          {member.foto && !brokenFoto ? (
            <img src={member.foto} alt="Foto" className="h-20 w-20 rounded-full object-cover" onError={() => setBrokenFoto(true)} />
          ) : (
            <span className="text-3xl font-bold text-primary-600">{getInitials(member.nama || 'A')}</span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800">{member.nama || '-'}</h3>
          <p className="text-sm text-gray-500 font-mono">{member.kode_anggota || '-'}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">{member.jenis || memberType.toUpperCase()}</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${member.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {member.status || 'Aktif'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-start gap-3">
          <User className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Kelamin</p>
            <p className="text-sm font-medium text-gray-900">{member.kelamin || '-'}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">No HP</p>
            <p className="text-sm font-medium text-gray-900">{member.no_hp || '-'}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Mail className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-sm font-medium text-gray-900">{member.email || '-'}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Tempat Lahir</p>
            <p className="text-sm font-medium text-gray-900">{member.tempat_lahir || '-'}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Tanggal Lahir</p>
            <p className="text-sm font-medium text-gray-900">{member.tanggal_lahir || '-'}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Jenis Identitas</p>
            <p className="text-sm font-medium text-gray-900">{member.jenis_identitas || '-'}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">No Induk Kependudukan</p>
            <p className="text-sm font-medium text-gray-900">{member.no_nik || '-'}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Heart className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Agama</p>
            <p className="text-sm font-medium text-gray-900">{member.agama || '-'}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Award className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Golongan Darah</p>
            <p className="text-sm font-medium text-gray-900">{member.golongan_darah || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDomisiliContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Provinsi</p>
          <p className="text-sm font-medium text-gray-900">{member.dom_provinsi || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Kabupaten/Kota</p>
          <p className="text-sm font-medium text-gray-900">{member.dom_kabupaten || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Kecamatan</p>
          <p className="text-sm font-medium text-gray-900">{member.dom_kecamatan || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Desa/Kelurahan</p>
          <p className="text-sm font-medium text-gray-900">{member.dom_desa || '-'}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-sm text-gray-500">Alamat</p>
          <p className="text-sm font-medium text-gray-900">{member.alamat || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">RT / RW</p>
          <p className="text-sm font-medium text-gray-900">{member.rt || '-'} / {member.rw || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Kode Pos</p>
          <p className="text-sm font-medium text-gray-900">{member.kode_pos || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">No Telp</p>
          <p className="text-sm font-medium text-gray-900">{member.no_telp || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Domisili Status Kepemilikan</p>
          <p className="text-sm font-medium text-gray-900">{member.dom_status_kepemilikan || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status Tinggal</p>
          <p className="text-sm font-medium text-gray-900">{member.dom_status_tinggal || '-'}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-sm text-gray-500">Catatan</p>
          <p className="text-sm font-medium text-gray-900">{member.dom_catatan || '-'}</p>
        </div>
      </div>
    </div>
  );

  const renderIdentitasIDContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Provinsi</p>
          <p className="text-sm font-medium text-gray-900">{member.id_provinsi || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Kabupaten/Kota</p>
          <p className="text-sm font-medium text-gray-900">{member.id_kabupaten || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Kecamatan</p>
          <p className="text-sm font-medium text-gray-900">{member.id_kecamatan || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Desa/Kelurahan</p>
          <p className="text-sm font-medium text-gray-900">{member.id_desa || '-'}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-sm text-gray-500">Alamat</p>
          <p className="text-sm font-medium text-gray-900">{member.id_alamat || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">RT / RW</p>
          <p className="text-sm font-medium text-gray-900">{member.id_rt || '-'} / {member.id_rw || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Kode Pos</p>
          <p className="text-sm font-medium text-gray-900">{member.id_kode_pos || '-'}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-sm text-gray-500">Identitas Status Kepemilikan</p>
          <p className="text-sm font-medium text-gray-900">{member.id_status_kepemilikan || '-'}</p>
        </div>
      </div>
    </div>
  );

  const renderKontakDaruratContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Nama Kontak Darurat</p>
          <p className="text-sm font-medium text-gray-900">{member.kontak_darurat_nama || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Hubungan</p>
          <p className="text-sm font-medium text-gray-900">{member.kontak_darurat_hubungan || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">No HP</p>
          <p className="text-sm font-medium text-gray-900">{member.kontak_darurat_hp || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Alamat</p>
          <p className="text-sm font-medium text-gray-900">{member.kontak_darurat_alamat || '-'}</p>
        </div>
      </div>
    </div>
  );

  const renderRiwayatKeanggotaanContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Tahun Bergabung</p>
          <p className="text-sm font-medium text-gray-900">{member.riwayat_tahun_bergabung || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Unit Asal</p>
          <p className="text-sm font-medium text-gray-900">{member.riwayat_unit_asal || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Riwayat Jabatan</p>
          <p className="text-sm font-medium text-gray-900">{member.riwayat_jabatan || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Keterangan</p>
          <p className="text-sm font-medium text-gray-900">{member.riwayat_keterangan || '-'}</p>
        </div>
      </div>
    </div>
  );

  const renderPendidikanFormalContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Tingkat Pendidikan</p>
          <p className="text-sm font-medium text-gray-900">{member.pendidikan_tingkat || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Nama Institusi</p>
          <p className="text-sm font-medium text-gray-900">{member.pendidikan_institusi || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Jurusan</p>
          <p className="text-sm font-medium text-gray-900">{member.pendidikan_jurusan || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Tahun Lulus</p>
          <p className="text-sm font-medium text-gray-900">{member.pendidikan_tahun_lulus || '-'}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-sm text-gray-500">Ijazah</p>
          <p className="text-sm font-medium text-gray-900">{member.pendidikan_ijazah || '-'}</p>
        </div>
      </div>
    </div>
  );

  const renderDiklatPMIContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Nama Diklat</p>
          <p className="text-sm font-medium text-gray-900">{member.diklat_nama || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Penyelenggara</p>
          <p className="text-sm font-medium text-gray-900">{member.diklat_penyelenggara || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Tempat</p>
          <p className="text-sm font-medium text-gray-900">{member.diklat_tempat || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Tahun</p>
          <p className="text-sm font-medium text-gray-900">{member.diklat_tahun || '-'}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-sm text-gray-500">Sertifikat</p>
          <p className="text-sm font-medium text-gray-900">{member.diklat_sertifikat || '-'}</p>
        </div>
      </div>
    </div>
  );

  const renderSertifikasiContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Nama Sertifikasi</p>
          <p className="text-sm font-medium text-gray-900">{member.sertifikasi_nama || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Penerbit</p>
          <p className="text-sm font-medium text-gray-900">{member.sertifikasi_penerbit || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Nomor</p>
          <p className="text-sm font-medium text-gray-900">{member.sertifikasi_nomor || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Tahun</p>
          <p className="text-sm font-medium text-gray-900">{member.sertifikasi_tahun || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Berlaku Sampai</p>
          <p className="text-sm font-medium text-gray-900">{member.sertifikasi_berlaku || '-'}</p>
        </div>
      </div>
    </div>
  );

  const renderKeahlianContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Keahlian</p>
          <p className="text-sm font-medium text-gray-900">{member.keahlian || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Keterampilan</p>
          <p className="text-sm font-medium text-gray-900">{member.keterampilan || '-'}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-sm text-gray-500">Kategori</p>
          <p className="text-sm font-medium text-gray-900">{member.keahlian_kategori || '-'}</p>
        </div>
      </div>
    </div>
  );

  const renderRiwayatOrganisasiContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Nama Organisasi</p>
          <p className="text-sm font-medium text-gray-900">{member.organisasi_nama || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Jabatan</p>
          <p className="text-sm font-medium text-gray-900">{member.organisasi_jabatan || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Periode</p>
          <p className="text-sm font-medium text-gray-900">{member.organisasi_periode || '-'}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-sm text-gray-500">Keterangan</p>
          <p className="text-sm font-medium text-gray-900">{member.organisasi_keterangan || '-'}</p>
        </div>
      </div>
    </div>
  );

  const renderRiwayatPenghargaanContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Nama Penghargaan</p>
          <p className="text-sm font-medium text-gray-900">{member.penghargaan_nama || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Pemberi</p>
          <p className="text-sm font-medium text-gray-900">{member.penghargaan_pemberi || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Tahun</p>
          <p className="text-sm font-medium text-gray-900">{member.penghargaan_tahun || '-'}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-sm text-gray-500">Keterangan</p>
          <p className="text-sm font-medium text-gray-900">{member.penghargaan_keterangan || '-'}</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileContent();
      case 'domisili':
        return renderDomisiliContent();
      case 'identitas_id':
        return renderIdentitasIDContent();
      case 'kontak_darurat':
        return renderKontakDaruratContent();
      case 'riwayat_keanggotaan':
        return renderRiwayatKeanggotaanContent();
      case 'pendidikan_formal':
        return renderPendidikanFormalContent();
      case 'diklat_pmi':
        return renderDiklatPMIContent();
      case 'sertifikasi':
        return renderSertifikasiContent();
      case 'keahlian':
        return renderKeahlianContent();
      case 'riwayat_organisasi':
        return renderRiwayatOrganisasiContent();
      case 'riwayat_penghargaan':
        return renderRiwayatPenghargaanContent();
      default:
        return renderProfileContent();
    }
  };

  return (
    <div>
      <Header title={`Profil Anggota ${memberType.toUpperCase()}`} />
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-primary-600">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Sidebar Tabs - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="card p-0 overflow-hidden sticky top-6">
              <nav className="space-y-1">
                {sidebarTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab.key
                          ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Mobile Tabs Dropdown */}
          <div className="lg:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as SidebarTab)}
              className="input-field w-full"
            >
              {sidebarTabs.map((tab) => (
                <option key={tab.key} value={tab.key}>{tab.label}</option>
              ))}
            </select>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <h3 className="text-lg font-bold text-gray-800 capitalize">
                  {sidebarTabs.find(t => t.key === activeTab)?.label || 'Profile'}
                </h3>
                <button onClick={handleEdit} className="btn-primary inline-flex items-center gap-2 text-sm">
                  <Edit3 className="h-4 w-4" />
                  Update
                </button>
              </div>
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
