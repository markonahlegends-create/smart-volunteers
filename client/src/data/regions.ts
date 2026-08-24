export const PROVINSI_OPTIONS = [
  'Aceh',
  'Sumatera Utara',
  'Sumatera Barat',
  'Riau',
  'Jambi',
  'Sumatera Selatan',
  'Bengkulu',
  'Lampung',
  'Kepulauan Bangka Belitung',
  'Kepulauan Riau',
  'DKI Jakarta',
  'Jawa Barat',
  'Jawa Tengah',
  'DI Yogyakarta',
  'Jawa Timur',
  'Banten',
  'Bali',
  'Nusa Tenggara Barat',
  'Nusa Tenggara Timur',
  'Kalimantan Barat',
  'Kalimantan Tengah',
  'Kalimantan Selatan',
  'Kalimantan Timur',
  'Kalimantan Utara',
  'Sulawesi Utara',
  'Sulawesi Tengah',
  'Sulawesi Selatan',
  'Sulawesi Tenggara',
  'Gorontalo',
  'Sulawesi Barat',
  'Maluku',
  'Maluku Utara',
  'Papua',
  'Papua Barat',
  'Papua Selatan',
  'Papua Tengah',
  'Papua Pegunungan',
  'Papua Barat Daya',
];

export const KABUPATEN_OPTIONS: Record<string, string[]> = {
  'Banten': ['KOTA CILEGON', 'LEBAK', 'PANDEGLANG', 'SERANG', 'KABUPATEN SERANG'],
  'DKI Jakarta': ['Jakarta Pusat', 'Jakarta Utara', 'Jakarta Barat', 'Jakarta Selatan', 'Jakarta Timur'],
  'Jawa Barat': ['Kota Bandung', 'Kota Bekasi', 'Kota Bogor', 'Kota Depok', 'Kota Cimahi', 'Kota Banjar', 'Kabupaten Bandung', 'Kabupaten Bekasi', 'Kabupaten Bogor', 'Kabupaten Cianjur', 'Kabupaten Cirebon', 'Kabupaten Garut', 'Kabupaten Indramayu', 'Kabupaten Karawang', 'Kabupaten Kuningan', 'Kabupaten Majalengka', 'Kabupaten Pangandaran', 'Kabupaten Purwakarta', 'Kabupaten Subang', 'Kabupaten Sukabumi', 'Kabupaten Sumedang', 'Kabupaten Tasikmalaya'],
  'Jawa Tengah': ['Kota Semarang', 'Kota Surakarta', 'Kota Salatiga', 'Kota Pekalongan', 'Kota Tegal', 'Kabupaten Banjarnegara', 'Kabupaten Banyumas', 'Kabupaten Batang', 'Kabupaten Blora', 'Kabupaten Boyolali', 'Kabupaten Brebes', 'Kabupaten Cilacap', 'Kabupaten Demak', 'Kabupaten Grobogan', 'Kabupaten Jepara', 'Kabupaten Karanganyar', 'Kabupaten Kebumen', 'Kabupaten Kendal', 'Kabupaten Klaten', 'Kabupaten Kudus', 'Kabupaten Magelang', 'Kabupaten Pati', 'Kabupaten Pekalongan', 'Kabupaten Pemalang', 'Kabupaten Purbalingga', 'Kabupaten Purworejo', 'Kabupaten Rembang', 'Kabupaten Semarang', 'Kabupaten Sragen', 'Kabupaten Sukoharjo', 'Kabupaten Tegal', 'Kabupaten Temanggung', 'Kabupaten Wonogiri', 'Kabupaten Wonosobo'],
  'Jawa Timur': ['Kota Surabaya', 'Kota Malang', 'Kota Batu', 'Kota Blitar', 'Kota Kediri', 'Kota Madiun', 'Kota Mojokerto', 'Kota Pasuruan', 'Kota Probolinggo', 'Kabupaten Banyuwangi', 'Kabupaten Blitar', 'Kabupaten Bojonegoro', 'Kabupaten Bondowoso', 'Kabupaten Gresik', 'Kabupaten Jember', 'Kabupaten Jombang', 'Kabupaten Kediri', 'Kabupaten Lamongan', 'Kabupaten Lumajang', 'Kabupaten Madiun', 'Kabupaten Magetan', 'Kabupaten Malang', 'Kabupaten Mojokerto', 'Kabupaten Nganjuk', 'Kabupaten Ngawi', 'Kabupaten Pacitan', 'Kabupaten Pamekasan', 'Kabupaten Pasuruan', 'Kabupaten Ponorogo', 'Kabupaten Probolinggo', 'Kabupaten Sampang', 'Kabupaten Sidoarjo', 'Kabupaten Situbondo', 'Kabupaten Sumenep', 'Kabupaten Trenggalek', 'Kabupaten Tuban', 'Kabupaten Tulungagung'],
};

