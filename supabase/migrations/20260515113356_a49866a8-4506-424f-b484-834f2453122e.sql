
-- Therapist license status enum
DO $$ BEGIN
  CREATE TYPE public.therapist_license_status AS ENUM ('verified', 'pending', 'suspended');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.therapist_platform_status AS ENUM ('active', 'inactive', 'suspended', 'removed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.therapists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  photo_url TEXT,
  specialisations TEXT[] NOT NULL DEFAULT '{}',
  qualification TEXT,
  license_number TEXT,
  licensing_body TEXT,
  years_experience INTEGER DEFAULT 0,
  bio TEXT,
  languages TEXT[] NOT NULL DEFAULT '{}',
  session_types TEXT[] NOT NULL DEFAULT '{}',
  availability TEXT[] NOT NULL DEFAULT '{}',
  license_status public.therapist_license_status NOT NULL DEFAULT 'pending',
  platform_status public.therapist_platform_status NOT NULL DEFAULT 'active',
  session_count INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  suspension_reason TEXT,
  suspension_review_date DATE,
  removed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage therapists"
ON public.therapists FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view active therapists"
ON public.therapists FOR SELECT TO anon, authenticated
USING (platform_status = 'active');

CREATE TRIGGER update_therapists_updated_at
BEFORE UPDATE ON public.therapists
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for therapist photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('therapist-photos', 'therapist-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Therapist photos are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'therapist-photos');

CREATE POLICY "Admins can upload therapist photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'therapist-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update therapist photos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'therapist-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete therapist photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'therapist-photos' AND public.has_role(auth.uid(), 'admin'));
