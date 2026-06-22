import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage } from './config';

// ========================================
// In-Memory Cache with TTL
// ========================================
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

const getCacheKey = (collectionName, orderField, orderDirection) =>
  `${collectionName}_${orderField}_${orderDirection}`;

const getCached = (key) => {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  cache.delete(key);
  return null;
};

const setCache = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const clearCache = (collectionName) => {
  for (const key of cache.keys()) {
    if (key.startsWith(collectionName)) {
      cache.delete(key);
    }
  }
};

export const clearAllCache = () => cache.clear();

// ========================================
// Generic CRUD Operations
// ========================================

// Get all documents from a collection
export const getCollection = async (collectionName, orderField = 'createdAt', orderDirection = 'desc') => {
  const cacheKey = getCacheKey(collectionName, orderField, orderDirection);
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const q = query(collection(db, collectionName), orderBy(orderField, orderDirection));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error getting ${collectionName}:`, error);
    throw error;
  }
};

// Get a single document
export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
  } catch (error) {
    console.error(`Error getting document:`, error);
    throw error;
  }
};

// Add a document
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    clearCache(collectionName); // Clear cache after mutation
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document:`, error);
    throw error;
  }
};

// Update a document
export const updateDocument = async (collectionName, docId, data) => {
  try {
    console.log(`Updating ${collectionName}/${docId}:`, data);
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    clearCache(collectionName); // Clear cache after mutation
    return docId;
  } catch (error) {
    console.error(`Error updating document:`, error);
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    clearCache(collectionName); // Clear cache after mutation
    return docId;
  } catch (error) {
    console.error(`Error deleting document:`, error);
    throw error;
  }
};

// Delete all documents in a collection
export const deleteAllDocuments = async (collectionName) => {
  try {
    const q = query(collection(db, collectionName));
    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, collectionName, d.id)));
    await Promise.all(deletePromises);
    clearCache(collectionName); // Clear cache after mutation
    return snapshot.size;
  } catch (error) {
    console.error(`Error deleting all documents:`, error);
    throw error;
  }
};

// ========================================
// Real-time Subscription
// ========================================

export const subscribeToCollection = (collectionName, callback, orderField = 'createdAt', orderDirection = 'desc') => {
  const q = query(collection(db, collectionName), orderBy(orderField, orderDirection));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(data);
  });
};

// ========================================
// Image/File Upload Operations
// ========================================