export const KECAMATAN_OPTIONS: Record<string, Record<string, string[]>> = {
  'KOTA CILEGON': {
    'Cibeber': ['Bulakan', 'Cibeber', 'Cikerai', 'Kalitimbang', 'Karangasem', 'Kedaleman'],
    'Cilegon': ['Bagendung', 'Bendungan', 'Ciwaduk', 'Ciwedus', 'Ketileng'],
    'Citangkil': ['Citangkil', 'Deringo', 'Kebonsari', 'Lebakdenok', 'Samangraya', 'Tamanbaru', 'Warnasari'],
    'Ciwandan': ['Banjar Negara', 'Gunungsugih', 'Kepuh', 'Kubangsari', 'Randakari', 'Tegalratu'],
    'Gerogol': ['Gerem', 'Gerogol', 'Kotasari', 'Rawa Arum'],
    'Jombang': ['Gedong Dalem', 'Jombang Wetan', 'Masigit', 'Panggung Rawi', 'Sukmajaya'],
    'Pulomerak': ['Lebak Gede', 'Mekarsari', 'Suralaya', 'Tamansari'],
    'Purwakarta': ['Kebondalem', 'Kotabumi', 'Pabean', 'Purwakarta', 'Ramanuju', 'Tegal Bunder'],
  },
  'LEBAK': {
    'Rangkasbitung': ['Cileles', 'Hajimena', 'Kadumanggu', 'Muncung', 'Nangerang', 'Pasirjaya', 'Rangkasbitung Barat', 'Rangkasbitung Timur', 'Sobang'],
    'Malingping': ['Bojongkoneng', 'Gunungkencana', 'Lebakwangi', 'Malingping Barat', 'Malingping Selatan', 'Malingping Utara', 'Padasuka', 'Sangkanhurip'],
    'Pandeglang': ['Cibadak', 'Cihaur', 'Cisabrang', 'Kaduranten', 'Pandeglang', 'Sukamanah'],
    'Bayah': ['Bayah Barat', 'Bayah Selatan', 'Bayah Utara', 'Cibeureum', 'Cikulak', 'Cikuning', 'Lebaksiuh'],
  },
  'PANDEGLANG': {
    'Pandeglang': ['Babakan', 'Bintangresmi', 'Kadumukti', 'Kadusirung', 'Karatungan', 'Pandeglang', 'Sukamulya'],
    'Cileles': ['Cileles', 'Kadudampit', 'Kadung', 'Karangpamulang', 'Mekarsari', 'Padasuka', 'Sobang'],
  },
  'SERANG': {
    'Serang': ['Cipocok Jaya', 'Kota Tua', 'Lontar', 'Pancur', 'Pangadegan', 'Serang', 'Sumur Pecung'],
    'Cipocok': ['Cipocok', 'Karanganyar', 'Kebon Cau', 'Kota Serang', 'Lingkung', 'Pakuncen', 'Pelawad'],
  },
  'KABUPATEN SERANG': {
    'Cikupa': ['Bojong', 'Cikupa', 'Dukuh', 'Kelapa Dua', 'Krembangan', 'Pasir Ampo', 'Sukasirna'],
    'Kresek': ['Cikande', 'Kresek', 'Lebak Kepuh', 'Pamengkang', 'Sangiang', 'Sukamaju'],
  },
};

