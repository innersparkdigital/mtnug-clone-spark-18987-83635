ALTER TABLE public.doctors
  ADD COLUMN IF NOT EXISTS credentials_email_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS credentials_email_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS credentials_email_error text;

CREATE INDEX IF NOT EXISTS idx_doctors_credentials_email_status ON public.doctors(credentials_email_status);