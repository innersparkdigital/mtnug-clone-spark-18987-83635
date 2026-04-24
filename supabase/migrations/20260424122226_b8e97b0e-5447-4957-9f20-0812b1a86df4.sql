-- Allow admins to deactivate doctor accounts without deleting them
ALTER TABLE public.doctors
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS deactivated_at timestamptz,
  ADD COLUMN IF NOT EXISTS deactivated_reason text;

CREATE INDEX IF NOT EXISTS idx_doctors_is_active ON public.doctors (is_active);