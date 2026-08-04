ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS meta_title text,
  ADD COLUMN IF NOT EXISTS canonical_url text,
  ADD COLUMN IF NOT EXISTS og_title text,
  ADD COLUMN IF NOT EXISTS og_description text,
  ADD COLUMN IF NOT EXISTS og_image_url text,
  ADD COLUMN IF NOT EXISTS faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS related_service_url text,
  ADD COLUMN IF NOT EXISTS schema_type text NOT NULL DEFAULT 'Article',
  ADD COLUMN IF NOT EXISTS last_updated_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS redirect_from_slug text;

CREATE UNIQUE INDEX IF NOT EXISTS blog_posts_redirect_from_slug_key
  ON public.blog_posts (redirect_from_slug)
  WHERE redirect_from_slug IS NOT NULL;