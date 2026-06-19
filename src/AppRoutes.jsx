import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuth } from './admin/ProtectedRoute';

const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));
const DashboardHome = lazy(() => import('./admin/pages/DashboardHome'));
const Services = lazy(() => import('./admin/pages/Services'));
const Portfolio = lazy(() => import('./admin/pages/Portfolio'));
const Rentals = lazy(() => import('./admin/pages/Rentals'));
const Testimonials = lazy(() => import('./admin/pages/Testimonials'));
const Settings = lazy(() => import('./admin/pages/Settings'));
const DecorationPrices = lazy(() => import('./admin/pages/DecorationPrices'));
const App = lazy(() => import('./App'));

const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#FDF6EF'
  }}>
    <div style={{
      width: 40,
      height: 40,
      border: '4px solid #F4D9CC',
      borderTopColor: '#5B3E2B',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!user) {
    return <AdminLogin />;
  }

  return children;
};

const AdminRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="services" element={<Services />} />
          <Route path="rentals" element={<Rentals />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="settings" element={<Settings />} />
          <Route path="decoration" element={<DecorationPrices />} />
        </Route>
        <Route path="/*" element={<App />} />
      </Routes>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Suspense>
  );
};

export default AdminRoutes;