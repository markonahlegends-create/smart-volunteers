import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../services/auth';

interface LoginProps {
  onLogin: (token: string, user: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const captchaInputRef = useRef<HTMLInputElement>(null);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const captchaValue = captchaInputRef.current?.value || '';
      const response = await authApi.login({
        login,
        password,
        captcha: captchaValue.toLowerCase(),
      });
      localStorage.setItem('token', response.token);
      onLogin(response.token, response.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal');
      generateCaptcha();
      if (captchaInputRef.current) {
        captchaInputRef.current.value = '';
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden p-4">
      <img
        src="/background_merah.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-primary-600 px-6 lg:px-8 py-6 lg:py-8 text-center">
            <img src="/logopmiputih.png" alt="PMI Logo" className="h-16 lg:h-20 mx-auto mb-4" />
            <h1 className="text-xl lg:text-2xl font-bold text-white">Smart Volunteers</h1>
            <p className="text-primary-100 mt-1 text-sm lg:text-base">PMI Kota Cilegon</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Masukkan email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="Masukkan password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Verifikasi CAPTCHA</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mb-2">
                    <span className="text-xl lg:text-2xl font-bold text-gray-700 tracking-widest select-none">
                      {captchaCode}
                    </span>
                  </div>
                  <input
                    ref={captchaInputRef}
                    type="text"
                    className="input-field"
                    placeholder="Masukkan kode CAPTCHA"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
                >
                  Refresh
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary py-3 text-base lg:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Memuat...' : 'Masuk'}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-white/80 text-xs lg:text-sm mt-6">
          © 2026 Palang Merah Indonesia. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
