import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  AlertTriangle,
  FileText,
  User,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/markas', label: 'Markas PMI', icon: Building2 },
  { path: '/units/pmr/mula', label: 'Unit PMR Mula', icon: Users },
  { path: '/units/pmr/madya', label: 'Unit PMR Madya', icon: Users },
  { path: '/units/pmr/wira', label: 'Unit PMR Wira', icon: Users },
  { path: '/units/ksr', label: 'Unit KSR', icon: Users },
  { path: '/units/tsr', label: 'Unit TSR', icon: Users },
  { path: '/members/pmr', label: 'Anggota PMR', icon: Users },
  { path: '/members/ksr', label: 'Anggota KSR', icon: Users },
  { path: '/members/tsr', label: 'Anggota TSR', icon: Users },
  { path: '/bencana', label: 'Kejadian Bencana', icon: AlertTriangle },
  { path: '/laporan', label: 'Laporan', icon: FileText },
  { path: '/profile', label: 'Profile', icon: User },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onLaporanClick?: () => void;
}

export default function Sidebar({ isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-2 lg:p-4 xl:p-6">
        <div className={`flex flex-col items-center gap-2 mb-4 lg:mb-6 ${isCollapsed ? 'lg:px-2' : ''}`}>
          <motion.img
            src="/logo_pmi.png"
            alt="PMI Logo"
            className={`object-contain flex-shrink-0 ${isCollapsed ? 'h-10 w-10 lg:h-12 lg:w-12' : 'h-14 w-14 lg:h-20 lg:w-20'}`}
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          />
          {!isCollapsed && (
            <div className="text-center min-w-0">
              <motion.h1
                className="text-sm lg:text-lg font-bold text-primary-600 truncate"
                style={{ textShadow: '0 0 8px rgba(37, 99, 235, 0.3)' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Smart Volunteers
              </motion.h1>
              <motion.p
                className="text-xs text-gray-500 truncate"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                PMI Kota Cilegon
              </motion.p>
            </div>
          )}
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            if (item.path === '/laporan') {
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    onLaporanClick?.();
                    setIsMobileOpen(false);
                  }}
                  className={`sidebar-link w-full ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            }
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''} ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}`
                }
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className={`mt-auto p-2 lg:p-4 xl:p-6 pt-0 ${isCollapsed ? 'lg:px-2' : ''}`}>
        <div className="border-t border-gray-200 pt-4">
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            aria-label="Keluar"
            className={`sidebar-link w-full text-red-600 hover:bg-red-50 ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-4">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.img
            src="/logo_pmi.png"
            alt="PMI Logo"
            className="h-8 w-8 lg:h-10 lg:w-10 object-contain"
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          />
          <div>
            <h1 className="text-sm font-bold text-primary-600">Smart Volunteers</h1>
            <p className="text-xs text-gray-500">PMI Kota Cilegon</p>
          </div>
        </motion.div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-64 bg-white z-50 shadow-xl"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 64 : 256 }}
        transition={{ type: 'spring', damping: 20 }}
        className="hidden lg:flex fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-30 overflow-hidden"
      >
        <SidebarContent />
        <button
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Buka sidebar' : 'Tutup sidebar'}
          className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:shadow-lg transition-shadow"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </motion.aside>
    </>
  );
}
