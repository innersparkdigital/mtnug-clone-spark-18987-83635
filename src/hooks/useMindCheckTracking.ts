import { useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const generateSessionId = () => {
  return `mc_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

const getDeviceType = (): string => {
  const ua = navigator.userAgent;
  if (/Mobi|Android/i.test(ua)) return 'mobile';
  if (/Tablet|iPad/i.test(ua)) return 'tablet';
  return 'desktop';
};

const getSource = (searchParams: URLSearchParams): string => {
  const sourceParam = searchParams.get('source');
  if (sourceParam) return sourceParam; // e.g. 'app', 'social', etc.
  
  const ref = document.referrer;
  if (!ref) return 'direct';
  if (ref.includes('facebook.com') || ref.includes('twitter.com') || ref.includes('instagram.com') || ref.includes('linkedin.com') || ref.includes('tiktok.com')) return 'social';
  if (ref.includes('innersparkafrica.com')) return 'internal';
  if (ref.includes('google.') || ref.includes('bing.') || ref.includes('yahoo.')) return 'search';
  return 'referral';
};

// Track Mind Check page visit
export const usePageVisitTracking = () => {
  const [searchParams] = useSearchParams();
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    const sessionId = generateSessionId();
    const source = getSource(searchParams);
    const deviceType = getDeviceType();

    supabase.from('mindcheck_page_visits').insert({
      session_id: sessionId,
      source,
      device_type: deviceType,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
    } as any).then(() => {});
  }, [searchParams]);
};

// Track individual assessment session
export const useAssessmentTracking = (testType: string, totalQuestions: number) => {
  const [searchParams] = useSearchParams();
  const sessionIdRef = useRef<string | null>(null);
  const source = getSource(searchParams);
  const deviceType = getDeviceType();

  const trackStart = useCallback(() => {
    const sessionId = generateSessionId();
    sessionIdRef.current = sessionId;

    supabase.from('assessment_sessions').insert({
      session_id: sessionId,
      test_type: testType,
      source,
      device_type: deviceType,
      total_questions: totalQuestions,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
    } as any).then(() => {});

    return sessionId;
  }, [testType, totalQuestions, source, deviceType]);

  const trackProgress = useCallback((questionIndex: number) => {
    if (!sessionIdRef.current) return;
    supabase.from('assessment_sessions')
      .update({ last_question_reached: questionIndex + 1 } as any)
      .eq('session_id', sessionIdRef.current)
      .then(() => {});
  }, []);

  const trackCompletion = useCallback((score: number, maxScore: number, severityLevel: string) => {
    if (!sessionIdRef.current) return;
    supabase.from('assessment_sessions')
      .update({
        completed_at: new Date().toISOString(),
        score,
        max_score: maxScore,
        severity_level: severityLevel,
        last_question_reached: totalQuestions,
      } as any)
      .eq('session_id', sessionIdRef.current)
      .then(() => {});
  }, [totalQuestions]);

  const trackAbandonment = useCallback(() => {
    if (!sessionIdRef.current) return;
    supabase.from('assessment_sessions')
      .update({ abandoned_at: new Date().toISOString() } as any)
      .eq('session_id', sessionIdRef.current)
      .then(() => {});
  }, []);

  const submitEmail = useCallback(async (email: string, severityLevel: string, score: number) => {
    const sessionId = sessionIdRef.current || generateSessionId();
    // 1. Save consent + record
    await supabase.from('assessment_emails').insert({
      session_id: sessionId,
      email,
      test_type: testType,
      severity_level: severityLevel,
      score,
      source,
      device_type: deviceType,
      consent_given: true,
    } as any);

    // 2. Send branded results email (non-blocking)
    try {
      await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'mindcheck-results',
          recipientEmail: email,
          idempotencyKey: `mindcheck-${sessionId}`,
          templateData: {
            test_title: testType,
            score,
            severity_level: severityLevel,
          },
        },
      });
    } catch (e) {
      console.error('mindcheck-results email failed', e);
    }
  }, [testType, source, deviceType]);

  return {
    sessionId: sessionIdRef.current,
    trackStart,
    trackProgress,
    trackCompletion,
    trackAbandonment,
    submitEmail,
  };
};
