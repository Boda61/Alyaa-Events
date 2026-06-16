import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { LanguageProvider, useLanguage } from './i18n';
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

// Gallery Images - From local picture folder
const galleryImages = [
  { id: 1, src: '/picture/design 1.jpeg', title: 'Royal Wedding', location: 'Grand Ballroom' },
  { id: 2, src: '/picture/design 2.jpeg', title: 'Garden Ceremony', location: 'Private Estate' },
  { id: 3, src: '/picture/design 3.jpeg', title: 'Beach Reception', location: 'Coastal Villa' },
  { id: 4, src: '/picture/design 4.jpeg', title: 'Engagement Party', location: 'Rooftop Garden' },
  { id: 5, src: '/picture/design 5.jpeg', title: 'Intimate Dinner', location: 'Private Residence' },
  { id: 6, src: '/picture/design 6.jpeg', title: 'Henna Night', location: 'Cultural Center' },
  { id: 7, src: '/picture/design 7.jpeg', title: 'Floral Decor', location: 'Ballroom' },
  { id: 8, src: '/picture/design 8.jpeg', title: 'Classic Elegance', location: 'Grand Hall' },
  { id: 9, src: '/picture/design 9.jpeg', title: 'Modern Setup', location: 'Garden' },
];

// Instagram Images - From local picture folder
const instagramImages = [
  '/picture/design 10.jpeg',
  '/picture/design 11.jpeg',
  '/picture/design 12.jpeg',
  '/picture/design 13.jpeg',
  '/picture/design 14.jpeg',
  '/picture/design 15.jpeg',
  '/picture/design 16.jpeg',
  '/picture/design 17.jpeg',
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
            <li><button className="btn btn-secondary nav-cta" onClick={() => scrollTo('planner')}>{t('nav.planEvent')}</button></li>
            <li>
              <button className="lang-toggle" onClick={toggleLanguage}>
                {language === 'en' ? 'عربي' : 'EN'}
              </button>
            </li>
          </ul>
          <button className="nav-toggle" onClick={() => setMenuOpen(true)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>×</button>
        <a href="#home" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('home'); setMenuOpen(false); }}>{t('nav.home')}</a>
        <a href="#portfolio" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('portfolio'); setMenuOpen(false); }}>{t('nav.portfolio')}</a>
        <a href="#about" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('about'); setMenuOpen(false); }}>{t('nav.about')}</a>
        <a href="#services" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('services'); setMenuOpen(false); }}>{t('nav.services')}</a>
        <a href="#contact" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('contact'); setMenuOpen(false); }}>{t('nav.contact')}</a>
        <button className="btn btn-primary" onClick={() => { scrollTo('planner'); setMenuOpen(false); }}>{t('nav.planEvent')}</button>
        <button className="lang-toggle-mobile" onClick={() => { toggleLanguage(); setMenuOpen(false); }}>
          {language === 'en' ? 'العربية' : 'English'}
        </button>
      </div>
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
      <div className="hero-fallback"></div>
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
      <div className="hero-scroll" onClick={() => scrollTo('portfolio')}>
        <span>{t('hero.scroll')}</span>
        <span>↓</span>
      </div>
    </section>
  );
}

