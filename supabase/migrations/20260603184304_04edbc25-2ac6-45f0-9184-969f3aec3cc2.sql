-- Allow admins to view & manage all specialists (including inactive) and write changes
CREATE POLICY "Admins view all specialists"
ON public.specialists FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage specialists"
ON public.specialists FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.specialists TO authenticated;