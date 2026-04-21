
-- Doctors table (separate from auth.users; phone is the primary identifier)
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  facility TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_doctors_phone ON public.doctors(phone);
CREATE INDEX idx_doctors_user_id ON public.doctors(user_id);

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can view their own profile"
  ON public.doctors FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Doctors can insert their own profile"
  ON public.doctors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Doctors can update their own profile"
  ON public.doctors FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all doctors"
  ON public.doctors FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Public RPC to check if a phone is registered (so login form can find email)
CREATE OR REPLACE FUNCTION public.get_doctor_email_by_phone(_phone TEXT)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM public.doctors WHERE phone = _phone LIMIT 1;
$$;

-- Referrals table
CREATE TABLE public.doctor_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  doctor_name TEXT NOT NULL,
  doctor_phone TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  location TEXT,
  concern TEXT,
  preferred_mode TEXT NOT NULL DEFAULT 'virtual' CHECK (preferred_mode IN ('virtual','physical')),
  consent_confirmed BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','booked','completed','no_response')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_referrals_doctor_id ON public.doctor_referrals(doctor_id);
CREATE INDEX idx_referrals_status ON public.doctor_referrals(status);
CREATE INDEX idx_referrals_created_at ON public.doctor_referrals(created_at DESC);

ALTER TABLE public.doctor_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can insert their own referrals"
  ON public.doctor_referrals FOR INSERT
  TO authenticated
  WITH CHECK (
    doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid())
  );

CREATE POLICY "Doctors can view their own referrals"
  ON public.doctor_referrals FOR SELECT
  TO authenticated
  USING (
    doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can view all referrals"
  ON public.doctor_referrals FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update referrals"
  ON public.doctor_referrals FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete referrals"
  ON public.doctor_referrals FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Updated_at triggers
CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctor_referrals_updated_at
  BEFORE UPDATE ON public.doctor_referrals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
