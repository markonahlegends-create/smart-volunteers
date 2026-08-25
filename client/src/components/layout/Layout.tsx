import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useLayout } from '../../context/LayoutContext';

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { setLaporanModalOpen } = useLayout();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg">
        Lewati ke konten utama
      </a>
      <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(v => !v)} onLaporanClick={() => setLaporanModalOpen(true)} />
      <main id="main-content" className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} pt-16 lg:pt-0 flex-1`}>
        <div className="p-4 lg:p-6 xl:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`bg-white border-t border-gray-200 py-4 px-4 lg:px-6 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs lg:text-sm text-gray-500">
          <p className="truncate">© {new Date().getFullYear()} Palang Merah Indonesia Kota Cilegon</p>
          <a
            href="https://fadil-labs.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-primary-600 transition-colors truncate"
          >
            <span className="truncate">Oleh Fadil Advertising</span>
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
              className="inline-block text-red-500 flex-shrink-0"
            >
              <Heart className="h-3.5 w-3.5 lg:h-4 lg:w-4 fill-red-500" />
            </motion.span>
          </a>
        </div>
      </motion.footer>
    </div>
  );
}
