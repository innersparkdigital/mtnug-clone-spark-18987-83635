ALTER TABLE public.therapist_clients
  ADD COLUMN IF NOT EXISTS consent_token uuid,
  ADD COLUMN IF NOT EXISTS consent_signed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_signed_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS therapist_clients_consent_token_key
  ON public.therapist_clients (consent_token)
  WHERE consent_token IS NOT NULL;

CREATE OR REPLACE FUNCTION public.admin_generate_client_consent_token(_client_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _token uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.therapist_clients WHERE id = _client_id) THEN
    RAISE EXCEPTION 'Client not found';
  END IF;

  _token := gen_random_uuid();
  UPDATE public.therapist_clients
  SET consent_token = _token
  WHERE id = _client_id;

  RETURN _token;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_generate_client_consent_token(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_generate_client_consent_token(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_client_consent(_token uuid)
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT row_to_json(x)
  FROM (
    SELECT
      c.full_name AS client_name,
      ta.full_name AS therapist_name,
      c.consent_signed,
      c.consent_signed_at
    FROM public.therapist_clients c
    JOIN public.therapist_accounts ta ON ta.id = c.therapist_id
    WHERE c.consent_token = _token
    LIMIT 1
  ) x;
$$;

REVOKE ALL ON FUNCTION public.get_client_consent(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_client_consent(uuid) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.confirm_client_consent(_token uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _result json;
BEGIN
  UPDATE public.therapist_clients
  SET
    consent_signed = true,
    consent_signed_at = COALESCE(consent_signed_at, now())
  WHERE consent_token = _token;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or expired consent link';
  END IF;

  SELECT json_build_object(
    'consent_signed', consent_signed,
    'consent_signed_at', consent_signed_at
  )
  INTO _result
  FROM public.therapist_clients
  WHERE consent_token = _token;

  RETURN _result;
END;
$$;

REVOKE ALL ON FUNCTION public.confirm_client_consent(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.confirm_client_consent(uuid) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.admin_list_all_clients()
RETURNS json
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result JSON;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  SELECT COALESCE(json_agg(row_to_json(x) ORDER BY x.created_at DESC), '[]'::json)
  INTO result FROM (
    SELECT
      c.id, c.full_name, c.email, c.phone, c.presenting_concern, c.access_token,
      c.created_at, c.last_seen_at, c.client_code, c.country, c.session_type,
      c.duration_mins, c.session_rating, c.would_rebook, c.amount_ugx,
      c.therapist_share_ugx, c.innerspark_share_ugx, c.paid_status,
      c.receipt_number, c.receipt_url, c.last_session_date,
      c.therapist_paid, c.therapist_paid_at, c.receipt_sent_at,
      c.consent_signed, c.consent_signed_at,
      COALESCE(c.client_type, 'new') AS client_type,
      ta.id AS therapist_id,
      ta.full_name AS therapist_name,
      ta.email AS therapist_email,
      (SELECT count(*) FROM public.assignment_tools at
        JOIN public.client_assignments ca ON ca.id = at.assignment_id
        WHERE ca.client_id = c.id AND ca.is_active = true AND at.status <> 'completed') AS active_tools,
      (SELECT count(*) FROM public.assignment_tools at
        JOIN public.client_assignments ca ON ca.id = at.assignment_id
        WHERE ca.client_id = c.id AND ca.is_active = true) AS total_tools,
      (SELECT count(*) FROM public.assignment_tools at
        JOIN public.client_assignments ca ON ca.id = at.assignment_id
        WHERE ca.client_id = c.id AND ca.is_active = true AND at.status = 'completed') AS completed_tools,
      (SELECT count(*) FROM public.safety_alerts sa
        WHERE sa.client_id = c.id AND sa.resolved = false) AS open_alerts,
      (SELECT max(ts.submitted_at) FROM public.tool_submissions ts
        JOIN public.assignment_tools at ON at.id = ts.assignment_tool_id
        JOIN public.client_assignments ca ON ca.id = at.assignment_id
        WHERE ca.client_id = c.id AND ts.submission_type = 'final') AS last_submission_at,
      COALESCE(
        c.next_session_date,
        (SELECT tsf.next_appt_date FROM public.therapist_session_feedback tsf
          WHERE tsf.client_id = c.id AND tsf.next_appt_date IS NOT NULL
          ORDER BY tsf.session_date DESC LIMIT 1)
      ) AS next_session_date
    FROM public.therapist_clients c
    JOIN public.therapist_accounts ta ON ta.id = c.therapist_id
    ORDER BY c.created_at DESC
  ) x;

  RETURN COALESCE(result, '[]'::json);
END;
$$;

CREATE OR REPLACE FUNCTION public.therapist_client_overview()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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
      c.consent_signed,
      c.consent_signed_at,
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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'therapist_clients'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.therapist_clients;
  END IF;
END
$$;