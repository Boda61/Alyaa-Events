import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { LanguageProvider, useLanguage } from './i18n';
import { servicesService, portfolioService, testimonialsService, settingsService, rentalItemsService, decorationService } from './firebase/service';
import {
  HouseSimple,
  Users,
  CalendarCheck,
  Clock,
  MagnifyingGlass,
  X,
  Phone,
  EnvelopeSimple,
  MapPin,
  InstagramLogo,
  FacebookLogo,
  WhatsappLogo,
  PinterestLogo,
  CaretRight
} from 'phosphor-react';
import './App.css';

// Gallery Images - From local picture folder (fallback if Firebase empty)
const localGalleryImages = [
  { id: 1, src: '/picture/design 1.jpeg', title: 'Royal Wedding', location: 'Grand Ballroom', titleAr: 'زفاف ملكي', locationAr: 'القاعة الكبيرة' },
  { id: 2, src: '/picture/design 2.jpeg', title: 'Garden Ceremony', location: 'Private Estate', titleAr: ' ceremony في الحديقة', locationAr: 'Estate خاص' },
  { id: 3, src: '/picture/design 3.jpeg', title: 'Beach Reception', location: 'Coastal Villa', titleAr: 'استقبال على الشاطئ', locationAr: 'فيلا ساحلية' },
  { id: 4, src: '/picture/design 4.jpeg', title: 'Engagement Party', location: 'Rooftop Garden', titleAr: 'حفلة الخطوبة', locationAr: 'سطح الحديقة' },
  { id: 5, src: '/picture/design 5.jpeg', title: 'Intimate Dinner', location: 'Private Residence', titleAr: 'عشاء خاص', locationAr: ' residence خاص' },
  { id: 6, src: '/picture/design 6.jpeg', title: 'Henna Night', location: 'Cultural Center', titleAr: 'ليلة الحنة', locationAr: 'المركز الثقافي' },
  { id: 7, src: '/picture/design 7.jpeg', title: 'Floral Decor', location: 'Ballroom', titleAr: 'ديكور زهري', locationAr: 'القاعة' },
  { id: 8, src: '/picture/design 8.jpeg', title: 'Classic Elegance', location: 'Grand Hall', titleAr: 'أناقة كلاسيكية', locationAr: 'القاعة الكبيرة' },
  { id: 9, src: '/picture/design 9.jpeg', title: 'Modern Setup', location: 'Garden', titleAr: 'إعداد حديث', locationAr: 'الحديقة' },
];

// Default services (fallback)
const defaultServicesList = [
  { nameEn: 'Weddings', nameAr: 'الأفراح', descriptionEn: 'Full-scale wedding decoration', descriptionAr: 'ديكور أفراح كامل', icon: 'flower' },
  { nameEn: 'Engagements', nameAr: 'الخطوبات', descriptionEn: 'Elegant engagement setups', descriptionAr: 'إعدادات خطوبة أنيقة', icon: 'heart' },
  { nameEn: 'Corporate Events', nameAr: 'احتفالات الشركات', descriptionEn: 'Professional event decorations', descriptionAr: 'ديكورات احترافية', icon: 'briefcase' },
  { nameEn: 'Special Celebrations', nameAr: 'احتفالات خاصة', descriptionEn: 'Custom celebrations', descriptionAr: 'احتفالات مخصصة', icon: 'party-horn' },
];

