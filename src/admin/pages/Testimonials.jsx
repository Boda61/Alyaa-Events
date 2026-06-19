import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  PencilSimple,
  Trash,
  X,
  Eye,
  EyeSlash
} from 'phosphor-react';
import { testimonialsService } from '../../firebase/service';

const Testimonials = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(searchParams.get('action') === 'add');
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    text: '',
    textAr: '',
    rating: 5,
    visible: true,
    avatar: ''
  });

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await testimonialsService.getAll();
        setTestimonials(data);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const openAddModal = () => {
    setFormData({
      name: '',
      nameAr: '',
      text: '',
      textAr: '',
      rating: 5,
      visible: true,
      avatar: ''
    });
    setEditingId(null);
    setShowModal(true);
    setError('');
  };

  const openEditModal = (item) => {
    setFormData({
      name: item.name || '',
      nameAr: item.nameAr || '',
      text: item.text || '',
      textAr: item.textAr || '',
      rating: item.rating || 5,
      visible: item.visible !== false,
      avatar: item.avatar || ''
    });
    setEditingId(item.id);
    setShowModal(true);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const testimonialData = {
        name: formData.name,
        nameAr: formData.nameAr,
        text: formData.text,
        textAr: formData.textAr,
        rating: parseInt(formData.rating) || 5,
        visible: formData.visible
      };

      if (editingId) {
        await testimonialsService.update(editingId, testimonialData);
      } else {
        await testimonialsService.add(testimonialData);
      }

      const data = await testimonialsService.getAll();
      setTestimonials(data);
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
    if (!confirm('هل أنت متأكد من حذف هذا الرأي؟')) return;

    try {
      setLoading(true);
      await testimonialsService.delete(id);
      const data = await testimonialsService.getAll();
      setTestimonials(data);
    } catch (err) {
      console.error('Error deleting testimonial:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (id, currentVisible) => {
    try {
      await testimonialsService.toggleVisibility(id, !currentVisible);
      const data = await testimonialsService.getAll();
      setTestimonials(data);
    } catch (err) {
      console.error('Error toggling visibility:', err);
    }
  };

  if (loading && testimonials.length === 0) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="testimonials-page">
      <div className="page-header">
        <div>
          <h1>آراء العملاء</h1>
          <p>إدارة آراء العملاء</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          <Plus size={20} />
          إضافة رأي جديد
        </button>
      </div>

      {testimonials.length === 0 ? (
        <div className="empty-state">
          <p>لا توجد آراء حالياً</p>
          <button className="btn-primary" onClick={openAddModal}>
            <Plus size={20} />
            إضافة first opinion
          </button>
        </div>
      ) : (
        <div className="testimonials-list">
          {testimonials.map((item) => (
            <div key={item.id} className={`testimonial-card ${!item.visible ? 'hidden' : ''}`}>
              <div className="testimonial-header">
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {item.avatar ? (
                      <img src={item.avatar} alt={item.name} />
                    ) : (
                      <span>{item.name?.charAt(0) || '?'}</span>
                    )}
                  </div>
                  <div className="author-info">
                    <h3>{item.nameAr || item.name}</h3>
                    <div className="rating">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={i < item.rating ? 'star active' : 'star'}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="testimonial-actions">
                  <button
                    className={`btn-toggle ${item.visible ? 'visible' : ''}`}
                    onClick={() => handleToggleVisibility(item.id, item.visible)}
                    title={item.visible ? 'إخفاء' : 'إظهار'}
                  >
                    {item.visible ? <Eye size={18} /> : <EyeSlash size={18} />}
                  </button>
                  <button className="btn-edit" onClick={() => openEditModal(item)}>
                    <PencilSimple size={18} />
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                    <Trash size={18} />
                  </button>
                </div>
              </div>
              <div className="testimonial-text">
                <p>"{item.textAr || item.text}"</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'تعديل رأي' : 'إضافة رأي جديد'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {error && <div className="error-message">{error}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label>الاسم بالإنجليزية</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>الاسم بالعربية</label>
                  <input
                    type="text"
                    value={formData.nameAr}
                    onChange={e => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                    placeholder="جون دو"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>الرأي بالإنجليزية</label>
                  <textarea
                    value={formData.text}
                    onChange={e => setFormData(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Amazing service..."
                    rows={4}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>الرأي بالعربية</label>
                  <textarea
                    value={formData.textAr}
                    onChange={e => setFormData(prev => ({ ...prev, textAr: e.target.value }))}
                    placeholder="خدمة رائع..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>التقييم (1-5)</label>
                  <select
                    value={formData.rating}
                    onChange={e => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                  >
                    <option value="5">5 ★★★★★</option>
                    <option value="4">4 ★★★★</option>
                    <option value="3">3 ★★★</option>
                    <option value="2">2 ★★</option>
                    <option value="1">1 ★</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>إظهار في الموقع</label>
                  <div className="toggle-container">
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={formData.visible}
                        onChange={e => setFormData(prev => ({ ...prev, visible: e.target.checked }))}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="toggle-label">
                      {formData.visible ? 'مفعل' : 'معطل'}
                    </span>
                  </div>
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
        .testimonials-page {
          max-width: 900px;
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
          border-radius: 10px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background: #4a3224;
        }

        .empty-state {
          text-align: center;
          padding: 60px;
          background: white;
          border-radius: 16px;
        }

        .empty-state p {
          color: rgba(91, 62, 43, 0.6);
          margin-bottom: 20px;
        }

        .testimonials-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .testimonial-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(93, 62, 43, 0.08);
          transition: all 0.3s ease;
        }

        .testimonial-card.hidden {
          opacity: 0.5;
        }

        .testimonial-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .author-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #F4D9CC;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .author-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .author-avatar span {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          color: #5B3E2B;
        }

        .author-info h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          color: #5B3E2B;
          margin-bottom: 4px;
        }

        .rating .star {
          color: #ddd;
          font-size: 16px;
        }

        .rating .star.active {
          color: #B7AE84;
        }

        .testimonial-actions {
          display: flex;
          gap: 8px;
        }

        .btn-toggle, .btn-edit, .btn-delete {
          padding: 10px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-toggle {
          background: #f0f0f0;
          color: #666;
        }

        .btn-toggle.visible {
          background: #e8f5e9;
          color: #4CAF50;
        }

        .btn-toggle:hover {
          background: #e0e0e0;
        }

        .btn-edit {
          background: #FDF6EF;
          color: #5B3E2B;
        }

        .btn-edit:hover {
          background: #5B3E2B;
          color: white;
        }

        .btn-delete {
          background: #fee;
          color: #c00;
        }

        .btn-delete:hover {
          background: #c00;
          color: white;
        }

        .testimonial-text p {
          font-size: 15px;
          line-height: 1.8;
          color: rgba(91, 62, 43, 0.8);
          font-style: italic;
        }

        /* Modal */
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
          z-index: 2000;
          padding: 20px;
        }

        .modal {
          background: white;
          border-radius: 20px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid #F4D9CC;
        }

        .modal-header h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          color: #5B3E2B;
        }

        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(91, 62, 43, 0.6);
        }

        .modal-form {
          padding: 24px;
        }

        .error-message {
          background: #fee;
          color: #c00;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #5B3E2B;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 12px;
          border: 2px solid #F4D9CC;
          border-radius: 10px;
          font-size: 15px;
          transition: all 0.3s ease;
          background: #FDF6EF;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: #B7AE84;
          background: white;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }

        .toggle-container {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 8px;
        }

        .toggle {
          position: relative;
          width: 50px;
          height: 28px;
        }

        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #ccc;
          border-radius: 28px;
          transition: 0.3s;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 22px;
          width: 22px;
          left: 3px;
          bottom: 3px;
          background: white;
          border-radius: 50%;
          transition: 0.3s;
        }

        .toggle input:checked + .toggle-slider {
          background: #4CAF50;
        }

        .toggle input:checked + .toggle-slider:before {
          transform: translateX(22px);
        }

        .toggle-label {
          font-size: 14px;
          color: rgba(91, 62, 43, 0.7);
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
        }

        .btn-secondary {
          padding: 12px 24px;
          background: transparent;
          color: #5B3E2B;
          border: 2px solid #F4D9CC;
          border-radius: 10px;
          font-size: 14px;
          cursor: pointer;
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
          .form-row {
            grid-template-columns: 1fr;
          }

          .testimonial-header {
            flex-direction: column;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Testimonials;