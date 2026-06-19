import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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

async function check() {
  const cols = ['services', 'portfolio', 'testimonials', 'settings'];
  for (const c of cols) {
    const s = await getDocs(collection(db, c));
    console.log(c + ': ' + s.size);
  }
}

check();