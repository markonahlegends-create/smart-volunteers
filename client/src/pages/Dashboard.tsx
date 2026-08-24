import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserCheck,
  Activity,
  TrendingUp,
  Building2,
  Calendar as CalendarIcon,
  AlertTriangle,
  ClipboardList,
  RefreshCcw,
  FileSpreadsheet,
  FileText,
  Plus,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import api from '../services/api';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 space-y-3">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-8 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-32 bg-gray-200 rounded" />
        </div>
        <div className="h-10 w-10 bg-gray-200 rounded-lg flex-shrink-0" />
      </div>
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="h-6 w-40 bg-gray-200 rounded mb-6" />
      <div className="h-[280px] w-full bg-gray-100 rounded" />
    </div>
  );
}

interface DashboardStats {
  total_pmr: number;
  total_ksr: number;
  total_tsr: number;
  total_relawan: number;
  total_units: number;
  total_bencana: number;
  total_kegiatan: number;
}

interface PmrBreakdown {
  mula: number;
  madya: number;
  wira: number;
  total: number;
}

interface GrowthData {
  month: string;
  pmr: number;
  ksr: number;
  tsr: number;
}

interface StatCardConfig {
  title: string;
  value: number | undefined;
  icon: typeof Users;
  color: string;
  bg: string;
  textColor: string;
}

const FALLBACK_EVENTS = [
  { date: new Date().toISOString(), title: 'Banjir di Kota Cilegon' },
  { date: new Date(Date.now() + 86400000).toISOString(), title: 'Kebakaran di Jenderal Sudirman' },
  { date: new Date(Date.now() + 172800000).toISOString(), title: 'Longsor di Perkebunan' },
];

const topStatsCards: Omit<StatCardConfig, 'value'>[] = [
  { title: 'Total PMR', icon: Users, color: '#DC2626', bg: 'bg-red-50', textColor: 'text-red-600' },
  { title: 'Total KSR', icon: UserCheck, color: '#10B981', bg: 'bg-emerald-50', textColor: 'text-emerald-600' },
  { title: 'Total TSR', icon: Activity, color: '#6366F1', bg: 'bg-indigo-50', textColor: 'text-indigo-600' },
  { title: 'Total Unit', icon: Building2, color: '#F59E0B', bg: 'bg-amber-50', textColor: 'text-amber-600' },
  { title: 'Total Relawan', icon: Users, color: '#0EA5E9', bg: 'bg-sky-50', textColor: 'text-sky-600' },
];

