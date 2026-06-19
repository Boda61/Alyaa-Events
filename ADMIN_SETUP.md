# Alyaa Events - Admin Dashboard Setup Guide

## Created Files

### Firebase Configuration
- `src/firebase/config.js` - Firebase initialization
- `src/firebase/service.js` - CRUD operations for all collections

### Admin Pages
- `src/admin/ProtectedRoute.jsx` - Authentication & protected routes
- `src/admin/pages/AdminLogin.jsx` - Login page
- `src/admin/pages/AdminDashboard.jsx` - Dashboard layout with sidebar
- `src/admin/pages/DashboardHome.jsx` - Dashboard home/stats
- `src/admin/pages/Services.jsx` - Services CRUD
- `src/admin/pages/Portfolio.jsx` - Portfolio CRUD
- `src/admin/pages/Testimonials.jsx` - Testimonials CRUD
- `src/admin/pages/Settings.jsx` - Website settings

### Frontend Integration
- `src/services/useWebsiteData.js` - Hooks for fetching data
- `src/AppRoutes.jsx` - Routing configuration
- `src/main.jsx` - Updated entry point

---

## Firebase Setup Steps

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project "alyaa-events"
3. Enable Firestore and Storage

### 2. Get Firebase Config
1. In Firebase Console, go to Project Settings
2. Scroll to "Your apps" and click the web icon (</>)
3. Copy the firebaseConfig values

### 3. Update Firebase Config
Edit `src/firebase/config.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 4. Set Up Authentication
1. In Firebase Console, go to Authentication
2. Enable "Email/Password" sign-in method
3. Add your admin email/password:
   - Email: admin@alyaaevents.com
   - Password: (create a strong password)

### 5. Create Firestore Collections
Create these collections in Firestore with sample data:

#### services collection
```json
{
  "nameEn": "Wedding Decoration",
  "nameAr": "تجميل الزفاف",
  "descriptionEn": "Full wedding decoration service",
  "descriptionAr": "خدمة تجميل زفاف كاملة",
  "price": "From $1000",
  "image": "",
  "order": 0,
  "icon": "flower"
}
```

#### portfolio collection
```json
{
  "titleEn": "Royal Wedding",
  "titleAr": "زفاف ملكي",
  "descriptionEn": "Luxury wedding decoration",
  "descriptionAr": "تجميل زفاف فاخر",
  "price": "$5000",
  "images": [],
  "order": 0
}
```

#### testimonials collection
```json
{
  "name": "John Doe",
  "nameAr": "جون دو",
  "text": "Amazing service!",
  "textAr": "خدمة رائعة!",
  "rating": 5,
  "visible": true
}
```

#### settings collection
```json
{
  "name": "Alyaa Events",
  "tagLine": "Luxury Wedding & Event Decorations",
  "phone": "+20 100 000 0000",
  "email": "info@alyaaevents.com",
  "address": "Cairo, Egypt",
  "facebook": "",
  "instagram": "",
  "heroTitleEn": "Creating Unforgettable Moments",
  "heroTitleAr": "لخلق لحظات لا تُنسى"
}
```

### 6. Set Up Storage Rules
In Firebase Console → Storage → Rules:
```groovy
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
}
```

---

## How to Access Admin Panel

### Login to Admin Panel
1. Open http://localhost:5173/admin
2. Enter your admin credentials:
   - Email: admin@alyaaevents.com
   - Password: (your password)
3. Click "تسجيل الدخول"

### Admin Dashboard Features
- **Dashboard Home**: View statistics and quick actions
- **Services**: Add/Edit/Delete services
- **Portfolio**: Add/Edit/Delete portfolio projects
- **Testimonials**: Manage customer reviews
- **Settings**: Update website content

---

## Data Flow

### Frontend → Firebase
1. Admin logs in via `/admin`
2. Admin adds/edits data in dashboard
3. Data saved to Firestore via services in `src/firebase/service.js`
4. Images uploaded to Firebase Storage

### Firebase → Frontend
1. Website loads
2. `useServices()`, `usePortfolio()`, `useTestimonials()` hooks fetch data
3. Real-time subscriptions keep data updated
4. Dynamic content displayed on website

---

## Environment Variables (Optional)

Create `.env` file in project root:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

## Troubleshooting

### "Authentication failed"
- Check that email/password is correct
- Make sure Authentication is enabled in Firebase Console

### "Permission denied"
- Check Firestore rules allow read/write

### Images not uploading
- Check Storage rules
- Verify Firebase Storage is enabled

### Data not showing
- Check collection names match (services, portfolio, testimonials, settings)
- Verify documents have required fields