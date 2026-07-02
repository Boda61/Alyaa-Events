import { useEffect, useMemo, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../ProtectedRoute';
import { db } from '../../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
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
  const [visitEvents, setVisitEvents] = useState([]);
  const [planUsageEvents, setPlanUsageEvents] = useState([]);
  const [eventTypeEvents, setEventTypeEvents] = useState([]);
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

  useEffect(() => {
    let unsub = null;

    try {
      unsub = onSnapshot(collection(db, 'analytics'), (snapshot) => {
        const allDocs = snapshot.docs.map((d) => d.data());

        const visits = allDocs.filter(
          (d) => d?.type === 'visit' && typeof d?.timestamp === 'number'
        );

        const planUsed = allDocs.filter(
          (d) =>
            d?.type === 'plan_used' &&
            (d?.plan === 'basic' || d?.plan === 'pro' || d?.plan === 'vip')
        );

        const eventTypeUsed = allDocs.filter(
          (d) => d?.type === 'event_type_used' && typeof d?.eventType === 'string'
        );

        setVisitEvents(visits);
        setPlanUsageEvents(planUsed);
        setEventTypeEvents(eventTypeUsed);
      });
    } catch {
      setVisitEvents([]);
    }

    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  const [activeUsersCount, setActiveUsersCount] = useState(0);

  useEffect(() => {
    let unsub = null;

    try {
      unsub = onSnapshot(collection(db, 'activeUsers'), (snapshot) => {
        const now = Date.now();
        const onlineUsers = snapshot.docs
          .map((d) => d.data())
          .filter((u) => typeof u?.lastSeen === 'number' && now - u.lastSeen < 15000);

        setActiveUsersCount(onlineUsers.length);
      });
    } catch {
      setActiveUsersCount(0);
    }

    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  const analyticsCards = useMemo(() => {
    const today = new Date().toDateString();
    const weekAgoTs = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const totalVisits = visitEvents.length;
    const todayVisits = visitEvents.filter((v) => v?.date === today).length;
    const weeklyVisits = visitEvents.filter((v) => v?.timestamp >= weekAgoTs).length;

    const cardStyle = {
      padding: '14px 16px',
      borderRadius: 12,
      background: 'rgba(91, 62, 43, 0.08)',
      border: '1px solid rgba(91, 62, 43, 0.18)',
      minWidth: 0,
    };

    const labelStyle = { fontSize: 13, opacity: 0.8 };
    const valueStyle = { fontSize: 22, fontWeight: 800, marginTop: 6 };

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div style={cardStyle}>
          <div style={labelStyle}>Total Visits</div>
          <div style={valueStyle}>{totalVisits}</div>
        </div>

        <div style={cardStyle}>
          <div style={labelStyle}>Today Visits</div>
          <div style={valueStyle}>{todayVisits}</div>
        </div>

        <div style={cardStyle}>
          <div style={labelStyle}>Weekly Visits</div>
          <div style={valueStyle}>{weeklyVisits}</div>
        </div>
      </div>
    );
  }, [visitEvents]);

  const [chartRangeDays, setChartRangeDays] = useState(7);

  const eventTypeDistribution = useMemo(() => {
    const counts = {
      Wedding: 0,
      Engagement: 0,
      'Henna Night': 0,
      Corporate: 0,
      Birthday: 0,
      Other: 0,
    };

    for (const e of eventTypeEvents) {
      const k = e?.eventType;
      if (k in counts) counts[k] += 1;
      else counts.Other += 1;
    }

    return counts;
  }, [eventTypeEvents]);

  const safeToDateKey = (ts) => {
    const d = new Date(typeof ts === 'number' ? ts : 0);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const visitsTrendData = useMemo(() => {
    const days = chartRangeDays;
    const startTs = Date.now() - days * 24 * 60 * 60 * 1000;

    const visitsInRange = visitEvents.filter((v) => v?.timestamp >= startTs);

    const countsByDate = new Map();
    for (const v of visitsInRange) {
      const key = v?.date || safeToDateKey(v?.timestamp);
      countsByDate.set(key, (countsByDate.get(key) || 0) + 1);
    }

    // build ordered buckets (fill missing days with 0)
    const buckets = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = safeToDateKey(d.getTime());
      buckets.push({ date: key, value: countsByDate.get(key) || 0 });
    }

    return buckets;
  }, [chartRangeDays, visitEvents]);


  const planUsageDistribution = useMemo(() => {
    const counts = { basic: 0, pro: 0, vip: 0 };
    for (const p of planUsageEvents) {
      if (p?.plan in counts) counts[p.plan] += 1;
    }
    return counts;
  }, [planUsageEvents]);

  const activeUsersCard = useMemo(() => {
    const cardStyle = {
      padding: '14px 16px',
      borderRadius: 12,
      background: 'rgba(91, 62, 43, 0.08)',
      border: '1px solid rgba(91, 62, 43, 0.18)',
      marginBottom: 18,
    };

    const labelStyle = { fontSize: 13, opacity: 0.8 };
    const valueStyle = { fontSize: 20, fontWeight: 800, marginTop: 6 };

    return (
      <div style={cardStyle}>
        <div style={labelStyle}>🟢 Live Active Users</div>
        <div style={valueStyle}>{activeUsersCount}</div>
      </div>
    );
  }, [activeUsersCount]);

  const chartsLoading = !visitEvents || visitEvents.length === 0;

  const lineChart = useMemo(() => {
    const width = 520;
    const height = 180;
    const padding = 28;

    const data = visitsTrendData;
    const maxY = Math.max(1, ...data.map((d) => d.value));
    const minY = 0;

    const xStep = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;

    const points = data.map((d, idx) => {
      const x = padding + idx * xStep;
      const y =
        padding + (height - padding * 2) * (1 - (d.value - minY) / (maxY - minY || 1));
      return { x, y, value: d.value, date: d.date };
    });

    const poly = points.map((p) => `${p.x},${p.y}`).join(' ');

    return { width, height, padding, poly, points, maxY };
  }, [visitsTrendData]);

  const barChart = useMemo(() => {
    const width = 520;
    const height = 180;

    const entries = [
      { plan: 'basic', label: 'Basic', value: planUsageDistribution.basic, color: '#5B3E2B' },
      { plan: 'pro', label: 'Pro', value: planUsageDistribution.pro, color: '#A76E3A' },
      { plan: 'vip', label: 'VIP', value: planUsageDistribution.vip, color: '#6F4A2B' },
    ];

    const max = Math.max(1, ...entries.map((e) => e.value));
    return { width, height, entries, max };
  }, [planUsageDistribution]);

  const chartsCard = (
    <div
      style={{
        padding: '18px 18px',
        borderRadius: 14,
        background: 'rgba(91, 62, 43, 0.04)',
        border: '1px solid rgba(91, 62, 43, 0.12)',
        marginBottom: 18,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 16 }}>Analytics Charts</div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => setChartRangeDays(7)}
            style={{
              padding: '8px 12px',
              borderRadius: 10,
              cursor: 'pointer',
              border: '1px solid rgba(91, 62, 43, 0.25)',
              background: chartRangeDays === 7 ? 'rgba(91, 62, 43, 0.12)' : 'transparent',
              color: '#5B3E2B',
              fontWeight: 700,
            }}
          >
            7 Days
          </button>

          <button
            type="button"
            onClick={() => setChartRangeDays(30)}
            style={{
              padding: '8px 12px',
              borderRadius: 10,
              cursor: 'pointer',
              border: '1px solid rgba(91, 62, 43, 0.25)',
              background: chartRangeDays === 30 ? 'rgba(91, 62, 43, 0.12)' : 'transparent',
              color: '#5B3E2B',
              fontWeight: 700,
            }}
          >
            30 Days
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 12,
        }}
      >
        <div
          style={{
            borderRadius: 12,
            border: '1px solid rgba(91, 62, 43, 0.12)',
            background: 'rgba(255,255,255,0.5)',
            padding: 12,
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Website Visits Trend</div>

          {chartsLoading ? (
            <div style={{ opacity: 0.7, padding: '30px 0', textAlign: 'center' }}>No visit data yet</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <svg
                width={lineChart.width}
                height={lineChart.height}
                viewBox={`0 0 ${lineChart.width} ${lineChart.height}`}
                style={{ display: 'block' }}
              >
                {/* grid */}
                {[0, 1, 2, 3].map((i) => {
                  const y = 28 + ((180 - 56) * i) / 3;
                  return (
                    <line
                      key={i}
                      x1={28}
                      x2={lineChart.width - 28}
                      y1={y}
                      y2={y}
                      stroke="rgba(91,62,43,0.12)"
                      strokeDasharray="4 4"
                    />
                  );
                })}

                <polyline points={lineChart.poly} fill="none" stroke="#5B3E2B" strokeWidth="2.5" />

                {lineChart.points.map((p, idx) => (
                  <g key={idx}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={3.5}
                      fill="#FDF6EF"
                      stroke="#5B3E2B"
                      strokeWidth="2"
                    />
                  </g>
                ))}
              </svg>
            </div>
          )}
        </div>

        <div
          style={{
            borderRadius: 12,
            border: '1px solid rgba(91, 62, 43, 0.12)',
            background: 'rgba(255,255,255,0.5)',
            padding: 12,
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Plan Usage Distribution</div>

          {planUsageEvents.length === 0 ? (
            <div style={{ opacity: 0.7, padding: '30px 0', textAlign: 'center' }}>
              No plan usage data yet
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <svg
                width={barChart.width}
                height={barChart.height}
                viewBox={`0 0 ${barChart.width} ${barChart.height}`}
                style={{ display: 'block' }}
              >
                {barChart.entries.map((e, idx) => {
                  const barW = 150;
                  const gap = 14;
                  const x = 20 + idx * (barW + gap);
                  const barH = (barChart.height - 60) * (e.value / barChart.max);
                  const y = barChart.height - 40 - barH;

                  return (
                    <g key={e.plan}>
                      <rect x={x} y={y} width={barW} height={barH} rx={10} fill={e.color} opacity={0.85} />
                      <text
                        x={x + barW / 2}
                        y={barChart.height - 18}
                        textAnchor="middle"
                        fontSize="14"
                        fontWeight="700"
                        fill="#5B3E2B"
                      >
                        {e.label}
                      </text>
                      <text
                        x={x + barW / 2}
                        y={y - 6}
                        textAnchor="middle"
                        fontSize="14"
                        fontWeight="800"
                        fill="#5B3E2B"
                      >
                        {e.value}
                      </text>
                    </g>
                  );
                })}

                <line
                  x1={20}
                  x2={barChart.width - 20}
                  y1={barChart.height - 40}
                  y2={barChart.height - 40}
                  stroke="rgba(91,62,43,0.18)"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );

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
        {activeUsersCard}
        {chartsCard}
        {analyticsCards}
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