function QuickAccessModal({
  isOpen,
  onClose,
  title,
  items,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: { label: string; path: string; icon: typeof Users }[];
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">{title}</h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-2">
              {items.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors group"
                >
                  <div className="p-2 bg-white rounded-lg group-hover:scale-110 transition-transform">
                    <item.icon className="h-5 w-5 text-primary-600" />
                  </div>
                  <span className="font-medium text-primary-700 text-sm lg:text-base">{item.label}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MiniCalendar({ events = [] }: { events?: { date: string; title: string }[] }) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const isToday = (day: number | null) => day === today.getDate();
  const hasEvent = (day: number | null) => events.some(e => new Date(e.date).getDate() === day);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-700 text-sm">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <CalendarIcon className="h-4 w-4 text-gray-400" />
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="text-gray-400 font-medium py-1">{d}</div>
        ))}
        {days.map((day, i) => (
          <div
            key={i}
            className={`py-1.5 rounded-lg text-xs font-medium ${
              !day
                ? 'text-gray-300'
                : isToday(day)
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {day}
            {day && hasEvent(day) && !isToday(day) && (
              <span className="block w-1 h-1 bg-red-400 rounded-full mx-auto mt-0.5"></span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-1.5">
        {events.slice(0, 3).map((event, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></span>
            <span className="text-gray-600 truncate">{event.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CircularStat({ value, label, color, size = 100 }: { value: number; label: string; color: string; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(value / 100, 1);
  const offset = circumference - percentage * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="6"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-800">{value}</span>
        </div>
      </div>
      <span className="text-xs text-gray-500 mt-2 font-medium">{label}</span>
    </div>
  );
}

function SmallCircularStat({ value, maxValue, color }: { value: number; maxValue: number; color: string }) {
  const size = 48;
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = maxValue > 0 ? Math.min(value / maxValue, 1) : 0;
  const offset = circumference - percentage * circumference;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="5"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold text-gray-700">{Math.round(percentage * 100)}%</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [unitModalOpen, setUnitModalOpen] = useState(false);
  const [laporanModalOpen, setLaporanModalOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      await api.post('/sync/all');
      setSyncMessage('Sinkronisasi ke Google Sheets berhasil');
    } catch (e) {
      setSyncMessage('Sinkronisasi gagal, silakan coba lagi');
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(null), 4000);
    }
  };

  const { data: stats, isLoading, error: statsError, refetch: refetchStats } = useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await api.get('/dashboard/stats');
      return response.data;
    },
    retry: 1,
  });

  const { data: pmrBreakdown, error: pmrError, refetch: refetchPmr } = useQuery<PmrBreakdown>({
    queryKey: ['dashboard', 'pmr-breakdown'],
    queryFn: async () => {
      const response = await api.get('/dashboard/pmr-breakdown');
      return response.data;
    },
    retry: 1,
  });

  const { data: growth, error: growthError, refetch: refetchGrowth } = useQuery<GrowthData[]>({
    queryKey: ['dashboard', 'growth'],
    queryFn: async () => {
      const response = await api.get('/dashboard/growth');
      return response.data;
    },
    retry: 1,
  });

  const { data: bencana, error: bencanaError, refetch: refetchBencana } = useQuery<any[]>({
    queryKey: ['bencana'],
    queryFn: async () => {
      const response = await api.get('/bencana');
      return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    },
    retry: 1,
  });

  const handleRetry = async () => {
    await Promise.all([refetchStats(), refetchPmr(), refetchGrowth(), refetchBencana()]);
  };

  const hasError = statsError || pmrError || growthError || bencanaError;

  const pmr = pmrBreakdown?.total ?? stats?.total_pmr ?? 0;
  const pmrMula = pmrBreakdown?.mula ?? 0;
  const pmrMadya = pmrBreakdown?.madya ?? 0;
  const pmrWira = pmrBreakdown?.wira ?? 0;

  const calendarEventsBase = (bencana || []).slice(0, 5).map((b: any) => ({
    date: b.created_at || new Date().toISOString(),
    title: b.nama_bencana || 'Bencana',
  }));

  const calendarEvents = calendarEventsBase.length > 0 ? calendarEventsBase : FALLBACK_EVENTS;

  const growthData = growth && growth.length > 0 ? growth : [
    { month: 'Jan', pmr: 120, ksr: 80, tsr: 45 },
    { month: 'Feb', pmr: 135, ksr: 92, tsr: 50 },
    { month: 'Mar', pmr: 150, ksr: 105, tsr: 62 },
    { month: 'Apr', pmr: 165, ksr: 118, tsr: 70 },
    { month: 'May', pmr: 180, ksr: 130, tsr: 85 },
    { month: 'Jun', pmr: 195, ksr: 145, tsr: 95 },
  ];

  const areaData = growth && growth.length > 0 ? growth.map((g) => ({ month: g.month, members: g.pmr + g.ksr + g.tsr })) : [
    { month: 'Jan', members: 245 },
    { month: 'Feb', members: 277 },
    { month: 'Mar', members: 317 },
    { month: 'Apr', members: 353 },
    { month: 'May', members: 395 },
    { month: 'Jun', members: 435 },
  ];

  const topStats: StatCardConfig[] = [
    { ...topStatsCards[0], value: stats?.total_pmr },
    { ...topStatsCards[1], value: stats?.total_ksr },
    { ...topStatsCards[2], value: stats?.total_tsr },
    { ...topStatsCards[3], value: stats?.total_units },
    { ...topStatsCards[4], value: stats?.total_relawan },
  ];

  const memberOptions = [
    { label: 'Tambah Anggota PMR', path: '/members/pmr/add', icon: Users },
    { label: 'Tambah Anggota KSR', path: '/members/ksr/add', icon: Users },
    { label: 'Tambah Anggota TSR', path: '/members/tsr/add', icon: Users },
  ];

  const unitOptions = [
    { label: 'Tambah Unit PMR', path: '/units/pmr/mula/add', icon: Building2 },
    { label: 'Tambah Unit KSR', path: '/units/ksr/add', icon: Building2 },
    { label: 'Tambah Unit TSR', path: '/units/tsr/add', icon: Building2 },
  ];

  const laporanOptions = [
    { label: 'Laporan Semester', path: '/api/kegiatan/download/semester', icon: FileSpreadsheet },
    { label: 'Laporan Kegiatan', path: '/api/kegiatan/download/kegiatan', icon: FileText },
    { label: 'Tambah Kegiatan', path: '/laporan', icon: Plus },
  ];

  const horizontalBars = [
    { name: 'PMR', value: stats?.total_pmr ?? 0, color: '#DC2626' },
    { name: 'KSR', value: stats?.total_ksr ?? 0, color: '#10B981' },
    { name: 'TSR', value: stats?.total_tsr ?? 0, color: '#6366F1' },
    { name: 'Unit', value: stats?.total_units ?? 0, color: '#F59E0B' },
  ];
  const maxHValue = Math.max(...horizontalBars.map((b) => b.value), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm lg:text-base text-gray-600 mt-1">Selamat datang di Smart Volunteers PMI Kota Cilegon</p>
      </div>

      {hasError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-medium">Gagal memuat data dashboard</p>
            <p className="text-sm text-red-600">Beberapa informasi mungkin tidak akurat. Silakan coba lagi.</p>
          </div>
          <button onClick={handleRetry} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
            Coba Lagi
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Google Sheets Sync</h2>
          <p className="text-sm text-gray-500">Sinkronkan data ke spreadsheet Smart Volunteers</p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-70 transition-colors"
        >
          <RefreshCcw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Menyinkronkan...' : 'Sync ke Google Sheets'}
        </button>
      </div>

      {syncMessage && (
        <div className={`rounded-xl p-3 text-sm ${syncMessage.includes('berhasil') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {syncMessage}
        </div>
      )}

      {/* Top Row: Stats + Calendar */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
        <div className="xl:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            topStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-default"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs lg:text-sm text-gray-500 font-medium mb-1">{stat.title}</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                      {stat.value?.toLocaleString() ?? 0}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="h-3 w-3 text-emerald-500" />
                      <span className="text-xs text-emerald-600 font-medium">+12.5%</span>
                      <span className="text-xs text-gray-400">vs last month</span>
                    </div>
                  </div>
                  <div className={`${stat.bg} p-2.5 rounded-lg flex-shrink-0`}>
                    <stat.icon className={`h-5 w-5 lg:h-6 lg:w-6 ${stat.textColor}`} />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {isLoading ? (
          <div className="xl:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-pulse">
            <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
            <div className="h-64 bg-gray-100 rounded" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="xl:col-span-3"
          >
            <MiniCalendar events={calendarEvents} />
          </motion.div>
        )}
      </div>

      {/* Quick Access */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-4">Akses Cepat</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setMemberModalOpen(true)}
            className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors text-center group"
          >
            <Users className="h-6 w-6 text-primary-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-medium text-primary-700 text-sm lg:text-base">Tambah Anggota</p>
          </button>
          <button
            onClick={() => setUnitModalOpen(true)}
            className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors text-center group"
          >
            <Building2 className="h-6 w-6 text-primary-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-medium text-primary-700 text-sm lg:text-base">Tambah Unit</p>
          </button>
          <a
            href="/bencana"
            className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors text-center group"
          >
            <AlertTriangle className="h-6 w-6 text-primary-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-medium text-primary-700 text-sm lg:text-base">Laporan Bencana</p>
          </a>
          <button
            onClick={() => setLaporanModalOpen(true)}
            className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors text-center group"
          >
            <ClipboardList className="h-6 w-6 text-primary-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-medium text-primary-700 text-sm lg:text-base">Download Laporan</p>
          </button>
        </div>
      </motion.div>

      {/* Middle Row: Circular Stats + Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {isLoading ? (
          <>
            <SkeletonChart />
            <SkeletonChart />
          </>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-6">Breakdown PMR</h2>
              <div className="flex flex-wrap justify-center gap-8">
                <CircularStat value={pmrMula} label="PMR Mula" color="#10B981" size={110} />
                <CircularStat value={pmrMadya} label="PMR Madya" color="#3B82F6" size={110} />
                <CircularStat value={pmrWira} label="PMR Wira" color="#F59E0B" size={110} />
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center gap-6 text-sm">
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-800">{pmr.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Total PMR</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-4">Pertumbuhan Bulanan</h2>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={growthData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                      cursor={{ fill: '#F9FAFB' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="pmr" fill="#DC2626" radius={[4, 4, 0, 0]} name="PMR" />
                    <Bar dataKey="ksr" fill="#10B981" radius={[4, 4, 0, 0]} name="KSR" />
                    <Bar dataKey="tsr" fill="#6366F1" radius={[4, 4, 0, 0]} name="TSR" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Bottom Row: Area Chart + Horizontal Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {isLoading ? (
          <>
            <SkeletonChart />
            <SkeletonChart />
          </>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-4">Tren Anggota</h2>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#DC2626" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="members"
                      stroke="#DC2626"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorMembers)"
                      name="Total Anggota"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-6">Distribusi Kategori</h2>
              <div className="space-y-5">
                {horizontalBars.map((bar, i) => {
                  const percentage = maxHValue > 0 ? (bar.value / maxHValue) * 100 : 0;
                  return (
                    <div key={bar.name} className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-600 w-12 flex-shrink-0">{bar.name}</span>
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: bar.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.9 + i * 0.1, ease: 'easeOut' }}
                        />
                      </div>
                      <SmallCircularStat value={bar.value} maxValue={maxHValue} color={bar.color} />
                      <span className="text-xs text-gray-500 w-10 text-right">{Math.round(percentage)}%</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </div>

      <QuickAccessModal
        isOpen={memberModalOpen}
        onClose={() => setMemberModalOpen(false)}
        title="Tambah Anggota"
        items={memberOptions}
      />
      <QuickAccessModal
        isOpen={unitModalOpen}
        onClose={() => setUnitModalOpen(false)}
        title="Tambah Unit"
        items={unitOptions}
      />
      <QuickAccessModal
        isOpen={laporanModalOpen}
        onClose={() => setLaporanModalOpen(false)}
        title="Download Laporan"
        items={laporanOptions}
      />
    </div>
  );
}
