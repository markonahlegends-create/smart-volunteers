import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart, Users, Shield, Phone, Mail, MapPin, Globe, HandHeart, Plus } from 'lucide-react';

const principles = [
  { title: 'Kemanusiaan', desc: 'Mengutamakan penghargaan terhadap martabat manusia dan melindungi jiwa serta kesehatan.', icon: Heart },
  { title: 'Netralitas', desc: 'Tidak mengambil pihak dalam konflik, menjaga kepercayaan semua pihak.', icon: Shield },
  { title: 'Ketidakberpihakan', desc: 'Memberi bantuan tanpa memandang suku, keyakinan, atau latar belakang.', icon: Users },
  { title: 'Kemandirian', desc: 'Mengelola organisasi secara otonom sesuai dengan prinsip gerakan.', icon: Globe },
  { title: 'Sukarela', desc: 'Dikelola oleh relawan yang bekerja tanpa pamrih dan ikhlas.', icon: HandHeart },
  { title: 'Kesatuan', desc: 'Hanya ada satu organisasi PMI di setiap negara.', icon: Users },
  { title: 'Universalitas', desc: 'Gerakan PMI adalah satu gerakan global yang sama di seluruh dunia.', icon: Globe },
];

function FloatingIcon({ children, x = 0, y = 0, size = 40, delay = 0 }: { children: React.ReactNode; x?: number; y?: number; size?: number; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay, type: 'spring' }}
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <motion.div
        animate={{ y: [0, -25, 0], rotate: [0, 15, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay }}
        className="relative"
        style={{ width: size, height: size }}
      >
        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl" />
        <div className="relative z-10 flex items-center justify-center w-full h-full text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

function CrescentMoon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function NeonCard({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
      whileHover={{ y: -8, rotateX: 4, rotateY: 4 }}
      className={`relative bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-xl transition-all duration-500 hover:shadow-red-500/30 hover:border-red-500/50 ${className}`}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
    >
      {children}
    </motion.div>
  );
}

interface Stats {
  total_pmr: number;
  total_ksr: number;
  total_tsr: number;
  total_relawan: number;
  total_units: number;
  total_bencana: number;
  total_kegiatan: number;
  total_penerima_manfaat: number;
}

export default function Landing() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -120]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/public-stats')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then((data: Stats) => { setStats(data); setLoadingStats(false); })
      .catch(() => setLoadingStats(false));
  }, []);

  const formatNumber = (n: number) => n.toLocaleString('id-ID');

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden font-sans selection:bg-red-500/30">
      <nav className="fixed top-0 w-full z-50 bg-gray-900/70 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div className="flex items-center gap-16" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="relative">
              <img src="/logopmiputih.png" alt="PMI Logo" className="h-16 relative z-10" />
              <div className="absolute inset-0 bg-red-500/30 blur-xl rounded-full" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide">Smart Volunteers</h1>
              <p className="text-xs text-gray-400 tracking-wider">PMI Kota Cilegon</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Link to="/login" className="relative group px-6 py-2.5 rounded-full font-semibold text-sm overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 opacity-80 group-hover:opacity-100 transition-opacity" />
              <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 shadow-[0_0_20px_rgba(239,68,68,0.6)] transition-all duration-500" />
              <span className="relative z-10">Masuk</span>
            </Link>
          </motion.div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]" />
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <video className="absolute inset-0 w-full h-full object-cover opacity-[0.04] mix-blend-normal" autoPlay muted loop playsInline>
            <source src="/parallax-pmi.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <FloatingIcon x={8} y={15} size={48} delay={0.2}>
          <Plus className="h-8 w-8" />
        </FloatingIcon>
        <FloatingIcon x={85} y={20} size={56} delay={0.5}>
          <CrescentMoon size={32} />
        </FloatingIcon>
        <FloatingIcon x={15} y={70} size={40} delay={0.8}>
          <Plus className="h-6 w-6" />
        </FloatingIcon>
        <FloatingIcon x={80} y={65} size={44} delay={1.1}>
          <CrescentMoon size={28} />
        </FloatingIcon>
        <FloatingIcon x={50} y={10} size={36} delay={1.4}>
          <Plus className="h-5 w-5" />
        </FloatingIcon>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }} className="mb-8 relative inline-block">
            <div className="absolute inset-0 bg-red-500/40 blur-3xl rounded-full animate-pulse" />
            <img src="/logopmiputih.png" alt="PMI Logo" className="h-28 md:h-36 mx-auto relative z-10 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]" />
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-5xl md:text-7xl font-black mb-4 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-white to-orange-400">Smart</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-white to-red-400">Volunteers</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-xl md:text-2xl text-gray-300 mb-10 font-light">
            Sistem Manajemen Relawan <span className="text-red-400 font-semibold">PMI Kota Cilegon</span>
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex flex-wrap justify-center gap-4">
            <Link to="/login" className="group relative px-10 py-4 rounded-full font-bold text-lg overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500" />
              <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 shadow-[0_0_30px_rgba(239,68,68,0.8)] transition-all duration-500 blur-xl" />
              <span className="relative z-10 flex items-center gap-2">
                Masuk ke Sistem
                <HandHeart className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </span>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {loadingStats ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center animate-pulse">
                  <div className="h-12 w-24 bg-gray-700 rounded mx-auto mb-2" />
                  <div className="h-3 w-20 bg-gray-700 rounded mx-auto" />
                </div>
              ))
            ) : stats ? (
              [
                { label: 'Relawan Aktif', value: formatNumber(stats.total_relawan), neon: 'text-orange-300' },
                { label: 'Penerima Manfaat', value: formatNumber(stats.total_penerima_manfaat), neon: 'text-red-300' },
                { label: 'Kegiatan', value: formatNumber(stats.total_kegiatan), neon: 'text-white' },
                { label: 'Unit Terdaftar', value: formatNumber(stats.total_units), neon: 'text-orange-300' },
              ].map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + i * 0.1 }} className="text-center">
                  <div className={`text-4xl md:text-5xl font-black ${stat.neon} drop-shadow-[0_0_10px_currentColor] mb-1`}>{stat.value}</div>
                  <div className="text-xs uppercase tracking-widest text-gray-400">{stat.label}</div>
                </motion.div>
              ))
            ) : null}
          </motion.div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-red-500/50 flex justify-center pt-2">
            <div className="w-1 h-3 bg-red-400 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      <section className="relative py-24 px-6 bg-gray-900 z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-gray-900 to-black" />
        <div className="relative max-w-7xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="text-red-400">7</span> Prinsip Dasar <span className="text-red-400">PMI</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Prinsip yang menjadi landasan setiap tindakan kemanusiaan yang kami laksanakan.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((p, i) => (
              <NeonCard key={p.title} delay={i * 0.1}>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4 mx-auto">
                    <p.icon className="h-6 w-6 text-red-400" />
                  </div>
                  <h3 className="text-lg font-bold text-center mb-2 text-white">{p.title}</h3>
                  <p className="text-sm text-gray-400 text-center leading-relaxed">{p.desc}</p>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full blur-2xl -mr-10 -mt-10" />
              </NeonCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-black relative overflow-hidden z-10">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-red-600/20 to-orange-500/20 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-center mb-16">
            Dampak <span className="text-orange-400">Kemanusiaan</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Respons Bencana', desc: 'Mobilisasi tim relawan dalam hitungan jam untuk tanggap darurat.', icon: Shield, color: 'from-red-500 to-orange-500' },
              { title: 'Pelayanan Medis', desc: 'Posyandu, donor darah, dan layanan kesehatan masyarakat.', icon: Heart, color: 'from-orange-500 to-red-500' },
              { title: 'Pengembangan Relawan', desc: 'Diklat dan sertifikasi SDM kemanusiaan secara berkelanjutan.', icon: Users, color: 'from-red-500 to-orange-400' },
            ].map((item, i) => (
              <NeonCard key={item.title} delay={i * 0.15}>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                <div className="mt-6 h-1 w-full bg-gradient-to-r from-red-500/50 to-orange-500/50 rounded-full overflow-hidden">
                  <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 1, delay: i * 0.2 }} className="h-full bg-gradient-to-r from-red-400 to-orange-400 rounded-full" />
                </div>
              </NeonCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gray-900 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-center mb-16">
            Mengapa <span className="text-red-400">Smart Volunteers</span>?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'Manajemen Unit Terpadu', desc: 'Kelola PMR, KSR, dan TSR dalam satu platform terintegrasi dengan data real-time.', icon: Users },
              { title: 'Database Anggota Lengkap', desc: 'Profil anggota, riwayat diklat, dan dokumen tersimpan aman dan mudah diakses.', icon: Heart },
              { title: 'Monitoring Bencana', desc: 'Catat penanggulangan bencana dengan timestamp dan koordinat untuk akuntabilitas.', icon: Shield },
              { title: 'Laporan Otomatis', desc: 'Generate laporan kegiatan dalam format Word dan Excel dengan satu klik.', icon: Globe },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex gap-6 group">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/20 flex items-center justify-center group-hover:border-red-500/50 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all duration-500">
                  <item.icon className="h-7 w-7 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-red-400 transition-colors">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden z-10">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.h2 initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} className="text-4xl md:text-6xl font-black mb-6">
            Relawan <span className="text-red-500">PMI Kota Cilegon</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Bergabung dengan kami dan jadi bagian dari gerakan kemanusiaan terbesar di dunia.
          </motion.p>

          {loadingStats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-gray-800 rounded-2xl mb-2" />
                  <div className="h-4 w-24 bg-gray-800 rounded mx-auto" />
                </div>
              ))}
            </div>
          ) : stats ? (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Relawan', value: formatNumber(stats.total_relawan), neon: 'text-orange-300' },
                { label: 'PMR', value: formatNumber(stats.total_pmr), neon: 'text-red-300' },
                { label: 'KSR', value: formatNumber(stats.total_ksr), neon: 'text-orange-300' },
                { label: 'TSR', value: formatNumber(stats.total_tsr), neon: 'text-red-300' },
              ].map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="bg-gray-900/60 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 shadow-xl hover:shadow-red-500/20 hover:border-red-500/40 transition-all duration-500">
                  <div className={`text-4xl md:text-5xl font-black ${stat.neon} drop-shadow-[0_0_10px_currentColor] mb-2`}>{stat.value}</div>
                  <div className="text-xs uppercase tracking-widest text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          ) : null}
        </div>
      </section>

      <footer className="bg-black border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-16">
              <img src="/logopmiputih.png" alt="PMI Logo" className="h-16 opacity-80" />
              <div>
                <h3 className="font-bold">Smart Volunteers</h3>
                <p className="text-xs text-gray-500">PMI Kota Cilegon</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-red-400" /> +62 254 123456</span>
              <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-red-400" /> info@pmi-cilegon.or.id</span>
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-red-400" /> Kota Cilegon, Banten</span>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">© 2026 Palang Merah Indonesia Kota Cilegon. All rights reserved.</p>
            <a href="https://fadil-labs.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-red-400 transition-colors">
              by Fadil Advertising
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
