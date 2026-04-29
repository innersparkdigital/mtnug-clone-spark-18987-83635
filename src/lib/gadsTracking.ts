// Google Ads Conversion Tracking - AW-11330697005
// Funnel-based conversion events with value attribution

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

const gtagEvent = (eventName: string, params: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
    console.log('[Google Ads] Event:', eventName, params);
  }
};

// ─── Deduplication guard ───
const firedEvents = new Set<string>();

const fireOnce = (key: string, eventName: string, params: Record<string, unknown>) => {
  if (firedEvents.has(key)) return;
  firedEvents.add(key);
  gtagEvent(eventName, params);
};

// ─── TOP FUNNEL: Interest Stage ───

/** Mood Check-in (Daily Engagement) */
export const trackGadsMoodCheckin = () => {
  // Allow once per page session
  fireOnce('mood_checkin', 'mood_checkin', {
    value: 500,
    currency: 'UGX',
  });
};

// ─── MID FUNNEL: Consideration Stage ───

/** Assessment Completed */
export const trackGadsAssessmentCompleted = (assessmentType: string, severity: string, score: number) => {
  fireOnce(`assessment_completed_${assessmentType}`, 'assessment_completed', {
    value: 3000,
    currency: 'UGX',
    assessment_type: assessmentType,
    severity,
    score,
  });
};

/** WhatsApp Click (Lead Intent) */
export const trackGadsWhatsAppClick = (context: string) => {
  // Allow multiple WhatsApp clicks but dedupe rapid doubles
  const key = `whatsapp_click_${context}_${Math.floor(Date.now() / 5000)}`;
  fireOnce(key, 'whatsapp_click', {
    value: 5000,
    currency: 'UGX',
    event_category: 'lead',
    event_label: 'whatsapp_contact',
    context,
  });
};

// ─── BOTTOM FUNNEL: Conversion Stage ───

/** Appointment Booking - PRIMARY CONVERSION */
export const trackGadsBookingConversion = (formType: string, assessmentType?: string) => {
  fireOnce(`booking_${formType}_${Date.now()}`, 'ads_conversion_Book_appointment_1', {
    value: 50000,
    currency: 'UGX',
    form_type: formType,
    assessment_type: assessmentType || 'none',
  });
};

// ─── AUDIENCE SEGMENTATION ───

export const trackGadsUserSegment = (userType: 'student' | 'corporate' | 'individual') => {
  fireOnce(`user_segment_${userType}`, 'user_segment', {
    user_type: userType,
  });
};

// ─── ENHANCED TRACKING ───

/** Track assessment time spent */
export const trackGadsAssessmentDuration = (assessmentType: string, durationSeconds: number) => {
  gtagEvent('assessment_duration', {
    assessment_type: assessmentType,
    duration_seconds: durationSeconds,
  });
};

/** Track assessment drop-off */
export const trackGadsAssessmentDropoff = (assessmentType: string, lastQuestion: number, totalQuestions: number) => {
  gtagEvent('assessment_dropoff', {
    assessment_type: assessmentType,
    last_question: lastQuestion,
    total_questions: totalQuestions,
    completion_percentage: Math.round((lastQuestion / totalQuestions) * 100),
  });
};

/** Track WHO-5 wellbeing completion */
export const trackGadsWellbeingCompleted = (percentage: number, level: string) => {
  fireOnce('wellbeing_completed', 'assessment_completed', {
    value: 3000,
    currency: 'UGX',
    assessment_type: 'who5_wellbeing',
    severity: level,
    score: percentage,
  });
};

/** Reset dedup for new page session (call on route change if needed) */
export const resetGadsDedup = () => {
  firedEvents.clear();
};

// ─── THANK-YOU PAGE CONVERSIONS ───
// Fired when a user lands on a /thank-you-* page after a successful action.
// Each conversion type has a unique URL for Google Ads conversion tracking.
export type ThankYouConversionType =
  | 'booking'
  | 'contact'
  | 'corporate'
  | 'referral'
  | 'newsletter'
  | 'download';

const conversionValues: Record<ThankYouConversionType, number> = {
  booking: 75000,
  contact: 5000,
  corporate: 25000,
  referral: 15000,
  newsletter: 1000,
  download: 2000,
};

export const trackGadsThankYouConversion = (
  type: ThankYouConversionType,
  meta?: Record<string, unknown>,
) => {
  const eventName = `ads_conversion_${type}`;
  // Allow once per type per page-session
  fireOnce(`thankyou_${type}`, eventName, {
    value: conversionValues[type],
    currency: 'UGX',
    conversion_type: type,
    ...(meta || {}),
  });
  // Also fire a generic GA4 event
  gtagEvent('conversion_completed', {
    conversion_type: type,
    value: conversionValues[type],
    currency: 'UGX',
    ...(meta || {}),
  });
};