// Instagram Images - From local picture folder
const instagramImages = [
  '/picture/design 10.jpeg',
  '/picture/design 11.jpeg',
  '/picture/design 1.jpeg',
  '/picture/design 13.jpeg',
  '/picture/design 14.jpeg',
  '/picture/design 2.jpeg',
  '/picture/design 16.jpeg',
  '/picture/Design 20.jpeg',
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// Counter Component
function Counter({ end, duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{end > 100 ? '+' : ''}</span>;
}

// Navigation Component
function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, language, toggleLanguage, isRTL } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="#" className="nav-logo">Alyaa Events</a>
          <ul className="nav-links">
            <li><a href="#home" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('home'); }}>{t('nav.home')}</a></li>
            <li><a href="#portfolio" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('portfolio'); }}>{t('nav.portfolio')}</a></li>
            <li><a href="#about" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('about'); }}>{t('nav.about')}</a></li>
            <li><a href="#services" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('services'); }}>{t('nav.services')}</a></li>
            <li><a href="#contact" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>{t('nav.contact')}</a></li>
            <li><a href="#testimonials" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('testimonials'); }}>{language === 'en' ? 'Reviews' : 'آراء'}</a></li>
            <li><button className="btn btn-secondary nav-cta" onClick={() => scrollTo('planner')}>{t('nav.planEvent')}</button></li>
            <li>
              <a href="/admin" className="admin-link" title="لوحة التحكم" onClick={(e) => {
                // Allow default link behavior
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </a>
            </li>
            <li>
              <button className="lang-toggle" onClick={toggleLanguage}>
                {language === 'en' ? 'عربي' : 'EN'}
              </button>
            </li>
          </ul>
          <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Overlay */}
      <div className={`mobile-menu-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}></div>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>×</button>
        <a href="#home" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('home'); setMenuOpen(false); }}>{t('nav.home')}</a>
        <a href="#portfolio" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('portfolio'); setMenuOpen(false); }}>{t('nav.portfolio')}</a>
        <a href="#about" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('about'); setMenuOpen(false); }}>{t('nav.about')}</a>
        <a href="#services" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('services'); setMenuOpen(false); }}>{t('nav.services')}</a>
        <a href="#testimonials" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('testimonials'); setMenuOpen(false); }}>{language === 'en' ? 'Reviews' : 'آراء'}</a>
        <a href="#contact" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('contact'); setMenuOpen(false); }}>{t('nav.contact')}</a>
        <button className="btn btn-primary" onClick={() => { scrollTo('planner'); setMenuOpen(false); }}>{t('nav.planEvent')}</button>
        <a
          href="/admin"
          className="admin-link admin-link-mobile"
          title="لوحة التحكم"
          onClick={(e) => {
            // Allow default navigation
            setMenuOpen(false);
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span className="admin-link-mobile-text">لوحة التحكم</span>
        </a>
      </div>
      {/* Language toggle outside mobile menu - fixed position on mobile */}
      <button className="lang-toggle-fixed" onClick={() => { toggleLanguage(); setMenuOpen(false); }}>
        {language === 'en' ? 'عربي' : 'EN'}
      </button>
    </>
  );
}

// Hero Section
function Hero() {
  const { t } = useLanguage();
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero">
      <video
        className="hero-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{ background: 'transparent', display: 'block' }}
      >
        <source src="/picture/hero video.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <motion.p
          className="hero-label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {t('hero.label')}
        </motion.p>
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {t('hero.title').split(' ').map((word, i) => (
            i === 1 ? <span key={i}>{word}</span> : word + ' '
          ))}
        </motion.h1>
        <motion.p
          className="hero-description"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {t('hero.description')}
        </motion.p>
        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <button className="btn btn-outline" onClick={() => scrollTo('portfolio')}>{t('hero.viewPortfolio')}</button>
          <button className="btn btn-primary" onClick={() => scrollTo('planner')}>{t('hero.planYourEvent')}</button>
        </motion.div>
      </div>
      <div className="hero-scroll" onClick={() => scrollTo('planner')}>
        <span>{t('hero.scroll')}</span>
        <span>↓</span>
      </div>
    </section>
  );
}

// Gallery Section
function Gallery() {
  const { t, language } = useLanguage();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  // Map portfolio data with local images
  const mapPortfolioWithImages = (portfolioData) => {
    return portfolioData.map((item, index) => {
      // Use uploaded image if available, otherwise use local fallback
      // Handle both old format (images array) and new format (imageUrl)
      let imageSrc = '';
      if (item.imageUrl) {
        // New format
        imageSrc = item.imageUrl;
      } else if (item.images && item.images.length > 0) {
        // Old format
        const firstImage = item.images[0];
        imageSrc = typeof firstImage === 'string' ? firstImage : firstImage?.url || '';
      }
      // Only use valid URLs (not empty strings)
      if (!imageSrc) {
        imageSrc = localGalleryImages[index]?.src || '';
      }
      return {
        ...item,
        src: imageSrc,
        title: item.titleEn,
        titleAr: item.titleAr,
        location: item.location,
        locationAr: item.location,
      };
    });
  };

  // Fetch from Firebase, fallback to local
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await portfolioService.getAll();
        if (data && data.length > 0) {
          setGalleryImages(mapPortfolioWithImages(data));
        } else {
          setGalleryImages(localGalleryImages);
        }
      } catch (error) {
        console.error('Error fetching gallery:', error);
        setGalleryImages(localGalleryImages);
      }
    };
    fetchGallery();
  }, []);

  const images = galleryImages.length > 0
    ? galleryImages.filter(img => img.src) // Filter out empty images
    : localGalleryImages;

  const openLightbox = (image) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  };

  return (
    <section id="portfolio" className="section gallery">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{t('portfolio.label')}</span>
          <h2 className="section-title">{t('portfolio.title')}</h2>
          <p className="section-subtitle">{t('portfolio.subtitle')}</p>
        </div>

        <div className="gallery-grid">
          {images.map((image, index) => (
            <div
              key={image.id || index}
              className="gallery-item"
              onClick={() => openLightbox(image)}
            >
              <img src={image.src} alt={language === 'ar' ? image.titleAr : image.title} loading="lazy" />
              <div className="gallery-overlay">
                <div className="gallery-info">
                  <h4>{language === 'ar' ? image.titleAr : image.title}</h4>
                  <p>{image.location}</p>
                </div>
                <div className="gallery-icon">
                  <MagnifyingGlass weight="bold" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightboxOpen && selectedImage && (
          <motion.div
            className="lightbox open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
          >
            <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>
              <X weight="bold" />
            </button>
            <img src={selectedImage.src} alt={selectedImage.title} />
            <div className="lightbox-info">
              <h3>{language === 'ar' ? selectedImage.titleAr : selectedImage.title}</h3>
              <p>{selectedImage.location}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// About Section
function About() {
  const { t } = useLanguage();
  const timeline = t('timeline');

  return (
    <section id="about" className="section about">
      <div className="container">
        <div className="about-grid">
          <motion.div
            className="about-image"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img src="https://images.unsplash.com/photo-1529636798458-92182e662485?w=800" alt="Alyaa Events Team" loading="lazy" />
          </motion.div>

          <motion.div
            className="about-content"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">{t('about.label')}</span>
            <h2>{t('about.title')}</h2>
            <p className="about-text">
              {t('about.text')}
            </p>

            <div className="about-timeline">
              {timeline.map((item, index) => (
                <div key={index} className="timeline-item">
                  <span className="timeline-year">{item.year}</span>
                  <p className="timeline-text">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="about-stats">
              <div className="stat-item">
                <div className="stat-number"><Counter end={3} /> {t('about.years')}</div>
                <div className="stat-label">{t('about.experience')}</div>
              </div>
              <div className="stat-item">
                <div className="stat-number"><Counter end={200} />+</div>
                <div className="stat-label">{t('about.events')}</div>
              </div>
              <div className="stat-item">
                <div className="stat-number"><Counter end={500} />+</div>
                <div className="stat-label">{t('about.clients')}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Services Section
function Services() {
  const { t, language } = useLanguage();
  const [servicesList, setServicesList] = useState([]);

  // Fetch from Firebase, fallback to local
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await servicesService.getAll();
        if (data && data.length > 0) {
          setServicesList(data);
        } else {
          setServicesList(defaultServicesList);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setServicesList(defaultServicesList);
      }
    };
    fetchServices();
  }, []);

  const services = servicesList.length > 0 ? servicesList : defaultServicesList;

  return (
    <section id="services" className="section services">
      <div className="container">
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="section-label">{t('services.label')}</span>
          <h2 className="section-title">{t('services.title')}</h2>
          <p className="section-subtitle">{t('services.subtitle')}</p>
        </motion.div>

        <motion.div
          className="services-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.length > 0 ? services.map((service, index) => (
            <motion.div
              key={service.id || index}
              className="service-card"
              variants={fadeInUp}
              whileHover={{ y: -8 }}
            >
              <div className="service-icon">
                {index === 0 && <HouseSimple weight="duotone" />}
                {index === 1 && <Users weight="duotone" />}
                {index === 2 && <CalendarCheck weight="duotone" />}
                {index === 3 && <Clock weight="duotone" />}
              </div>
              <h3>{language === 'ar' ? service.nameAr : service.nameEn}</h3>
              <p>{language === 'ar' ? service.descriptionAr : service.descriptionEn}</p>
                          </motion.div>
          )) : defaultServicesList.map((service, index) => (
            <motion.div
              key={index}
              className="service-card"
              variants={fadeInUp}
              whileHover={{ y: -8 }}
            >
              <div className="service-icon">
                {index === 0 && <HouseSimple weight="duotone" />}
                {index === 1 && <Users weight="duotone" />}
                {index === 2 && <CalendarCheck weight="duotone" />}
                {index === 3 && <Clock weight="duotone" />}
              </div>
              <h3>{language === 'ar' ? service.nameAr : service.nameEn}</h3>
              <p>{language === 'ar' ? service.descriptionAr : service.descriptionEn}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Pricing Section
function Pricing() {
  const { language } = useLanguage();
  const [decorations, setDecorations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchDecorations = async () => {
      try {
        const data = await decorationService.getAllWithDefaults();
        setDecorations(data);
      } catch (err) {
        console.error('Error fetching decorations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDecorations();
  }, []);

  // Get valid image URL with fallback
  const getValidImageUrl = (item, index) => {
    if (item.imageUrl && item.imageUrl.startsWith('http') && !item.imageUrl.startsWith('blob:')) {
      return item.imageUrl;
    }
    // Fallback to local image
    return `/picture/design ${(index % 15) + 1}.jpeg`;
  };

  // Default designs if no data
  const designs = decorations.length > 0 ? decorations : [
    { name: 'Design 1', price: 35000, imageUrl: '' },
    { name: 'Design 2', price: 45000, imageUrl: '' },
    { name: 'Design 3', price: 55000, imageUrl: '' },
    { name: 'Design 4', price: 40000, imageUrl: '' },
    { name: 'Design 5', price: 50000, imageUrl: '' },
    { name: 'Design 6', price: 60000, imageUrl: '' },
    { name: 'Design 7', price: 42000, imageUrl: '' },
    { name: 'Design 8', price: 38000, imageUrl: '' },
    { name: 'Design 9', price: 38000, imageUrl: '' },
    { name: 'Design 10', price: 38000, imageUrl: '' },
    { name: 'Design 11', price: 38000, imageUrl: '' },
    { name: 'Design 12', price: 38000, imageUrl: '' },
    { name: 'Design 13', price: 38000, imageUrl: '' },
    { name: 'Design 14', price: 38000, imageUrl: '' },
    { name: 'Design 15', price: 38000, imageUrl: '' }
  ];

  const openModal = (design) => {
    setSelectedDesign(design);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDesign(null);
    document.body.style.overflow = 'auto';
  };

  // Design details for modal (sample data - in production this would come from Firebase)
  const designDetails = {
    flowerType: language === 'en' ? 'Fresh Roses & Orchids' : 'ورود طازجة واوركيد',
    setupDuration: language === 'en' ? '3-4 hours' : '3-4 ساعات',
  };

  return (
    <section id="pricing" className="section pricing">
      <div className="container">
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="section-label">{language === 'en' ? 'Our Designs' : 'تصامناتنا'}</span>
          <h2 className="section-title">{language === 'en' ? 'Decoration Prices' : 'اسعار الديكور'}</h2>
          <p className="section-subtitle">{language === 'en' ? 'Choose your design and get a custom quote' : 'اختر تصميمك واحصل على سعر مخصص'}</p>
        </motion.div>

        <motion.div
          className="designs-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {designs.map((item, index) => (
            <motion.div
              key={index}
              className="design-card"
              variants={fadeInUp}
              whileHover={{ scale: 1.03 }}
            >
              <div className="design-image">
                <img
                  src={getValidImageUrl(item, index)}
                  alt={item.name || `Design ${index + 1}`}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = `/picture/design ${(index % 15) + 1}.jpeg`;
                  }}
                />
              </div>
              <div className="design-info">
                <span className="design-price">
                  {language === 'en' ? `${Number(item.price).toLocaleString()} EGP` : `${Number(item.price).toLocaleString()} جنيه`}
                </span>
                <span className="price-label">{language === 'en' ? 'Starting Price' : 'سعر البداية'}</span>
                <button className="view-details-btn" onClick={() => openModal(item)}>
                  {language === 'en' ? 'View Details' : 'عرض التفاصيل'}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Modal */}
        {showModal && selectedDesign && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="design-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="modal-close-btn" onClick={closeModal}>
                <X size={24} />
              </button>

              <div className="modal-image">
                <img
                  src={getValidImageUrl(selectedDesign, designs.indexOf(selectedDesign))}
                  alt={selectedDesign.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = `/picture/design ${(designs.indexOf(selectedDesign) % 15) + 1}.jpeg`;
                  }}
                />
              </div>

              <div className="modal-content">
                <h2 className="modal-title">{selectedDesign.name}</h2>

                <div className="setup-section">
                  <h3>{language === 'en' ? 'تجهيز المكان' : 'تجهيز المكان'}</h3>
                  <div className="setup-grid">
                    {[
                      { id: 'بدون كنبة', icon: '🛋️', label: 'بدون كنبة' },
                      { id: 'ب كنبة', icon: '🛋️✨', label: 'ب كنبة' },
                      { id: 'ب كراسي', icon: '🪑', label: 'ب كراسي' },
                      { id: 'بدون كراسي', icon: '🚫🪑', label: 'بدون كراسي' }
                    ].map((setup) => (
                      <div
                        key={setup.id}
                        className={`setup-card ${selectedDesign.setupType === setup.id ? 'active' : 'inactive'}`}
                      >
                        <span className="setup-icon">{setup.icon}</span>
                        <span className="setup-label">{setup.label}</span>
                        {selectedDesign.setupType === setup.id && (
                          <span className="setup-check">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="details-grid">
                  <div className="detail-card">
                    <span className="detail-label">{language === 'en' ? 'Flower Type' : 'نوع الورود'}</span>
                    <span className="detail-value">{designDetails.flowerType}</span>
                  </div>

                  <div className="detail-card">
                    <span className="detail-label">{language === 'en' ? 'Setup Duration' : 'مدة التركيب'}</span>
                    <span className="detail-value">{designDetails.setupDuration}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Rental Prices Section
function RentalPrices() {
  const { language } = useLanguage();
  const [rentalItems, setRentalItems] = useState([]);

  // Fetch from Firebase
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const data = await rentalItemsService.getAll();
        if (data && data.length > 0) {
          setRentalItems(data);
        }
      } catch (error) {
        console.error('Error fetching rentals:', error);
      }
    };
    fetchRentals();
  }, []);

  // Filter items by category
  const tributesWithFlowers = rentalItems.filter(item => item.category === 'mirrors-flowers');
  const tributesWithoutFlowers = rentalItems.filter(item => item.category === 'mirrors');
  const normalChairs = rentalItems.filter(item => item.category === 'normalChairs');
  const caneChairs = rentalItems.filter(item => item.category === 'caneChairs');

  // Helper to get display name based on language
  const getDisplayName = (item) => {
    if (language === 'ar' && item.nameAr) return item.nameAr;
    return item.nameEn || item.name || '';
  };

  // Helper to map Firebase data to display format with discount logic
  const mapRentalItem = (item) => {
    const displayPrice = item.hasDiscount && item.discountedPrice ? item.discountedPrice : item.price;
    return {
      name: getDisplayName(item),
      price: displayPrice || '',
      originalPrice: item.hasDiscount && item.originalPrice ? item.originalPrice : null,
      hasDiscount: item.hasDiscount || false
    };
  };

  // Default fallback data if Firebase is empty
  const defaultTributesWithFlowers = [
    { name: language === 'en' ? 'Mirror with Gold Roses' : 'مراية ورود ذهب', price: '1,500' },
    { name: language === 'en' ? 'Mirror with White Roses' : 'مراية ورود بيض', price: '1,200' },
    { name: language === 'en' ? 'Mirror with Mix Roses' : 'مراية ورود ملونة', price: '1,800' },
    { name: language === 'en' ? 'Mirror with Red Roses' : 'مراية ورود حمرا', price: '1,600' }
  ];

  const defaultTributesWithoutFlowers = [
    { name: language === 'en' ? 'Classic Mirror' : 'مراية كلاسيك', price: '800' },
    { name: language === 'en' ? 'Gold Frame Mirror' : 'مراية ذهب', price: '1,200' },
    { name: language === 'en' ? 'Crystal Mirror' : 'مراية كريستال', price: '1,500' },
    { name: language === 'en' ? 'Mirror with LED' : 'مراية ليد', price: '2,500' }
  ];

  const defaultNormalChairs = [
    { name: language === 'en' ? '50 - 100 chairs' : '٥٠ - ١٠٠ كرسي', price: '4,000' },
    { name: language === 'en' ? '100 - 200 chairs' : '١٠٠ - ٢٠٠ كرسي', price: '7,500' },
    { name: language === 'en' ? '200 - 300 chairs' : '٢٠٠ - ٣٠٠ كرسي', price: '11,000' },
    { name: language === 'en' ? '300 - 500 chairs' : '٣٠٠ - ٥٠٠ كرسي', price: '17,500' },
    { name: language === 'en' ? '500+ chairs' : '٥٠٠+ كرسي', price: '25,000' }
  ];

  const defaultCaneChairs = [
    { name: language === 'en' ? '50 - 100 cane chairs' : '٥٠ - ١٠٠ كرسي كانيه', price: '6,000' },
    { name: language === 'en' ? '100 - 200 cane chairs' : '١٠٠ - ٢٠٠ كرسي كانيه', price: '11,000' },
    { name: language === 'en' ? '200 - 300 cane chairs' : '٢٠٠ - ٣٠٠ كرسي كانيه', price: '16,000' },
    { name: language === 'en' ? '300 - 500 cane chairs' : '٣٠٠ - ٥٠٠ كرسي كانيه', price: '24,000' },
    { name: language === 'en' ? '500+ cane chairs' : '٥٠٠+ كرسي كانيه', price: '35,000' }
  ];

  // Use Firebase data or fallback, map to display format
  const displayTributesWithFlowers = tributesWithFlowers.length > 0 ? tributesWithFlowers.map(mapRentalItem) : defaultTributesWithFlowers;
  const displayTributesWithoutFlowers = tributesWithoutFlowers.length > 0 ? tributesWithoutFlowers.map(mapRentalItem) : defaultTributesWithoutFlowers;
  const displayNormalChairs = normalChairs.length > 0 ? normalChairs.map(mapRentalItem) : defaultNormalChairs;
  const displayCaneChairs = caneChairs.length > 0 ? caneChairs.map(mapRentalItem) : defaultCaneChairs;

  return (
    <section id="rental" className="section rental">
      <div className="container">
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="section-label">{language === 'en' ? 'Rental Prices' : 'اسعار الايجار'}</span>
          <h2 className="section-title">{language === 'en' ? 'Mirrors & Chairs' : 'مرايا والكراسي'}</h2>
          <p className="section-subtitle">{language === 'en' ? 'Rent premium items for your event' : 'استأجر عناصر PREMIUM لحدثك'}</p>
        </motion.div>

        <div className="rental-grid">
          <motion.div
            className="rental-category"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h3>{language === 'en' ? 'Mirrors with Flowers' : 'مرايا بورد'}</h3>
            <div className="rental-items">
              {displayTributesWithFlowers.map((item, index) => (
                <div key={index} className="rental-item">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">
                    {item.hasDiscount && item.originalPrice ? (
                      <>
                        <span className="original-price">{language === 'en' ? `${item.originalPrice} EGP` : `${item.originalPrice} جنيه`}</span>
                        <span className="discounted-price">{language === 'en' ? `${item.price} EGP` : `${item.price} جنيه`}</span>
                      </>
                    ) : (
                      language === 'en' ? `${item.price} EGP` : `${item.price} جنيه`
                    )}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="rental-category"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h3>{language === 'en' ? 'Tapels' : 'ترابيزات'}</h3>
            <div className="rental-items">
              {displayTributesWithoutFlowers.map((item, index) => (
                <div key={index} className="rental-item">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">
                    {item.hasDiscount && item.originalPrice ? (
                      <>
                        <span className="original-price">{language === 'en' ? `${item.originalPrice} EGP` : `${item.originalPrice} جنيه`}</span>
                        <span className="discounted-price">{language === 'en' ? `${item.price} EGP` : `${item.price} جنيه`}</span>
                      </>
                    ) : (
                      language === 'en' ? `${item.price} EGP` : `${item.price} جنيه`
                    )}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="rental-category"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h3>{language === 'en' ? ' Chairs' : 'كراسي'}</h3>
            <div className="rental-items">
              {displayNormalChairs.map((item, index) => (
                <div key={index} className="rental-item">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">
                    {item.hasDiscount && item.originalPrice ? (
                      <>
                        <span className="original-price">{language === 'en' ? `${item.originalPrice} EGP` : `${item.originalPrice} جنيه`}</span>
                        <span className="discounted-price">{language === 'en' ? `${item.price} EGP` : `${item.price} جنيه`}</span>
                      </>
                    ) : (
                      language === 'en' ? `${item.price} EGP` : `${item.price} جنيه`
                    )}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="rental-category"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h3>{language === 'en' ? 'Cane Chairs' : 'كراسي (مدفع)'}</h3>
            <div className="rental-items">
              {displayCaneChairs.map((item, index) => (
                <div key={index} className="rental-item">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">
                    {item.hasDiscount && item.originalPrice ? (
                      <>
                        <span className="original-price">{language === 'en' ? `${item.originalPrice} EGP` : `${item.originalPrice} جنيه`}</span>
                        <span className="discounted-price">{language === 'en' ? `${item.price} EGP` : `${item.price} جنيه`}</span>
                      </>
                    ) : (
                      language === 'en' ? `${item.price} EGP` : `${item.price} جنيه`
                    )}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Mirror & Welcome Board Gallery Section
function MirrorGallery() {
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const mirrorItems = [
    { name: '  ', nameEn: '  ', image: '/picture/ديكور مرايا و لوحه ترحيب.jpeg' },
    { name: '  ', nameEn: '  ', image: '/picture/ديكور مرايا..jpeg' },
    { name: '  ', nameEn: '  ', image: '/picture/لوحه ترحيب 6.jpeg' },
    { name: '  ', nameEn: '  ', image: '/picture/design 6.jpeg' },
    { name: '  ', nameEn: '  ', image: '/picture/لوحه ترحيب 4.jpeg' },
    { name: '  ', nameEn: '  ', image: '/picture/ديكور مرايا 8.jpeg' },
    { name: '  ', nameEn: '   ', image: '/picture/لوحه ترحيب 5.jpeg' },
    { name: '  ', nameEn: '  ', image: '/picture/ديكور باب الشقه.jpeg' },
    { name: '  ', nameEn: '  ', image: '/picture/ديكور مرايا 9.jpeg' },
    { name: '  ', nameEn: '  ', image: '/picture/لوحه ترحيب 3.jpeg' },
    { name: '  ', nameEn: '  ', image: '/picture/design 7.jpeg' },
    { name: '  ', nameEn: '  ', image: '/picture/ديكور باب شقه 3.jpeg' },
    { name: '  ', nameEn: '  ', image: '/picture/ديكور مرايا 7.jpeg' },
    { name: '  ', nameEn: '  ', image: '/picture/لوحه ترحيب 8.jpeg' },
    { name: '  ', nameEn: '  ', image: '/picture/ديكور مرايا 3.jpeg' },
    { name: '  ', nameEn: '  ', image: '/picture/ديكور باب الشقه 2.jpeg' },
    { name: '  ', nameEn: '  ', image: '/picture/ديكور مرايا 10.jpeg' },
    { name: '  ', nameEn: '  ', image: '/picture/ديكور مرايا 5.jpeg' },
    { name: '  ', nameEn: '  ', image: '/picture/ديكور مرايا 6.jpeg' },
  ];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % mirrorItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, mirrorItems.length]);

  const [touchStart, setTouchStart] = useState(null);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - touchStart.x;
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(touch.clientY - touchStart.y)) {
      if (diffX > 0) {
        setCurrentSlide(prev => (prev - 1 + mirrorItems.length) % mirrorItems.length);
      } else {
        setCurrentSlide(prev => (prev + 1) % mirrorItems.length);
      }
    }
    setTouchStart(null);
  };

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % mirrorItems.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + mirrorItems.length) % mirrorItems.length);

  return (
    <section id="mirror-gallery" className="section mirror-gallery">
      <div className="container">
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="section-label">{language === 'en' ? 'Gallery' : 'معرض'}</span>
          <h2 className="section-title">{language === 'en' ? 'Mirrors & Welcome Boards' : 'المرايا ولوحات الترحيب'}</h2>
        </motion.div>

        <div
          className="gallery-slider"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button className="gallery-nav-btn prev" onClick={prevSlide}>
            ❮
          </button>

          <div className="gallery-wrapper">
            {mirrorItems.map((item, index) => (
              <div
                key={index}
                className={`gallery-card ${index === currentSlide ? 'active' : ''}`}
              >
                <div className="gallery-image">
                  <img
                    src={item.image}
                    alt={language === 'ar' ? item.name : item.nameEn}
                    loading="lazy"
                  />
                </div>
                <div className="gallery-info">
                  <h3>{language === 'ar' ? item.name : item.nameEn}</h3>
                </div>
              </div>
            ))}
          </div>

          <button className="gallery-nav-btn next" onClick={nextSlide}>
            ❯
          </button>
        </div>

        <div className="gallery-dots">
          {mirrorItems.map((_, index) => (
            <button
              key={index}
              className={`gallery-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Rental Gallery Slider Section
function RentalGallery() {
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Gallery data for chairs & tables
  const galleryItems = [
    { name: 'كرسي مدفع ', nameEn: 'Cannon chair', image: '/picture/كراسي مدفع 2.jpeg' },
    { name: ' كرسي اكليرك (ترابيزه اكليرك)', nameEn: 'Acrylic chair (acrylic table)', image: '/picture/كرسي اكليرك.jpeg' },
    { name: ' كرسي خشب (ترابيزه خشب)', nameEn: 'Wooden chair (wooden table)', image: '/picture/كرسي خشب.jpeg' },
    { name: ' كرسي خشب اكس', nameEn: 'Wooden Chair X', image: '/picture/كرسي خشب اكس .jpeg' },
    { name: 'كرسي خشب', nameEn: 'Wooden Chair', image: '/picture/كرسي خشب 3 .jpeg' },
    { name: 'ترابيزه زجزاج ', nameEn: 'Zigzag table', image: '/picture/ترابيزه زجزاج.jpeg' },
    { name: 'كرسي مدفع (ترابيزه بيضاوي)', nameEn: 'Cannon Chair (Oval Table)', image: '/picture/كراسي مدفع 3.jpeg' },
    { name: 'ورد ع السلم', nameEn: 'Roses on the Staircase', image: '/picture/ديكور السلم.jpeg' },
    { name: 'ورد ع السلم', nameEn: 'Roses on the Staircase', image: '/picture/ديكور سلم 2.jpeg' },
    { name: 'ورد ع السلم', nameEn: 'Roses on the Staircase', image: '/picture/ديكور سلم 3.jpeg' },
  ];

  // Auto play - change slide every 4 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % galleryItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, galleryItems.length]);

  // Swipe handlers for mobile
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - touchStart.current.x;
    const diffY = touch.clientY - touchStart.current.y;

    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        setCurrentSlide(prev => (prev - 1 + galleryItems.length) % galleryItems.length);
      } else {
        setCurrentSlide(prev => (prev + 1) % galleryItems.length);
      }
    }
    setTouchStart(null);
  };

  const [touchStart, setTouchStart] = useState(null);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % galleryItems.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + galleryItems.length) % galleryItems.length);

  return (
    <section id="rental-gallery" className="section rental-gallery">
      <div className="container">
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="section-label">{language === 'en' ? 'Gallery' : 'معرض'}</span>
          <h2 className="section-title">{language === 'en' ? 'Mirrors & Chairs Gallery' : 'معرض التربيزات والكراسي'}</h2>
        </motion.div>

        <div
          className="gallery-slider"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button className="gallery-nav-btn prev" onClick={prevSlide}>
            ❮
          </button>

          <div className="gallery-wrapper">
            {galleryItems.map((item, index) => (
              <div
                key={index}
                className={`gallery-card ${index === currentSlide ? 'active' : ''}`}
              >
                <div className="gallery-image">
                  <img
                    src={item.image}
                    alt={language === 'ar' ? item.name : item.nameEn}
                    loading="lazy"
                  />
                </div>
                <div className="gallery-info">
                  <h3>{language === 'ar' ? item.name : item.nameEn}</h3>
                </div>
              </div>
            ))}
          </div>

          <button className="gallery-nav-btn next" onClick={nextSlide}>
            ❯
          </button>
        </div>

        <div className="gallery-dots">
          {galleryItems.map((_, index) => (
            <button
              key={index}
              className={`gallery-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Event Planner Section
function EventPlanner() {
  const [step, setStep] = useState(1);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formDataImages, setFormDataImages] = useState([]);
  const [formData, setFormData] = useState({
    eventType: '',
    guestCount: '',
    style: '',
    colors: [],
    budget: '',
    budgetText: '',
    notes: '',
    venueType: '',
    venueLocation: '',
    venueNotes: ''
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Toggle color selection - allow 1-5 colors
  const toggleColor = (colorId) => {
    const currentColors = formData.colors || [];
    if (currentColors.includes(colorId)) {
      // Remove color if already selected
      updateFormData('colors', currentColors.filter(c => c !== colorId));
    } else {
      // Add color only if less than 5 selected
      if (currentColors.length < 5) {
        updateFormData('colors', [...currentColors, colorId]);
      }
    }
  };

  const isColorSelected = (colorId) => (formData.colors || []).includes(colorId);

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setFormDataImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...formDataImages];
    newImages.splice(index, 1);
    setFormDataImages(newImages);
  };

  const getEventTypeName = (id) => eventTypesList.find(t => t.id === id)?.name || id;
  const getGuestCountName = (id) => guestCountsList.find(g => g.id === id)?.name || id;
  const getStyleName = (id) => decorationStylesList.find(s => s.id === id)?.name || id;
  const getColorName = (id) => availableColors.find(c => c.id === id)?.name || id;
  const getBudgetName = (id) => budgetRangesList.find(b => b.id === id)?.name || id;

  // Upload image to free hosting service
  // Upload image to litterbox (temporary free hosting)
  const uploadImageToLitterbox = async (file) => {
    return new Promise((resolve, reject) => {
      const formDataUpload = new FormData();
      formDataUpload.append('reqtype', 'uploadrequest');
      formDataUpload.append('time', '1h');
      formDataUpload.append('fileToUpload', file);

      fetch('https://litterbox.catbox.moe/resources/internals/uploader.php', {
        method: 'POST',
        body: formDataUpload
      })
      .then(response => response.text())
      .then(data => {
        if (data.startsWith('https://')) {
          resolve(data);
        } else {
          reject(new Error('Upload failed'));
        }
      })
      .catch(err => reject(err));
    });
  };

  const generateWhatsAppMessage = async () => {
    let message = `✨ New Event Inquiry - Alyaa Events\n\n`;

    // Event details
    if (formData.eventType) {
      message += `نوع الفعالية: ${getEventTypeName(formData.eventType)}\n`;
    }
    if (formData.guestCount) {
      message += `عدد الضيوف: ${getGuestCountName(formData.guestCount)}\n`;
    }
    if (formData.colors && formData.colors.length > 0) {
      const colorNames = formData.colors.map(id => getColorName(id)).join(' - ');
      message += `الوان الورد: ${colorNames}\n`;
    }
    if (formData.budget) {
      message += `الميزانية: ${formData.budgetText.replace(/\n/g, ' ')}\n`;
    }

    // Venue info
    if (formData.venueType) {
      message += `نوع المكان: ${getVenueTypeName(formData.venueType)}\n`;
    }
    if (formData.venueLocation) {
      message += `موقع المكان: ${formData.venueLocation}\n`;
    }

    message += `\nملاحظات إضافية:\n`;
    const notes = formData.notes || formData.venueNotes;
    message += notes ? `${notes}\n` : `لا يوجد\n`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/201100496079?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const canProceed = () => {
    switch(step) {
      case 1: return formData.eventType;
      case 2: return true; // guestCount is optional
      case 3: return formData.colors && formData.colors.length >= 1;
      case 4: return formData.budget;
      case 5: return formData.venueType;
      case 6: return true; // image is optional
      default: return true;
    }
  };

  const { t, language } = useLanguage();

  const eventTypesList = [
    { id: 'wedding', name: language === 'en' ? 'Wedding' : 'فرح', description: language === 'en' ? 'Full day celebration' : 'احتفال اليوم الكامل' },
    { id: 'engagement', name: language === 'en' ? 'Engagement' : 'خطوبة', description: language === 'en' ? 'Ring exchange ceremony' : 'مراسم تبادل الخواتم' },
    { id: 'henna', name: language === 'en' ? 'Henna Night' : 'قرايه فاتحه', description: language === 'en' ? 'Traditional celebration' : 'احتفال تقليدي' },
    { id: 'corporate', name: language === 'en' ? 'Corporate' : 'شركة', description: language === 'en' ? 'Business event' : 'حدث تجاري' },
    { id: 'birthday', name: language === 'en' ? 'Birthday' : 'كتب كتاب', description: language === 'en' ? 'Anniversary celebration' : 'احتفال الذكرى' },
    { id: 'other', name: language === 'en' ? 'Other' : 'أخرى', description: language === 'en' ? 'Custom event' : 'حدث مخصص' },
  ];

  const guestCountsList = [
    { id: 'skip', name: language === 'en' ? 'Not sure yet' : 'مش متأكد', range: language === 'en' ? 'Skip for now' : 'يتخطى للمؤقت' },
    { id: '50', name: '50', range: language === 'en' ? 'Up to 50 guests' : 'حتى 50 ضيف' },
    { id: '100', name: '100', range: language === 'en' ? '50-100 guests' : '50-100 ضيف' },
    { id: '200', name: '200', range: language === 'en' ? '100-200 guests' : '100-200 ضيف' },
    { id: '300', name: '300', range: language === 'en' ? '200-300 guests' : '200-300 ضيف' },
    { id: '500', name: '500+', range: language === 'en' ? '300+ guests' : '300+ ضيف' },
  ];


  // قائمة الألوان المنفردة للاختيار
  const availableColors = [
    { id: 'white', name: language === 'en' ? 'White' : 'أبيض', color: '#FFFFFF' },
    { id: 'ivory', name: language === 'en' ? 'ofwhite' : 'اوف وايت', color: '#F5F5DC' },
    { id: 'blush', name: language === 'en' ? 'Blush' : 'بلاش', color: '#FFB6C1' },
    { id: 'pink', name: language === 'en' ? 'Pink' : 'وردي', color: '#FF69B4' },
    { id: 'coral', name: language === 'en' ? 'purple' : 'بنفسجي', color: '#a03ca3' },
    { id: 'peach', name: language === 'en' ? 'beige' : 'بيچ', color: '#FFDAB9' },
    { id: 'red', name: language === 'en' ? 'Red' : 'أحمر', color: '#DC143C' },
    { id: 'burgundy', name: language === 'en' ? 'brown' : 'بني', color: '#722F37' },
    { id: 'lavender', name: language === 'en' ? 'baby blue' : 'بيبي بلو', color: '#2486d1' },
  ];

  const budgetRangesList = [
    { id: '50k', name: '2500 - 8500 EGP', range: language === 'en' ? 'Budget-friendly' : 'قرايه فاتحه او خطوبه(in door)' },
    { id: '150k', name: '15,000 - 25,000 EGP', range: language === 'en' ? 'Mid-range' : 'كتب كتاب (out door)' },
    { id: '250k', name: '3000 - 8000 EGP', range: language === 'en' ? 'Premium' : 'كتب كتاب(in door)' },
    { id: '500k', name: '15,000 - 30,000 EGP', range: language === 'en' ? 'Luxury' : 'خطوبه (out door)' },
    { id: 'custom', name: '70,000 - 150,000 EGP', range: language === 'en' ? 'Ultra-luxury' : 'فرح' },
  ];

  const venueTypesList = [
    { id: 'villa', name: language === 'en' ? 'Villa' : 'فيلا' },
    { id: 'hotel', name: language === 'en' ? 'Hotel' : 'فندق' },
    { id: 'hall', name: language === 'en' ? 'Hall' : 'قاعة' },
    { id: 'beach', name: language === 'en' ? 'Beach' : 'شاطئ' },
    { id: 'garden', name: language === 'en' ? 'Garden' : 'حديقة' },
    { id: 'rooftop', name: language === 'en' ? 'Rooftop' : 'روف' },
    { id: 'other', name: language === 'en' ? 'Other' : 'أخرى' },
  ];

  const getVenueTypeName = (id) => venueTypesList.find(v => v.id === id)?.name || id;

  return (
    <section id="planner" className="section planner">
      <div className="container">
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="section-label">{t('planner.label')}</span>
          <h2 className="section-title">{t('planner.title')}</h2>
          <p className="section-subtitle">{t('planner.subtitle')}</p>
        </motion.div>

        <motion.div
          className="planner-form glass-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="planner-progress">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className={`progress-step ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}>
                <div className="progress-number">{step > s ? '✓' : s}</div>
                <span className="progress-label">
                  {s === 1 ? (language === 'en' ? 'Type' : 'النوع') : s === 2 ? (language === 'en' ? 'Guests' : 'الضيوف') : s === 3 ? (language === 'en' ? 'Colors' : 'الألوان') : s === 4 ? (language === 'en' ? 'Budget' : 'الميزانية') : (language === 'en' ? 'Details' : 'التفاصيل')}
                </span>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                className="planner-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="step-title">{t('form.eventType')}</h3>
                <p className="step-subtitle">{t('form.eventTypeSub')}</p>
                <div className="option-grid">
                  {eventTypesList.map((type) => (
                    <div
                      key={type.id}
                      className={`option-card ${formData.eventType === type.id ? 'selected' : ''}`}
                      onClick={() => updateFormData('eventType', type.id)}
                    >
                      <h4>{type.name}</h4>
                      <p>{type.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                className="planner-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="step-title">{t('form.guestCount')}</h3>
                <p className="step-subtitle">{t('form.guestCountSub')}</p>
                <div className="option-grid">
                  {guestCountsList.map((count) => (
                    <div
                      key={count.id}
                      className={`option-card ${formData.guestCount === count.id ? 'selected' : ''}`}
                      onClick={() => updateFormData('guestCount', count.id)}
                    >
                      <h4>{count.name}</h4>
                      <p>{count.range}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                className="planner-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="step-title">{t('form.colors')}</h3>
                <p className="step-subtitle">
                  {language === 'en'
                    ? `Select 1-5 colors for your flowers`
                    : `اختر من 1 الي 5 الوان لورود المناسبه`}
                </p>

                {/* Selected colors count info */}
                <div className="selected-count-info">
                  <span style={{
                    color: (formData.colors?.length || 0) >= 1 && (formData.colors?.length || 0) <= 5 ? '#22c55e' : '#eab308',
                    fontWeight: 600
                  }}>
                    {formData.colors?.length || 0}/5
                  </span>
                  <span style={{ marginRight: '8px', color: '#666' }}>
                    {language === 'en' ? 'colors selected' : 'ألوان مختاره'}
                  </span>
                </div>

                <div className="option-grid">
                  {availableColors.map((colorItem) => (
                    <div
                      key={colorItem.id}
                      className={`option-card color-card ${isColorSelected(colorItem.id) ? 'selected' : ''}`}
                      onClick={() => toggleColor(colorItem.id)}
                      style={{
                        border: isColorSelected(colorItem.id) ? '3px solid #5B3E2B' : '2px solid #e5e5e5',
                        background: isColorSelected(colorItem.id) ? '#FDF6EF' : '#fff'
                      }}
                    >
                      <div
                        className="color-circle"
                        style={{
                          background: colorItem.color,
                          border: colorItem.color === '#FFFFFF' || colorItem.color === '#F5F5DC' ? '2px solid #ccc' : 'none'
                        }}
                      ></div>
                      <h4>{colorItem.name}</h4>
                      {isColorSelected(colorItem.id) && (
                        <span className="color-check">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                className="planner-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="step-title">{t('form.budget')}</h3>
                <p className="step-subtitle">{t('form.budgetSub')}</p>
                <div className="option-grid">
                  {budgetRangesList.map((budget) => (
                    <div
                      key={budget.id}
                      className={`option-card ${formData.budget === budget.id ? 'selected' : ''}`}
                      onClick={() => {
                        updateFormData('budget', budget.id);
                        updateFormData('budgetText', `${budget.name}\n${budget.range}`);
                      }}
                    >
                      <h4>{budget.name}</h4>
                      <p>{budget.range}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                className="planner-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="step-title">{language === 'en' ? 'Venue Information' : 'معلومات المكان'}</h3>
                <p className="step-subtitle">{language === 'en' ? 'Tell us about your event location' : 'أخبرنا عن مكان فعاليتك'}</p>

                {/* Venue Type */}
                <div className="form-group">
                  <label className="form-label">{language === 'en' ? 'Venue Type *' : 'نوع المكان *'}</label>
                  <select
                    className="form-select"
                    value={formData.venueType}
                    onChange={(e) => updateFormData('venueType', e.target.value)}
                  >
                    <option value="">{language === 'en' ? 'Select venue type' : 'اختر نوع المكان'}</option>
                    {venueTypesList.map((venue) => (
                      <option key={venue.id} value={venue.id}>{venue.name}</option>
                    ))}
                  </select>
                </div>

                {/* Venue Location */}
                <div className="form-group">
                  <label className="form-label">{language === 'en' ? 'Venue Location' : 'موقع المكان'}</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={language === 'en' ? 'Enter address or paste Google Maps link' : 'اكتب عنوان المكان أو الصق رابط Google Maps'}
                    value={formData.venueLocation}
                    onChange={(e) => updateFormData('venueLocation', e.target.value)}
                  />
                </div>

                {/* Additional Notes */}
                <div className="form-group">
                  <label className="form-label">{language === 'en' ? 'Additional Notes (Optional)' : 'ملاحظات إضافية (اختياري)'}</label>
                  <textarea
                    className="form-textarea"
                    placeholder={language === 'en' ? 'Any other important information...' : 'أي معلومات أخرى مهمة...'}
                    value={formData.venueNotes}
                    onChange={(e) => updateFormData('venueNotes', e.target.value)}
                  ></textarea>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="planner-navigation">
            <button
              className={`btn btn-back ${step === 1 ? 'hidden' : ''}`}
              onClick={prevStep}
              style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
            >
              {t('form.back')}
            </button>
            {step < 5 ? (
              <button
                className="btn btn-primary"
                onClick={nextStep}
                disabled={!canProceed()}
                style={{ opacity: canProceed() ? 1 : 0.5 }}
              >
                {t('form.continue')}
              </button>
            ) : (
              <button
                className="btn planner-submit"
                onClick={generateWhatsAppMessage}
              >
                {t('form.submit')}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Process Section
function Process() {
  const { t, language } = useLanguage();

  const processStepsList = [
    { number: '01', title: language === 'en' ? 'Consultation' : 'استشارة', description: language === 'en' ? 'We meet to understand your vision, preferences, and budget for the perfect event.' : 'نلتقي لفهم رؤيتك وتفضيلاتك وميزانيتك للحدث المثالي.' },
    { number: '02', title: language === 'en' ? 'Design' : 'التصميم', description: language === 'en' ? 'Our team creates detailed mockups and design concepts tailored to your requirements.' : 'يإن فريقنا نماذج تفصيلية ومفاهيم تصميمية مصممة حسب متطلباتك.' },
    { number: '03', title: language === 'en' ? 'Proposal' : 'العرض', description: language === 'en' ? 'Receive a comprehensive proposal with detailed pricing and timeline for approval.' : 'استلم عرضاً شاملاً مع تسعير مفصل وجدول زمني للموافقة.' },
    { number: '04', title: language === 'en' ? 'Execution' : 'التنفيذ', description: language === 'en' ? 'Our professional team executes every detail with precision and care.' : 'ينفذ فريقنا المحترف كل التفاصيل بدقة وعناية.' },
    { number: '05', title: language === 'en' ? 'Celebration' : 'الاحتفال', description: language === 'en' ? 'Enjoy your flawless event while we handle all decorative elements.' : 'استمتع بحدثك المثالي بينما نتعامل مع جميع العناصر الزخرفية.' },
  ];

  return (
    <section id="process" className="section process">
      <div className="container">
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="section-label">{t('process.label')}</span>
          <h2 className="section-title">{t('process.title')}</h2>
          <p className="section-subtitle">{t('process.subtitle')}</p>
        </motion.div>

        <div className="process-timeline">
          {processStepsList.map((step, index) => (
            <motion.div
              key={index}
              className="process-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <div className="process-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              <div className="process-number">{step.number}</div>
              <div className="process-spacer"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section - Reviews from customers
function Testimonials() {
  const { t, language } = useLanguage();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', text: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = testimonialsService.subscribe((data) => {
      setTestimonials(data.filter(t => t.visible));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.text.trim()) {
      setError(language === 'en' ? 'Please fill in all fields' : 'يرجى ملء جميع الحقول');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const textAr = formData.text; // In production, you'd translate this
      await testimonialsService.add({
        name: formData.name,
        text: formData.text,
        textAr: textAr,
        rating: formData.rating,
        visible: true
      });
      setSubmitted(true);
      setFormData({ name: '', text: '', rating: 5 });
      setTimeout(() => {
        setSubmitted(false);
        setShowForm(false);
      }, 3000);
    } catch (err) {
      setError(language === 'en' ? 'Failed to submit. Try again.' : 'فشل في الإرسال. حاول مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section testimonials" id="testimonials">
      <div className="container">
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="section-label">{t('testimonials.label')}</span>
          <h2 className="section-title">{t('testimonials.title')}</h2>
        </motion.div>

        {/* Testimonials Display */}
        {!loading && testimonials.length > 0 && (
          <motion.div
            className="testimonials-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.slice(0, 6).map((item, index) => (
              <motion.div
                key={item.id || index}
                className="testimonial-card"
                variants={fadeInUp}
              >
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < item.rating ? 'star filled' : 'star'}>★</span>
                  ))}
                </div>
                <p className="testimonial-text">"{item.text}"</p>
                <p className="testimonial-name">- {item.name}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Add Testimonial Button */}
        <motion.div
          className="testimonial-cta"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm
              ? (language === 'en' ? 'Cancel' : 'إلغاء')
              : (language === 'en' ? 'Share Your Experience' : 'شارك تجربتك')}
          </button>
        </motion.div>

        {/* Testimonial Form */}
        {showForm && (
          <motion.div
            className="testimonial-form-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {submitted ? (
              <div className="testimonial-success">
                <span className="success-icon">✓</span>
                <p>{language === 'en' ? 'Thank you for your feedback!' : 'شكراً لملاحظاتك!'}</p>
              </div>
            ) : (
              <form className="testimonial-form" onSubmit={handleSubmit}>
                <h3>{language === 'en' ? 'Share Your Experience' : 'شارك تجربتك معنا'}</h3>

                <div className="form-group">
                  <label>{language === 'en' ? 'Your Name' : 'اسمك'}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={language === 'en' ? 'Enter your name' : 'أدخل اسمك'}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{language === 'en' ? 'Your Experience' : 'تجربتك'}</label>
                  <textarea
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    placeholder={language === 'en' ? 'Tell us about your experience...' : 'أخبرنا عن تجربتك...'}
                    rows="4"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{language === 'en' ? 'Rating' : 'التقييم'}</label>
                  <div className="rating-select">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${star <= formData.rating ? 'active' : ''}`}
                        onClick={() => setFormData({ ...formData, rating: star })}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {error && <p className="form-error">{error}</p>}

                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting
                    ? (language === 'en' ? 'Submitting...' : 'جاري الإرسال...')
                    : (language === 'en' ? 'Submit Review' : 'إرسال التقييم')}
                </button>
              </form>
            )}
          </motion.div>
        )}

        {/* Fallback stats if no testimonials */}
        {!loading && testimonials.length === 0 && (
          <div className="stats-fallback">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">500+</div>
                <div className="stat-label">{language === 'en' ? 'Events Completed' : 'فعالية منجزة'}</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">3</div>
                <div className="stat-label">{language === 'en' ? 'Years Experience' : 'سنة خبرة'}</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">1000+</div>
                <div className="stat-label">{language === 'en' ? 'Happy Clients' : 'عميل سعيد'}</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">98%</div>
                <div className="stat-label">{language === 'en' ? 'Client Satisfaction' : 'رضا العملاء'}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Before & After Section
function BeforeAfter() {
  const { t, language } = useLanguage();

  const transformations = [
    { before: '/picture/before 6.jpeg', after: '/picture/after 6.jpeg' },
    { before: '/picture/before 4.jpeg', after: '/picture/after 4.jpeg' },
    { before: '/picture/before 1.jpeg', after: '/picture/after 1.jpeg' },
    { before: '/picture/before 2.jpeg', after: '/picture/after 2.jpeg' },
    { before: '/picture/before 5.jpeg', after: '/picture/after 5.jpeg' },
    { before: '/picture/before 7.jpeg', after: '/picture/after 7.jpeg' },
  ];

  return (
    <section className="section before-after">
      <div className="container">
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="section-label">{language === 'en' ? 'Transformations' : 'تحويلات'}</span>
          <h2 className="section-title">{language === 'en' ? 'Before & After' : 'قبل و بعد'}</h2>
        </motion.div>

        <div className="before-after-grid">
          {transformations.map((item, index) => (
            <motion.div
              key={index}
              className="before-after-card"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="ba-images">
                <div className="ba-before">
                  <img src={item.before} alt="Before" />
                  <span className="ba-label">{language === 'en' ? 'Before' : 'قبل'}</span>
                </div>
                <div className="ba-after">
                  <img src={item.after} alt="After" />
                  <span className="ba-label">{language === 'en' ? 'After' : 'بعد'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Instagram Section
function Instagram() {
  const { t } = useLanguage();

  return (
    <section className="section instagram">
      <div className="container">
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="section-label">{t('instagram.label')}</span>
          <h2 className="section-title">{t('instagram.title')}</h2>
        </motion.div>

        <motion.div
          className="instagram-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {instagramImages.map((src, index) => (
            <motion.div
              key={index}
              className="instagram-item"
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
            >
              <img src={src} alt={`Instagram ${index + 1}`} loading="lazy" />
              <div className="instagram-overlay">
                <InstagramLogo weight="fill" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div style={{ textAlign: 'center' }}>
          <a href="https://www.instagram.com/alya_eventss?igsh=MTNrbG4yZGpqb2g4cg==" target="_blank" rel="noopener noreferrer" className="instagram-link">
            {t('instagram.followLink')}
          </a>
        </div>
      </div>
    </section>
  );
}

// Contact Section
function Contact() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="section-label">{t('contact.label')}</span>
          <h2 className="section-title">{t('contact.title')}</h2>
          <p className="section-subtitle">{t('contact.subtitle')}</p>
        </motion.div>

        <motion.div
          className="contact-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="contact-card" variants={fadeInUp}>
            <div className="contact-icon">
              <Phone weight="duotone" />
            </div>
            <h3>{t('contact.phone')}</h3>
            <p>
              <a href="tel:+100496079">+20 110 049 6079</a>
            </p>
          </motion.div>
          <motion.div className="contact-card" variants={fadeInUp}>
            <div className="contact-icon">
              <EnvelopeSimple weight="duotone" />
            </div>
            <h3>{t('contact.email')}</h3>
            <p>
              <a href="mailto:info@alyaaevents.com">info@alyaaevents.com</a>
            </p>
          </motion.div>
          <motion.div className="contact-card" variants={fadeInUp}>
            <div className="contact-icon">
              <MapPin weight="duotone" />
            </div>
            <h3>{t('contact.location')}</h3>
            <p>Cairo, Egypt</p>
          </motion.div>
        </motion.div>

        <div className="social-links">
          <a href="https://www.facebook.com/share/1LW38mxGpY/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
            <FacebookLogo weight="duotone" />
          </a>
          <a href="https://www.instagram.com/alya_eventss?igsh=MTNrbG4yZGpqb2g4cg==" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
            <InstagramLogo weight="duotone" />
          </a>
          <a href="https://wa.me/201100496079" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp">
            <WhatsappLogo weight="duotone" />
          </a>
          <a href="https://www.tiktok.com/@alya.events21?_r=1&_t=ZS-97GM4SM1ixl" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="TikTok">
            <span className="social-icon-tiktok">TikTok</span>
          </a>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <img src="/logo.jpg" alt="Alyaa Events Logo" className="footer-logo" />
            <p>{t('footer.about')}</p>
          </div>
          <div>
            <h5>{t('footer.quickLinks')}</h5>
            <ul className="footer-links">
              <li><a href="#home">{t('nav.home')}</a></li>
              <li><a href="#portfolio">{t('nav.portfolio')}</a></li>
              <li><a href="#about">{t('nav.about')}</a></li>
              <li><a href="#contact">{t('nav.contact')}</a></li>
            </ul>
          </div>
          <div>
            <h5>{t('footer.services')}</h5>
            <ul className="footer-links">
              <li><a href="#services">{language === 'en' ? 'Weddings' : 'ت weddings'}</a></li>
              <li><a href="#services">{language === 'en' ? 'Engagements' : 'خطوبات'}</a></li>
              <li><a href="#services">{language === 'en' ? 'Corporate Events' : 'احتفالات الشركات'}</a></li>
              <li><a href="#services">{language === 'en' ? 'Special Celebrations' : 'احتفالات خاصة'}</a></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h5>{t('footer.contact')}</h5>
            <p>Cairo, Egypt</p>
            <p>+20 110 049 6079</p>
            <p>info@alyaaevents.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">{t('footer.copyright')}</p>
          <div className="footer-social">
            <a href="https://www.facebook.com/share/1LW38mxGpY/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FacebookLogo weight="duotone" />
            </a>
            <a href="https://www.instagram.com/alya_eventss?igsh=MTNrbG4yZGpqb2g4cg==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramLogo weight="duotone" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main App Component
function App() {
  return (
    <LanguageProvider>
      <Navigation />
      <Hero />
      <EventPlanner />
      <Gallery />
      <About />
      <Services />
      <Pricing />
      <RentalPrices />
      <MirrorGallery />
      <RentalGallery />
      <Process />
      <Testimonials />
      <BeforeAfter />
      <Instagram />
      <Contact />
      <Footer />
    </LanguageProvider>
  );
}

export default App;