
CREATE TABLE public.backlinks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_url TEXT NOT NULL,
  source_domain TEXT NOT NULL,
  target_url TEXT NOT NULL,
  anchor_text TEXT,
  link_type TEXT NOT NULL DEFAULT 'dofollow',
  status TEXT NOT NULL DEFAULT 'prospect',
  domain_authority INTEGER,
  category TEXT,
  contact_name TEXT,
  contact_email TEXT,
  outreach_date DATE,
  acquired_date DATE,
  last_checked_at TIMESTAMPTZ,
  is_live BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_backlinks_status ON public.backlinks(status);
CREATE INDEX idx_backlinks_domain ON public.backlinks(source_domain);
CREATE INDEX idx_backlinks_is_live ON public.backlinks(is_live);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.backlinks TO authenticated;
GRANT ALL ON public.backlinks TO service_role;

ALTER TABLE public.backlinks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view backlinks"
  ON public.backlinks FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert backlinks"
  ON public.backlinks FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update backlinks"
  ON public.backlinks FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete backlinks"
  ON public.backlinks FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_backlinks_updated_at
  BEFORE UPDATE ON public.backlinks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
