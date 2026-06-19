import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAdGLtlt-cqDlnTklZCHNRxnbXbg9jk3os",
  authDomain: "aliaa-event.firebaseapp.com",
  projectId: "aliaa-event",
  storageBucket: "aliaa-event.firebasestorage.app",
  messagingSenderId: "780980263093",
  appId: "1:780980263093:web:b3015772ac944db22f06fc"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

async function testUpload() {
  const testContent = new Blob(['test'], { type: 'text/plain' });
  const storageRef = ref(storage, 'test/test.txt');

  try {
    await uploadBytes(storageRef, testContent);
    console.log('Upload successful!');
    const url = await getDownloadURL(storageRef);
    console.log('URL:', url);
  } catch (err) {
    console.error('Error:', err.code, err.message);
  }
}

testUpload();