
-- Whispers table
CREATE TABLE public.whispers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  public_token TEXT NOT NULL UNIQUE DEFAULT replace(gen_random_uuid()::text, '-', ''),
  email TEXT NOT NULL,
  audio_path TEXT NOT NULL,
  duration_seconds INTEGER,
  language TEXT DEFAULT 'en',
  topic_hint TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  reply_audio_path TEXT,
  reply_text TEXT,
  reply_sent_at TIMESTAMPTZ,
  replied_by UUID,
  user_agent TEXT,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_whispers_status ON public.whispers(status);
CREATE INDEX idx_whispers_created_at ON public.whispers(created_at DESC);

ALTER TABLE public.whispers ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (submit a whisper) - but typically done via edge function
CREATE POLICY "Anyone can submit a whisper"
  ON public.whispers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all whispers"
  ON public.whispers FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update whispers"
  ON public.whispers FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete whispers"
  ON public.whispers FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE TRIGGER trg_whispers_updated_at
  BEFORE UPDATE ON public.whispers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Public lookup by token (no auth needed)
CREATE OR REPLACE FUNCTION public.get_whisper_by_token(_token TEXT)
RETURNS JSON
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'public_token', w.public_token,
    'status', w.status,
    'reply_text', w.reply_text,
    'reply_audio_path', w.reply_audio_path,
    'reply_sent_at', w.reply_sent_at,
    'created_at', w.created_at,
    'duration_seconds', w.duration_seconds
  ) INTO result
  FROM public.whispers w
  WHERE w.public_token = _token;

  RETURN result;
END;
$$;

-- Private storage bucket for whispers
INSERT INTO storage.buckets (id, name, public)
VALUES ('whispers', 'whispers', false)
ON CONFLICT (id) DO NOTHING;

-- Admins can read whisper audio directly
CREATE POLICY "Admins can read whisper audio"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'whispers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload whisper audio"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'whispers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete whisper audio"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'whispers' AND public.has_role(auth.uid(), 'admin'));
