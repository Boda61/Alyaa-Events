/**
 * PageViewTracker Component
 * 
 * Automatically tracks page views when the route changes.
 * Place this component inside your Router (BrowserRouter).
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';

export function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    const path = location.pathname;
    const title = getPageTitle(path);
    trackPageView(path, title);
  }, [location]);

  return null;
}

/**
 * Get page title based on path
 */
function getPageTitle(path) {
  const titles = {
    '/': 'Home',
    '/home': 'Home',
    '/portfolio': 'Portfolio',
    '/services': 'Services',
    '/rentals': 'Rentals',
    '/contact': 'Contact',
    '/admin': 'Admin Dashboard',
    '/admin/login': 'Admin Login',
  };
  
  return titles[path] || 'Unknown Page';
}

export default PageViewTracker;