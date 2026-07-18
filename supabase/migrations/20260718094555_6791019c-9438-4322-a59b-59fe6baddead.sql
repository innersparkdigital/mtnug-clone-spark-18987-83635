
-- ============ 1. therapist_session_feedback ============
DO $$ BEGIN
  CREATE TYPE public.session_progress_status AS ENUM (
    'progressing_well','steady','needs_more_support','at_risk','crisis_activated'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.therapist_session_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id UUID NOT NULL REFERENCES public.therapist_accounts(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.therapist_clients(id) ON DELETE CASCADE,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_new_client BOOLEAN NOT NULL DEFAULT false,
  service_delivered TEXT NOT NULL,
  duration TEXT NOT NULL,
  homework_given BOOLEAN NOT NULL DEFAULT false,
  homework_text TEXT,
  progress_status public.session_progress_status NOT NULL DEFAULT 'steady',
  next_appt_booked TEXT NOT NULL DEFAULT 'tbc',
  next_appt_date DATE,
  next_appt_service TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.therapist_session_feedback TO authenticated;
GRANT ALL ON public.therapist_session_feedback TO service_role;
ALTER TABLE public.therapist_session_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "therapist manages own session feedback"
ON public.therapist_session_feedback FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.therapist_accounts ta
          WHERE ta.id = therapist_id AND ta.user_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.therapist_accounts ta
          WHERE ta.id = therapist_id AND ta.user_id = auth.uid())
);

CREATE POLICY "admins view all session feedback"
ON public.therapist_session_feedback FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_tsf_client ON public.therapist_session_feedback(client_id, session_date DESC);
CREATE INDEX IF NOT EXISTS idx_tsf_therapist ON public.therapist_session_feedback(therapist_id, session_date DESC);

