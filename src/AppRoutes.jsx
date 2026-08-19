import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuth } from './admin/ProtectedRoute';
import PageViewTracker from './components/PageViewTracker';
import CinematicLoader from './components/CinematicLoader/CinematicLoader';

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
    height: '100vh',
    background: 'linear-gradient(160deg, #24150c 0%, #5b3e2b 55%, #24150c 100%)'
  }} />
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
      <PageViewTracker />
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
      <CinematicLoader />
    </Suspense>
  );
};

export default AdminRoutes;