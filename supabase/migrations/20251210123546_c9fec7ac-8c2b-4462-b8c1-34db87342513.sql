-- Create storage bucket for specialist certificates
INSERT INTO storage.buckets (id, name, public)
VALUES ('specialist-certificates', 'specialist-certificates', true);

-- Create policy to allow public reading of certificates
CREATE POLICY "Anyone can view certificates"
ON storage.objects FOR SELECT
USING (bucket_id = 'specialist-certificates');

-- Create policy to allow authenticated users to upload certificates (admin use)
CREATE POLICY "Admins can upload certificates"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'specialist-certificates');

-- Create table to track specialist certificates
CREATE TABLE public.specialist_certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  specialist_id UUID NOT NULL REFERENCES public.specialists(id) ON DELETE CASCADE,
  certificate_name TEXT NOT NULL,
  certificate_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.specialist_certificates ENABLE ROW LEVEL SECURITY;

-- Anyone can view certificates
CREATE POLICY "Anyone can view specialist certificates"
ON public.specialist_certificates FOR SELECT
USING (true);