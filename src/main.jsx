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

// Initialize Google Analytics
initializeAnalytics()

// Track unique visit once per day (per browser session) to avoid refresh duplicates
try {
  const today = new Date().toDateString()
  const VISIT_SESSION_KEY = `visit_${today}`

  if (typeof window !== 'undefined' && !sessionStorage.getItem(VISIT_SESSION_KEY)) {
    sessionStorage.setItem(VISIT_SESSION_KEY, '1')

    const now = Date.now()
    addDoc(collection(db, 'analytics'), {
      type: 'visit',
      timestamp: now,
      date: today,
    }).catch(() => {
      // ignore analytics write failures in production
    })
  }
} catch {
  // ignore
}

// Live Active Users tracking (unique per browser session)
try {
  const STORAGE_USER_ID_KEY = 'active_users_user_id'
  const userId =
    typeof window !== 'undefined'
      ? sessionStorage.getItem(STORAGE_USER_ID_KEY) || (crypto?.randomUUID?.() ?? `u_${Date.now()}_${Math.random().toString(16).slice(2)}`)
      : null

  if (typeof window !== 'undefined' && userId) {
    if (!sessionStorage.getItem(STORAGE_USER_ID_KEY)) {
      sessionStorage.setItem(STORAGE_USER_ID_KEY, userId)
    }

    const activeUserRef = doc(db, 'activeUsers', userId)

    const writeLastSeen = () => {
      setDoc(activeUserRef, { lastSeen: Date.now() }, { merge: true }).catch(() => {
        // keep app usable even if tracking fails
      })
    }

    // write immediately on load
    writeLastSeen()

    // update every 10 seconds
    const intervalId = setInterval(writeLastSeen, 10000)

    window.addEventListener('beforeunload', () => {
      clearInterval(intervalId)
    })
  }
} catch {
  // ignore
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

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
)