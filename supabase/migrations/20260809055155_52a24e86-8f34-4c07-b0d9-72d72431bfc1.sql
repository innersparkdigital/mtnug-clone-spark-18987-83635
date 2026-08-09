-- 1. Assessment sessions: remove blanket public UPDATE
DROP POLICY IF EXISTS "Anyone can update assessment sessions" ON public.assessment_sessions;

CREATE OR REPLACE FUNCTION public.track_assessment_progress(p_session_id text, p_last_question integer)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.assessment_sessions
     SET last_question_reached = p_last_question
   WHERE session_id = p_session_id
     AND completed_at IS NULL
     AND started_at > now() - interval '24 hours';
$$;

CREATE OR REPLACE FUNCTION public.track_assessment_completion(p_session_id text, p_score integer, p_max_score integer, p_severity_level text, p_total_questions integer)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.assessment_sessions
     SET completed_at = now(),
         score = p_score,
         max_score = p_max_score,
         severity_level = p_severity_level,
         last_question_reached = p_total_questions
   WHERE session_id = p_session_id
     AND completed_at IS NULL
     AND started_at > now() - interval '24 hours';
$$;

CREATE OR REPLACE FUNCTION public.track_assessment_abandonment(p_session_id text)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.assessment_sessions
     SET abandoned_at = now()
   WHERE session_id = p_session_id
     AND completed_at IS NULL
     AND abandoned_at IS NULL
     AND started_at > now() - interval '24 hours';
$$;

-- 2. WHO-5 sessions: remove blanket public UPDATE
DROP POLICY IF EXISTS "Anyone can update WHO-5 sessions" ON public.who5_sessions;

CREATE OR REPLACE FUNCTION public.track_who5_progress(p_session_id text, p_last_question integer)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.who5_sessions
     SET last_question_reached = p_last_question
   WHERE session_id = p_session_id
     AND completed_at IS NULL
     AND started_at > now() - interval '24 hours';
$$;

CREATE OR REPLACE FUNCTION public.track_who5_completion(p_session_id text, p_raw_score integer, p_percentage_score integer, p_wellbeing_level text, p_time_taken_seconds integer)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.who5_sessions
     SET completed_at = now(),
         raw_score = p_raw_score,
         percentage_score = p_percentage_score,
         wellbeing_level = p_wellbeing_level,
         time_taken_seconds = p_time_taken_seconds,
         last_question_reached = 5
   WHERE session_id = p_session_id
     AND completed_at IS NULL
     AND started_at > now() - interval '24 hours';
$$;

CREATE OR REPLACE FUNCTION public.track_who5_abandonment(p_session_id text)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.who5_sessions
     SET abandoned_at = now()
   WHERE session_id = p_session_id
     AND completed_at IS NULL
     AND abandoned_at IS NULL
     AND started_at > now() - interval '24 hours';
$$;

-- 3. Chat sessions: all writes happen in the ai-chat edge function (service role)
DROP POLICY IF EXISTS "Anyone can update own session metadata" ON public.chat_sessions;

-- 4. Corporate companies: stop exposing contact details publicly
DROP POLICY IF EXISTS "Anyone can view companies" ON public.corporate_companies;

CREATE OR REPLACE FUNCTION public.get_company_public(p_company_id uuid)
RETURNS TABLE(name text, slug text) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT c.name, c.slug FROM public.corporate_companies c WHERE c.id = p_company_id;
$$;

GRANT EXECUTE ON FUNCTION public.track_assessment_progress(text, integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_assessment_completion(text, integer, integer, text, integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_assessment_abandonment(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_who5_progress(text, integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_who5_completion(text, integer, integer, text, integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_who5_abandonment(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_company_public(uuid) TO anon, authenticated;