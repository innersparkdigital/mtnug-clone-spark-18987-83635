
-- Blog posts
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL DEFAULT '',
  category TEXT,
  hero_image_url TEXT,
  author TEXT DEFAULT 'InnerSpark Team',
  read_time TEXT,
  status TEXT NOT NULL DEFAULT 'draft', -- draft | scheduled | published
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blog posts"
  ON public.blog_posts FOR SELECT
  USING (status = 'published' AND (published_at IS NULL OR published_at <= now()));

CREATE POLICY "Content admins manage blog posts"
  ON public.blog_posts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'content_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'content_admin'));

CREATE TRIGGER blog_posts_updated
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Events
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT,
  body TEXT DEFAULT '',
  event_date DATE,
  hero_image_url TEXT,
  gallery TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published events"
  ON public.events FOR SELECT
  USING (status = 'published');

CREATE POLICY "Content admins manage events"
  ON public.events FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'content_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'content_admin'));

CREATE TRIGGER events_updated
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Allow content_admin to manage trainings too
DROP POLICY IF EXISTS "Admins can manage trainings" ON public.trainings;
CREATE POLICY "Admins manage trainings"
  ON public.trainings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'content_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'content_admin'));

-- Storage bucket for content images
INSERT INTO storage.buckets (id, name, public)
VALUES ('content-media', 'content-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view content media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'content-media');

CREATE POLICY "Content admins upload content media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'content-media' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'content_admin')));

CREATE POLICY "Content admins update content media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'content-media' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'content_admin')));

CREATE POLICY "Content admins delete content media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'content-media' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'content_admin')));
