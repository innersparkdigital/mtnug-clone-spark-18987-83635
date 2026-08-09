import { useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const generateSessionId = () => `who5_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

const getDeviceType = (): string => {
  const ua = navigator.userAgent;
  if (/Mobi|Android/i.test(ua)) return 'mobile';
  if (/Tablet|iPad/i.test(ua)) return 'tablet';
  return 'desktop';
};

const getSource = (searchParams: URLSearchParams): string => {
  const sourceParam = searchParams.get('source');
  if (sourceParam) return sourceParam;
  const ref = document.referrer;
  if (!ref) return 'direct';
  if (ref.includes('facebook.com') || ref.includes('twitter.com') || ref.includes('instagram.com') || ref.includes('linkedin.com') || ref.includes('tiktok.com')) return 'social';
  if (ref.includes('innersparkafrica.com')) return 'internal';
  if (ref.includes('google.') || ref.includes('bing.') || ref.includes('yahoo.')) return 'search';
  return 'referral';
};

export const useWho5Tracking = () => {
  const [searchParams] = useSearchParams();
  const sessionIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(0);
  const source = getSource(searchParams);
  const deviceType = getDeviceType();

  const trackStart = useCallback(() => {
    const sessionId = generateSessionId();
    sessionIdRef.current = sessionId;
    startTimeRef.current = Date.now();

    supabase.from('who5_sessions').insert({
      session_id: sessionId,
      source,
      device_type: deviceType,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
    } as any).then(() => {});

    return sessionId;
  }, [source, deviceType]);

  const trackProgress = useCallback((questionIndex: number) => {
    if (!sessionIdRef.current) return;
    (supabase.rpc as any)('track_who5_progress', {
      p_session_id: sessionIdRef.current,
      p_last_question: questionIndex + 1,
    }).then(() => {});
  }, []);

  const trackCompletion = useCallback((rawScore: number, percentageScore: number, wellbeingLevel: string) => {
    if (!sessionIdRef.current) return;
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
    (supabase.rpc as any)('track_who5_completion', {
      p_session_id: sessionIdRef.current,
      p_raw_score: rawScore,
      p_percentage_score: percentageScore,
      p_wellbeing_level: wellbeingLevel,
      p_time_taken_seconds: timeTaken,
    }).then(() => {});
  }, []);

  const trackAbandonment = useCallback(() => {
    if (!sessionIdRef.current) return;
    (supabase.rpc as any)('track_who5_abandonment', {
      p_session_id: sessionIdRef.current,
    }).then(() => {});
  }, []);

  const trackCtaClick = useCallback((ctaType: string) => {
    supabase.from('who5_cta_clicks').insert({
      session_id: sessionIdRef.current || 'unknown',
      cta_type: ctaType,
      source,
      device_type: deviceType,
    } as any).then(() => {});
  }, [source, deviceType]);

  return {
    sessionId: sessionIdRef.current,
    trackStart,
    trackProgress,
    trackCompletion,
    trackAbandonment,
    trackCtaClick,
  };
};
