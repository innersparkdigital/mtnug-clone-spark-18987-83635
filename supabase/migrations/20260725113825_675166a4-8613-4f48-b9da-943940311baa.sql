
-- RLS for receipts bucket
CREATE POLICY "Admins can read receipts"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'receipts' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload receipts"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'receipts' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update receipts"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'receipts' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete receipts"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'receipts' AND public.has_role(auth.uid(), 'admin'));
