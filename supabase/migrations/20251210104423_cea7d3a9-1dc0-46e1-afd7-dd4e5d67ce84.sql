-- Create storage bucket for specialist photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('specialist-photos', 'specialist-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for public read access
CREATE POLICY "Anyone can view specialist photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'specialist-photos');

-- Create storage policy for authenticated upload (admin only in future)
CREATE POLICY "Admins can upload specialist photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'specialist-photos');