export const uploadImage = async (collectionName, docId, file, fileName) => {
  try {
    const storageRef = ref(storage, `${collectionName}/${docId}/${fileName}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error(`Error uploading image:`, error);
    throw error;
  }
};

export const uploadImageNoDoc = async (collectionName, file, fileName) => {
  try {
    const storageRef = ref(storage, `${collectionName}/${Date.now()}_${fileName}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error(`Error uploading image:`, error);
    throw error;
  }
};

export const deleteImage = async (imageUrl) => {
  try {
    if (!imageUrl) return;
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error(`Error deleting image:`, error);
    // Don't throw - image might not exist
  }
};

// ========================================
// Services Collection
// ========================================

const defaultServices = [
  { nameEn: 'Weddings', nameAr: 'الأفراح', descriptionEn: 'Full-scale wedding decoration transforming your venue into a dream celebration.', descriptionAr: 'ديكور أفراح كامل يحول مكانك إلى حلم celebrations.', price: 'From $1000', icon: 'flower', order: 0 },
  { nameEn: 'Engagements', nameAr: 'الخطوبات', descriptionEn: 'Elegant engagement ceremony setups with personalized themes and decorations.', descriptionAr: 'إعدادات خطوبة أنيقة مع موضوعات وديكورات مخصصة.', price: 'From $500', icon: 'heart', order: 1 },
  { nameEn: 'Corporate Events', nameAr: 'احتفالات الشركات', descriptionEn: 'Professional event decorations for corporate gatherings and company celebrations.', descriptionAr: 'ديكورات احترافية للاجتماعات الشركات والاحتفالات.', price: 'From $300', icon: 'briefcase', order: 2 },
  { nameEn: 'Special Celebrations', nameAr: 'احتفالات خاصة', descriptionEn: 'Birthdays, anniversaries, and custom celebrations with unique decorative themes.', descriptionAr: 'أعياد ميلاد، ذكرى سنوية، واحتفالات مخصصة بمواضيع فريدة.', price: 'From $200', icon: 'party-horn', order: 3 }
];

export const servicesService = {
  getAll: () => getCollection('services', 'order'),
  getById: (id) => getDocument('services', id),
  add: (data) => addDocument('services', data),
  update: (id, data) => updateDocument('services', id, data),
  delete: (id) => deleteDocument('services', id),
  subscribe: (callback) => subscribeToCollection('services', callback, 'order'),
  // Auto-create default services if empty
  getAllWithDefaults: async () => {
    const data = await getCollection('services', 'order');
    if (data.length === 0) {
      for (const service of defaultServices) {
        await addDocument('services', service);
      }
      return await getCollection('services', 'order');
    }
    return data;
  }
};

// ========================================
// Portfolio Collection
// ========================================

const defaultPortfolio = [
  { titleEn: 'Royal Wedding', titleAr: 'زفاف ملكي', descriptionEn: 'Luxury wedding decoration at Grand Ballroom', descriptionAr: 'تجميل زفاف فاخر في قاعة grandes', price: '$5000', location: 'Grand Ballroom', order: 0 },
  { titleEn: 'Garden Ceremony', titleAr: ' ceremony في الحديقة', descriptionEn: 'Outdoor garden ceremony at Private Estate', descriptionAr: ' ceremony في حديقة خاصة', price: '$3000', location: 'Private Estate', order: 1 },
  { titleEn: 'Beach Reception', titleAr: 'استقبال على الشاطئ', descriptionEn: 'Beach reception at Coastal Villa', descriptionAr: 'استقبال على الشاطئ في فيلا ساحلية', price: '$4000', location: 'Coastal Villa', order: 2 },
  { titleEn: 'Engagement Party', titleAr: 'حفلة الخطوبة', descriptionEn: 'Engagement party at Rooftop Garden', descriptionAr: 'حفلة خطوبة على سطح الحديقة', price: '$2500', location: 'Rooftop Garden', order: 3 },
  { titleEn: 'Intimate Dinner', titleAr: 'عشاء خاص', descriptionEn: 'Intimate dinner at Private Residence', descriptionAr: 'عشاء خاص في residence خاص', price: '$1500', location: 'Private Residence', order: 4 },
  { titleEn: 'Henna Night', titleAr: 'ليلة الحنه', descriptionEn: 'Henna night at Cultural Center', descriptionAr: 'ليلة حنة في مركز ثقافي', price: '$2000', location: 'Cultural Center', order: 5 },
  { titleEn: 'Floral Decor', titleAr: 'ديكور زهري', descriptionEn: 'Floral decor at Ballroom', descriptionAr: 'ديكور زهري في القاعة', price: '$1800', location: 'Ballroom', order: 6 },
  { titleEn: 'Classic Elegance', titleAr: 'أناقة كلاسيكية', descriptionEn: 'Classic elegant setup at Grand Hall', descriptionAr: 'إعداد كلاسيكي أنيق في القاعة الكبيرة', price: '$3500', location: 'Grand Hall', order: 7 },
  { titleEn: 'Modern Setup', titleAr: 'إعداد حديث', descriptionEn: 'Modern setup in Garden', descriptionAr: 'إعداد حديث في الحديقة', price: '$2200', location: 'Garden', order: 8 }
];

export const portfolioService = {
  getAll: () => getCollection('portfolio', 'order'),
  getById: (id) => getDocument('portfolio', id),
  add: (data) => addDocument('portfolio', data),
  update: (id, data) => updateDocument('portfolio', id, data),
  delete: (id) => deleteDocument('portfolio', id),
  subscribe: (callback) => subscribeToCollection('portfolio', callback, 'order'),
  getAllWithDefaults: async () => {
    const data = await getCollection('portfolio', 'order');
    if (data.length === 0) {
      for (const item of defaultPortfolio) {
        await addDocument('portfolio', item);
      }
      return await getCollection('portfolio', 'order');
    }
    return data;
  }
};

// ========================================
// Testimonials Collection
// ========================================

const defaultTestimonials = [
  { name: 'Sarah & Ahmed', text: 'Amazing decoration!', textAr: 'تجميل رائع!', rating: 5, visible: true },
  { name: 'Mariam', text: 'Very professional', textAr: 'محترفة جداً', rating: 5, visible: true },
  { name: 'Noura', text: 'Loved it!', textAr: 'أعجبتني!', rating: 5, visible: true }
];

export const testimonialsService = {
  getAll: () => getCollection('testimonials', 'createdAt', 'desc'),
  getById: (id) => getDocument('testimonials', id),
  add: (data) => addDocument('testimonials', { ...data, visible: true }),
  update: (id, data) => updateDocument('testimonials', id, data),
  delete: (id) => deleteDocument('testimonials', id),
  toggleVisibility: (id, visible) => updateDocument('testimonials', id, { visible }),
  subscribe: (callback) => subscribeToCollection('testimonials', callback, 'createdAt'),
  getAllWithDefaults: async () => {
    const data = await getCollection('testimonials', 'createdAt', 'desc');
    if (data.length === 0) {
      for (const item of defaultTestimonials) {
        await addDocument('testimonials', item);
      }
      return await getCollection('testimonials', 'createdAt', 'desc');
    }
    return data;
  }
};

// ========================================
// Settings Collection
// ========================================

export const settingsService = {
  get: async () => {
    const q = query(collection(db, 'settings'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      // Create default settings if not exists
      const defaultSettings = {
        name: 'Alyaa Events',
        tagLine: 'Luxury Wedding & Event Decorations',
        phone: '+20 100 000 0000',
        email: 'info@alyaaevents.com',
        address: 'Cairo, Egypt',
        facebook: '',
        instagram: '',
        twitter: '',
        heroTitleEn: 'Creating Unforgettable Moments',
        heroTitleAr: 'لخلق لحظات لا تُنسى',
        heroSubtitleEn: 'Luxury wedding and event decoration services',
        heroSubtitleAr: 'خدمات_decoration_الزفاف_والمناسبات',
        aboutEn: 'Alyaa Events is a premier wedding and event decoration company...',
        aboutAr: 'شركة_alia_للزفاف_والمناسبات_هي_شركة_رائدة...'
      };
      await addDocument('settings', defaultSettings);
      return { id: 'default', ...defaultSettings };
    }
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  },
  update: (data) => {
    // Settings is a singleton - update or create
    return getCollection('settings').then(settings => {
      if (settings.length > 0) {
        return updateDocument('settings', settings[0].id, data);
      } else {
        return addDocument('settings', data);
      }
    });
  },
  subscribe: (callback) => {
    return onSnapshot(query(collection(db, 'settings')), (snapshot) => {
      if (!snapshot.empty) {
        const data = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        callback(data);
      }
    });
  }
};

// ========================================
// Rental Items Collection (Decoration, Mirrors, Chairs, etc)
// ========================================

const defaultRentalItems = [
  // مرايا بورد (Mirrors with Flowers)
  { nameEn: 'Small Crystal Mirror', nameAr: 'مرايا كريستال صغيرة', price: '250', category: 'mirrors-flowers', order: 0 },
  { nameEn: 'Large Crystal Mirror', nameAr: 'مرايا كريستال كبيرة', price: '350', category: 'mirrors-flowers', order: 1 },
  { nameEn: 'Silver Mirror', nameAr: 'مرايا فضة ستانليس', price: '400', category: 'mirrors-flowers', order: 2 },
  { nameEn: 'Gold Mirror', nameAr: 'مرايا ذهبي بورد', price: '200', category: 'mirrors-flowers', order: 3 },
  // مرايا (Mirrors without Flowers)
  { nameEn: 'Regular Mirror', nameAr: 'مرايا عادية', price: '150', category: 'mirrors', order: 0 },
  { nameEn: 'Silver Mirror Plain', nameAr: 'مرايا فضة ستانليس', price: '250', category: 'mirrors', order: 1 },
  // كراسي عادية (Normal Chairs) - بالقطعة
  { nameEn: 'Louis Chair', nameAr: 'كرسي لويس', price: '80', category: 'normalChairs', order: 0 },
  { nameEn: 'Chiavari Chair', nameAr: 'كرسي تشيافري', price: '60', category: 'normalChairs', order: 1 },
  { nameEn: 'Acrylic Chair', nameAr: 'كرسي اكريلك', price: '100', category: 'normalChairs', order: 2 },
  // كراسي عادية (Normal Chairs) - بالكمية
  { nameEn: '50 - 100 chairs', nameAr: '٥٠ - ١٠٠ كرسي', price: '4,000', category: 'normalChairs', order: 10 },
  { nameEn: '100 - 200 chairs', nameAr: '١٠٠ - ٢٠٠ كرسي', price: '7,500', category: 'normalChairs', order: 11 },
  { nameEn: '200 - 300 chairs', nameAr: '٢٠٠ - ٣٠٠ كرسي', price: '11,000', category: 'normalChairs', order: 12 },
  { nameEn: '300 - 500 chairs', nameAr: '٣٠٠ - ٥٠٠ كرسي', price: '17,500', category: 'normalChairs', order: 13 },
  { nameEn: '500+ chairs', nameAr: '٥٠٠+ كرسي', price: '25,000', category: 'normalChairs', order: 14 },
  // كراسي كانيه (Cane Chairs) - بالقطعة
  { nameEn: 'Cane Chair White', nameAr: 'كرسي كانيه ابيض', price: '120', category: 'caneChairs', order: 0 },
  { nameEn: 'Cane Chair Gold', nameAr: 'كرسي كانيه ذهب', price: '150', category: 'caneChairs', order: 1 },
  { nameEn: 'Cane Chair Silver', nameAr: 'كرسي كانيه فضة', price: '140', category: 'caneChairs', order: 2 },
  // كراسي كانيه (Cane Chairs) - بالكمية
  { nameEn: '50 - 100 cane chairs', nameAr: '٥٠ - ١٠٠ كرسي كانيه', price: '6,000', category: 'caneChairs', order: 10 },
  { nameEn: '100 - 200 cane chairs', nameAr: '١٠٠ - ٢٠٠ كرسي كانيه', price: '11,000', category: 'caneChairs', order: 11 },
  { nameEn: '200 - 300 cane chairs', nameAr: '٢٠٠ - ٣٠٠ كرسي كانيه', price: '16,000', category: 'caneChairs', order: 12 },
  { nameEn: '300 - 500 cane chairs', nameAr: '٣٠٠ - ٥٠٠ كرسي كانيه', price: '24,000', category: 'caneChairs', order: 13 },
  { nameEn: '500+ cane chairs', nameAr: '٥٠٠+ كرسي كانيه', price: '35,000', category: 'caneChairs', order: 14 },
];

export const rentalItemsService = {
  getAll: () => getCollection('rentalItems', 'order'),
  getById: (id) => getDocument('rentalItems', id),
  add: (data) => addDocument('rentalItems', data),
  update: (id, data) => updateDocument('rentalItems', id, data),
  delete: (id) => deleteDocument('rentalItems', id),
  subscribe: (callback) => subscribeToCollection('rentalItems', callback, 'order'),
  getAllWithDefaults: async () => {
    const data = await getCollection('rentalItems', 'order');
    if (data.length === 0) {
      for (const item of defaultRentalItems) {
        await addDocument('rentalItems', item);
      }
      return await getCollection('rentalItems', 'order');
    }
    return data;
  }
};

// ========================================
// Decoration Designs Collection
// ========================================

const defaultDecorations = [
  { name: 'Design 1', price: 35000, imageUrl: '', order: 0 },
  { name: 'Design 2', price: 45000, imageUrl: '', order: 1 },
  { name: 'Design 3', price: 55000, imageUrl: '', order: 2 },
  { name: 'Design 4', price: 40000, imageUrl: '', order: 3 },
  { name: 'Design 5', price: 50000, imageUrl: '', order: 4 },
  { name: 'Design 6', price: 60000, imageUrl: '', order: 5 },
  { name: 'Design 7', price: 42000, imageUrl: '', order: 6 },
  { name: 'Design 8', price: 38000, imageUrl: '', order: 7 },
];

export const decorationService = {
  getAll: () => getCollection('decorations', 'order'),
  getById: (id) => getDocument('decorations', id),
  add: (data) => addDocument('decorations', data),
  update: (id, data) => updateDocument('decorations', id, data),
  delete: (id) => deleteDocument('decorations', id),
  subscribe: (callback) => subscribeToCollection('decorations', callback, 'order'),
  getAllWithDefaults: async () => {
    const data = await getCollection('decorations', 'order');
    if (data.length === 0) {
      for (const item of defaultDecorations) {
        await addDocument('decorations', item);
      }
      return await getCollection('decorations', 'order');
    }
    return data;
  }
};

// ========================================
// Clear All Admin Data
// ========================================

export const clearAllAdminData = async () => {
  const collections = ['services', 'portfolio', 'testimonials', 'settings', 'rentalItems', 'decorations'];
  const results = {};

  for (const col of collections) {
    try {
      results[col] = await deleteAllDocuments(col);
    } catch (error) {
      console.error(`Error clearing ${col}:`, error);
      results[col] = 0;
    }
  }

  clearAllCache();
  return results;
};