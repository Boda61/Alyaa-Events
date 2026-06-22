import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  PencilSimple,
  Trash,
  X,
} from 'phosphor-react';
import { rentalItemsService, decorationService } from '../../firebase/service';

const Rentals = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rentals, setRentals] = useState([]);
  const [decorations, setDecorations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(searchParams.get('action') === 'add');
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('decoration');

  const [formData, setFormData] = useState({
    nameEn: '',
    nameAr: '',
    price: '',
    originalPrice: '',
    discountedPrice: '',
    hasDiscount: false,
    category: 'mirrors-flowers',
    order: 0
  });

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        // Try to get existing data, or create defaults if empty
        const rentalData = await rentalItemsService.getAllWithDefaults();
        setRentals(rentalData);

        // Also fetch decorations for decoration category
        const decorationData = await decorationService.getAllWithDefaults();
        setDecorations(decorationData);
      } catch (err) {
        console.error('Error fetching rentals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, []);

  const openAddModal = () => {
    const itemCount = activeCategory === 'decorations' ? decorations.length : rentals.length;
    setFormData({
      nameEn: '',
      nameAr: '',
      price: '',
      originalPrice: '',
      discountedPrice: '',
      hasDiscount: false,
      category: activeCategory,
      order: itemCount
    });
    setEditingId(null);
    setShowModal(true);
    setError('');
    setSearchParams({ action: 'add' });
  };

  const openEditModal = (item) => {
    setFormData({
      nameEn: item.nameEn || '',
      nameAr: item.nameAr || '',
      price: item.price || '',
      originalPrice: item.originalPrice || '',
      discountedPrice: item.discountedPrice || '',
      hasDiscount: item.hasDiscount || false,
      category: item.category || 'mirrors-flowers',
      order: item.order || 0
    });
    setEditingId(item.id);
    setShowModal(true);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    if (!formData.nameEn && !formData.nameAr) {
      setError('يرجى إدخال اسم العنصر');
      setSaving(false);
      return;
    }
    if (!formData.price) {
      setError('يرجى إدخال السعر');
      setSaving(false);
      return;
    }
    if (formData.hasDiscount && (!formData.originalPrice || !formData.discountedPrice)) {
      setError('يرجى إدخال السعر الأصلي والسعر المخفض');
      setSaving(false);
      return;
    }

    try {
      const itemData = {
        nameEn: formData.nameEn,
        nameAr: formData.nameAr,
        price: formData.price,
        originalPrice: formData.hasDiscount ? formData.originalPrice : '',
        discountedPrice: formData.hasDiscount ? formData.discountedPrice : '',
        hasDiscount: formData.hasDiscount || false,
        category: formData.category,
        order: parseInt(formData.order) || 0
      };

      // Use decorationService for decorations, rentalItemsService for other items
      if (activeCategory === 'decorations') {
        if (editingId) {
          await decorationService.update(editingId, itemData);
        } else {
          await decorationService.add(itemData);
        }
        const data = await decorationService.getAll();
        setDecorations(data);
      } else {
        if (editingId) {
          await rentalItemsService.update(editingId, itemData);
        } else {
          await rentalItemsService.add(itemData);
        }
        const data = await rentalItemsService.getAll();
        setRentals(data);
      }

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
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;

    try {
      setLoading(true);
      if (activeCategory === 'decorations') {
        await decorationService.delete(id);
        const data = await decorationService.getAll();
        setDecorations(data);
      } else {
        await rentalItemsService.delete(id);
        const data = await rentalItemsService.getAll();
        setRentals(data);
      }
    } catch (err) {
      console.error('Error deleting:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRentals = activeCategory === 'decorations'
    ? decorations
    : rentals.filter(r => r.category === activeCategory);

  const categories = [
    { id: 'decorations', name: 'تصاميم الديكور' },
    { id: 'mirrors-flowers', name: 'مرايا بورد' },
    { id: 'mirrors', name: 'مرايا' },
    { id: 'normalChairs', name: 'كراسي عادية' },
    { id: 'caneChairs', name: 'كرسي كانيه' }
  ];

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="rentals-page">
      <div className="page-header">
        <div>
          <h1>اسعار الإيجار</h1>
          <p>إدارة اسعار المرايا والكراسي</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          <Plus size={20} />
          إضافة جديد
        </button>
      </div>

      <div className="category-tabs">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {filteredRentals.length === 0 ? (
        <div className="empty-state">
          <p>لا يوجد عناصر في هذه الفئة</p>
          <button onClick={openAddModal}>
            إضافة أول عنصر
          </button>
        </div>
      ) : (
        <div className="rentals-grid">
          {filteredRentals.sort((a, b) => a.order - b.order).map(item => (
            <div key={item.id} className="rental-card">
              <div className="rental-info">
                <h3>{item.nameAr || item.nameEn}</h3>
                {item.nameEn && <p className="name-en">{item.nameEn}</p>}
                {item.hasDiscount && item.originalPrice ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <span className="rental-price" style={{ textDecoration: 'line-through', color: '#c62828', fontSize: '14px' }}>{item.originalPrice} جم</span>
                    <span className="rental-price">{item.discountedPrice} جم</span>
                    <span style={{ fontSize: '10px', background: '#c62828', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>تخفيض</span>
                  </div>
                ) : (
                  item.price && <span className="rental-price">{item.price} جم</span>
                )}
              </div>
              <div className="rental-actions">
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
              <h2>{editingId ? 'تعديل عنصر' : 'إضافة عنصر جديد'}</h2>
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
                    placeholder="Crystal Mirror"
                  />
                </div>
                <div className="form-group">
                  <label>الاسم بالعربية</label>
                  <input
                    type="text"
                    value={formData.nameAr}
                    onChange={e => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                    placeholder="مراية كريستال"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>السعر (جنيه مصري)</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="100"
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

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.hasDiscount}
                    onChange={e => setFormData(prev => ({ ...prev, hasDiscount: e.target.checked }))}
                  />
                  يوجد تخفيض
                </label>
              </div>

              {formData.hasDiscount && (
                <div className="form-row">
                  <div className="form-group">
                    <label>السعر الأصلي (قبل التخفيض)</label>
                    <input
                      type="text"
                      value={formData.originalPrice}
                      onChange={e => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                      placeholder="150"
                    />
                  </div>
                  <div className="form-group">
                    <label>السعر بعد التخفيض</label>
                    <input
                      type="text"
                      value={formData.discountedPrice}
                      onChange={e => setFormData(prev => ({ ...prev, discountedPrice: e.target.value }))}
                      placeholder="100"
                    />
                  </div>
                </div>
              )}

              {activeCategory !== 'decorations' && (
                <div className="form-group">
                  <label>الفئة</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                  >
                    {categories.filter(cat => cat.id !== 'decorations').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  إلغاء
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'جاري الحفظ...' : 'حفظ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .rentals-page { max-width: 1200px; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .page-header h1 { font-size: 28px; color: #333; margin: 0; }
        .page-header p { color: #666; margin: 4px 0 0; }
        .category-tabs { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
        .category-tab { padding: 10px 16px; background: #F5F5F5; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; white-space: nowrap; }
        .category-tab.active { background: #5B3E2B; color: white; }
        .rentals-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .rental-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 20px; }
        .rental-info { padding: 0; }
        .rental-info h3 { margin: 0 0 4px; font-size: 18px; color: #333; }
        .rental-info .name-en { color: #666; font-size: 14px; margin: 0 0 12px; font-style: italic; }
        .rental-price { display: block; margin-top: 12px; color: #5B3E2B; font-weight: bold; font-size: 16px; }
        .rental-actions { display: flex; gap: 8px; padding-top: 16px; }
        .btn-edit, .btn-delete { flex: 1; padding: 10px; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .btn-edit { background: #4CAF50; color: white; }
        .btn-delete { background: #f44336; color: white; }
        .empty-state { text-align: center; padding: 60px 20px; color: #666; }
        .empty-state p { margin: 16px 0; }
        .empty-state button { margin-top: 16px; padding: 12px 24px; background: #5B3E2B; color: white; border: none; border-radius: 8px; cursor: pointer; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal { background: white; border-radius: 16px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #eee; }
        .modal-header h2 { margin: 0; font-size: 20px; }
        .modal-close { background: none; border: none; cursor: pointer; color: #666; }
        .modal-form { padding: 24px; }
        .error-message { background: #ffebee; color: #c62828; padding: 12px; border-radius: 8px; margin-bottom: 16px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: 500; color: #333; }
        .form-group input, .form-group textarea { width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px; box-sizing: border-box; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #B7AE84; }
        .modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
        .btn-secondary { padding: 12px 24px; background: #f5f5f5; border: none; border-radius: 8px; cursor: pointer; }
        .btn-primary { padding: 12px 24px; background: #5B3E2B; color: white; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        @media (max-width: 768px) { .form-row { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default Rentals;