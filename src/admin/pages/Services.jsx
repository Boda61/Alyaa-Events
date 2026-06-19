import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  PencilSimple,
  Trash,
  X,
  ArrowRight,
  Upload,
  Image
} from 'phosphor-react';
import { servicesService } from '../../firebase/service';
import { uploadImage } from '../../firebase/service';

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(searchParams.get('action') === 'add');
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nameEn: '',
    nameAr: '',
    descriptionEn: '',
    descriptionAr: '',
    price: '',
    image: '',
    order: 0,
    icon: 'flower'
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await servicesService.getAll();
        setServices(data);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const openAddModal = () => {
    setFormData({
      nameEn: '',
      nameAr: '',
      descriptionEn: '',
      descriptionAr: '',
      price: '',
      image: '',
      order: services.length,
      icon: 'flower'
    });
    setEditingId(null);
    setShowModal(true);
    setError('');
  };

  const openEditModal = (service) => {
    setFormData({
      nameEn: service.nameEn || '',
      nameAr: service.nameAr || '',
      descriptionEn: service.descriptionEn || '',
      descriptionAr: service.descriptionAr || '',
      price: service.price || '',
      image: service.image || '',
      order: service.order || 0,
      icon: service.icon || 'flower'
    });
    setEditingId(service.id);
    setShowModal(true);
    setError('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSaving(true);
      const imageUrl = await uploadImageNoDoc('services', file, file.name);
      setFormData(prev => ({ ...prev, image: imageUrl }));
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
      const serviceData = {
        nameEn: formData.nameEn,
        nameAr: formData.nameAr,
        descriptionEn: formData.descriptionEn,
        descriptionAr: formData.descriptionAr,
        price: formData.price,
        image: formData.image,
        order: parseInt(formData.order) || 0,
        icon: formData.icon
      };

      if (editingId) {
        await servicesService.update(editingId, serviceData);
      } else {
        await servicesService.add(serviceData);
      }

      // Refresh list
      const data = await servicesService.getAll();
      setServices(data);
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
    if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;

    try {
      setLoading(true);
      await servicesService.delete(id);
      const data = await servicesService.getAll();
      setServices(data);
    } catch (err) {
      console.error('Error deleting service:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && services.length === 0) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="services-page">
      <div className="page-header">
        <div>
          <h1>الخدمات</h1>
          <p>إدارة الخدمات</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          <Plus size={20} />
          إضافة خدمة
        </button>
      </div>

      {services.length === 0 ? (
        <div className="empty-state">
          <p>لا توجد خدمات حالياً</p>
          <button className="btn-primary" onClick={openAddModal}>
            <Plus size={20} />
            إضافة erste خدمة
          </button>
        </div>
      ) : (
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-image">
                {service.image ? (
                  <img src={service.image} alt={service.nameEn} />
                ) : (
                  <div className="no-image">
                    <Image size={32} />
                  </div>
                )}
              </div>
              <div className="service-info">
                <h3>{service.nameAr || service.nameEn}</h3>
                <p>{service.descriptionAr || service.descriptionEn}</p>
                {service.price && (
                  <span className="service-price">{service.price}</span>
                )}
              </div>
              <div className="service-actions">
                <button
                  className="btn-edit"
                  onClick={() => openEditModal(service)}
                >
                  <PencilSimple size={18} />
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(service.id)}
                >
                  <Trash size={18} />
                </button>
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
              <h2>{editingId ? 'تعديل خدمة' : 'إضافة خدمة جديدة'}</h2>
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
                    value={formData.nameEn}
                    onChange={e => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                    placeholder="Wedding Decoration"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>الاسم بالعربية</label>
                  <input
                    type="text"
                    value={formData.nameAr}
                    onChange={e => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                    placeholder="زفاف"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>الوصف بالإنجليزية</label>
                  <textarea
                    value={formData.descriptionEn}
                    onChange={e => setFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                    placeholder="Service description..."
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>الوصف بالعربية</label>
                  <textarea
                    value={formData.descriptionAr}
                    onChange={e => setFormData(prev => ({ ...prev, descriptionAr: e.target.value }))}
                    placeholder="وصف الخدمة..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>السعر</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="Starts from $1000"
                  />
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
              </div>

              <div className="form-group">
                <label>الصورة</label>
                <div className="image-upload">
                  {formData.image ? (
                    <div className="image-preview">
                      <img src={formData.image} alt="Preview" />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="upload-label">
                      <Upload size={24} />
                      <span>اختيار صورة</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        hidden
                      />
                    </label>
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
        .services-page {
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
          border-radius: 10px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background: #4a3224;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .service-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(93, 62, 43, 0.08);
          transition: all 0.3s ease;
        }

        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(93, 62, 43, 0.12);
        }

        .service-image {
          aspect-ratio: 16/10;
          background: #F4D9CC;
          overflow: hidden;
        }

        .service-image img {
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
          color: rgba(91, 62, 43, 0.4);
        }

        .service-info {
          padding: 20px;
        }

        .service-info h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          color: #5B3E2B;
          margin-bottom: 8px;
        }

        .service-info p {
          font-size: 14px;
          color: rgba(91, 62, 43, 0.7);
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .service-price {
          display: inline-block;
          margin-top: 12px;
          padding: 6px 12px;
          background: #FDF6EF;
          border-radius: 6px;
          font-size: 13px;
          color: #B7AE84;
        }

        .service-actions {
          display: flex;
          gap: 8px;
          padding: 0 20px 20px;
        }

        .btn-edit, .btn-delete {
          padding: 10px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
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
          min-height: 80px;
        }

        .image-upload {
          width: 120px;
          height: 120px;
        }

        .image-preview {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 10px;
          overflow: hidden;
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-image {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 24px;
          height: 24px;
          background: rgba(0, 0, 0, 0.6);
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .upload-label {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #FDF6EF;
          border: 2px dashed #F4D9CC;
          border-radius: 10px;
          cursor: pointer;
          color: rgba(91, 62, 43, 0.6);
          font-size: 12px;
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
        }
      `}</style>
    </div>
  );
};

export default Services;