import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAdGLtlt-cqDlnTklZCHNRxnbXbg9jk3os",
  authDomain: "aliaa-event.firebaseapp.com",
  projectId: "aliaa-event",
  storageBucket: "aliaa-event.firebasestorage.app",
  messagingSenderId: "780980263093",
  appId: "1:780980263093:web:b3015772ac944db22f06fc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const defaultRentals = [
  // Mirrors with Flowers
  { nameEn: 'Mirror with Gold Roses', nameAr: 'مراية ورود ذهب', descriptionEn: 'Elegant mirror with gold roses', descriptionAr: 'مراية انيقة مع ورود ذهب', price: '1,500', category: 'mirrors-flowers', order: 1 },
  { nameEn: 'Mirror with White Roses', nameAr: 'مراية ورود بيض', descriptionEn: 'Elegant mirror with white roses', descriptionAr: 'مراية انيقة مع ورود بيض', price: '1,200', category: 'mirrors-flowers', order: 2 },
  { nameEn: 'Mirror with Mix Roses', nameAr: 'مراية ورود ملونة', descriptionEn: 'Elegant mirror with mix roses', descriptionAr: 'مراية انيقة مع ورود ملونة', price: '1,800', category: 'mirrors-flowers', order: 3 },
  { nameEn: 'Mirror with Red Roses', nameAr: 'مراية ورود حمرا', descriptionEn: 'Elegant mirror with red roses', descriptionAr: 'مراية انيقة مع ورود حمرا', price: '1,600', category: 'mirrors-flowers', order: 4 },

  // Mirrors without Flowers
  { nameEn: 'Classic Mirror', nameAr: 'مراية كلاسيك', descriptionEn: 'Classic elegant mirror', descriptionAr: 'مراية كلاسيك انيقة', price: '800', category: 'mirrors', order: 1 },
  { nameEn: 'Gold Frame Mirror', nameAr: 'مراية ذهب', descriptionEn: 'Mirror with gold frame', descriptionAr: 'مراية بإطار ذهب', price: '1,200', category: 'mirrors', order: 2 },
  { nameEn: 'Crystal Mirror', nameAr: 'مراية كريستال', descriptionEn: 'Crystal mirror', descriptionAr: 'مراية كريستال', price: '1,500', category: 'mirrors', order: 3 },
  { nameEn: 'Mirror with LED', nameAr: 'مراية ليد', descriptionEn: 'Mirror with LED lights', descriptionAr: 'مراية مع إضاءة ليد', price: '2,500', category: 'mirrors', order: 4 },

  // Chairs
  { nameEn: '50 - 100 chairs', nameAr: '٥٠ - ١٠٠ كرسي', descriptionEn: 'Chairs for 50-100 guests', descriptionAr: 'كراسي من ٥٠ إلى ١٠٠ شخص', price: '4,000', category: 'chairs', order: 1 },
  { nameEn: '100 - 200 chairs', nameAr: '١٠٠ - ٢٠٠ كرسي', descriptionEn: 'Chairs for 100-200 guests', descriptionAr: 'كراسي من ١٠٠ إلى ٢٠٠ شخص', price: '7,500', category: 'chairs', order: 2 },
  { nameEn: '200 - 300 chairs', nameAr: '٢٠٠ - ٣٠٠ كرسي', descriptionEn: 'Chairs for 200-300 guests', descriptionAr: 'كراسي من ٢٠٠ إلى ٣٠٠ شخص', price: '11,000', category: 'chairs', order: 3 },
  { nameEn: '300 - 500 chairs', nameAr: '٣٠٠ - ٥٠٠ كرسي', descriptionEn: 'Chairs for 300-500 guests', descriptionAr: 'كراسي من ٣٠٠ إلى ٥٠٠ شخص', price: '17,500', category: 'chairs', order: 4 },
  { nameEn: '500+ chairs', nameAr: '٥٠٠+ كرسي', descriptionEn: 'Chairs for 500+ guests', descriptionAr: 'كراسي لأكثر من ٥٠٠ شخص', price: '25,000', category: 'chairs', order: 5 },
];

async function addRentals() {
  console.log('Adding default rentals to Firebase...');

  for (const rental of defaultRentals) {
    try {
      const docRef = await addDoc(collection(db, 'rentalItems'), rental);
      console.log(`Added: ${rental.nameEn} (${docRef.id})`);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

  console.log('Done!');
}

addRentals();