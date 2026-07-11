
-- 1. Recurring schedules for assignment tools
CREATE TABLE public.assignment_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_tool_id UUID NOT NULL REFERENCES public.assignment_tools(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.therapist_clients(id) ON DELETE CASCADE,
  frequency TEXT NOT NULL CHECK (frequency IN ('one_time','daily','weekly','custom')),
  days_of_week INT[] NOT NULL DEFAULT '{}',
  time_of_day TIME,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  timezone TEXT NOT NULL DEFAULT 'Africa/Nairobi',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.assignment_schedules TO authenticated;
GRANT ALL ON public.assignment_schedules TO service_role;

ALTER TABLE public.assignment_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapists manage schedules for their clients"
  ON public.assignment_schedules
  FOR ALL
  TO authenticated
  USING (public.is_client_therapist(client_id))
  WITH CHECK (public.is_client_therapist(client_id));

CREATE TRIGGER update_assignment_schedules_updated_at
  BEFORE UPDATE ON public.assignment_schedules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_assignment_schedules_client ON public.assignment_schedules(client_id);
CREATE INDEX idx_assignment_schedules_tool ON public.assignment_schedules(assignment_tool_id);

-- 2. RPC: therapist creates a schedule for one of their assignment tools
CREATE OR REPLACE FUNCTION public.create_assignment_schedule(
  _assignment_tool_id UUID,
  _frequency TEXT,
  _days_of_week INT[],
  _time_of_day TIME,
  _start_date DATE,
  _end_date DATE
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _client_id UUID;
  _therapist_id UUID;
  _new_id UUID;
BEGIN
  SELECT ta.id INTO _therapist_id
  FROM public.therapist_accounts ta
  WHERE ta.user_id = auth.uid() AND ta.is_active = true;
  IF _therapist_id IS NULL THEN RAISE EXCEPTION 'Not a therapist'; END IF;

  SELECT ca.client_id INTO _client_id
  FROM public.assignment_tools at
  JOIN public.client_assignments ca ON ca.id = at.assignment_id
  WHERE at.id = _assignment_tool_id AND ca.therapist_id = _therapist_id;

  IF _client_id IS NULL THEN RAISE EXCEPTION 'Tool not owned by this therapist'; END IF;

  INSERT INTO public.assignment_schedules (
    assignment_tool_id, client_id, frequency, days_of_week, time_of_day, start_date, end_date
  ) VALUES (
    _assignment_tool_id, _client_id, _frequency,
    COALESCE(_days_of_week, '{}'::int[]),
    _time_of_day,
    COALESCE(_start_date, CURRENT_DATE),
    _end_date
  ) RETURNING id INTO _new_id;

  RETURN _new_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_assignment_schedule(_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _therapist_id UUID;
BEGIN
  SELECT ta.id INTO _therapist_id FROM public.therapist_accounts ta
  WHERE ta.user_id = auth.uid() AND ta.is_active = true;
  IF _therapist_id IS NULL THEN RETURN false; END IF;

  DELETE FROM public.assignment_schedules s
  USING public.therapist_clients c
  WHERE s.id = _id AND s.client_id = c.id AND c.therapist_id = _therapist_id;

  RETURN FOUND;
END;
$$;

-- 3. Extend client_snapshot to include schedules + today/catchup arrays
CREATE OR REPLACE FUNCTION public.client_snapshot(_token uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
  _client_id UUID;
  _today DATE := (now() AT TIME ZONE 'Africa/Nairobi')::date;
  _dow INT := EXTRACT(DOW FROM (now() AT TIME ZONE 'Africa/Nairobi'))::int;
BEGIN
  SELECT id INTO _client_id FROM public.therapist_clients WHERE access_token = _token;
  IF _client_id IS NULL THEN RETURN NULL; END IF;

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
            'schedule', (
              SELECT json_build_object(
                'id', s.id,
                'frequency', s.frequency,
                'days_of_week', s.days_of_week,
                'time_of_day', s.time_of_day,
                'start_date', s.start_date,
                'end_date', s.end_date
              )
              FROM public.assignment_schedules s
              WHERE s.assignment_tool_id = at.id
              ORDER BY s.created_at DESC LIMIT 1
            ),
            'latest_submission', (
              SELECT json_build_object(
                'id', ts.id, 'payload', ts.payload,
                'submission_type', ts.submission_type,
                'submitted_at', ts.submitted_at,
                'updated_at', ts.updated_at
              )
              FROM public.tool_submissions ts
              WHERE ts.assignment_tool_id = at.id
              ORDER BY ts.updated_at DESC LIMIT 1
            ),
            'completed_dates', COALESCE((
              SELECT json_agg(DISTINCT (ts2.submitted_at AT TIME ZONE 'Africa/Nairobi')::date)
              FROM public.tool_submissions ts2
              WHERE ts2.assignment_tool_id = at.id AND ts2.submission_type = 'final'
                AND ts2.submitted_at >= (now() - interval '14 days')
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
    'today', _today,
    'has_red_alert', EXISTS (
      SELECT 1 FROM public.safety_alerts sa
      WHERE sa.client_id = c.id AND sa.severity = 'red' AND sa.resolved = false
    )
  ) INTO result
  FROM public.therapist_clients c
  JOIN public.therapist_accounts ta ON ta.id = c.therapist_id
  WHERE c.id = _client_id;

  UPDATE public.therapist_clients SET last_seen_at = now() WHERE id = _client_id;
  RETURN result;
END;
$$;

-- 4. Therapist-facing adherence + client status helper
CREATE OR REPLACE FUNCTION public.therapist_client_overview()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _therapist_id UUID;
  result JSON;
BEGIN
  SELECT ta.id INTO _therapist_id FROM public.therapist_accounts ta
  WHERE ta.user_id = auth.uid() AND ta.is_active = true;
  IF _therapist_id IS NULL THEN RAISE EXCEPTION 'Not a therapist'; END IF;

  SELECT json_agg(row_to_json(x)) INTO result FROM (
    SELECT
      c.id,
      c.full_name,
      c.email,
      c.phone,
      c.presenting_concern,
      c.access_token,
      c.created_at,
      c.last_seen_at,
      (SELECT count(*) FROM public.assignment_tools at
        JOIN public.client_assignments ca ON ca.id = at.assignment_id
        WHERE ca.client_id = c.id AND ca.is_active = true AND at.status <> 'completed') AS active_tools,
      (SELECT count(*) FROM public.assignment_tools at
        JOIN public.client_assignments ca ON ca.id = at.assignment_id
        WHERE ca.client_id = c.id AND ca.is_active = true
          AND at.due_date IS NOT NULL AND at.due_date < CURRENT_DATE
          AND at.status <> 'completed') AS overdue_tools,
      (SELECT count(*) FROM public.safety_alerts sa
        WHERE sa.client_id = c.id AND sa.resolved = false) AS open_alerts,
      (SELECT json_agg(json_build_object(
          'date', d::date,
          'completed', (
            SELECT count(*) FROM public.tool_submissions ts
            JOIN public.assignment_tools at ON at.id = ts.assignment_tool_id
            JOIN public.client_assignments ca ON ca.id = at.assignment_id
            WHERE ca.client_id = c.id AND ts.submission_type = 'final'
              AND (ts.submitted_at AT TIME ZONE 'Africa/Nairobi')::date = d::date
          )
        ) ORDER BY d)
        FROM generate_series(CURRENT_DATE - interval '6 days', CURRENT_DATE, interval '1 day') d
      ) AS week_activity
    FROM public.therapist_clients c
    WHERE c.therapist_id = _therapist_id
    ORDER BY c.created_at DESC
  ) x;

  RETURN COALESCE(result, '[]'::json);
END;
$$;