export const DESA_OPTIONS: Record<string, Record<string, Record<string, string[]>>> = {
  'KOTA CILEGON': {
    'Cibeber': {
      'Bulakan': ['Bulakan'],
      'Cibeber': ['Cibeber'],
      'Cikerai': ['Cikerai'],
      'Kalitimbang': ['Kalitimbang'],
      'Karangasem': ['Karangasem'],
      'Kedaleman': ['Kedaleman'],
    },
    'Cilegon': {
      'Bagendung': ['Bagendung'],
      'Bendungan': ['Bendungan'],
      'Ciwaduk': ['Ciwaduk'],
      'Ciwedus': ['Ciwedus'],
      'Ketileng': ['Ketileng'],
    },
    'Citangkil': {
      'Citangkil': ['Citangkil'],
      'Deringo': ['Deringo'],
      'Kebonsari': ['Kebonsari'],
      'Lebakdenok': ['Lebakdenok'],
      'Samangraya': ['Samangraya'],
      'Tamanbaru': ['Tamanbaru'],
      'Warnasari': ['Warnasari'],
    },
    'Ciwandan': {
      'Banjar Negara': ['Banjar Negara'],
      'Gunungsugih': ['Gunungsugih'],
      'Kepuh': ['Kepuh'],
      'Kubangsari': ['Kubangsari'],
      'Randakari': ['Randakari'],
      'Tegalratu': ['Tegalratu'],
    },
    'Gerogol': {
      'Gerem': ['Gerem'],
      'Gerogol': ['Gerogol'],
      'Kotasari': ['Kotasari'],
      'Rawa Arum': ['Rawa Arum'],
    },
    'Jombang': {
      'Gedong Dalem': ['Gedong Dalem'],
      'Jombang Wetan': ['Jombang Wetan'],
      'Masigit': ['Masigit'],
      'Panggung Rawi': ['Panggung Rawi'],
      'Sukmajaya': ['Sukmajaya'],
    },
    'Pulomerak': {
      'Lebak Gede': ['Lebak Gede'],
      'Mekarsari': ['Mekarsari'],
      'Suralaya': ['Suralaya'],
      'Tamansari': ['Tamansari'],
    },
    'Purwakarta': {
      'Kebondalem': ['Kebondalem'],
      'Kotabumi': ['Kotabumi'],
      'Pabean': ['Pabean'],
      'Purwakarta': ['Purwakarta'],
      'Ramanuju': ['Ramanuju'],
      'Tegal Bunder': ['Tegal Bunder'],
    },
  },
  'LEBAK': {
    'Rangkasbitung': {
      'Cileles': ['Cileles'],
      'Hajimena': ['Hajimena'],
      'Kadumanggu': ['Kadumanggu'],
      'Muncung': ['Muncung'],
      'Nangerang': ['Nangerang'],
      'Pasirjaya': ['Pasirjaya'],
      'Rangkasbitung Barat': ['Rangkasbitung Barat'],
      'Rangkasbitung Timur': ['Rangkasbitung Timur'],
      'Sobang': ['Sobang'],
    },
    'Malingping': {
      'Bojongkoneng': ['Bojongkoneng'],
      'Gunungkencana': ['Gunungkencana'],
      'Lebakwangi': ['Lebakwangi'],
      'Malingping Barat': ['Malingping Barat'],
      'Malingping Selatan': ['Malingping Selatan'],
      'Malingping Utara': ['Malingping Utara'],
      'Padasuka': ['Padasuka'],
      'Sangkanhurip': ['Sangkanhurip'],
    },
  },
  'PANDEGLANG': {
    'Pandeglang': {
      'Babakan': ['Babakan'],
      'Bintangresmi': ['Bintangresmi'],
      'Kadumukti': ['Kadumukti'],
      'Kadusirung': ['Kadusirung'],
      'Karatungan': ['Karatungan'],
      'Pandeglang': ['Pandeglang'],
      'Sukamulya': ['Sukamulya'],
    },
    'Cileles': {
      'Cileles': ['Cileles'],
      'Kadudampit': ['Kadudampit'],
      'Kadung': ['Kadung'],
      'Karangpamulang': ['Karangpamulang'],
      'Mekarsari': ['Mekarsari'],
      'Padasuka': ['Padasuka'],
      'Sobang': ['Sobang'],
    },
  },
};

export const getKecamatanOptions = (_provinsi: string, kabupaten: string): string[] => {
  if (kabupaten && KECAMATAN_OPTIONS[kabupaten]) {
    return Object.keys(KECAMATAN_OPTIONS[kabupaten]);
  }
  return [];
};

export const getDesaOptions = (_provinsi: string, kabupaten: string, kecamatan: string): string[] => {
  if (kabupaten && kecamatan && DESA_OPTIONS[kabupaten]?.[kecamatan]) {
    return Object.keys(DESA_OPTIONS[kabupaten][kecamatan]);
  }
  return [];
};
