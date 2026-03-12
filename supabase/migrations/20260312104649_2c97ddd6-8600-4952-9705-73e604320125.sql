
-- Mind Check Analytics: assessment sessions tracking
CREATE TABLE public.assessment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  test_type TEXT NOT NULL,
  source TEXT DEFAULT 'website',
  device_type TEXT DEFAULT 'desktop',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  abandoned_at TIMESTAMP WITH TIME ZONE,
  last_question_reached INTEGER DEFAULT 0,
  total_questions INTEGER NOT NULL,
  score INTEGER,
  max_score INTEGER,
  severity_level TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Mind Check Analytics: email collection after test completion
CREATE TABLE public.assessment_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  email TEXT NOT NULL,
  test_type TEXT NOT NULL,
  severity_level TEXT,
  score INTEGER,
  source TEXT DEFAULT 'website',
  device_type TEXT DEFAULT 'desktop',
  consent_given BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Mind Check Analytics: page visit tracking
CREATE TABLE public.mindcheck_page_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  source TEXT DEFAULT 'website',
  device_type TEXT DEFAULT 'desktop',
  user_agent TEXT,
  referrer TEXT,
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mindcheck_page_visits ENABLE ROW LEVEL SECURITY;

-- Public insert policies (anonymous tracking, no auth required)
CREATE POLICY "Anyone can insert assessment sessions"
ON public.assessment_sessions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can update assessment sessions"
ON public.assessment_sessions FOR UPDATE
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can view assessment sessions"
ON public.assessment_sessions FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert assessment emails"
ON public.assessment_emails FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view assessment emails"
ON public.assessment_emails FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert page visits"
ON public.mindcheck_page_visits FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view page visits"
ON public.mindcheck_page_visits FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));
