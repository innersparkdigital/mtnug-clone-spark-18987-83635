CREATE TABLE IF NOT EXISTS public.corporate_screening_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  employee_count INTEGER,
  preferred_date DATE,
  preferred_format TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.corporate_screening_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can submit screening bookings"
  ON public.corporate_screening_bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view screening bookings"
  ON public.corporate_screening_bookings FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update screening bookings"
  ON public.corporate_screening_bookings FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete screening bookings"
  ON public.corporate_screening_bookings FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_corporate_screening_bookings_updated_at
  BEFORE UPDATE ON public.corporate_screening_bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_corporate_screening_bookings_created_at
  ON public.corporate_screening_bookings(created_at DESC);