CREATE TRIGGER update_tsf_updated_at
BEFORE UPDATE ON public.therapist_session_feedback
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ 2. submission_reactions ============
CREATE TABLE IF NOT EXISTS public.submission_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.tool_submissions(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES public.therapist_accounts(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.therapist_clients(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  note TEXT,
  seen_by_client BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT reaction_note_len CHECK (note IS NULL OR char_length(note) <= 100)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.submission_reactions TO authenticated;
GRANT ALL ON public.submission_reactions TO service_role;
ALTER TABLE public.submission_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "therapist manages own reactions"
ON public.submission_reactions FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.therapist_accounts ta
          WHERE ta.id = therapist_id AND ta.user_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.therapist_accounts ta
          WHERE ta.id = therapist_id AND ta.user_id = auth.uid())
);

CREATE POLICY "admins view all reactions"
ON public.submission_reactions FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_reactions_submission ON public.submission_reactions(submission_id);
CREATE INDEX IF NOT EXISTS idx_reactions_client ON public.submission_reactions(client_id, created_at DESC);

-- ============ 3. client_reminder_log ============
CREATE TABLE IF NOT EXISTS public.client_reminder_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.therapist_clients(id) ON DELETE CASCADE,
  assignment_tool_id UUID REFERENCES public.assignment_tools(id) ON DELETE CASCADE,
  sent_for_date DATE NOT NULL,
  kind TEXT NOT NULL, -- 'daily_task' | 'weekly_summary' | 'reaction'
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (client_id, assignment_tool_id, sent_for_date, kind)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_reminder_log TO authenticated;
GRANT ALL ON public.client_reminder_log TO service_role;
ALTER TABLE public.client_reminder_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins read reminder log"
ON public.client_reminder_log FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============ 4. RPCs ============

-- Log a session feedback entry (verifies caller is the therapist that owns the client).
CREATE OR REPLACE FUNCTION public.log_session_feedback(
  _client_id UUID,
  _session_date DATE,
  _is_new_client BOOLEAN,
  _service_delivered TEXT,
  _duration TEXT,
  _homework_given BOOLEAN,
  _homework_text TEXT,
  _progress_status public.session_progress_status,
  _next_appt_booked TEXT,
  _next_appt_date DATE,
  _next_appt_service TEXT,
  _notes TEXT
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _therapist_id UUID;
  _new_id UUID;
BEGIN
  SELECT ta.id INTO _therapist_id
  FROM public.therapist_accounts ta
  WHERE ta.user_id = auth.uid() AND ta.is_active = true;
  IF _therapist_id IS NULL THEN RAISE EXCEPTION 'Not a therapist'; END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.therapist_clients
    WHERE id = _client_id AND therapist_id = _therapist_id
  ) THEN
    RAISE EXCEPTION 'Client not owned by this therapist';
  END IF;

  INSERT INTO public.therapist_session_feedback (
    therapist_id, client_id, session_date, is_new_client, service_delivered,
    duration, homework_given, homework_text, progress_status,
    next_appt_booked, next_appt_date, next_appt_service, notes
  ) VALUES (
    _therapist_id, _client_id, COALESCE(_session_date, CURRENT_DATE),
    COALESCE(_is_new_client, false), _service_delivered, _duration,
    COALESCE(_homework_given, false), _homework_text, _progress_status,
    COALESCE(_next_appt_booked, 'tbc'), _next_appt_date, _next_appt_service, _notes
  ) RETURNING id INTO _new_id;

  RETURN _new_id;
END $$;

-- Attach a reaction to a submission.
CREATE OR REPLACE FUNCTION public.add_submission_reaction(
  _submission_id UUID,
  _emoji TEXT,
  _note TEXT
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _therapist_id UUID;
  _client_id UUID;
  _reaction_id UUID;
BEGIN
  SELECT ta.id INTO _therapist_id
  FROM public.therapist_accounts ta
  WHERE ta.user_id = auth.uid() AND ta.is_active = true;
  IF _therapist_id IS NULL THEN RAISE EXCEPTION 'Not a therapist'; END IF;

  SELECT ts.client_id INTO _client_id
  FROM public.tool_submissions ts
  JOIN public.assignment_tools at ON at.id = ts.assignment_tool_id
  JOIN public.client_assignments ca ON ca.id = at.assignment_id
  WHERE ts.id = _submission_id AND ca.therapist_id = _therapist_id;

  IF _client_id IS NULL THEN RAISE EXCEPTION 'Submission not accessible'; END IF;
  IF _note IS NOT NULL AND char_length(_note) > 100 THEN
    RAISE EXCEPTION 'Note too long (max 100 chars)';
  END IF;

  INSERT INTO public.submission_reactions (
    submission_id, therapist_id, client_id, emoji, note
  ) VALUES (
    _submission_id, _therapist_id, _client_id, _emoji, NULLIF(trim(_note), '')
  ) RETURNING id INTO _reaction_id;

  RETURN _reaction_id;
END $$;

-- Fetch reactions on a client's submissions via their access token (client portal).
CREATE OR REPLACE FUNCTION public.get_client_reactions_by_token(_token UUID)
RETURNS JSON
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _client_id UUID;
  result JSON;
BEGIN
  SELECT id INTO _client_id FROM public.therapist_clients WHERE access_token = _token;
  IF _client_id IS NULL THEN RETURN '[]'::json; END IF;

  SELECT COALESCE(json_agg(row_to_json(r) ORDER BY r.created_at DESC), '[]'::json)
  INTO result FROM (
    SELECT
      sr.id, sr.submission_id, sr.emoji, sr.note, sr.created_at,
      ta.full_name AS therapist_name,
      at.tool_key,
      at.title AS tool_title
    FROM public.submission_reactions sr
    JOIN public.tool_submissions ts ON ts.id = sr.submission_id
    JOIN public.assignment_tools at ON at.id = ts.assignment_tool_id
    JOIN public.therapist_accounts ta ON ta.id = sr.therapist_id
    WHERE sr.client_id = _client_id
    ORDER BY sr.created_at DESC
    LIMIT 200
  ) r;

  -- Mark them as seen after fetch
  UPDATE public.submission_reactions SET seen_by_client = true
    WHERE client_id = _client_id AND seen_by_client = false;

  RETURN result;
END $$;