// Gallery Section
function Gallery() {
  const { t } = useLanguage();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openLightbox = (image) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  };

  return (
    <section id="portfolio" className="section gallery">
      <div className="container">
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="section-label">{t('portfolio.label')}</span>
          <h2 className="section-title">{t('portfolio.title')}</h2>
          <p className="section-subtitle">{t('portfolio.subtitle')}</p>
        </motion.div>

        <motion.div
          className="gallery-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              className="gallery-item"
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              onClick={() => openLightbox(image)}
            >
              <img src={image.src} alt={image.title} loading="lazy" />
              <div className="gallery-overlay">
                <div className="gallery-info">
                  <h4>{image.title}</h4>
                  <p>{image.location}</p>
                </div>
                <div className="gallery-icon">
                  <MagnifyingGlass weight="bold" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
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
              <h3>{selectedImage.title}</h3>
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
                <div className="stat-number"><Counter end={12} /> {t('about.years')}</div>
                <div className="stat-label">{t('about.experience')}</div>
              </div>
              <div className="stat-item">
                <div className="stat-number"><Counter end={500} />+</div>
                <div className="stat-label">{t('about.events')}</div>
              </div>
              <div className="stat-item">
                <div className="stat-number"><Counter end={1000} />+</div>
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

  const servicesList = [
    { icon: '💒', title: language === 'en' ? 'Weddings' : 'الأفراح', description: language === 'en' ? 'Full-scale wedding decoration transforming your venue into a dream celebration.' : 'ديكور أفراح كامل يحول مكانك إلى حلم celebrations.' },
    { icon: '💍', title: language === 'en' ? 'Engagements' : 'الخطوبات', description: language === 'en' ? 'Elegant engagement ceremony setups with personalized themes and decorations.' : 'إعدادات خطوبة أنيقة مع موضوعات وديكورات مخصصة.' },
    { icon: '🏢', title: language === 'en' ? 'Corporate Events' : 'احتفالات الشركات', description: language === 'en' ? 'Professional event decorations for corporate gatherings and company celebrations.' : 'ديكورات احترافية للاجتماعات الشركات والاحتفالات.' },
    { icon: '🎉', title: language === 'en' ? 'Special Celebrations' : 'احتفالات خاصة', description: language === 'en' ? 'Birthdays, anniversaries, and custom celebrations with unique decorative themes.' : 'أعياد ميلاد، ذكرى سنوية، واحتفالات مخصصة بمواضيع فريدة.' },
  ];

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
          {servicesList.map((service, index) => (
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
              <h3>{service.title}</h3>
              <p>{service.description}</p>
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

  const designs = [
    { img: '/picture/design 1.jpeg', price: '35,000' },
    { img: '/picture/design 2.jpeg', price: '45,000' },
    { img: '/picture/design 3.jpeg', price: '55,000' },
    { img: '/picture/design 4.jpeg', price: '40,000' },
    { img: '/picture/design 5.jpeg', price: '50,000' },
    { img: '/picture/design 6.jpeg', price: '60,000' },
    { img: '/picture/design 7.jpeg', price: '42,000' },
    { img: '/picture/design 8.jpeg', price: '38,000' }
  ];

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
              whileHover={{ y: -8 }}
            >
              <div className="design-image">
                <img src={item.img} alt={`Design ${index + 1}`} />
              </div>
              <div className="design-info">
                <span className="design-price">
                  {language === 'en' ? `${item.price} EGP` : `${item.price} جنيه`}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Rental Prices Section
function RentalPrices() {
  const { language } = useLanguage();

  const mirrorsWithFlowers = [
    { name: language === 'en' ? 'Mirror with Gold Roses' : 'مراية ورود ذهب', price: '1,500' },
    { name: language === 'en' ? 'Mirror with White Roses' : 'مراية ورود بيض', price: '1,200' },
    { name: language === 'en' ? 'Mirror with Mix Roses' : 'مراية ورود ملونة', price: '1,800' },
    { name: language === 'en' ? 'Mirror with Red Roses' : 'مراية ورود حمرا', price: '1,600' }
  ];

  const mirrorsWithoutFlowers = [
    { name: language === 'en' ? 'Classic Mirror' : 'مراية كلاسيك', price: '800' },
    { name: language === 'en' ? 'Gold Frame Mirror' : 'مراية ذهب', price: '1,200' },
    { name: language === 'en' ? 'Crystal Mirror' : 'مراية كريستال', price: '1,500' },
    { name: language === 'en' ? 'Mirror with LED' : 'مراية ليد', price: '2,500' }
  ];

  const chairs = [
    { name: language === 'en' ? '50 - 100 chairs' : '٥٠ - ١٠٠ كرسي', price: '4,000' },
    { name: language === 'en' ? '100 - 200 chairs' : '١٠٠ - ٢٠٠ كرسي', price: '7,500' },
    { name: language === 'en' ? '200 - 300 chairs' : '٢٠٠ - ٣٠٠ كرسي', price: '11,000' },
    { name: language === 'en' ? '300 - 500 chairs' : '٣٠٠ - ٥٠٠ كرسي', price: '17,500' },
    { name: language === 'en' ? '500+ chairs' : '٥٠٠+ كرسي', price: '25,000' }
  ];

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
              {mirrorsWithFlowers.map((item, index) => (
                <div key={index} className="rental-item">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">
                    {language === 'en' ? `${item.price} EGP` : `${item.price} جنيه`}
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
            <h3>{language === 'en' ? 'Mirrors without Flowers' : 'مرايا بدون ورر'}</h3>
            <div className="rental-items">
              {mirrorsWithoutFlowers.map((item, index) => (
                <div key={index} className="rental-item">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">
                    {language === 'en' ? `${item.price} EGP` : `${item.price} جنيه`}
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
            <h3>{language === 'en' ? 'Chairs' : 'كراسي'}</h3>
            <div className="rental-items">
              {chairs.map((item, index) => (
                <div key={index} className="rental-item">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">
                    {language === 'en' ? `${item.price} EGP` : `${item.price} جنيه`}
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

// Event Planner Section
function EventPlanner() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    eventType: '',
    guestCount: '',
    style: '',
    colors: '',
    budget: '',
    notes: '',
    images: []
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 6));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    updateFormData('images', [...formData.images, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    updateFormData('images', newImages);
  };

  const getEventTypeName = (id) => eventTypesList.find(t => t.id === id)?.name || id;
  const getGuestCountName = (id) => guestCountsList.find(g => g.id === id)?.name || id;
  const getStyleName = (id) => decorationStylesList.find(s => s.id === id)?.name || id;
  const getColorName = (id) => colorPalettesList.find(c => c.id === id)?.name || id;
  const getBudgetName = (id) => budgetRangesList.find(b => b.id === id)?.name || id;

  const generateWhatsAppMessage = () => {
    const eventLabel = language === 'en' ? 'Event Type' : 'نوع الفعالية';
    const guestLabel = language === 'en' ? 'Guest Count' : 'عدد الضيوف';
    const styleLabel = language === 'en' ? 'Decoration Style' : 'أسلوب الديكور';
    const colorsLabel = language === 'en' ? 'Color Palette' : 'الوان الورد';
    const budgetLabel = language === 'en' ? 'Budget Range' : 'الميزانية';
    const notesLabel = language === 'en' ? 'Additional Notes' : 'ملاحظات إضافية';
    const imagesLabel = language === 'en' ? 'Attached Images' : 'الصور المرفقة';
    const noneText = language === 'en' ? 'None' : 'لا يوجد';

    const message = `*New Event Inquiry - Alyaa Events*\n\n` +
      `*${eventLabel}:* ${getEventTypeName(formData.eventType)}\n` +
      `*${guestLabel}:* ${getGuestCountName(formData.guestCount)}\n` +
      `*${styleLabel}:* ${getStyleName(formData.style)}\n` +
      `*${colorsLabel}:* ${getColorName(formData.colors)}\n` +
      `*${budgetLabel}:* ${getBudgetName(formData.budget)}\n\n` +
      `*${notesLabel}:*\n${formData.notes || noneText}\n\n` +
      (formData.images.length > 0 ? `*${imagesLabel}:* ${formData.images.length} file(s) - Will be sent via email` : '');

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/201100496079?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');

    // If there are images, also open email with attachments
    if (formData.images.length > 0) {
      const subject = encodeURIComponent('New Event Inquiry with Attachments - Alyaa Events');
      const body = encodeURIComponent(message);
      setTimeout(() => {
        window.location.href = `mailto:info@alyaaevents.com?subject=${subject}&body=${body}`;
      }, 1000);
    }
  };

  const canProceed = () => {
    switch(step) {
      case 1: return formData.eventType;
      case 2: return true; // guestCount is optional
      case 3: return formData.style;
      case 4: return formData.colors;
      case 5: return formData.budget;
      default: return true;
    }
  };

  const { t, language } = useLanguage();

  const eventTypesList = [
    { id: 'wedding', name: language === 'en' ? 'Wedding' : 'فرح', description: language === 'en' ? 'Full day celebration' : 'احتفال اليوم الكامل' },
    { id: 'engagement', name: language === 'en' ? 'Engagement' : 'خطوبة', description: language === 'en' ? 'Ring exchange ceremony' : 'مراسم تبادل الخواتم' },
    { id: 'henna', name: language === 'en' ? 'Henna Night' : 'ليلة الحنة', description: language === 'en' ? 'Traditional celebration' : 'احتفال تقليدي' },
    { id: 'corporate', name: language === 'en' ? 'Corporate' : 'شركة', description: language === 'en' ? 'Business event' : 'حدث تجاري' },
    { id: 'birthday', name: language === 'en' ? 'Birthday' : 'عيد ميلاد', description: language === 'en' ? 'Anniversary celebration' : 'احتفال الذكرى' },
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

  const decorationStylesList = [
    { id: 'classic', name: language === 'en' ? 'Classic Elegant' : 'كلاسيكي أنيق', description: language === 'en' ? 'Timeless sophistication' : 'أناقة خالدة' },
    { id: 'modern', name: language === 'en' ? 'Modern Minimalist' : 'حديث بسيط', description: language === 'en' ? 'Clean & contemporary' : 'نظيف وعصري' },
    { id: 'bohemian', name: language === 'en' ? 'Bohemian' : '.bohemian', description: language === 'en' ? 'Free-spirited & natural' : 'حر وطبيعي' },
    { id: 'glamour', name: language === 'en' ? 'Glamour' : 'فاخر', description: language === 'en' ? 'Luxurious & opulent' : 'فاخر وراقٍ' },
    { id: 'rustic', name: language === 'en' ? 'Rustic Chic' : 'ريفي أنيق', description: language === 'en' ? 'Warm & inviting' : 'دافئ ومرحّب' },
    { id: 'floral', name: language === 'en' ? 'Floral Paradise' : 'جنة الأزهار', description: language === 'en' ? 'Flower-focused design' : 'تصميم مركز على الزهور' },
  ];

  const colorPalettesList = [
    { id: 'blush', name: language === 'en' ? 'Blush Roses' : 'ورود بلاش', colors: ['#FFB6C1', '#FFC0CB', '#DB7093'] },
    { id: 'peach', name: language === 'en' ? 'Peach & Coral' : 'خوخى ومرجاني', colors: ['#FFDAB9', '#FF7F50', '#FA8072'] },
    { id: 'red', name: language === 'en' ? 'Red Roses' : 'ورود حمراء', colors: ['#DC143C', '#B22222', '#8B0000'] },
    { id: 'white', name: language === 'en' ? 'White & Ivory' : 'أبيض وعاجي', colors: ['#FFFAFA', '#F5F5F5', '#FAF0E6'] },
    { id: 'pastel', name: language === 'en' ? 'Pastel Dreams' : 'أحلام باستيل', colors: ['#FFB7C5', '#E6E6FA', '#F0FFF0'] },
    { id: 'burgundy', name: language === 'en' ? 'Wine & Gold' : 'تين وزهبي', colors: ['#722F37', '#FFD700', '#B8860B'] },
  ];

  const budgetRangesList = [
    { id: '50k', name: '50,000 - 100,000 EGP', range: language === 'en' ? 'Budget-friendly' : 'اقتصادي' },
    { id: '150k', name: '100,000 - 150,000 EGP', range: language === 'en' ? 'Mid-range' : 'متوسط' },
    { id: '250k', name: '150,000 - 250,000 EGP', range: language === 'en' ? 'Premium' : 'متميز' },
    { id: '500k', name: '250,000 - 500,000 EGP', range: language === 'en' ? 'Luxury' : 'فاخر' },
    { id: 'custom', name: '500,000+ EGP', range: language === 'en' ? 'Ultra-luxury' : 'فاخر جداً' },
  ];

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
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div key={s} className={`progress-step ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}>
                <div className="progress-number">{step > s ? '✓' : s}</div>
                <span className="progress-label">
                  {s === 1 ? (language === 'en' ? 'Type' : 'النوع') : s === 2 ? (language === 'en' ? 'Guests' : 'الضيوف') : s === 3 ? (language === 'en' ? 'Style' : 'الأسلوب') : s === 4 ? (language === 'en' ? 'Colors' : 'الألوان') : s === 5 ? (language === 'en' ? 'Budget' : 'الميزانية') : (language === 'en' ? 'Details' : 'التفاصيل')}
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
                <h3 className="step-title">{t('form.style')}</h3>
                <p className="step-subtitle">{t('form.styleSub')}</p>
                <div className="option-grid">
                  {decorationStylesList.map((style) => (
                    <div
                      key={style.id}
                      className={`option-card ${formData.style === style.id ? 'selected' : ''}`}
                      onClick={() => updateFormData('style', style.id)}
                    >
                      <h4>{style.name}</h4>
                      <p>{style.description}</p>
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
                <h3 className="step-title">{t('form.colors')}</h3>
                <p className="step-subtitle">{t('form.colorsSub')}</p>
                <div className="option-grid">
                  {colorPalettesList.map((palette) => (
                    <div
                      key={palette.id}
                      className={`option-card ${formData.colors === palette.id ? 'selected' : ''}`}
                      onClick={() => updateFormData('colors', palette.id)}
                    >
                      <h4>{palette.name}</h4>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '8px' }}>
                        {palette.colors.map((color, i) => (
                          <span key={i} style={{ width: '20px', height: '20px', borderRadius: '50%', background: color, display: 'inline-block' }}></span>
                        ))}
                      </div>
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
                <h3 className="step-title">{t('form.budget')}</h3>
                <p className="step-subtitle">{t('form.budgetSub')}</p>
                <div className="option-grid">
                  {budgetRangesList.map((budget) => (
                    <div
                      key={budget.id}
                      className={`option-card ${formData.budget === budget.id ? 'selected' : ''}`}
                      onClick={() => updateFormData('budget', budget.id)}
                    >
                      <h4>{budget.name}</h4>
                      <p>{budget.range}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div
                key="step6"
                className="planner-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="step-title">{t('form.details')}</h3>
                <p className="step-subtitle">{t('form.detailsSub')}</p>

                <div className="form-group">
                  <label className="form-label">{t('form.notes')}</label>
                  <textarea
                    className="form-textarea"
                    placeholder={t('form.notesPlaceholder')}
                    value={formData.notes}
                    onChange={(e) => updateFormData('notes', e.target.value)}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('form.images')}</label>
                  <label className="file-upload">
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
                    <div className="file-upload-icon">📁</div>
                    <p>{t('form.imagesUpload')}</p>
                  </label>
                  {formData.images.length > 0 && (
                    <div className="file-preview">
                      {formData.images.map((img, index) => (
                        <div key={index} className="file-preview-item">
                          <img src={img.preview} alt={`Upload ${index + 1}`} />
                          <button className="file-preview-remove" onClick={() => removeImage(index)}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
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
            {step < 6 ? (
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

// Testimonials Section - Stats Version
function Testimonials() {
  const { t, language } = useLanguage();

  const statsList = [
    { number: 500, suffix: '+', label: language === 'en' ? 'Events Completed' : 'فعالية منجزة', sub: language === 'en' ? 'Weddings & Celebrations' : 'أفراح واحتفالات' },
    { number: 12, suffix: '', label: language === 'en' ? 'Years Experience' : 'سنة خبرة', sub: language === 'en' ? 'In Event Industry' : 'في صناعة الفعاليات' },
    { number: 1000, suffix: '+', label: language === 'en' ? 'Happy Clients' : 'عميل سعيد', sub: language === 'en' ? 'Satisfied Customers' : 'عملاء راضون' },
    { number: 98, suffix: '%', label: language === 'en' ? 'Client Satisfaction' : 'رضا العملاء', sub: language === 'en' ? 'Average Rating' : 'متوسط التقييم' },
  ];

  return (
    <section className="section testimonials">
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

        <motion.div
          className="stats-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {statsList.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              variants={fadeInUp}
            >
              <div className="stat-number">
                <Counter end={stat.number} />{stat.suffix}
              </div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-sub">{stat.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Before & After Section
function BeforeAfter() {
  const { t, language } = useLanguage();

  const transformations = [
    { before: '/beforeafter/before1.jpg', after: '/beforeafter/after1.jpg' },
    { before: '/beforeafter/before2.jpg', after: '/beforeafter/after2.jpg' },
    { before: '/beforeafter/before3.jpg', after: '/beforeafter/after3.jpg' },
    { before: '/beforeafter/before4.jpg', after: '/beforeafter/after4.jpg' },
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
          <a href="https://instagram.com/alyaaevents" target="_blank" rel="noopener noreferrer" className="instagram-link">
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
              <a href="tel:+201100496079">+20 110 049 6079</a>
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
      <Gallery />
      <About />
      <Services />
      <Pricing />
      <RentalPrices />
      <EventPlanner />
      <Process />
      <BeforeAfter />
      <Instagram />
      <Contact />
      <Footer />
    </LanguageProvider>
  );
}

export default App;