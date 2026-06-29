import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  PencilSimple,
  Trash,
  X,
  Upload,
  Image
} from 'phosphor-react';
import { portfolioService, uploadToCloudinary } from '../../firebase/service';

const Portfolio = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(searchParams.get('action') === 'add');
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImages, setUploadingImages] = useState({ uploading: false });

  const [formData, setFormData] = useState({
    titleAr: '',
    titleEn: '',
    imageUrl: '',
    publicId: '',
    order: 0
  });

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await portfolioService.getAll();
        setPortfolio(data);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const openAddModal = () => {
    setFormData({
      titleAr: '',
      titleEn: '',
      imageUrl: '',
      publicId: '',
      order: portfolio.length
    });
    setEditingId(null);
    setShowModal(true);
    setError('');
    setUploadingImages({ uploading: false });
  };

  const openEditModal = (item) => {
    setFormData({
      titleAr: item.titleAr || '',
      titleEn: item.titleEn || '',
      imageUrl: item.imageUrl || '',
      publicId: item.publicId || '',
      order: item.order || 0
    });
    setEditingId(item.id);
    setShowModal(true);
    setError('');
    setUploadingImages({ uploading: false });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('يرجى اختيار صورة صحيحة (JPEG, PNG, WebP, GIF)');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('حجم الصورة يجب أن يكون أقل من 10 ميجابايت');
      return;
    }

    try {
      setUploadingImages({ uploading: true });
      const result = await uploadToCloudinary(file, 'portfolio');
      setFormData(prev => ({ ...prev, imageUrl: result.imageUrl, publicId: result.publicId }));
    } catch (err) {
      setError('حدث خطأ في رفع الصورة');
      console.error(err);
    } finally {
      setUploadingImages({ uploading: false });
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: '', publicId: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.imageUrl) {
      setError('يرجى رفع صورة');
      return;
    }

    setSaving(true);
    try {
      const itemData = {
        titleAr: formData.titleAr,
        titleEn: formData.titleEn,
        imageUrl: formData.imageUrl,
        publicId: formData.publicId,
        order: parseInt(formData.order) || 0
      };

      if (editingId) {
        await portfolioService.update(editingId, itemData);
      } else {
        await portfolioService.add(itemData);
      }

      const data = await portfolioService.getAll();
      setPortfolio(data);
      setShowModal(false);
      setSearchParams({});
    } catch (err) {
      setError('حدث خطأ في حفظ البيانات');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا العمل؟')) return;

    try {
      setLoading(true);
      await portfolioService.delete(id);
      const data = await portfolioService.getAll();
      setPortfolio(data);
    } catch (err) {
      console.error('Error deleting:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && portfolio.length === 0) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="portfolio-page">
      <div className="page-header">
        <div>
          <h1>أعمالنا</h1>
          <p>إدارة معرض الأعمال</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          <Plus size={20} />
          إضافة عمل جديد
        </button>
      </div>

      {portfolio.length === 0 ? (
        <div className="empty-state">
          <p>لا توجد أعمال حالياً</p>
          <button className="btn-primary" onClick={openAddModal}>
            <Plus size={20} />
            إضافة أول عمل
          </button>
        </div>
      ) : (
        <div className="portfolio-grid">
          {portfolio.map((item) => (
            <div key={item.id} className="portfolio-card">
              <div className="portfolio-images">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.titleEn} loading="lazy" />
                ) : (
                  <div className="no-image">
                    <Image size={32} />
                  </div>
                )}
              </div>
              <div className="portfolio-info">
                <h3>{item.titleAr || item.titleEn}</h3>
              </div>
              <div className="portfolio-actions">
                <button className="btn-edit" onClick={() => openEditModal(item)}>
                  <PencilSimple size={18} />
                </button>
                <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                  <Trash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'تعديل عمل' : 'إضافة عمل جديد'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {error && <div className="error-message">{error}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label>العنوان بالعربية</label>
                  <input
                    type="text"
                    value={formData.titleAr}
                    onChange={e => setFormData(prev => ({ ...prev, titleAr: e.target.value }))}
                    placeholder="زفاف فاخر"
                  />
                </div>
                <div className="form-group">
                  <label>العنوان بالإنجليزية</label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={e => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                    placeholder="Luxury Wedding"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>الترتيب</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={e => setFormData(prev => ({ ...prev, order: e.target.value }))}
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label>الصورة</label>
                <div className="image-upload-area">
                  {formData.imageUrl ? (
                    <div className="image-preview">
                      <img src={formData.imageUrl} alt="Preview" />
                      <button type="button" className="remove-image" onClick={removeImage}>
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="upload-label">
                      <Upload size={32} />
                      <span>اختر صورة</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        hidden
                      />
                    </label>
                  )}
                  {uploadingImages.uploading && (
                    <div className="image-preview loading-placeholder">
                      <div className="loading-spinner-small"></div>
                      <span>جاري الرفع...</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={saving}
                >
                  {saving ? 'جاري الحفظ...' : 'حفظ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .portfolio-page {
          max-width: 1200px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
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

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #5B3E2B;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }

        .btn-primary:hover {
          background: #4A3225;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          padding: 12px 24px;
          background: #f5f5f5;
          color: #333;
          border: 1px solid #ddd;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-secondary:hover {
          background: #eee;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: #fafafa;
          border-radius: 12px;
        }

        .empty-state p {
          color: rgba(91, 62, 43, 0.7);
          margin-bottom: 20px;
        }

        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .portfolio-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .portfolio-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        }

        .portfolio-images {
          aspect-ratio: 4/3;
          background: #f5f5f5;
          overflow: hidden;
        }

        .portfolio-images img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ccc;
        }

        .portfolio-info {
          padding: 16px;
        }

        .portfolio-info h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          color: #5B3E2B;
          margin: 0;
        }

        .portfolio-actions {
          display: flex;
          gap: 8px;
          padding: 0 16px 16px;
        }

        .portfolio-actions button {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .btn-edit {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .btn-edit:hover {
          background: #c8e6c9;
        }

        .btn-delete {
          background: #ffebee;
          color: #c62828;
        }

        .btn-delete:hover {
          background: #ffcdd2;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 450px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #eee;
        }

        .modal-header h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          color: #5B3E2B;
          margin: 0;
        }

        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #999;
          padding: 4px;
        }

        .modal-close:hover {
          color: #333;
        }

        .modal-form {
          padding: 24px;
        }

        .error-message {
          background: #ffebee;
          color: #c62828;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
          font-size: 14px;
        }

        .form-group input {
          width: 100%;
          padding: 10px 12px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #5B3E2B;
        }

        .image-upload-area {
          border: 2px dashed #ddd;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          min-height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-preview {
          position: relative;
          width: 100%;
          max-width: 200px;
          margin: 0 auto;
        }

        .image-preview img {
          width: 100%;
          border-radius: 8px;
        }

        .remove-image {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 24px;
          height: 24px;
          background: #c62828;
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .upload-label {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #999;
        }

        .upload-label span {
          font-size: 14px;
        }

        .loading-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #5B3E2B;
        }

        .loading-spinner-small {
          width: 24px;
          height: 24px;
          border: 3px solid #eee;
          border-top-color: #5B3E2B;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }

        .admin-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #eee;
          border-top-color: #5B3E2B;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;