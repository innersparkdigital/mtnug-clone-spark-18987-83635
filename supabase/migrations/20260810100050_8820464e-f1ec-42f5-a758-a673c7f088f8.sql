DROP POLICY IF EXISTS "Admins can upload specialist photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload certificates" ON storage.objects;

CREATE POLICY "Admins can upload specialist photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'specialist-photos' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update specialist photos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'specialist-photos' AND public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'specialist-photos' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can upload certificates"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'specialist-certificates' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update certificates"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'specialist-certificates' AND public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'specialist-certificates' AND public.has_role(auth.uid(), 'admin'::app_role));