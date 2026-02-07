// Google Analytics 4 Tracking Utility
// Replace GA_MEASUREMENT_ID with your actual GA4 Measurement ID

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// Initialize gtag if not already defined
if (typeof window !== 'undefined' && !window.gtag) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
}

// Event Categories
export const ANALYTICS_EVENTS = {
  // Booking Events
  BOOKING_BUTTON_CLICK: 'booking_button_click',
  BOOKING_FORM_OPENED: 'booking_form_opened',
  BOOKING_FORM_SUBMITTED: 'booking_form_submitted',
  
  // Support Group Events
  GROUP_BUTTON_CLICK: 'group_button_click',
  GROUP_FORM_OPENED: 'group_form_opened',
  GROUP_FORM_SUBMITTED: 'group_form_submitted',
  
  // Assessment Events
  ASSESSMENT_STARTED: 'assessment_started',
  ASSESSMENT_COMPLETED: 'assessment_completed',
  ASSESSMENT_SKIPPED: 'assessment_skipped',
  
  // CTA Events
  CTA_CLICK: 'cta_click',
  WHATSAPP_CLICK: 'whatsapp_click',
  
  // Page Events
  PAGE_VIEW: 'page_view',
  
  // Download Events
  APP_DOWNLOAD_CLICK: 'app_download_click',
} as const;

// Track custom event
export const trackEvent = (
  eventName: string,
  params?: Record<string, string | number | boolean>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
    console.log('[Analytics] Event tracked:', eventName, params);
  }
};

// Track page view
export const trackPageView = (pagePath: string, pageTitle: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
};

// Track booking button click
export const trackBookingClick = (location: string) => {
  trackEvent(ANALYTICS_EVENTS.BOOKING_BUTTON_CLICK, {
    button_location: location,
  });
};

// Track support group button click
export const trackGroupClick = (location: string) => {
  trackEvent(ANALYTICS_EVENTS.GROUP_BUTTON_CLICK, {
    button_location: location,
  });
};

// Track assessment started
export const trackAssessmentStarted = (assessmentType: string) => {
  trackEvent(ANALYTICS_EVENTS.ASSESSMENT_STARTED, {
    assessment_type: assessmentType,
  });
};

// Track assessment completed
export const trackAssessmentCompleted = (
  assessmentType: string,
  severity: string,
  score: number
) => {
  trackEvent(ANALYTICS_EVENTS.ASSESSMENT_COMPLETED, {
    assessment_type: assessmentType,
    severity: severity,
    score: score,
  });
};

// Track assessment skipped
export const trackAssessmentSkipped = (actionType: 'book' | 'group') => {
  trackEvent(ANALYTICS_EVENTS.ASSESSMENT_SKIPPED, {
    action_type: actionType,
  });
};

// Track booking form opened
export const trackBookingFormOpened = (hasAssessment: boolean) => {
  trackEvent(ANALYTICS_EVENTS.BOOKING_FORM_OPENED, {
    has_assessment: hasAssessment,
  });
};

// Track booking form submitted (conversion)
export const trackBookingSubmitted = (
  formType: 'book' | 'group',
  assessmentType?: string,
  severity?: string
) => {
  const eventName = formType === 'book' 
    ? ANALYTICS_EVENTS.BOOKING_FORM_SUBMITTED 
    : ANALYTICS_EVENTS.GROUP_FORM_SUBMITTED;
  
  trackEvent(eventName, {
    form_type: formType,
    has_assessment: !!assessmentType,
    assessment_type: assessmentType || 'none',
    severity: severity || 'none',
  });

  // Also track as a conversion event
  trackEvent('conversion', {
    conversion_type: formType === 'book' ? 'therapy_booking' : 'support_group_signup',
  });
};

// Track CTA click
export const trackCTAClick = (ctaName: string, ctaLocation: string) => {
  trackEvent(ANALYTICS_EVENTS.CTA_CLICK, {
    cta_name: ctaName,
    cta_location: ctaLocation,
  });
};

// Track WhatsApp click
export const trackWhatsAppClick = (context: string) => {
  trackEvent(ANALYTICS_EVENTS.WHATSAPP_CLICK, {
    context: context,
  });
};

// Track app download click
export const trackAppDownload = (platform: 'android' | 'ios' | 'web') => {
  trackEvent(ANALYTICS_EVENTS.APP_DOWNLOAD_CLICK, {
    platform: platform,
  });
};
