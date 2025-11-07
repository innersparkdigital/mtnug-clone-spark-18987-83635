-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false);

-- Storage policies (RLS is already enabled on storage.objects by Supabase)
-- Allow anyone to upload resumes
CREATE POLICY "Anyone can upload resumes"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'resumes');

-- Allow users to view resumes
CREATE POLICY "Users can view resumes"
ON storage.objects
FOR SELECT
USING (bucket_id = 'resumes');

-- Add country field to career_applications table
ALTER TABLE public.career_applications
ADD COLUMN country TEXT NOT NULL DEFAULT 'Uganda';