
-- 1. Extend corporate_companies
ALTER TABLE public.corporate_companies
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS slug_locked boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS campaign_headline text,
  ADD COLUMN IF NOT EXISTS campaign_subtext text,
  ADD COLUMN IF NOT EXISTS campaign_close_date timestamptz,
  ADD COLUMN IF NOT EXISTS languages_enabled text[] NOT NULL DEFAULT ARRAY['en']::text[],
  ADD COLUMN IF NOT EXISTS mode text NOT NULL DEFAULT 'corporate',
  ADD COLUMN IF NOT EXISTS incentive_amount_ugx integer NOT NULL DEFAULT 0;

-- Slug generation helper
CREATE OR REPLACE FUNCTION public.slugify_company_name(_name text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(coalesce(_name, ''), '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
$$;

-- Backfill slugs for existing companies (with -2/-3 suffix on collisions)
DO $$
DECLARE
  r RECORD;
  base_slug text;
  candidate text;
  n int;
BEGIN
  FOR r IN SELECT id, name FROM public.corporate_companies WHERE slug IS NULL LOOP
    base_slug := substring(public.slugify_company_name(r.name) FROM 1 FOR 50);
    IF base_slug = '' OR base_slug IS NULL THEN
      base_slug := 'company-' || substring(r.id::text FROM 1 FOR 8);
    END IF;
    candidate := base_slug;
    n := 2;
    WHILE EXISTS (SELECT 1 FROM public.corporate_companies WHERE slug = candidate) LOOP
      candidate := base_slug || '-' || n;
      n := n + 1;
    END LOOP;
    UPDATE public.corporate_companies SET slug = candidate WHERE id = r.id;
  END LOOP;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS corporate_companies_slug_unique ON public.corporate_companies(slug) WHERE slug IS NOT NULL;

-- 2. FAQ analytics table
CREATE TABLE IF NOT EXISTS public.campaign_faq_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid,
  session_id text NOT NULL,
  event_type text NOT NULL,
  item_index integer,
  language text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS campaign_faq_events_company_idx ON public.campaign_faq_events(company_id);
CREATE INDEX IF NOT EXISTS campaign_faq_events_session_idx ON public.campaign_faq_events(session_id);

ALTER TABLE public.campaign_faq_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log faq events"
  ON public.campaign_faq_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view faq events"
  ON public.campaign_faq_events FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 3. Public-safe RPC: get campaign by slug
CREATE OR REPLACE FUNCTION public.get_campaign_by_slug(_slug text)
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'id', c.id,
    'name', c.name,
    'slug', c.slug,
    'logo_url', c.logo_url,
    'campaign_headline', c.campaign_headline,
    'campaign_subtext', c.campaign_subtext,
    'campaign_close_date', c.campaign_close_date,
    'languages_enabled', c.languages_enabled,
    'mode', c.mode,
    'incentive_amount_ugx', c.incentive_amount_ugx,
    'employee_count', c.employee_count
  ) INTO result
  FROM public.corporate_companies c
  WHERE c.slug = _slug
  LIMIT 1;
  RETURN result;
END;
$$;

-- 4. Completion count for progress bar
CREATE OR REPLACE FUNCTION public.get_campaign_completion(_company_id uuid)
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_count int;
  completed_count int;
BEGIN
  SELECT count(*) INTO total_count FROM public.corporate_employees WHERE company_id = _company_id;
  SELECT count(*) INTO completed_count FROM public.corporate_employees WHERE company_id = _company_id AND screening_completed = true;
  RETURN json_build_object('total', total_count, 'completed', completed_count);
END;
$$;

-- 5. Lock the slug on first public access
CREATE OR REPLACE FUNCTION public.lock_campaign_slug(_slug text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.corporate_companies SET slug_locked = true WHERE slug = _slug AND slug_locked = false;
$$;

-- 6. Storage bucket for company logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logos', 'company-logos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view company logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'company-logos');

CREATE POLICY "Admins can upload company logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'company-logos' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update company logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'company-logos' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete company logos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'company-logos' AND public.has_role(auth.uid(), 'admin'::app_role));
