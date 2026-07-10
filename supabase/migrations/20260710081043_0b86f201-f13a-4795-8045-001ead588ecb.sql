
-- Ensure pgcrypto for passcode hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Extend assignment_tools with human config fields
ALTER TABLE public.assignment_tools
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS therapist_note TEXT,
  ADD COLUMN IF NOT EXISTS due_date DATE;

-- Extend tool_submissions
ALTER TABLE public.tool_submissions
  ADD COLUMN IF NOT EXISTS submission_type TEXT NOT NULL DEFAULT 'final',
  ADD COLUMN IF NOT EXISTS screening_severity TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE UNIQUE INDEX IF NOT EXISTS tool_submissions_draft_unique
  ON public.tool_submissions (assignment_tool_id)
  WHERE submission_type = 'draft';

-- Extend safety_alerts
ALTER TABLE public.safety_alerts
  ADD COLUMN IF NOT EXISTS severity TEXT NOT NULL DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS crisis_message_shown BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS resolved_by UUID;

-- RPC: set passcode (first visit)
CREATE OR REPLACE FUNCTION public.set_client_passcode(_token UUID, _passcode TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _row public.therapist_clients%ROWTYPE;
BEGIN
  IF length(coalesce(_passcode,'')) < 4 THEN RAISE EXCEPTION 'Passcode too short'; END IF;
  SELECT * INTO _row FROM public.therapist_clients WHERE access_token = _token;
  IF NOT FOUND THEN RETURN false; END IF;
  IF _row.passcode_hash IS NOT NULL THEN RAISE EXCEPTION 'Passcode already set'; END IF;
  UPDATE public.therapist_clients
     SET passcode_hash = crypt(_passcode, gen_salt('bf', 10)),
         last_seen_at = now()
   WHERE id = _row.id;
  RETURN true;
END;
$$;

-- RPC: verify passcode
CREATE OR REPLACE FUNCTION public.verify_client_passcode(_token UUID, _passcode TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _hash TEXT; _id UUID;
BEGIN
  SELECT id, passcode_hash INTO _id, _hash FROM public.therapist_clients WHERE access_token = _token;
  IF NOT FOUND OR _hash IS NULL THEN RETURN false; END IF;
  IF _hash = crypt(_passcode, _hash) THEN
    UPDATE public.therapist_clients SET last_seen_at = now() WHERE id = _id;
    RETURN true;
  END IF;
  RETURN false;
END;
$$;

-- RPC: full client snapshot (assignment + tools + latest submissions + submission history)
CREATE OR REPLACE FUNCTION public.client_snapshot(_token UUID)
RETURNS JSON
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE result JSON;
BEGIN
  SELECT json_build_object(
    'client', json_build_object(
      'id', c.id,
      'full_name', c.full_name,
      'has_passcode', c.passcode_hash IS NOT NULL
    ),
    'therapist', json_build_object(
      'full_name', ta.full_name,
      'phone', ta.phone,
      'email', ta.email
    ),
    'assignment', (
      SELECT json_build_object(
        'id', ca.id,
        'personal_note', ca.personal_note,
        'created_at', ca.created_at,
        'tools', COALESCE((
          SELECT json_agg(json_build_object(
            'id', at.id,
            'tool_key', at.tool_key,
            'title', at.title,
            'therapist_note', at.therapist_note,
            'due_date', at.due_date,
            'config', at.config,
            'status', at.status,
            'latest_submission', (
              SELECT json_build_object(
                'id', ts.id, 'payload', ts.payload,
                'submission_type', ts.submission_type,
                'submitted_at', ts.submitted_at,
                'updated_at', ts.updated_at,
                'mood_score', ts.mood_score,
                'screening_score', ts.screening_score,
                'screening_severity', ts.screening_severity
              )
              FROM public.tool_submissions ts
              WHERE ts.assignment_tool_id = at.id
              ORDER BY ts.updated_at DESC LIMIT 1
            ),
            'history', COALESCE((
              SELECT json_agg(json_build_object(
                'submitted_at', ts2.submitted_at,
                'mood_score', ts2.mood_score,
                'screening_score', ts2.screening_score,
                'screening_severity', ts2.screening_severity
              ) ORDER BY ts2.submitted_at ASC)
              FROM public.tool_submissions ts2
              WHERE ts2.assignment_tool_id = at.id AND ts2.submission_type = 'final'
            ), '[]'::json)
          ) ORDER BY at.created_at ASC)
          FROM public.assignment_tools at
          WHERE at.assignment_id = ca.id
        ), '[]'::json)
      )
      FROM public.client_assignments ca
      WHERE ca.client_id = c.id AND ca.is_active = true
      ORDER BY ca.created_at DESC LIMIT 1
    ),
    'has_red_alert', EXISTS (
      SELECT 1 FROM public.safety_alerts sa
      WHERE sa.client_id = c.id AND sa.severity = 'red' AND sa.resolved = false
    )
  ) INTO result
  FROM public.therapist_clients c
  JOIN public.therapist_accounts ta ON ta.id = c.therapist_id
  WHERE c.access_token = _token;

  IF result IS NOT NULL THEN
    UPDATE public.therapist_clients SET last_seen_at = now() WHERE access_token = _token;
  END IF;
  RETURN result;
END;
$$;

-- RPC: save tool submission (token-scoped, upserts draft, inserts final)
CREATE OR REPLACE FUNCTION public.save_tool_submission(
  _token UUID,
  _assignment_tool_id UUID,
  _payload JSONB,
  _final BOOLEAN,
  _mood_score INT DEFAULT NULL,
  _screening_score INT DEFAULT NULL,
  _screening_severity TEXT DEFAULT NULL,
  _safety_flag BOOLEAN DEFAULT false
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _client_id UUID;
  _therapist_id UUID;
  _submission_id UUID;
  _alert_id UUID;
BEGIN
  SELECT c.id, c.therapist_id INTO _client_id, _therapist_id
  FROM public.therapist_clients c
  JOIN public.assignment_tools at ON at.id = _assignment_tool_id
  JOIN public.client_assignments ca ON ca.id = at.assignment_id
  WHERE c.access_token = _token AND ca.client_id = c.id;

  IF _client_id IS NULL THEN RAISE EXCEPTION 'Invalid token or tool'; END IF;

  IF _final THEN
    INSERT INTO public.tool_submissions (
      assignment_tool_id, client_id, payload, mood_score, screening_score,
      screening_severity, safety_flag, submission_type, submitted_at, updated_at
    ) VALUES (
      _assignment_tool_id, _client_id, _payload, _mood_score, _screening_score,
      _screening_severity, _safety_flag, 'final', now(), now()
    ) RETURNING id INTO _submission_id;
    -- Remove any lingering draft
    DELETE FROM public.tool_submissions
      WHERE assignment_tool_id = _assignment_tool_id AND submission_type = 'draft';
    UPDATE public.assignment_tools SET status = 'completed', updated_at = now()
      WHERE id = _assignment_tool_id;
  ELSE
    -- Upsert draft
    INSERT INTO public.tool_submissions (
      assignment_tool_id, client_id, payload, mood_score, screening_score,
      screening_severity, safety_flag, submission_type, submitted_at, updated_at
    ) VALUES (
      _assignment_tool_id, _client_id, _payload, _mood_score, _screening_score,
      _screening_severity, _safety_flag, 'draft', now(), now()
    )
    ON CONFLICT (assignment_tool_id) WHERE (submission_type = 'draft')
    DO UPDATE SET payload = EXCLUDED.payload,
                  mood_score = EXCLUDED.mood_score,
                  screening_score = EXCLUDED.screening_score,
                  screening_severity = EXCLUDED.screening_severity,
                  safety_flag = EXCLUDED.safety_flag,
                  updated_at = now()
    RETURNING id INTO _submission_id;
    UPDATE public.assignment_tools SET status = 'in_progress', updated_at = now()
      WHERE id = _assignment_tool_id AND status = 'pending';
  END IF;

  -- Safety alert insertion (only on final submissions)
  IF _final AND _safety_flag THEN
    INSERT INTO public.safety_alerts (client_id, therapist_id, submission_id, payload, severity, crisis_message_shown)
    VALUES (_client_id, _therapist_id, _submission_id, _payload,
            COALESCE(_payload->>'severity', 'red'),
            COALESCE((_payload->>'crisis_message_shown')::boolean, false))
    RETURNING id INTO _alert_id;
  END IF;

  UPDATE public.therapist_clients SET last_seen_at = now() WHERE id = _client_id;

  RETURN json_build_object('submission_id', _submission_id, 'alert_id', _alert_id);
END;
$$;

-- RPC: therapist assignment creation (from authenticated therapist)
CREATE OR REPLACE FUNCTION public.create_client_assignment(
  _client_id UUID,
  _personal_note TEXT,
  _tools JSONB -- array of {tool_key, title, therapist_note, due_date, config}
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _therapist_id UUID;
  _assignment_id UUID;
  _tool JSONB;
BEGIN
  SELECT ta.id INTO _therapist_id
  FROM public.therapist_accounts ta
  WHERE ta.user_id = auth.uid() AND ta.is_active = true;
  IF _therapist_id IS NULL THEN RAISE EXCEPTION 'Not a therapist'; END IF;

  IF NOT EXISTS (SELECT 1 FROM public.therapist_clients WHERE id = _client_id AND therapist_id = _therapist_id) THEN
    RAISE EXCEPTION 'Client not owned by this therapist';
  END IF;

  UPDATE public.client_assignments SET is_active = false WHERE client_id = _client_id AND is_active = true;

  INSERT INTO public.client_assignments (client_id, therapist_id, personal_note, is_active)
  VALUES (_client_id, _therapist_id, _personal_note, true)
  RETURNING id INTO _assignment_id;

  FOR _tool IN SELECT * FROM jsonb_array_elements(_tools)
  LOOP
    INSERT INTO public.assignment_tools (
      assignment_id, tool_key, title, therapist_note, due_date, config, status
    ) VALUES (
      _assignment_id,
      _tool->>'tool_key',
      NULLIF(_tool->>'title',''),
      NULLIF(_tool->>'therapist_note',''),
      NULLIF(_tool->>'due_date','')::date,
      COALESCE(_tool->'config', '{}'::jsonb),
      'pending'
    );
  END LOOP;

  RETURN _assignment_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_client_passcode(UUID, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_client_passcode(UUID, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.client_snapshot(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.save_tool_submission(UUID, UUID, JSONB, BOOLEAN, INT, INT, TEXT, BOOLEAN) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_client_assignment(UUID, TEXT, JSONB) TO authenticated;
