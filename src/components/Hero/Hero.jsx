import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '../../i18n';
import HeroEffects from './HeroEffects';
import useMousePosition from '../../hooks/useMousePosition';
import './Hero.css';

// Counter Component with animation
function Counter({ end, duration = 2, startCounting = false }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!startCounting || !isInView) return;

    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // Easing function for smooth count
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [startCounting, isInView, end, duration]);

  return <span ref={ref}>{count}</span>;
}

// Letter-by-letter animation for Arabic text
function AnimatedText({ text, delay = 0, className = '' }) {
  const letters = text.split('');
  
  return (
    <span className={className}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: delay + index * 0.05,
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{ display: 'inline-block' }}
        >
          {letter}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  const { t, isRTL } = useLanguage();
  const mousePosition = useMousePosition();
  const [animationStarted, setAnimationStarted] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [startCounting, setStartCounting] = useState(false);
  const heroRef = useRef(null);

  // Start animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationStarted(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Animation timeline progress tracker
  useEffect(() => {
    if (!animationStarted) return;

    const startTime = performance.now();
    const duration = 5500; // 5.5 seconds total animation

    const updateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(progress);

      // Trigger counter animation at 5 seconds
      if (progress >= 0.9 && !startCounting) {
        setStartCounting(true);
      }

      if (progress < 1) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [animationStarted]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Parallax transform based on mouse
  const parallaxStyle = {
    transform: `translate(${mousePosition.normalizedX * -10}px, ${mousePosition.normalizedY * -10}px)`,
  };

  // Content visibility states
  const showContent = animationProgress > 0.6;
  const showHeadline = animationProgress > 0.6;
  const showDescription = animationProgress > 0.75;
  const showButtons = animationProgress > 0.82;
  const showStats = animationProgress > 0.9;
  const showScrollIndicator = animationProgress > 0.95;

  return (
    <section id="home" className="hero-cinematic" ref={heroRef}>
      {/* Background layers */}
      <div className="hero-background" style={parallaxStyle}>
        <div className="hero-bg-gradient" />
        <HeroEffects animationProgress={animationProgress} />
      </div>

      {/* Main content container */}
      <div className="hero-container">
        {/* Left side - Content */}
        <div className="hero-content-side">
          {/* Premium label */}
          <motion.div
            className="hero-premium-label"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="label-line" />
            <span className="label-text">{t('hero.premiumLabel')}</span>
            <span className="label-line" />
          </motion.div>

          {/* Main headline - Arabic */}
          <motion.h1
            className="hero-headline"
            initial={{ opacity: 0 }}
            animate={{ opacity: showHeadline ? 1 : 0 }}
            transition={{ duration: 0.1 }}
          >
            <AnimatedText
              text={t('hero.titleAr')}
              delay={0.6}
              className="headline-text"
            />
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: showDescription ? 1 : 0, y: showDescription ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* Description */}
          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: showDescription ? 1 : 0, y: showDescription ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            {t('hero.description')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: showButtons ? 1 : 0, y: showButtons ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          >
            <button
              className="hero-btn hero-btn-primary"
              onClick={() => scrollTo('planner')}
            >
              <span>{t('hero.planYourEvent')}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button
              className="hero-btn hero-btn-outline"
              onClick={() => scrollTo('portfolio')}
            >
              {t('hero.viewPortfolio')}
            </button>
          </motion.div>

          {/* Statistics */}
          <motion.div
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: showStats ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="hero-stat">
              <div className="stat-number">
                <Counter end={500} duration={2} startCounting={startCounting} />
                <span className="stat-plus">+</span>
              </div>
              <div className="stat-label">{t('hero.statEvents')}</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="stat-number">
                <Counter end={3} duration={1.5} startCounting={startCounting} />
                <span className="stat-suffix">{t('hero.statYearsSuffix')}</span>
              </div>
              <div className="stat-label">{t('hero.statExperience')}</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="stat-number">
                <Counter end={100} duration={2} startCounting={startCounting} />
                <span className="stat-plus">%</span>
              </div>
              <div className="stat-label">{t('hero.statSatisfaction')}</div>
            </div>
          </motion.div>
        </div>

        {/* Right side - Visual */}
        <motion.div
          className="hero-visual-side"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: showContent ? 1 : 0, scale: showContent ? 1 : 1.1 }}
          transition={{ duration: 2, delay: 0.3, ease: 'easeOut' }}
          style={{
            transform: `translate(${mousePosition.normalizedX * -15}px, ${mousePosition.normalizedY * -15}px)`,
          }}
        >
          <div className="hero-image-frame">
            <div className="hero-image-glow" />
            <div className="hero-image-container">
              <img
                src="/picture/hero-display.jpg"
                alt="Luxury Wedding Decoration"
                className="hero-image"
                loading="eager"
              />
              <div className="hero-image-overlay" />
            </div>
            <div className="hero-frame-corner top-left" />
            <div className="hero-frame-corner top-right" />
            <div className="hero-frame-corner bottom-left" />
            <div className="hero-frame-corner bottom-right" />
          </div>

          {/* Floating badge */}
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: showStats ? 1 : 0, scale: showStats ? 1 : 0.8 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="badge-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div className="badge-text">
              <span className="badge-title">{t('hero.badgeTitle')}</span>
              <span className="badge-subtitle">{t('hero.badgeSubtitle')}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hero-scroll-indicator"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showScrollIndicator ? 1 : 0, y: showScrollIndicator ? 0 : 20 }}
        transition={{ duration: 0.5 }}
        onClick={() => scrollTo('portfolio')}
      >
        <span className="scroll-text">{t('hero.scroll')}</span>
        <div className="scroll-line">
          <div className="scroll-dot" />
        </div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="hero-bottom-fade" />
    </section>
  );
}

export default Hero;