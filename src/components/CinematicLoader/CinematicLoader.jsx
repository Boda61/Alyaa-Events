import { memo, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import './CinematicLoader.css';

const MIN_DURATION = 3000;
const SHIMMER_DURATION = 950;
const EXIT_MS = 1100;

const BRAND_NAME = 'ALYAA EVENTS';
const TAGLINE = 'Luxury Wedding & Event Decorations';

function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260819);
const SPARKLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: rand() * 100,
  top: rand() * 100,
  size: 2 + rand() * 3,
  delay: rand() * 3.5,
  duration: 2.5 + rand() * 2.5,
}));

function LoaderCounter() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const DELAY = 1200;
    const DURATION = 1400;
    const tick = (now) => {
      const t = now - start - DELAY;
      const p = Math.min(Math.max(t / DURATION, 0), 1);
      setProgress(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="loader-progress">
      <div className="loader-bar">
        <div className="loader-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <span className="loader-percent">{progress}%</span>
    </div>
  );
}

function ShimmerLoader() {
  return (
    <motion.div
      className="loader-shimmer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="shimmer-logo">
        <div className="shimmer-block shimmer-circle" />
      </div>
      <div className="shimmer-hero">
        <div className="shimmer-block shimmer-line shimmer-line-sm" />
        <div className="shimmer-block shimmer-line shimmer-line-lg" />
        <div className="shimmer-block shimmer-line shimmer-line-md" />
        <div className="shimmer-buttons">
          <div className="shimmer-block shimmer-pill" />
          <div className="shimmer-block shimmer-pill" />
        </div>
      </div>
      <div className="shimmer-grid">
        <div className="shimmer-block shimmer-card" />
        <div className="shimmer-block shimmer-card" />
        <div className="shimmer-block shimmer-card" />
      </div>
    </motion.div>
  );
}

const CinematicLoader = memo(function CinematicLoader() {
  const { pathname } = useLocation();
  const [phase, setPhase] = useState(null);
  const unlockTimerRef = useRef(null);

  const lock = () => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  };

  const unlock = () => {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  };

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    requestAnimationFrame(() => setPhase('cinematic'));
  }, [pathname]);

  useEffect(() => {
    if (phase !== 'cinematic') return;
    lock();
    const t = setTimeout(() => setPhase('shimmer'), MIN_DURATION);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'shimmer') return;
    const t = setTimeout(() => setPhase(null), SHIMMER_DURATION);
    unlockTimerRef.current = setTimeout(unlock, EXIT_MS);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    return () => {
      if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
      unlock();
    };
  }, []);

  if (phase === null) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="cinematic-loader"
        initial={{ clipPath: 'circle(150% at 50% 50%)' }}
        animate={{ clipPath: 'circle(150% at 50% 50%)' }}
        exit={{
          clipPath: 'circle(0% at 50% 50%)',
          transition: { duration: 0.9, ease: [0.65, 0, 0.35, 1] },
        }}
      >
        {phase === 'cinematic' ? (
          <>
            <div className="loader-sparkles">
              {SPARKLES.map((s) => (
                <span
                  key={s.id}
                  className="loader-sparkle"
                  style={{
                    left: `${s.left}%`,
                    top: `${s.top}%`,
                    width: s.size,
                    height: s.size,
                    animationDelay: `${s.delay}s`,
                    animationDuration: `${s.duration}s`,
                  }}
                />
              ))}
            </div>

            <div className="loader-center">
              <motion.div
                className="loader-logo-wrap"
                initial={{ opacity: 0, scale: 0.72, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              >
                <div className="loader-halo" />
                <div className="loader-logo-frame">
                  <motion.img
                    className="loader-logo"
                    src="/logo.webp"
                    alt="Alyaa Events"
                    draggable={false}
                    initial={{ filter: 'blur(14px)', scale: 0.86, opacity: 0 }}
                    animate={{ filter: 'blur(0px)', scale: 1, opacity: 1 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>

              <h1 className="loader-name">
                {BRAND_NAME.split('').map((ch, i) => (
                  <motion.span
                    key={i}
                    className="loader-letter"
                    initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ delay: 0.75 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
                  >
                    {ch === ' ' ? '\u00A0' : ch}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                className="loader-tagline"
                initial={{ opacity: 0, letterSpacing: '0.6em' }}
                animate={{ opacity: 1, letterSpacing: '0.32em' }}
                transition={{ delay: 1.55, duration: 1 }}
              >
                {TAGLINE}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7, duration: 0.7 }}
              >
                <LoaderCounter />
              </motion.div>
            </div>

            <div className="loader-vignette" />
          </>
        ) : (
          <ShimmerLoader />
        )}
      </motion.div>
    </AnimatePresence>
  );
});

export default CinematicLoader;