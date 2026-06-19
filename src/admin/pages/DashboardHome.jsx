import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  House,
  Scissors,
  Image,
  ChatCircle,
  Users,
  Eye,
  Trash
} from 'phosphor-react';
import {
  servicesService,
  portfolioService,
  testimonialsService,
  clearAllAdminData
} from '../../firebase/service';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    services: 0,
    portfolio: 0,
    testimonials: 0,
    visibleTestimonials: 0
  });
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      try {
        // Use Promise.race with timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 8000)
        );

        const fetchPromise = Promise.all([
          servicesService.getAll(),
          portfolioService.getAll(),
          testimonialsService.getAll()
        ]);

        const [services, portfolio, testimonials] = await Promise.race([
          fetchPromise,
          timeoutPromise
        ]);

        if (cancelled) return;

        setStats({
          services: services?.length || 0,
          portfolio: portfolio?.length || 0,
          testimonials: testimonials?.length || 0,
          visibleTestimonials: testimonials?.filter(t => t.visible).length || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Still set loading to false on error so UI doesn't hang
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchStats();
    return () => { cancelled = true; };
  }, []);

  const statCards = [
    {
      title: 'الخدمات',
      titleEn: 'Services',
      count: stats.services,
      icon: Scissors,
      color: '#B7AE84',
      path: '/admin/services'
    },
    {
      title: 'أعمالنا',
      titleEn: 'Portfolio',
      count: stats.portfolio,
      icon: Image,
      color: '#5B3E2B',
      path: '/admin/portfolio'
    },
    {
      title: 'آراء العملاء',
      titleEn: 'Testimonials',
      count: stats.testimonials,
      icon: ChatCircle,
      color: '#F4D9CC',
      path: '/admin/testimonials'
    },
    {
      title: 'آراء معروضة',
      titleEn: 'Visible Reviews',
      count: stats.visibleTestimonials,
      icon: Eye,
      color: '#8BC34A',
      path: '/admin/testimonials'
    }
  ];

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-home">
      <div className="dashboard-header">
        <h1>لوحة التحكم</h1>
        <p>مرحباً بك في لوحة تحكم Alyaa Events</p>
      </div>

      <div className="dashboard-stats">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="stat-card"
            onClick={() => navigate(stat.path)}
            style={{ borderTopColor: stat.color }}
          >
            <div className="stat-icon" style={{ background: stat.color }}>
              <stat.icon size={24} color="white" />
            </div>
            <div className="stat-info">
              <span className="stat-count">{stat.count}</span>
              <span className="stat-label">{stat.title}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-actions">
        <h2>إجراءات سريعة</h2>
        <div className="action-buttons">
          <button onClick={() => navigate('/admin/services?action=add')}>
            <Scissors size={20} />
            إضافة خدمة جديدة
          </button>
          <button onClick={() => navigate('/admin/portfolio?action=add')}>
            <Image size={20} />
           إضافة عمل جديد
          </button>
          <button onClick={() => navigate('/admin/testimonials?action=add')}>
            <ChatCircle size={20} />
            إضافة رأي جديد
          </button>
        </div>
      </div>

      <div className="dashboard-links">
        <a href="/" target="_blank" rel="noopener noreferrer">
          <Eye size={20} />
          عرض الموقع
        </a>
      </div>

      <div className="dashboard-actions danger-zone">
        <h2>مسح كل البيانات</h2>
        <p>احذر: هذا الإجراء سيقوم بمسح جميع البيانات من لوحه التحكم نهائياً</p>
        <button
          className="btn-danger"
          onClick={async () => {
            if (window.confirm('هل أنت متأكد من مسح كل البيانات؟ لا يمكن التراجع عن هذا الإجراء.')) {
              setDeleting(true);
              try {
                await clearAllAdminData();
                alert('تم مسح جميع البيانات بنجاح');
                window.location.reload();
              } catch (err) {
                console.error(err);
                alert('حدث خطأ في مسح البيانات');
              } finally {
                setDeleting(false);
              }
            }
          }}
          disabled={deleting}
        >
          <Trash size={20} />
          {deleting ? 'جاري المسح...' : 'مسح كل البيانات'}
        </button>
      </div>

      <style>{`
        .dashboard-home {
          max-width: 1200px;
        }

        .dashboard-header {
          margin-bottom: 32px;
        }

        .dashboard-header h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          color: #5B3E2B;
          margin-bottom: 8px;
        }

        .dashboard-header p {
          color: rgba(91, 62, 43, 0.7);
          font-size: 16px;
        }

        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          border-top: 4px solid #B7AE84;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(93, 62, 43, 0.08);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(93, 62, 43, 0.12);
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-count {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          color: #5B3E2B;
          line-height: 1;
        }

        .stat-label {
          font-size: 14px;
          color: rgba(91, 62, 43, 0.7);
          margin-top: 4px;
        }

        .dashboard-actions {
          background: white;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(93, 62, 43, 0.08);
        }

        .dashboard-actions h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          color: #5B3E2B;
          margin-bottom: 20px;
        }

        .action-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .action-buttons button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: #FDF6EF;
          border: 2px solid #F4D9CC;
          border-radius: 10px;
          color: #5B3E2B;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-buttons button:hover {
          background: #5B3E2B;
          border-color: #5B3E2B;
          color: white;
        }

        .dashboard-links {
          display: flex;
          gap: 12px;
        }

        .dashboard-links a {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: #5B3E2B;
          border-radius: 10px;
          color: white;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .dashboard-links a:hover {
          background: #4a3224;
        }

        .admin-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #F4D9CC;
          border-top-color: #5B3E2B;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .dashboard-header h1 {
            font-size: 28px;
          }

          .stat-card {
            padding: 20px;
          }

          .stat-icon {
            width: 48px;
            height: 48px;
          }

          .stat-count {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardHome;