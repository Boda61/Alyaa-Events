import { useState, useEffect } from 'react';
import { settingsService, uploadImageNoDoc, clearAllAdminData } from '../../firebase/service';

const Settings = () => {
  const [settings, setSettings] = useState({
    name: 'Alyaa Events',
    tagLine: 'Luxury Wedding & Event Decorations',
    phone: '',
    email: '',
    address: '',
    facebook: '',
    instagram: '',
    twitter: '',
    heroTitleEn: '',
    heroTitleAr: '',
    heroSubtitleEn: '',
    heroSubtitleAr: '',
    aboutEn: '',
    aboutAr: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.get();
        if (data) {
          setSettings(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSaving(true);
      const imageUrl = await uploadImageNoDoc('settings', file, file.name);
      setSettings(prev => ({ ...prev, heroImage: imageUrl }));
    } catch (err) {
      setError('حدث خطأ في رفع الصورة');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await settingsService.update(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('حدث خطأ في حفظ الإعدادات');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1>الإعدادات</h1>
          <p>إعدادات الموقع</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        {error && <div className="error-message">{error}</div>}
        {saved && <div className="success-message">تم حفظ الإعدادات بنجاح</div>}

        {/* General Info */}
        <section className="settings-section">
          <h2>المعلومات العامة</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>اسم الشركة</label>
              <input
                type="text"
                name="name"
                value={settings.name || ''}
                onChange={handleChange}
                placeholder="Alyaa Events"
              />
            </div>
            <div className="form-group">
              <label>الوصف القصير</label>
              <input
                type="text"
                name="tagLine"
                value={settings.tagLine || ''}
                onChange={handleChange}
                placeholder="Luxury Wedding & Event Decorations"
              />
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="settings-section">
          <h2>معلومات الاتصال</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>الهاتف</label>
              <input
                type="tel"
                name="phone"
                value={settings.phone || ''}
                onChange={handleChange}
                placeholder="+20 100 000 0000"
              />
            </div>
            <div className="form-group">
              <label>البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                value={settings.email || ''}
                onChange={handleChange}
                placeholder="info@alyaaevents.com"
              />
            </div>
            <div className="form-group">
              <label>العنوان</label>
              <input
                type="text"
                name="address"
                value={settings.address || ''}
                onChange={handleChange}
                placeholder="Cairo, Egypt"
              />
            </div>
          </div>
        </section>

        {/* Social Media */}
        <section className="settings-section">
          <h2>روابط التواصل الاجتماعي</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Facebook</label>
              <input
                type="url"
                name="facebook"
                value={settings.facebook || ''}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div className="form-group">
              <label>Instagram</label>
              <input
                type="url"
                name="instagram"
                value={settings.instagram || ''}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div className="form-group">
              <label>Twitter</label>
              <input
                type="url"
                name="twitter"
                value={settings.twitter || ''}
                onChange={handleChange}
                placeholder="https://twitter.com/..."
              />
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="settings-section">
          <h2>النص في الصفحة الرئيسية</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>العنوان بالإنجليزية</label>
              <input
                type="text"
                name="heroTitleEn"
                value={settings.heroTitleEn || ''}
                onChange={handleChange}
                placeholder="Creating Unforgettable Moments"
              />
            </div>
            <div className="form-group">
              <label>العنوان بالعربية</label>
              <input
                type="text"
                name="heroTitleAr"
                value={settings.heroTitleAr || ''}
                onChange={handleChange}
                placeholder="لخلق لحظات لا تُنسى"
              />
            </div>
            <div className="form-group">
              <label>الوصف بالإنجليزية</label>
              <input
                type="text"
                name="heroSubtitleEn"
                value={settings.heroSubtitleEn || ''}
                onChange={handleChange}
                placeholder="Luxury wedding and event decoration services"
              />
            </div>
            <div className="form-group">
              <label>الوصف بالعربية</label>
              <input
                type="text"
                name="heroSubtitleAr"
                value={settings.heroSubtitleAr || ''}
                onChange={handleChange}
                placeholder="خدمات_decoration_الزفاف_والمناسبات"
              />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="settings-section">
          <h2>عن الشركة</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>النص بالإنجليزية</label>
              <textarea
                name="aboutEn"
                value={settings.aboutEn || ''}
                onChange={handleChange}
                placeholder="About company text..."
                rows={4}
              />
            </div>
            <div className="form-group">
              <label>النص بالعربية</label>
              <textarea
                name="aboutAr"
                value={settings.aboutAr || ''}
                onChange={handleChange}
                placeholder="نص_عن_الشركة..."
                rows={4}
              />
            </div>
          </div>
        </section>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </button>
        </div>

        <section className="settings-section danger-zone">
          <h2>مسح كل البيانات</h2>
          <p>احذر: هذا الإجراء سيقوم بمسح جميع البيانات من لوحه التحكم نهائياً</p>
          <button
            type="button"
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
            {deleting ? 'جاري المسح...' : 'مسح كل البيانات'}
          </button>
        </section>
      </form>

      <style>{`
        .settings-page {
          max-width: 900px;
        }

        .page-header {
          margin-bottom: 32px;
        }

        .page-header h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          color: #5B3E2B;
        }

        .page-header p {
          color: rgba(91, 62, 43, 0.7);
          font-size: 14px;
        }

        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .settings-section {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(93, 62, 43, 0.08);
        }

        .settings-section h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          color: #5B3E2B;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid #F4D9CC;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          margin-bottom: 0;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #5B3E2B;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #F4D9CC;
          border-radius: 10px;
          font-size: 15px;
          transition: all 0.3s ease;
          background: #FDF6EF;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #B7AE84;
          background: white;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }

        .error-message {
          background: #fee;
          color: #c00;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
        }

        .success-message {
          background: #e8f5e9;
          color: #4CAF50;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          background: #5B3E2B;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary:hover:not(:disabled) {
          background: #4a3224;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        .danger-zone {
          border: 2px solid #ffcdd2;
          background: #fff5f5;
        }

        .danger-zone h2 {
          color: #c62828;
          border-bottom-color: #ffcdd2;
        }

        .danger-zone p {
          color: #c62828;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .btn-danger {
          padding: 12px 24px;
          background: #c62828;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-danger:hover:not(:disabled) {
          background: #b71c1c;
        }

        .btn-danger:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Settings;