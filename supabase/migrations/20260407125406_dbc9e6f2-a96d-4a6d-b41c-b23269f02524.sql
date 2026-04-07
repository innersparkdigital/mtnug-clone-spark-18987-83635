CREATE POLICY "Admins can delete training registrations"
ON public.training_registrations
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));