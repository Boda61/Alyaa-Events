import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  PencilSimple,
  Trash,
  X,
  UploadSimple,
  Image as ImageIcon,
  Spinner
} from 'phosphor-react';
import { decorationService, uploadToCloudinary } from '../../firebase/service';

const DecorationPrices = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [decorations, setDecorations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(searchParams.get('action') === 'add');
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    imageUrl: '',
    publicId: '',
    order: 0,
    setupType: ''
  });

  const [uploadProgress, setUploadProgress] = useState(0);

  const setupTypeOptions = [
    { value: 'بدون كنبة', label: 'بدون كنبة' },
    { value: 'ب كنبة', label: 'ب كنبة' },
    { value: 'ب كراسي', label: 'ب كراسي' },
    { value: 'بدون كراسي', label: 'بدون كراسي' }
  ];

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

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

  // Image validation
  const validateImage = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('يرجى اختيار صورة صحيحة (JPEG, PNG, WebP, GIF)');
      return false;
    }
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('حجم الصورة يجب أن يكون أقل من 10 ميجابايت');
      return false;
    }
    return true;
  };

  // Check if URL is valid Cloudinary URL (not blob)
  const isValidImageUrl = (url) => {
    if (!url) return false;
    return url.startsWith('http') && !url.startsWith('blob:');
  };

  const openAddModal = () => {
    setFormData({
      name: '',
      price: '',
      imageUrl: '',
      publicId: '',
      order: decorations.length,
      setupType: ''
    });
    setSelectedImage(null);
    setPreviewUrl('');
    setEditingId(null);
    setShowModal(true);
    setError('');
    setUploadProgress(0);
    setSearchParams({ action: 'add' });
  };

  const openEditModal = (item) => {
    setFormData({
      name: item.name || '',
      price: item.price || '',
      imageUrl: item.imageUrl || '',
      publicId: item.publicId || '',
      order: item.order || 0,
      setupType: item.setupType || ''
    });
    setSelectedImage(null);
    setPreviewUrl(item.imageUrl || '');
    setEditingId(item.id);
    setShowModal(true);
    setError('');
    setUploadProgress(0);
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image
    if (!validateImage(file)) {
      e.target.value = '';
      return;
    }

    setError('');
    setUploading(true);
    setUploadProgress(10);

    // Keep selected file for upload, show loading state - NO blob URL
    setSelectedImage(file);

    try {
      setUploadProgress(40);

      // Upload to Cloudinary
      const result = await uploadToCloudinary(file, 'decorations');

      setUploadProgress(100);

      // Update form with Cloudinary URL only
      setFormData(prev => ({
        ...prev,
        imageUrl: result.imageUrl,
        publicId: result.publicId
      }));

      // Update preview to Cloudinary URL (only valid http URL)
      setPreviewUrl(result.imageUrl);

    } catch (err) {
      console.error('Upload error:', err);
      setError('حدث خطأ في رفع الصورة. يرجى المحاولة مرة أخرى');
      setFormData(prev => ({
        ...prev,
        imageUrl: '',
        publicId: ''
      }));
      setPreviewUrl('');
    } finally {
      setUploading(false);
      setSelectedImage(null);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    if (!formData.name) {
      setError('يرجى إدخال اسم التصميم');
      setSaving(false);
      return;
    }
    if (!formData.price) {
      setError('يرجى إدخال السعر');
      setSaving(false);
      return;
    }

    try {
      // Validate image URL before saving
      const validImageUrl = isValidImageUrl(formData.imageUrl) ? formData.imageUrl : '';

      const itemData = {
        name: formData.name,
        price: parseInt(formData.price) || 0,
        imageUrl: validImageUrl,
        publicId: formData.publicId || '',
        order: parseInt(formData.order) || 0,
        setupType: formData.setupType || ''
      };

      if (editingId) {
        await decorationService.update(editingId, itemData);
      } else {
        await decorationService.add(itemData);
      }

      setShowModal(false);
      setSearchParams({});

      // Reload page to get fresh data
      window.location.reload();
    } catch (err) {
    setError('حدث خطأ في حفظ البيانات');
    console.error(err);
  } finally {
    setSaving(false);
  }
  };

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا التصميم؟')) return;

    try {
      setLoading(true);
      await decorationService.delete(id);
      const data = await decorationService.getAll();
      setDecorations(data);
    } catch (err) {
      console.error('Error deleting:', err);
    } finally {
      setLoading(false);
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
    <div className="decoration-page">
      <div className="page-header">
        <div>
          <h1>اسعار الديكور</h1>
          <p>إدارة تصاميم الديكور واسعارها</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          <Plus size={20} />
          إضافة جديد
        </button>
      </div>

      {decorations.length === 0 ? (
        <div className="empty-state">
          <p>لا يوجد تصاميم ديكور</p>
          <button onClick={openAddModal}>
            إضافة أول تصميم
          </button>
        </div>
      ) : (
        <div className="decoration-grid">
          {decorations.sort((a, b) => a.order - b.order).map(item => (
            <div key={item.id} className="decoration-card">
              <div className="decoration-image">
                {item.imageUrl && isValidImageUrl(item.imageUrl) ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextSibling?.style?.removeProperty('display');
                    }}
                  />
                ) : null}
                <div className="no-image" style={{ display: item.imageUrl && isValidImageUrl(item.imageUrl) ? 'none' : 'flex' }}>
                  <ImageIcon size={48} />
                  <span>لا توجد صورة</span>
                </div>
              </div>
              <div className="decoration-info">
                <h3>{item.name}</h3>
                {item.price && <span className="decoration-price">{item.price.toLocaleString()} جم</span>}
              </div>
              <div className="decoration-actions">
                <button className="btn-edit" onClick={() => openEditModal(item)}>
                  <PencilSimple size={18} />
                  تعديل
                </button>
                <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                  <Trash size={18} />
                  حذف
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
              <h2>{editingId ? 'تعديل تصميم' : 'إضافة تصميم جديد'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {error && <div className="error-message">{error}</div>}

              {/* Image Upload */}
              <div className="form-group">
                <label>الصورة</label>
                <div className="image-upload-area">
                  {(isValidImageUrl(previewUrl) || isValidImageUrl(formData.imageUrl)) ? (
                    <div className="image-preview">
                      <img src={previewUrl || formData.imageUrl} alt="Preview" onError={(e) => e.currentTarget.style.display = 'none'} />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => {
                          setSelectedImage(null);
                          setPreviewUrl('');
                          setFormData(prev => ({ ...prev, imageUrl: '', publicId: '' }));
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="upload-label">
                      <UploadSimple size={32} />
                      <span>اضغط لاختيار صورة</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        hidden
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>اسم التصميم</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Design 1"
                  />
                </div>
                <div className="form-group">
                  <label>السعر (جنيه مصري)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="35000"
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
                <label>تجهيز المكان</label>
                <select
                  value={formData.setupType}
                  onChange={e => setFormData(prev => ({ ...prev, setupType: e.target.value }))}
                  style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                >
                  <option value="">اختر تجهيز المكان</option>
                  {setupTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  إلغاء
                </button>
                <button type="submit" className="btn-primary" disabled={saving || uploading}>
                  {saving ? 'جاري الحفظ...' : uploading ? 'جاري رفع الصورة...' : 'حفظ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .decoration-page { max-width: 1200px; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .page-header h1 { font-size: 28px; color: #333; margin: 0; }
        .page-header p { color: #666; margin: 4px 0 0; }

        .decoration-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; }
        .decoration-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08); transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .decoration-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }

        .decoration-image { height: 200px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .decoration-image img { width: 100%; height: 100%; object-fit: cover; }
        .decoration-image .no-image { display: flex; flex-direction: column; align-items: center; gap: 8px; color: #ccc; }
        .decoration-image .no-image span { font-size: 14px; }

        .decoration-info { padding: 20px; }
        .decoration-info h3 { margin: 0 0 8px; font-size: 18px; color: #333; font-weight: 600; }
        .decoration-price { display: inline-block; background: linear-gradient(135deg, #5B3E2B 0%, #8B5E3C 100%); color: white; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; }

        .decoration-actions { display: flex; gap: 8px; padding: 0 20px 20px; }
        .btn-edit, .btn-delete { flex: 1; padding: 10px; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 14px; }
        .btn-edit { background: #4CAF50; color: white; }
        .btn-delete { background: #f44336; color: white; }

        .empty-state { text-align: center; padding: 60px 20px; color: #666; }
        .empty-state p { margin: 16px 0; }
        .empty-state button { margin-top: 16px; padding: 12px 24px; background: #5B3E2B; color: white; border: none; border-radius: 8px; cursor: pointer; }

        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal { background: white; border-radius: 16px; width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #eee; }
        .modal-header h2 { margin: 0; font-size: 20px; color: #333; }
        .modal-close { background: none; border: none; cursor: pointer; color: #666; }
        .modal-form { padding: 24px; }
        .error-message { background: #ffebee; color: #c62828; padding: 12px; border-radius: 8px; margin-bottom: 16px; }

        .image-upload-area { border: 2px dashed #ddd; border-radius: 12px; padding: 20px; text-align: center; }
        .upload-label { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; color: #666; padding: 20px; }
        .upload-label:hover { color: #5B3E2B; }
        .image-preview { position: relative; display: inline-block; }
        .image-preview img { width: 200px; height: 150px; object-fit: cover; border-radius: 8px; }
        .remove-image { position: absolute; top: -8px; right: -8px; background: #f44336; color: white; border: none; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: 500; color: #333; }
        .form-group input { width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px; box-sizing: border-box; }
        .form-group input:focus { outline: none; border-color: #5B3E2B; }

        .modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
        .btn-secondary { padding: 12px 24px; background: #f5f5f5; border: none; border-radius: 8px; cursor: pointer; color: #333; }
        .btn-primary { padding: 12px 24px; background: linear-gradient(135deg, #5B3E2B 0%, #8B5E3C 100%); color: white; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        @media (max-width: 768px) {
          .decoration-grid { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default DecorationPrices;