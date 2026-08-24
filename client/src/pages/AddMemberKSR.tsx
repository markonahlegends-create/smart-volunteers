import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, CheckCircle2, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { membersApi } from '../services/resources';
import { PROVINSI_OPTIONS, KABUPATEN_OPTIONS, getKecamatanOptions, getDesaOptions } from '../data/regions';
import Header from '../components/layout/Header';

const JENIS_IDENTITAS = ['KTP', 'Kartu Pelajar', 'SIM', 'Paspor', 'Lainnya'];
const GOLONGAN_DARAH = ['A', 'B', 'AB', 'O', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const AGAMA_LIST = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu', 'Lainnya'];
const KELAMIN_LIST = ['Laki-laki', 'Wanita'];

export default function AddMemberKSR() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const isEdit = !!id;
  const unitId = searchParams.get('unitId');

  const [form, setForm] = useState({
    provinsi: 'BANTEN',
    kabupaten: 'KOTA CILEGON',
    kode_anggota: '',
    nama: '',
    jenis_identitas: '',
    no_nik: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    kelamin: 'Laki-laki',
    agama: '',
    golongan_darah: '',
    email: '',
    no_hp: '',
    alamat_ktp: '',
    ktp_provinsi: 'BANTEN',
    ktp_kabupaten: 'KOTA CILEGON',
    ktp_kecamatan: '',
    ktp_desa: '',
    dom_is_alamat_ktp: true,
    dom_provinsi: 'BANTEN',
    dom_kabupaten: 'KOTA CILEGON',
    dom_kecamatan: '',
    dom_desa: '',
    kategori: 'Anggota',
    status: 'Aktif',
    nama_unit: '',
    jenis: 'KSR',
    angkatan: new Date().getFullYear(),
    kontak_darurat_nama: '',
    kontak_darurat_hubungan: '',
    kontak_darurat_hp: '',
    kontak_darurat_alamat: '',
    riwayat_tahun_bergabung: '',
    riwayat_unit_asal: '',
    riwayat_jabatan: '',
    riwayat_keterangan: '',
    pendidikan_tingkat: '',
    pendidikan_institusi: '',
    pendidikan_jurusan: '',
    pendidikan_tahun_lulus: '',
    pendidikan_ijazah: '',
    diklat_nama: '',
    diklat_penyelenggara: '',
    diklat_tempat: '',
    diklat_tahun: '',
    diklat_sertifikat: '',
    sertifikasi_nama: '',
    sertifikasi_penerbit: '',
    sertifikasi_nomor: '',
    sertifikasi_tahun: '',
    sertifikasi_berlaku: '',
    keahlian: '',
    keterampilan: '',
    keahlian_kategori: '',
    organisasi_nama: '',
    organisasi_jabatan: '',
    organisasi_periode: '',
    organisasi_keterangan: '',
    penghargaan_nama: '',
    penghargaan_pemberi: '',
    penghargaan_tahun: '',
    penghargaan_keterangan: '',
  });
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoRemoved, setFotoRemoved] = useState(false);
  const [fotoError, setFotoError] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [kecamatanLoading, setKecamatanLoading] = useState(false);

  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    if (form.dom_is_alamat_ktp) {
      setForm(prev => ({
        ...prev,
        dom_provinsi: prev.ktp_provinsi,
        dom_kabupaten: prev.ktp_kabupaten,
        dom_kecamatan: prev.ktp_kecamatan,
        dom_desa: prev.ktp_desa,
      }));
    }
  }, [form.dom_is_alamat_ktp, form.ktp_provinsi, form.ktp_kabupaten, form.ktp_kecamatan, form.ktp_desa]);

  useEffect(() => {
    if (unitId && !isEdit) {
      fetch(`/api/units/ksr/${unitId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then(res => res.ok ? res.json() : null)
        .then(unit => {
          if (unit) {
            setForm(prev => ({ ...prev, nama_unit: unit.nama_unit || '', jenis: 'KSR' }));
          }
        })
        .catch(() => {});
    }
  }, [unitId, isEdit]);

  useEffect(() => {
    if (isEdit && id) {
        membersApi.getKSRById(Number(id)).then((member: any) => {
          setForm({
            provinsi: member.provinsi || 'BANTEN',
            kabupaten: member.kabupaten || 'KOTA CILEGON',
            kode_anggota: member.kode_anggota || '',
            nama: member.nama || '',
            jenis_identitas: member.jenis_identitas || '',
            no_nik: member.no_nik || '',
            tempat_lahir: member.tempat_lahir || '',
            tanggal_lahir: member.tanggal_lahir || '',
            kelamin: member.kelamin || 'Laki-laki',
            agama: member.agama || '',
            golongan_darah: member.golongan_darah || '',
            email: member.email || '',
            no_hp: member.no_hp || '',
            alamat_ktp: member.alamat_ktp || '',
            ktp_provinsi: member.ktp_provinsi || 'BANTEN',
            ktp_kabupaten: member.ktp_kabupaten || 'KOTA CILEGON',
            ktp_kecamatan: member.ktp_kecamatan || '',
            ktp_desa: member.ktp_desa || '',
            dom_is_alamat_ktp: member.dom_is_alamat_ktp || false,
            dom_provinsi: member.dom_provinsi || 'BANTEN',
            dom_kabupaten: member.dom_kabupaten || 'KOTA CILEGON',
            dom_kecamatan: member.dom_kecamatan || '',
            dom_desa: member.dom_desa || '',
            kategori: member.kategori || 'Anggota',
            status: member.status || 'Aktif',
            nama_unit: member.nama_unit || '',
            jenis: member.jenis || 'KSR',
            angkatan: member.angkatan || new Date().getFullYear(),
            kontak_darurat_nama: member.kontak_darurat_nama || '',
            kontak_darurat_hubungan: member.kontak_darurat_hubungan || '',
            kontak_darurat_hp: member.kontak_darurat_hp || '',
            kontak_darurat_alamat: member.kontak_darurat_alamat || '',
            riwayat_tahun_bergabung: member.riwayat_tahun_bergabung || '',
            riwayat_unit_asal: member.riwayat_unit_asal || '',
            riwayat_jabatan: member.riwayat_jabatan || '',
            riwayat_keterangan: member.riwayat_keterangan || '',
            pendidikan_tingkat: member.pendidikan_tingkat || '',
            pendidikan_institusi: member.pendidikan_institusi || '',
            pendidikan_jurusan: member.pendidikan_jurusan || '',
            pendidikan_tahun_lulus: member.pendidikan_tahun_lulus || '',
            pendidikan_ijazah: member.pendidikan_ijazah || '',
            diklat_nama: member.diklat_nama || '',
            diklat_penyelenggara: member.diklat_penyelenggara || '',
            diklat_tempat: member.diklat_tempat || '',
            diklat_tahun: member.diklat_tahun || '',
            diklat_sertifikat: member.diklat_sertifikat || '',
            sertifikasi_nama: member.sertifikasi_nama || '',
            sertifikasi_penerbit: member.sertifikasi_penerbit || '',
            sertifikasi_nomor: member.sertifikasi_nomor || '',
            sertifikasi_tahun: member.sertifikasi_tahun || '',
            sertifikasi_berlaku: member.sertifikasi_berlaku || '',
            keahlian: member.keahlian || '',
            keterampilan: member.keterampilan || '',
            keahlian_kategori: member.keahlian_kategori || '',
            organisasi_nama: member.organisasi_nama || '',
            organisasi_jabatan: member.organisasi_jabatan || '',
            organisasi_periode: member.organisasi_periode || '',
            organisasi_keterangan: member.organisasi_keterangan || '',
            penghargaan_nama: member.penghargaan_nama || '',
            penghargaan_pemberi: member.penghargaan_pemberi || '',
            penghargaan_tahun: member.penghargaan_tahun || '',
            penghargaan_keterangan: member.penghargaan_keterangan || '',
          });
          setFotoRemoved(false);
          if (member.foto) setFotoPreview(member.foto);
          else setFotoPreview(null);
        });
      }
    }, [id, isEdit]);

   useEffect(() => {
     setFotoError(false);
   }, [fotoPreview]);

   const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    setCaptchaCode(code);
    setCaptchaInput('');
    setCaptchaVerified(false);
  };

  const handleVerifyCaptcha = () => {
    if (captchaInput.toUpperCase() === captchaCode) {
      setCaptchaVerified(true);
    } else {
      alert('Kode verifikasi salah');
      generateCaptcha();
    }
  };

  const handleKtpProvinsiChange = (provinsi: string) => {
    setForm(prev => ({ ...prev, ktp_provinsi: provinsi, ktp_kabupaten: '', ktp_kecamatan: '', ktp_desa: '' }));
  };

  const handleKtpKabupatenChange = (kabupaten: string) => {
    setForm(prev => ({ ...prev, ktp_kabupaten: kabupaten, ktp_kecamatan: '', ktp_desa: '' }));
  };

  const handleKtpKecamatanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setKecamatanLoading(true);
    setTimeout(() => {
      setForm(prev => ({ ...prev, ktp_kecamatan: val, ktp_desa: '' }));
      setKecamatanLoading(false);
    }, 500);
  };

  const handleDomKecamatanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setForm(prev => ({ ...prev, dom_kecamatan: val, dom_desa: '' }));
  };

  const handleKecamatanBlur = () => {
    if (!form.ktp_kecamatan) setKecamatanLoading(false);
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(file);
      setFotoRemoved(false);
      setFotoError(false);
      compressImage(file, 300, 0.7)
        .then(base64 => setFotoPreview(base64))
        .catch(() => {
          setFoto(null);
          setFotoRemoved(true);
          alert('Gagal memproses foto. Pastikan file gambar valid.');
        });
    }
  };

  const removeFoto = () => {
    setFoto(null);
    setFotoPreview(null);
    setFotoRemoved(true);
  };

  const compressImage = (file: File, maxWidth: number, quality: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas context not available'));
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const { data: unitOptions = [] } = useQuery({
    queryKey: ['units', 'autocomplete'],
    queryFn: async () => {
      const response = await api.get('/units/autocomplete');
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => membersApi.createKSR(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', 'ksr'] });
      navigate('/members/ksr');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Gagal menambah anggota';
      const detail = error?.response?.data?.error ? `\nDetail: ${error.response.data.error}` : '';
      alert(`${msg}${detail}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => membersApi.updateKSR(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', 'ksr'] });
      navigate('/members/ksr');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Gagal memperbarui anggota';
      const detail = error?.response?.data?.error ? `\nDetail: ${error.response.data.error}` : '';
      alert(`${msg}${detail}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaVerified) {
      alert('Harap verifikasi captcha terlebih dahulu');
      return;
    }
    const requiredFields = [
      { key: 'kode_anggota', label: 'Kode Anggota' },
      { key: 'nama', label: 'Nama Lengkap' },
      { key: 'nama_unit', label: 'Nama Unit' },
      { key: 'jenis', label: 'Jenis' },
      { key: 'kelamin', label: 'Jenis Kelamin' },
    ];
    const missing = requiredFields.find(f => !form[f.key as keyof typeof form]);
    if (missing) {
      alert(`Field "${missing.label}" harus diisi`);
      return;
    }
    const data: any = { ...form };
    if (fotoRemoved) {
      data.foto = null;
    } else if (fotoPreview) {
      data.foto = fotoPreview;
    }
    console.log('Submitting KSR:', data);
    if (isEdit && id) {
      updateMutation.mutate({ id: Number(id), data });
    } else {
      createMutation.mutate(data);
    }
  };

  const inputClass = "input-field";
  const selectClass = "input-field";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const requiredIndicator = <span className="text-red-500 ml-1">*</span>;

  return (
    <div>
      <Header title={isEdit ? 'Edit Anggota KSR' : 'Tambah Anggota KSR'} />
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Informasi Anggota</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Kode Anggota{requiredIndicator}</label>
                <input type="text" name="kode_anggota" value={form.kode_anggota} onChange={(e) => setForm({ ...form, kode_anggota: e.target.value })} className={inputClass} placeholder="Kode anggota" required />
              </div>
              <div>
                <label className={labelClass}>Nama Unit{requiredIndicator}</label>
                <input
                  type="text"
                  name="nama_unit"
                  value={form.nama_unit}
                  onChange={(e) => setForm({ ...form, nama_unit: e.target.value })}
                  className={inputClass}
                  placeholder="Nama unit"
                  list="unit-list"
                  required
                />
                <datalist id="unit-list">
                  {unitOptions.map((unit: string) => (
                    <option key={unit} value={unit} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className={labelClass}>Angkatan{requiredIndicator}</label>
                <input type="number" name="angkatan" value={form.angkatan} onChange={(e) => setForm({ ...form, angkatan: parseInt(e.target.value) || new Date().getFullYear() })} className={inputClass} placeholder="Tahun angkatan" required />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Informasi Pribadi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Jenis Identitas</label>
                <select name="jenis_identitas" value={form.jenis_identitas} onChange={(e) => setForm({ ...form, jenis_identitas: e.target.value })} className={selectClass}>
                  <option value="">Pilih Jenis Identitas</option>
                  {JENIS_IDENTITAS.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>No Induk Kependudukan</label>
                <input type="text" name="no_nik" value={form.no_nik} onChange={(e) => setForm({ ...form, no_nik: e.target.value })} className={inputClass} placeholder="Nomor NIK" />
              </div>
              <div>
                <label className={labelClass}>Nama Lengkap{requiredIndicator}</label>
                <input type="text" name="nama" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Tempat Lahir</label>
                <div className="relative">
                  <input type="text" name="tempat_lahir" value={form.tempat_lahir} onChange={(e) => setForm({ ...form, tempat_lahir: e.target.value })} className={inputClass} placeholder="Tempat lahir" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Tanggal Lahir</label>
                <div className="relative">
                  <input type="date" name="tanggal_lahir" value={form.tanggal_lahir} onChange={(e) => setForm({ ...form, tanggal_lahir: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Jenis Kelamin{requiredIndicator}</label>
                <select name="kelamin" value={form.kelamin} onChange={(e) => setForm({ ...form, kelamin: e.target.value })} className={selectClass} required>
                  {KELAMIN_LIST.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Agama</label>
                <select name="agama" value={form.agama} onChange={(e) => setForm({ ...form, agama: e.target.value })} className={selectClass}>
                  <option value="">Pilih Agama</option>
                  {AGAMA_LIST.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Golongan Darah</label>
                <select name="golongan_darah" value={form.golongan_darah} onChange={(e) => setForm({ ...form, golongan_darah: e.target.value })} className={selectClass}>
                  <option value="">Pilih Golongan Darah</option>
                  {GOLONGAN_DARAH.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="email@example.com" />
              </div>
              <div>
                <label className={labelClass}>No HP</label>
                <input type="text" name="no_hp" value={form.no_hp} onChange={(e) => setForm({ ...form, no_hp: e.target.value })} className={inputClass} placeholder="08123456789" />
              </div>
              <div>
                <label className={labelClass}>Kategori</label>
                <select name="kategori" value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} className={selectClass}>
                  <option value="Koordinator">Koordinator</option>
                  <option value="Anggota">Anggota</option>
                  <option value="Calon Anggota">Calon Anggota</option>
                  <option value="Anggota Tidak Aktif">Anggota Tidak Aktif</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select name="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={selectClass}>
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                  <option value="Suspend">Suspend</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Alamat Sesuai KTP</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Alamat{requiredIndicator}</label>
                <textarea name="alamat_ktp" value={form.alamat_ktp} onChange={(e) => setForm({ ...form, alamat_ktp: e.target.value })} className={inputClass} rows={2} placeholder="Alamat sesuai KTP" required />
              </div>
              <div>
                <label className={labelClass}>Provinsi{requiredIndicator}</label>
                <select value={form.ktp_provinsi} onChange={(e) => handleKtpProvinsiChange(e.target.value)} className={selectClass}>
                  <option value="">Pilih Provinsi</option>
                  {PROVINSI_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Kabupaten/Kota{requiredIndicator}</label>
                <select value={form.ktp_kabupaten} onChange={(e) => handleKtpKabupatenChange(e.target.value)} className={selectClass}>
                  <option value="">Pilih Kabupaten/Kota</option>
                  {(KABUPATEN_OPTIONS[form.ktp_provinsi] || []).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Kecamatan{requiredIndicator}</label>
                <select value={form.ktp_kecamatan} onChange={handleKtpKecamatanChange} onBlur={handleKecamatanBlur} className={selectClass} disabled={kecamatanLoading}>
                  <option value="">Pilih Kecamatan</option>
                  {getKecamatanOptions(form.ktp_provinsi, form.ktp_kabupaten).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
                {kecamatanLoading && <p className="text-xs text-gray-500 mt-1">Memuat...</p>}
              </div>
              <div>
                <label className={labelClass}>Desa/Kelurahan{requiredIndicator}</label>
                <select value={form.ktp_desa} onChange={(e) => setForm({ ...form, ktp_desa: e.target.value })} className={selectClass}>
                  <option value="">Pilih Desa/Kelurahan</option>
                  {getDesaOptions(form.ktp_provinsi, form.ktp_kabupaten, form.ktp_kecamatan).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.dom_is_alamat_ktp}
                    onChange={(e) => setForm({ ...form, dom_is_alamat_ktp: e.target.checked })}
                    className="h-4 w-4 text-primary-600 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Alamat KTP termasuk Domisili</span>
                </label>
              </div>
            </div>
          </div>

          {!form.dom_is_alamat_ktp && (
            <div className="card">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Domisili Tempat Tinggal</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Provinsi</label>
                  <select value="BANTEN" disabled className={selectClass}>
                    <option value="BANTEN">BANTEN</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Kabupaten/Kota</label>
                  <select value="KOTA CILEGON" disabled className={selectClass}>
                    <option value="KOTA CILEGON">KOTA CILEGON</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Kecamatan</label>
                  <select value={form.dom_kecamatan} onChange={handleDomKecamatanChange} className={selectClass}>
                    <option value="">Pilih Kecamatan</option>
                    {getKecamatanOptions('BANTEN', 'KOTA CILEGON').map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Desa/Kelurahan</label>
                  <select value={form.dom_desa} onChange={(e) => setForm({ ...form, dom_desa: e.target.value })} className={selectClass}>
                    <option value="">Pilih Desa/Kelurahan</option>
                    {getDesaOptions('BANTEN', 'KOTA CILEGON', form.dom_kecamatan).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Foto Anggota</h3>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="flex-shrink-0">
                {fotoPreview && !fotoError ? (
                  <div className="relative">
                    <img src={fotoPreview} alt="Preview" className="h-32 w-32 object-cover rounded-lg border border-gray-200" onError={() => setFotoError(true)} />
                    <button type="button" onClick={removeFoto} className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="h-32 w-32 flex items-center justify-center bg-gray-100 rounded-lg border border-dashed border-gray-300">
                    <span className="text-2xl font-bold text-gray-400">
                      {form.nama ? form.nama.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className={labelClass}>Upload Foto</label>
                <div className="flex items-center gap-3">
                  <input type="file" accept="image/*" onChange={handleFotoChange} className="hidden" id="foto-upload" />
                  <label htmlFor="foto-upload" className="btn-secondary cursor-pointer inline-flex items-center gap-2 text-sm">
                    <Upload className="h-4 w-4" />
                    Browse
                  </label>
                  {foto && <span className="text-sm text-gray-600">{foto.name}</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Kontak Darurat</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Nama Kontak Darurat</label>
                <input type="text" name="kontak_darurat_nama" value={form.kontak_darurat_nama} onChange={(e) => setForm({ ...form, kontak_darurat_nama: e.target.value })} className={inputClass} placeholder="Nama kontak darurat" />
              </div>
              <div>
                <label className={labelClass}>Hubungan</label>
                <input type="text" name="kontak_darurat_hubungan" value={form.kontak_darurat_hubungan} onChange={(e) => setForm({ ...form, kontak_darurat_hubungan: e.target.value })} className={inputClass} placeholder="Hubungan" />
              </div>
              <div>
                <label className={labelClass}>No HP</label>
                <input type="text" name="kontak_darurat_hp" value={form.kontak_darurat_hp} onChange={(e) => setForm({ ...form, kontak_darurat_hp: e.target.value })} className={inputClass} placeholder="No HP" />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className={labelClass}>Alamat</label>
                <textarea name="kontak_darurat_alamat" value={form.kontak_darurat_alamat} onChange={(e) => setForm({ ...form, kontak_darurat_alamat: e.target.value })} className={inputClass} rows={2} placeholder="Alamat kontak darurat" />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Riwayat Keanggotaan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Tahun Bergabung</label>
                <input type="text" name="riwayat_tahun_bergabung" value={form.riwayat_tahun_bergabung} onChange={(e) => setForm({ ...form, riwayat_tahun_bergabung: e.target.value })} className={inputClass} placeholder="Tahun bergabung" />
              </div>
              <div>
                <label className={labelClass}>Unit Asal</label>
                <input type="text" name="riwayat_unit_asal" value={form.riwayat_unit_asal} onChange={(e) => setForm({ ...form, riwayat_unit_asal: e.target.value })} className={inputClass} placeholder="Unit asal" />
              </div>
              <div>
                <label className={labelClass}>Riwayat Jabatan</label>
                <input type="text" name="riwayat_jabatan" value={form.riwayat_jabatan} onChange={(e) => setForm({ ...form, riwayat_jabatan: e.target.value })} className={inputClass} placeholder="Jabatan" />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className={labelClass}>Keterangan</label>
                <textarea name="riwayat_keterangan" value={form.riwayat_keterangan} onChange={(e) => setForm({ ...form, riwayat_keterangan: e.target.value })} className={inputClass} rows={2} placeholder="Keterangan riwayat keanggotaan" />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Pendidikan Formal</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Tingkat Pendidikan</label>
                <select name="pendidikan_tingkat" value={form.pendidikan_tingkat} onChange={(e) => setForm({ ...form, pendidikan_tingkat: e.target.value })} className={selectClass}>
                  <option value="">Pilih Tingkat</option>
                  <option value="SD">SD</option>
                  <option value="SMP">SMP</option>
                  <option value="SMA">SMA</option>
                  <option value="D3">D3</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Nama Institusi</label>
                <input type="text" name="pendidikan_institusi" value={form.pendidikan_institusi} onChange={(e) => setForm({ ...form, pendidikan_institusi: e.target.value })} className={inputClass} placeholder="Nama institusi" />
              </div>
              <div>
                <label className={labelClass}>Jurusan</label>
                <input type="text" name="pendidikan_jurusan" value={form.pendidikan_jurusan} onChange={(e) => setForm({ ...form, pendidikan_jurusan: e.target.value })} className={inputClass} placeholder="Jurusan" />
              </div>
              <div>
                <label className={labelClass}>Tahun Lulus</label>
                <input type="text" name="pendidikan_tahun_lulus" value={form.pendidikan_tahun_lulus} onChange={(e) => setForm({ ...form, pendidikan_tahun_lulus: e.target.value })} className={inputClass} placeholder="Tahun lulus" />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className={labelClass}>Ijazah</label>
                <input type="text" name="pendidikan_ijazah" value={form.pendidikan_ijazah} onChange={(e) => setForm({ ...form, pendidikan_ijazah: e.target.value })} className={inputClass} placeholder="Nomor ijazah / deskripsi" />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Diklat PMI</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Nama Diklat</label>
                <input type="text" name="diklat_nama" value={form.diklat_nama} onChange={(e) => setForm({ ...form, diklat_nama: e.target.value })} className={inputClass} placeholder="Nama diklat" />
              </div>
              <div>
                <label className={labelClass}>Penyelenggara</label>
                <input type="text" name="diklat_penyelenggara" value={form.diklat_penyelenggara} onChange={(e) => setForm({ ...form, diklat_penyelenggara: e.target.value })} className={inputClass} placeholder="Penyelenggara" />
              </div>
              <div>
                <label className={labelClass}>Tempat</label>
                <input type="text" name="diklat_tempat" value={form.diklat_tempat} onChange={(e) => setForm({ ...form, diklat_tempat: e.target.value })} className={inputClass} placeholder="Tempat" />
              </div>
              <div>
                <label className={labelClass}>Tahun</label>
                <input type="text" name="diklat_tahun" value={form.diklat_tahun} onChange={(e) => setForm({ ...form, diklat_tahun: e.target.value })} className={inputClass} placeholder="Tahun" />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className={labelClass}>Sertifikat</label>
                <input type="text" name="diklat_sertifikat" value={form.diklat_sertifikat} onChange={(e) => setForm({ ...form, diklat_sertifikat: e.target.value })} className={inputClass} placeholder="Nomor / deskripsi sertifikat" />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Sertifikasi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Nama Sertifikasi</label>
                <input type="text" name="sertifikasi_nama" value={form.sertifikasi_nama} onChange={(e) => setForm({ ...form, sertifikasi_nama: e.target.value })} className={inputClass} placeholder="Nama sertifikasi" />
              </div>
              <div>
                <label className={labelClass}>Penerbit</label>
                <input type="text" name="sertifikasi_penerbit" value={form.sertifikasi_penerbit} onChange={(e) => setForm({ ...form, sertifikasi_penerbit: e.target.value })} className={inputClass} placeholder="Penerbit" />
              </div>
              <div>
                <label className={labelClass}>Nomor</label>
                <input type="text" name="sertifikasi_nomor" value={form.sertifikasi_nomor} onChange={(e) => setForm({ ...form, sertifikasi_nomor: e.target.value })} className={inputClass} placeholder="Nomor" />
              </div>
              <div>
                <label className={labelClass}>Tahun</label>
                <input type="text" name="sertifikasi_tahun" value={form.sertifikasi_tahun} onChange={(e) => setForm({ ...form, sertifikasi_tahun: e.target.value })} className={inputClass} placeholder="Tahun" />
              </div>
              <div>
                <label className={labelClass}>Berlaku Sampai</label>
                <input type="text" name="sertifikasi_berlaku" value={form.sertifikasi_berlaku} onChange={(e) => setForm({ ...form, sertifikasi_berlaku: e.target.value })} className={inputClass} placeholder="Berlaku sampai" />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Keahlian / Keterampilan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Keahlian</label>
                <input type="text" name="keahlian" value={form.keahlian} onChange={(e) => setForm({ ...form, keahlian: e.target.value })} className={inputClass} placeholder="Keahlian" />
              </div>
              <div>
                <label className={labelClass}>Keterampilan</label>
                <input type="text" name="keterampilan" value={form.keterampilan} onChange={(e) => setForm({ ...form, keterampilan: e.target.value })} className={inputClass} placeholder="Keterampilan" />
              </div>
              <div>
                <label className={labelClass}>Kategori</label>
                <input type="text" name="keahlian_kategori" value={form.keahlian_kategori} onChange={(e) => setForm({ ...form, keahlian_kategori: e.target.value })} className={inputClass} placeholder="Kategori" />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Riwayat Organisasi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Nama Organisasi</label>
                <input type="text" name="organisasi_nama" value={form.organisasi_nama} onChange={(e) => setForm({ ...form, organisasi_nama: e.target.value })} className={inputClass} placeholder="Nama organisasi" />
              </div>
              <div>
                <label className={labelClass}>Jabatan</label>
                <input type="text" name="organisasi_jabatan" value={form.organisasi_jabatan} onChange={(e) => setForm({ ...form, organisasi_jabatan: e.target.value })} className={inputClass} placeholder="Jabatan" />
              </div>
              <div>
                <label className={labelClass}>Periode</label>
                <input type="text" name="organisasi_periode" value={form.organisasi_periode} onChange={(e) => setForm({ ...form, organisasi_periode: e.target.value })} className={inputClass} placeholder="Periode" />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className={labelClass}>Keterangan</label>
                <textarea name="organisasi_keterangan" value={form.organisasi_keterangan} onChange={(e) => setForm({ ...form, organisasi_keterangan: e.target.value })} className={inputClass} rows={2} placeholder="Keterangan" />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Riwayat Penghargaan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Nama Penghargaan</label>
                <input type="text" name="penghargaan_nama" value={form.penghargaan_nama} onChange={(e) => setForm({ ...form, penghargaan_nama: e.target.value })} className={inputClass} placeholder="Nama penghargaan" />
              </div>
              <div>
                <label className={labelClass}>Pemberi</label>
                <input type="text" name="penghargaan_pemberi" value={form.penghargaan_pemberi} onChange={(e) => setForm({ ...form, penghargaan_pemberi: e.target.value })} className={inputClass} placeholder="Pemberi" />
              </div>
              <div>
                <label className={labelClass}>Tahun</label>
                <input type="text" name="penghargaan_tahun" value={form.penghargaan_tahun} onChange={(e) => setForm({ ...form, penghargaan_tahun: e.target.value })} className={inputClass} placeholder="Tahun" />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className={labelClass}>Keterangan</label>
                <textarea name="penghargaan_keterangan" value={form.penghargaan_keterangan} onChange={(e) => setForm({ ...form, penghargaan_keterangan: e.target.value })} className={inputClass} rows={2} placeholder="Keterangan" />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Verifikasi</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="flex-1">
                <label className={labelClass}>Kode Verifikasi</label>
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 px-4 py-2 rounded-lg font-mono text-lg tracking-widest text-gray-800 select-none">
                    {captchaCode}
                  </div>
                  <button type="button" onClick={generateCaptcha} className="p-2 hover:bg-gray-100 rounded-lg" title="Refresh kode">
                    <RefreshCw className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <label className={labelClass}>Masukkan Kode</label>
                <input
                  type="text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                  className={inputClass}
                  placeholder="Masukkan kode verifikasi"
                  disabled={captchaVerified}
                />
              </div>
              <div>
                {captchaVerified ? (
                  <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircle2 className="h-4 w-4" /> Terverifikasi
                  </span>
                ) : (
                  <button type="button" onClick={handleVerifyCaptcha} className="btn-secondary text-sm">
                    Verifikasi
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button type="submit" className="btn-primary flex-1" disabled={createMutation.isPending || updateMutation.isPending || !captchaVerified}>
              {isEdit ? 'Simpan Perubahan' : 'Daftar Anggota'}
            </button>
            <button type="button" onClick={() => navigate('/members/ksr')} className="btn-secondary">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
