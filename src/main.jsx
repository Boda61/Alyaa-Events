import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import AppRoutes from './AppRoutes'
import { AuthProvider } from './admin/ProtectedRoute'
import { initializeAnalytics } from './utils/analytics'
import Clarity from "@microsoft/clarity";
import { db } from './firebase/config'
import { collection, addDoc, doc, setDoc } from 'firebase/firestore'

const projectId = import.meta.env.VITE_CLARITY_PROJECT_ID;
if (typeof window !== "undefined" && projectId) {
  Clarity.init(projectId);
}

initializeAnalytics();

// Track unique visit once per session
try {
  const today = new Date().toDateString();
  const VISIT_SESSION_KEY = `visit_${today}`;
  if (!sessionStorage.getItem(VISIT_SESSION_KEY)) {
    sessionStorage.setItem(VISIT_SESSION_KEY, '1');
    addDoc(collection(db, 'analytics'), {
      type: 'visit',
      timestamp: Date.now(),
      date: today,
    }).catch(() => {});
  }
} catch {}

// Live Active Users tracking
try {
  const STORAGE_USER_ID_KEY = 'active_users_user_id';
  const userId =
    sessionStorage.getItem(STORAGE_USER_ID_KEY) ||
    (crypto?.randomUUID?.() ?? `u_${Date.now()}_${Math.random().toString(16).slice(2)}`);

  if (!sessionStorage.getItem(STORAGE_USER_ID_KEY)) {
    sessionStorage.setItem(STORAGE_USER_ID_KEY, userId);
  }

  const activeUserRef = doc(db, 'activeUsers', userId);
  const writeLastSeen = () =>
    setDoc(activeUserRef, { lastSeen: Date.now() }, { merge: true }).catch(() => {});

  writeLastSeen();
  const intervalId = setInterval(writeLastSeen, 10000);

  const cleanup = () => clearInterval(intervalId);
  window.addEventListener('beforeunload', cleanup, { once: true });
  window.addEventListener('pagehide', cleanup, { once: true });
} catch {}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);