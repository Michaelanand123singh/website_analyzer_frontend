// frontend/src/services/analytics.js

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-PP5ETM9JGN';

// Track page views
export const trackPageView = (path, title) => {
  if (window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title,
    });
  }
};

// Track custom events
export const trackEvent = (eventName, parameters = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'Website Analyzer',
      ...parameters,
    });
  }
};

// Track website analysis events
export const trackWebsiteAnalysis = (url, success = true, analysisTime = null) => {
  trackEvent('website_analysis', {
    event_category: 'Analysis',
    event_label: url,
    success: success,
    analysis_time: analysisTime,
    value: success ? 1 : 0,
  });
};

// Track PDF export events
export const trackPDFExport = (url) => {
  trackEvent('pdf_export', {
    event_category: 'Export',
    event_label: url,
    value: 1,
  });
};

// Track user engagement
export const trackUserEngagement = (action, details = {}) => {
  trackEvent('user_engagement', {
    event_category: 'Engagement',
    action: action,
    ...details,
  });
};

// Track navigation between views
export const trackViewSwitch = (fromView, toView, url) => {
  trackEvent('view_switch', {
    event_category: 'Navigation',
    from_view: fromView,
    to_view: toView,
    page_url: url,
  });
};

// Track example URL clicks
export const trackExampleClick = (exampleUrl) => {
  trackEvent('example_url_click', {
    event_category: 'User Interaction',
    event_label: exampleUrl,
  });
};

// Track errors
export const trackError = (errorType, errorMessage, url = null) => {
  trackEvent('error', {
    event_category: 'Error',
    error_type: errorType,
    error_message: errorMessage,
    page_url: url,
  });
};