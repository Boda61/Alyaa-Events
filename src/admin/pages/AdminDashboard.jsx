import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../ProtectedRoute';
import {
  House,
  Scissors,
  Image,
  ChatCircle,
  Gear,
  SignOut,
  List,
  X,
  Armchair,
  Flower
} from 'phosphor-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { path: 'dashboard', icon: House, label: 'الرئيسية', labelEn: 'Dashboard' },
    { path: 'portfolio', icon: Image, label: 'أعمالنا', labelEn: 'Portfolio' },
    { path: 'services', icon: Scissors, label: 'الخدمات', labelEn: 'Services' },
    { path: 'rentals', icon: Armchair, label: 'اسعار الإيجار', labelEn: 'Rentals' },
    { path: 'decoration', icon: Flower, label: 'اسعار الديكور', labelEn: 'Decoration Prices' },
    { path: 'testimonials', icon: ChatCircle, label: 'اراء العملاء ', labelEn: 'Contact' },
    { path: 'settings', icon: Gear, label: 'الإعدادات', labelEn: 'Settings' },
  ];

  return (
    <div className="admin-dashboard">
      {/* Mobile Header */}
      <div className="admin-mobile-header">
        <button
          className="admin-menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={24} /> : <List size={24} />}
        </button>
        <span className="admin-mobile-title">Alyaa Events</span>
        <button className="admin-logout-btn-mobile" onClick={handleLogout}>
          <SignOut size={20} />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <h2>Alyaa Events</h2>
          <button
            className="admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <SignOut size={20} />
            <span>تسجيل خروج</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="admin-main">
        <Outlet />
      </main>

      <style>{`
        .admin-dashboard {
          display: flex;
          min-height: 100vh;
          background: #FDF6EF;
        }

        /* Mobile Header */
        .admin-mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: #5B3E2B;
          color: white;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          z-index: 1000;
        }

        .admin-menu-toggle {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 8px;
        }

        .admin-mobile-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
        }

        .admin-logout-btn-mobile {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 8px;
        }

        /* Sidebar */
        .admin-sidebar {
          width: 280px;
          min-height: 100vh;
          background: #5B3E2B;
          color: white;
          display: flex;
          flex-direction: column;
          position: fixed;
          right: 0;
          top: 0;
          z-index: 1001;
        }

        .admin-sidebar-header {
          padding: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .admin-sidebar-header h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          margin: 0;
        }

        .admin-sidebar-close {
          display: none;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }

        .admin-sidebar-nav {
          flex: 1;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 12px;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-size: 15px;
          transition: all 0.3s ease;
        }

        .admin-nav-item:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }

        .admin-nav-item.active {
          background: rgba(255,255,255,0.15);
          color: white;
        }

        .admin-sidebar-footer {
          padding: 16px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .admin-logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          width: 100%;
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .admin-logout-btn:hover {
          background: rgba(255,255,255,0.2);
        }

        /* Main Content */
        .admin-main {
          flex: 1;
          margin-right: 280px;
          padding: 32px;
          min-height: 100vh;
        }

        /* Overlay */
        .admin-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 1000;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .admin-mobile-header {
            display: flex;
          }

          .admin-sidebar {
            transform: translateX(100%);
            transition: transform 0.3s ease;
          }

          .admin-sidebar.open {
            transform: translateX(0);
          }

          .admin-sidebar-close {
            display: block;
          }

          .admin-overlay {
            display: block;
          }

          .admin-main {
            margin-right: 0;
            padding: 24px 16px;
            padding-top: 84px;
          }

          .admin-logout-btn-mobile {
            display: block;
          }
        }

        @media (max-width: 480px) {
          .admin-main {
            padding: 16px;
            padding-top: 84px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;