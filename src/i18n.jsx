import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      portfolio: 'Portfolio',
      about: 'About',
      services: 'Services',
      contact: 'Contact',
      planEvent: 'Plan Event',
    },
    // Hero
    hero: {
      label: 'Luxury Wedding & Event Decorations',
      title: 'Crafting Unforgettable Moments',
      description: 'Transform your special occasion into an extraordinary celebration with our premium decoration services.',
      viewPortfolio: 'View Portfolio',
      planYourEvent: 'Plan Your Event',
      scroll: 'Scroll',
    },
    // Portfolio
    portfolio: {
      label: 'Our Portfolio',
      title: 'Featured Projects',
      subtitle: 'Explore our collection of stunning wedding and event decorations',
    },
    // About
    about: {
      label: 'About Us',
      title: 'The Art of Elegant Celebrations',
      text: 'Founded in 2023, Alyaa Events has been transforming ordinary venues into extraordinary celebrations. Our passion for perfection and eye for detail have made us one of the most sought-after wedding and event decoration companies in the region.',
      years: 'years',
      events: 'Events',
      clients: 'Clients',
      experience: 'Experience',
    },
    // Timeline
    timeline: [
      { year: '2023', text: 'Founded with a vision for luxury events' },
      { year: '2024', text: 'Expanded to full-service decoration' },
      { year: '2025', text: 'International recognition' },
      { year: '2026', text: '500+ weddings completed' },
    ],
    // Services
    services: {
      label: 'Our Services',
      title: 'What We Offer',
      subtitle: 'Comprehensive decoration services for every type of celebration',
    },
    // Event Planner
    planner: {
      label: 'Plan Your Event',
      title: 'Interactive Event Planner',
      subtitle: 'Tell us about your vision and we\'ll help make it reality',
    },
    // Process
    process: {
      label: 'Our Process',
      title: 'How We Work',
      subtitle: 'A seamless journey from concept to celebration',
    },
    // Testimonials
    testimonials: {
      label: 'Testimonials',
      title: 'What Our Clients Say',
    },
    // Instagram
    instagram: {
      label: 'Follow Us',
      title: '@AlyaaEvents',
      followLink: 'Follow us on Instagram →',
    },
    // Contact
    contact: {
      label: 'Contact Us',
      title: 'Let\'s Create Magic Together',
      subtitle: 'Ready to transform your event? Get in touch with us today.',
      phone: 'Phone',
      email: 'Email',
      location: 'Location',
    },
    // Footer
    footer: {
      about: 'Since 2023, we have been dedicated to creating unforgettable moments and transforming ordinary venues into extraordinary celebrations.',
      quickLinks: 'Quick Links',
      services: 'Services',
      contact: 'Contact',
      copyright: '© 2024 Alyaa Events. All rights reserved.',
    },
    // Form Steps
    form: {
      eventType: 'What type of event?',
      eventTypeSub: 'Select your event type',
      guestCount: 'How many guests?',
      guestCountSub: 'Optional - helps us prepare chairs',
      style: 'Decoration Style',
      styleSub: 'Choose your preferred style',
      colors: 'Flower Colors',
      colorsSub: 'Choose your preferred rose colors',
      budget: 'Budget (EGP)',
      budgetSub: 'Select your budget in Egyptian pounds',
      details: 'Additional Details',
      detailsSub: 'Tell us more about your vision',
      notes: 'Additional Notes',
      notesPlaceholder: 'Describe your vision, specific requests, or any details you\'d like to share...',
      images: 'Equipment & Reference Photos',
      imagesUpload: 'Click to upload photos of machines/equipment you want us to use',
      continue: 'Continue →',
      back: '← Back',
      submit: 'Send via WhatsApp 📱',
    },
  },
  ar: {
    // Navigation
    nav: {
      home: 'الرئيسية',
      portfolio: 'أعمالنا',
      about: 'من نحن',
      services: 'الخدمات',
      contact: 'تواصل معنا',
      planEvent: 'تخطيط فعالية',
    },
    // Hero
    hero: {
      label: 'ديكورات الأفراح والمناسبات الفاخرة',
      title: 'نصنع لحظات لا تُنسى',
      description: 'حوّل مناسبتك الخاصة إلى احتفال استثنائي مع خدمات الديكور المميزة لدينا.',
      viewPortfolio: 'شاهد أعمالنا',
      planYourEvent: 'خطط لفعاليتك',
      scroll: 'مرر',
    },
    // Portfolio
    portfolio: {
      label: 'أعمالنا',
      title: 'المشاريع المميزة',
      subtitle: 'استكشف مجموعتنا المذهلة من ديكورات الأفراح والمناسبات',
    },
    // About
    about: {
      label: 'من نحن',
      title: 'فن الاحتفالات الراقية',
      text: 'تأسست شركة أليس إيفنتس في عام 2023، وتحوّل الأماكن العادية إلى احتفالات استثنائية. شغفنا بالكمال واهتمامنا بالتفاصيل جعلنا من أكثر شركات ديكور الأفراح والمناسبات طلباً في المنطقة.',
      years: 'سنوات',
      events: 'فعالية',
      clients: 'عميل',
      experience: 'خبرة',
    },
    // Timeline
    timeline: [
      { year: '2023', text: 'تأسيسنا برؤية للمناسبات الفاخرة' },
      { year: '2024', text: 'التوسع لخدمات الديكور الكاملة' },
      { year: '2025', text: 'الاعتراف الدولي' },
      { year: '2026', text: 'أكثر من 500 فرح مكتمل' },
    ],
    // Services
    services: {
      label: 'خدماتنا',
      title: 'ما نقدمه',
      subtitle: 'خدمات ديكور شاملة لكل نوع من الاحتفالات',
    },
    // Event Planner
    planner: {
      label: 'تخطيط فعاليتك',
      title: 'مخطط الاحتفال التفاعلي',
      subtitle: 'أخبرنا عن رؤيتك وسنساعدك على تحقيقها',
    },
    // Process
    process: {
      label: 'عملية العمل',
      title: 'كيف نعمل',
      subtitle: 'رحلة سلسة من المفهوم إلى الاحتفال',
    },
    // Testimonials
    testimonials: {
      label: 'آراء العملاء',
      title: 'ماذا يقول عملاؤنا',
    },
    // Instagram
    instagram: {
      label: 'تابعنا',
      title: '@AlyaaEvents',
      followLink: 'تابعنا على إنستغرام ←',
    },
    // Contact
    contact: {
      label: 'تواصل معنا',
      title: 'لنتعاون لصنع السحر',
      subtitle: 'جاهز لتحويل فعاليتك؟ تواصل معنا اليوم.',
      phone: 'الهاتف',
      email: 'البريد الإلكتروني',
      location: 'الموقع',
    },
    // Footer
    footer: {
      about: 'منذ عام 2023،نحن نختص بصنع اللحظات لا تُنسى وتحويل الاماكن العادية لاحتفالات استثنائية.',
      quickLinks: 'روابط سريعة',
      services: 'الخدمات',
      contact: 'تواصل معنا',
      copyright: '© 2026 Alyaa Events. جميع الحقوق محفوظة.',
    },
    // Form Steps
    form: {
      eventType: 'ما نوع الفعالية؟',
      eventTypeSub: 'اختر نوع الفعالية',
      guestCount: 'كم عدد الضيوف؟',
      guestCountSub: 'اختياري - لمساعدتنا في تجهيز الكراسي',
      style: 'أسلوب الديكور',
      styleSub: 'اختر الأسلوب المفضل',
      colors: 'ألوان الورد',
      colorsSub: 'اختر ألوان الورد المفضلة',
      budget: 'الميزانية',
      budgetSub: 'اختر ميزانيتك بالجنيه المصري',
      details: 'تفاصيل إضافية',
      detailsSub: 'أخبرنا المزيد عن رؤيتك',
      notes: 'ملاحظات إضافية',
      notesPlaceholder: 'صف رؤيتك، طلباتك المحددة، أو أي تفاصيل تريد مشاركتها...',
      images: 'صوره المكان الي هيتم علينا تجهيز الديكور فيه',
      imagesUpload: 'انقر لتحميل صور الأجهزة والمعدات التي تريد استخدامها',
      continue: 'التالي ←',
      back: '→ السابق',
      submit: 'إرسال عبر واتساب 📱',
      stepLabels: {
        type: 'النوع',
        guests: 'الضيوف',
        style: 'الأسلوب',
        colors: 'الألوان',
        budget: 'الميزانية',
        details: 'التفاصيل',
      },
    },

    // Services cards / planner lists
    lists: {
      services: {
        weddings: {
          title: 'الأفراح',
          description: 'ديكور أفراح كامل يحوّل مكانك إلى حلم متكامل.',
        },
        engagements: {
          title: 'الخطوبات',
          description: 'تصميم خطوبة راقٍ بموضوعات وديكورات مخصصة.',
        },
        corporate: {
          title: 'احتفالات الشركات',
          description: 'ديكورات احترافية للاجتماعات والاحتفالات المؤسسية.',
        },
        celebrations: {
          title: 'احتفالات خاصة',
          description: 'أعياد ميلاد وذكرى سنوية واحتفالات مخصصة بطابع فريد.',
        },
      },

      plannerEventTypes: {
        wedding: { name: 'فرح', description: 'احتفال اليوم الكامل' },
        engagement: { name: 'خطوبة', description: 'مراسم تبادل الخواتم' },
        henna: { name: 'قرايه فاتحه', description: 'احتفال تقليدي' },
        corporate: { name: 'شركة', description: 'حدث تجاري' },
        birthday: { name: 'كتب كتاب', description: 'احتفال الذكرى' },
        other: { name: 'أخرى', description: 'حدث مخصص' },
      },

      guestCounts: {
        50: 'حتى 50 ضيف',
        100: '50-100 ضيف',
        200: '100-200 ضيف',
        300: '200-300 ضيف',
        500: '300+ ضيف',
      },

      decorationStyles: {
        classic: { name: 'كلاسيكي أنيق', description: 'أناقة خالدة' },
        modern: { name: 'حديث بسيط', description: 'نظيف وعصري' },
        bohemian: { name: 'بوهيماين', description: 'حر وطبيعي' },
        glamour: { name: 'فاخر', description: 'فاخر وراقٍ' },
        rustic: { name: 'ريفي أنيق', description: 'دافئ ومرحّب' },
        floral: { name: 'جنة الأزهار', description: 'تصميم مركز على الزهور' },
      },

      budgets: {
        '5k': 'اقتصادي',
        '15k': 'متوسط',
        '25k': 'متميز',
        '50k': 'فاخر',
        custom: 'فاخر جداً',
      },
    },

    processSteps: [
      { number: '01', title: 'استشارة', description: 'نلتقي لفهم رؤيتك وتفضيلاتك وميزانيتك للحدث المثالي.' },
      { number: '02', title: 'التصميم', description: 'يضع فريقنا نماذج تفصيلية ومفاهيم تصميمية مناسبة تماماً لاحتياجاتك.' },
      { number: '03', title: 'العرض', description: 'نقدّم لك عرضاً شاملاً يشمل التسعير والجدول الزمني للموافقة.' },
      { number: '04', title: 'التنفيذ', description: 'ينفّذ فريقنا المحترف كل التفاصيل بدقة واهتمام.' },
      { number: '05', title: 'الاحتفال', description: 'استمتع بحدثك المثالي بينما نتكفل بكل عناصر الديكور.' },
    ],


  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('alyaa-language');
    if (saved) {
      setLanguage(saved);
      setIsRTL(saved === 'ar');
    }

    // Keep the html direction in sync with the selected language
    const initial = saved || 'en';
    document.documentElement.lang = initial;
    document.documentElement.dir = initial === 'ar' ? 'rtl' : 'ltr';
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);


  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    setIsRTL(newLang === 'ar');
    localStorage.setItem('alyaa-language', newLang);

    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };


  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }

    // If the key exists (including arrays/objects/false/0), return it.
    if (value !== undefined) return value;
    if (value === null) return null;
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}