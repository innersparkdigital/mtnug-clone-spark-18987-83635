CREATE TABLE public.kenya_page_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT,
  source TEXT,
  device_type TEXT,
  user_agent TEXT,
  referrer TEXT,
  path TEXT DEFAULT '/kenya',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.kenya_page_visits TO anon;
GRANT SELECT, INSERT ON public.kenya_page_visits TO authenticated;
GRANT ALL ON public.kenya_page_visits TO service_role;

ALTER TABLE public.kenya_page_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record a Kenya page visit"
  ON public.kenya_page_visits
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view Kenya page visits"
  ON public.kenya_page_visits
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_kenya_page_visits_created_at ON public.kenya_page_visits(created_at DESC);