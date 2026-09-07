ALTER TABLE public.therapist_clients
  ADD COLUMN IF NOT EXISTS session_type_needs_review boolean NOT NULL DEFAULT false;