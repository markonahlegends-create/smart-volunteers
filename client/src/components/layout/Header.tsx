import { useState, useRef, useEffect } from 'react';
import { Menu, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 lg:gap-4">
          <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Buka menu">
            <Menu className="h-5 w-5 lg:h-6 lg:w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg lg:text-2xl font-bold text-gray-800">{title}</h1>
            <p className="text-xs lg:text-sm text-gray-500 hidden sm:block">PMI Kota Cilegon</p>
          </div>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
            aria-label="Menu pengguna"
            className="flex items-center gap-2 lg:gap-3 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors"
          >
            <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="h-4 w-4 lg:h-5 lg:w-5 text-primary-600" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-800">Admin PMI Kota Cilegon</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
          </button>

          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
            >
              <button
                onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
              >
                <User className="h-4 w-4" />
                Profil
              </button>
              <button
                onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
              >
                <Settings className="h-4 w-4" />
                Pengaturan
              </button>
              <div className="border-t border-gray-100 my-1" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}
