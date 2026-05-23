CREATE TABLE IF NOT EXISTS public.site_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL UNIQUE,
  is_visible boolean NOT NULL DEFAULT true,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site sections"
  ON public.site_sections FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert site sections"
  ON public.site_sections FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site sections"
  ON public.site_sections FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site sections"
  ON public.site_sections FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER site_sections_set_updated_at
  BEFORE UPDATE ON public.site_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed defaults
INSERT INTO public.site_sections (section_key, is_visible, data) VALUES
('trust_stats_bar', true, '{
  "items": [
    {"icon": "Globe", "value": "5+", "label": "Countries served"},
    {"icon": "Languages", "value": "8+", "label": "African languages"},
    {"icon": "Clock", "value": "24/7", "label": "Always available"},
    {"icon": "Shield", "value": "100%", "label": "Confidential"}
  ]
}'::jsonb),
('impact_counter', true, '{
  "eyebrow": "Our impact (updated monthly)",
  "title": "Real lives. Real change. Across Africa.",
  "items": [
    {"value": "5,200+", "label": "Sessions delivered"},
    {"value": "8,500+", "label": "People supported across Africa"},
    {"value": "25+", "label": "Organizations enrolled"}
  ]
}'::jsonb)
ON CONFLICT (section_key) DO NOTHING;