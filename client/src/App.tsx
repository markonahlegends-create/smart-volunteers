import { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Layout from './components/layout/Layout';
import { LayoutProvider } from './context/LayoutContext';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Markas = lazy(() => import('./pages/Markas'));
const UnitsPage = lazy(() => import('./pages/Units'));
const UnitDetailKSR = lazy(() => import('./pages/UnitDetailKSR'));
const UnitDetailKSRPerguruanTinggi = lazy(() => import('./pages/UnitDetailKSRPerguruanTinggi'));
const AddUnitKSR = lazy(() => import('./pages/AddUnitKSR'));
const AddUnitPMR = lazy(() => import('./pages/AddUnitPMR'));
const AddUnitTSR = lazy(() => import('./pages/AddUnitTSR'));
const UnitDetailPMR = lazy(() => import('./pages/UnitDetailPMR'));
const UnitDetailTSR = lazy(() => import('./pages/UnitDetailTSR'));
const MembersPage = lazy(() => import('./pages/Members'));
const MemberProfile = lazy(() => import('./pages/MemberProfile'));
const AddMember = lazy(() => import('./pages/AddMember'));
const Bencana = lazy(() => import('./pages/Bencana'));
const Laporan = lazy(() => import('./pages/Laporan'));
const Profile = lazy(() => import('./pages/Profile'));

const queryClient = new QueryClient();

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-gray-500">Memuat halaman...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <LayoutProvider>
                  <Layout />
                </LayoutProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<Suspense fallback={<PageFallback />}><Dashboard /></Suspense>} />
            <Route path="markas" element={<Suspense fallback={<PageFallback />}><Markas /></Suspense>} />
            <Route path="units/pmr/mula" element={<Suspense fallback={<PageFallback />}><UnitsPage title="Unit PMR Mula" type="pmr-mula" /></Suspense>} />
            <Route path="units/pmr/mula/add" element={<Suspense fallback={<PageFallback />}><AddUnitPMR tingkat="MULA" backUrl="/units/pmr/mula" /></Suspense>} />
            <Route path="units/pmr/madya" element={<Suspense fallback={<PageFallback />}><UnitsPage title="Unit PMR Madya" type="pmr-madya" /></Suspense>} />
            <Route path="units/pmr/madya/add" element={<Suspense fallback={<PageFallback />}><AddUnitPMR tingkat="MADYA" backUrl="/units/pmr/madya" /></Suspense>} />
            <Route path="units/pmr/wira" element={<Suspense fallback={<PageFallback />}><UnitsPage title="Unit PMR Wira" type="pmr-wira" /></Suspense>} />
            <Route path="units/pmr/wira/add" element={<Suspense fallback={<PageFallback />}><AddUnitPMR tingkat="WIRA" backUrl="/units/pmr/wira" /></Suspense>} />
            <Route path="units/pmr/:id" element={<Suspense fallback={<PageFallback />}><UnitDetailPMR /></Suspense>} />
            <Route path="units/ksr" element={<Suspense fallback={<PageFallback />}><UnitsPage title="Unit KSR" type="ksr" /></Suspense>} />
            <Route path="units/ksr/add" element={<Suspense fallback={<PageFallback />}><AddUnitKSR /></Suspense>} />
            <Route path="units/ksr/:id" element={<Suspense fallback={<PageFallback />}><UnitDetailKSR /></Suspense>} />
            <Route path="units/ksr/:id/perguruan-tinggi" element={<Suspense fallback={<PageFallback />}><UnitDetailKSRPerguruanTinggi /></Suspense>} />
            <Route path="units/tsr" element={<Suspense fallback={<PageFallback />}><UnitsPage title="Unit TSR" type="tsr" /></Suspense>} />
            <Route path="units/tsr/add" element={<Suspense fallback={<PageFallback />}><AddUnitTSR backUrl="/units/tsr" /></Suspense>} />
            <Route path="units/tsr/:id" element={<Suspense fallback={<PageFallback />}><UnitDetailTSR /></Suspense>} />
            <Route path="members/pmr" element={<Suspense fallback={<PageFallback />}><MembersPage title="Anggota PMR" type="pmr" /></Suspense>} />
            <Route path="members/ksr" element={<Suspense fallback={<PageFallback />}><MembersPage title="Anggota KSR" type="ksr" /></Suspense>} />
            <Route path="members/tsr" element={<Suspense fallback={<PageFallback />}><MembersPage title="Anggota TSR" type="tsr" /></Suspense>} />
            <Route path="members/dds" element={<Suspense fallback={<PageFallback />}><MembersPage title="Anggota DDS" type="dds" /></Suspense>} />
            <Route path="members/:type/add/:id" element={<Suspense fallback={<PageFallback />}><AddMember /></Suspense>} />
            <Route path="members/:type/add" element={<Suspense fallback={<PageFallback />}><AddMember /></Suspense>} />
            <Route path="members/:type/:id" element={<Suspense fallback={<PageFallback />}><MemberProfile /></Suspense>} />
            <Route path="bencana" element={<Suspense fallback={<PageFallback />}><Bencana /></Suspense>} />
            <Route path="laporan" element={<Suspense fallback={<PageFallback />}><Laporan /></Suspense>} />
            <Route path="profile" element={<Suspense fallback={<PageFallback />}><Profile /></Suspense>} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
