
-- WHO-5 Wellbeing screening sessions
CREATE TABLE public.who5_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  source text DEFAULT 'website',
  device_type text DEFAULT 'desktop',
  user_agent text,
  referrer text,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  abandoned_at timestamptz,
  last_question_reached integer DEFAULT 0,
  raw_score integer,
  percentage_score integer,
  wellbeing_level text,
  time_taken_seconds integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.who5_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert WHO-5 sessions"
ON public.who5_sessions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can update WHO-5 sessions"
ON public.who5_sessions FOR UPDATE
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can view WHO-5 sessions"
ON public.who5_sessions FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- WHO-5 CTA click tracking
CREATE TABLE public.who5_cta_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  cta_type text NOT NULL,
  source text DEFAULT 'website',
  device_type text DEFAULT 'desktop',
  clicked_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.who5_cta_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert CTA clicks"
ON public.who5_cta_clicks FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view CTA clicks"
ON public.who5_cta_clicks FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Enable realtime for live dashboard
ALTER PUBLICATION supabase_realtime ADD TABLE public.who5_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.who5_cta_clicks;
