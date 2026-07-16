
ALTER TABLE public.chat_sessions
  ADD COLUMN IF NOT EXISTS qualification jsonb,
  ADD COLUMN IF NOT EXISTS pricing_response text,
  ADD COLUMN IF NOT EXISTS booked_outcome text,
  ADD COLUMN IF NOT EXISTS page_context text;
