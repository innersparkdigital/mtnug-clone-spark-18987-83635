
-- Add AI/analytics columns to whispers
ALTER TABLE public.whispers
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS ai_sentiment text,
  ADD COLUMN IF NOT EXISTS ai_urgency text,
  ADD COLUMN IF NOT EXISTS ai_theme text,
  ADD COLUMN IF NOT EXISTS ai_crisis boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS ai_language_detected text,
  ADD COLUMN IF NOT EXISTS ai_summary text,
  ADD COLUMN IF NOT EXISTS ai_analyzed_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_whispers_email_lower ON public.whispers (lower(email));
CREATE INDEX IF NOT EXISTS idx_whispers_ai_crisis ON public.whispers (ai_crisis) WHERE ai_crisis = true;
CREATE INDEX IF NOT EXISTS idx_whispers_replied_by ON public.whispers (replied_by);

-- Events table for engagement tracking
CREATE TABLE IF NOT EXISTS public.whisper_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  whisper_id uuid NOT NULL REFERENCES public.whispers(id) ON DELETE CASCADE,
  event_type text NOT NULL, -- 'reply_opened' | 'audio_played' | 'cta_book' | 'cta_talk'
  user_agent text,
  referrer text,
  country text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_whisper_events_whisper ON public.whisper_events (whisper_id);
CREATE INDEX IF NOT EXISTS idx_whisper_events_type ON public.whisper_events (event_type);
CREATE INDEX IF NOT EXISTS idx_whisper_events_created ON public.whisper_events (created_at DESC);

ALTER TABLE public.whisper_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert whisper events"
  ON public.whisper_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins view whisper events"
  ON public.whisper_events FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete whisper events"
  ON public.whisper_events FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
