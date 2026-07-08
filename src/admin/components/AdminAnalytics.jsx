import { useEffect, useMemo, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';

const AdminAnalytics = () => {
  const [visitEvents, setVisitEvents] = useState([]);
  const [planUsageEvents, setPlanUsageEvents] = useState([]);
  const [eventTypeEvents, setEventTypeEvents] = useState([]);

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
          (d) =>
            d?.type === 'event_type_used' && typeof d?.eventType === 'string'
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

  // Kept as existing logic for production-safety/reuse, even if currently only used in charts cards.
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
