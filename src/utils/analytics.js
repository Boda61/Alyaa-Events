/**
 * Google Analytics 4 Utility
 * 
 * This module provides a clean interface for tracking events and page views.
 * 
 * Usage:
 *   import { analytics, trackPageView, trackEvent } from './utils/analytics';
 *   
 *   // Track page view
 *   trackPageView('/home', 'Home Page');
 *   
 *   // Track custom event
 *   trackEvent('button_click', { button_name: 'Plan Event' });
 */

import ReactGA from 'react-ga4';

// Get Measurement ID from environment variable
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-57MH5QVWJF';

/**
 * Initialize Google Analytics
 * Call this once when the application starts
 */
export const initializeAnalytics = () => {
  ReactGA.initialize(MEASUREMENT_ID);
};

/**
 * Track a page view
 * @param {string} path - The page path (e.g., '/home', '/portfolio')
 * @param {string} title - The page title
 */
export const trackPageView = (path, title) => {
  ReactGA.send({ hitType: 'pageview', page: path, title: title });
};

/**
 * Track a custom event
 * @param {string} eventName - The name of the event (e.g., 'button_click', 'form_submit')
 * @param {object} eventParams - Additional parameters for the event
 */
export const trackEvent = (eventName, eventParams = {}) => {
  ReactGA.event(eventName, eventParams);
};

/**
 * Analytics object for convenient access
 */
export const analytics = {
  initialize: initializeAnalytics,
  pageView: trackPageView,
  event: trackEvent,
  
  // Pre-defined event trackers
  trackPlanEventClick: () => {
    trackEvent('button_click', {
      button_name: 'Plan Event',
      button_category: 'engagement',
    });
  },
  
  trackViewPortfolioClick: () => {
    trackEvent('button_click', {
      button_name: 'View Portfolio',
      button_category: 'navigation',
    });
  },
  
  trackWhatsAppClick: (location = 'unknown') => {
    trackEvent('whatsapp_click', {
      location: location,
      button_category: 'contact',
    });
  },
  
  trackFormSubmit: (formName = 'Event Planner') => {
    trackEvent('form_submit', {
      form_name: formName,
      form_category: 'lead_generation',
    });
  },
  
  trackLanguageSwitch: (newLanguage, previousLanguage) => {
    trackEvent('language_switch', {
      new_language: newLanguage,
      previous_language: previousLanguage,
    });
  },
};

export default analytics;