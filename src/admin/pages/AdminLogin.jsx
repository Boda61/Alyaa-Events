import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../ProtectedRoute';
import { auth } from '../../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Preload admin pages after login
const preloadAdminPages = () => {
  import('./AdminDashboard');
  import('./DashboardHome');
  import('../pages/Services');
  import('../pages/Portfolio');
  import('../pages/Testimonials');
  import('../pages/Settings');
};

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Preload pages for faster navigation
      preloadAdminPages();
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      switch (error.code) {
        case 'auth/invalid-email':
          setError('البريد الإلكتروني غير صالح');
          break;
        case 'auth/user-disabled':
          setError('تم تعطيل هذا الحساب');
          break;
        case 'auth/user-not-found':
          setError('المستخدم غير موجود');
          break;
        case 'auth/wrong-password':
          setError('كلمة المرور غير صحيحة');
          break;
        case 'auth/invalid-credential':
          setError('بيانات الاعتماد غير صحيحة');
          break;
        default:
          setError('حدث خطأ في تسجيل الدخول');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <h1>Alyaa Events</h1>
          <p>لوحة تحكم المسؤول</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && (
            <div className="admin-error-message">
              {error}
            </div>
          )}

          <div className="admin-form-group">
            <label htmlFor="email">البريد الإلكتروني</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="password">كلمة المرور</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="admin-login-footer">
          <a href="/">العودة للموقع</a>
        </div>
      </div>

      <style>{`
        .admin-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FDF6EF;
          padding: 20px;
        }

        .admin-login-container {
          background: white;
          border-radius: 24px;
          padding: 48px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 20px 60px rgba(93, 62, 43, 0.1);
        }

        .admin-login-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .admin-login-header h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          color: #5B3E2B;
          margin-bottom: 8px;
        }

        .admin-login-header p {
          color: #B7AE84;
          font-size: 14px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .admin-error-message {
          background: #fee;
          color: #c00;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
          text-align: center;
        }

        .admin-form-group {
          margin-bottom: 24px;
        }

        .admin-form-group label {
          display: block;
          margin-bottom: 8px;
          color: #5B3E2B;
          font-size: 14px;
          font-weight: 500;
        }

        .admin-form-group input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #F4D9CC;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: #FDF6EF;
        }

        .admin-form-group input:focus {
          outline: none;
          border-color: #B7AE84;
          background: white;
        }

        .admin-form-group input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .admin-login-btn {
          width: 100%;
          padding: 16px;
          background: #5B3E2B;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .admin-login-btn:hover:not(:disabled) {
          background: #4a3224;
          transform: translateY(-2px);
        }

        .admin-login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .admin-login-footer {
          margin-top: 24px;
          text-align: center;
        }

        .admin-login-footer a {
          color: #B7AE84;
          text-decoration: none;
          font-size: 14px;
        }

        .admin-login-footer a:hover {
          color: #5B3E2B;
        }

        @media (max-width: 480px) {
          .admin-login-container {
            padding: 32px 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;