
-- =========================================================
-- Admin oversight RPCs (read-only across all therapists)
-- =========================================================

CREATE OR REPLACE FUNCTION public.admin_list_all_clients()
RETURNS json
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
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
      c.id,
      c.full_name,
      c.email,
      c.phone,
      c.presenting_concern,
      c.access_token,
      c.created_at,
      c.last_seen_at,
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
      (SELECT tsf.next_appt_date FROM public.therapist_session_feedback tsf
        WHERE tsf.client_id = c.id AND tsf.next_appt_date IS NOT NULL
        ORDER BY tsf.session_date DESC LIMIT 1) AS next_session_date,
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
    JOIN public.therapist_accounts ta ON ta.id = c.therapist_id
    ORDER BY c.created_at DESC
  ) x;

  RETURN COALESCE(result, '[]'::json);
END;
$$;

-- Admin: full read-only detail for a single client
CREATE OR REPLACE FUNCTION public.admin_client_detail(_client_id uuid)
RETURNS json
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  SELECT json_build_object(
    'client', json_build_object(
      'id', c.id, 'full_name', c.full_name, 'email', c.email, 'phone', c.phone,
      'presenting_concern', c.presenting_concern, 'created_at', c.created_at,
      'last_seen_at', c.last_seen_at, 'access_token', c.access_token
    ),
    'therapist', json_build_object(
      'id', ta.id, 'full_name', ta.full_name, 'email', ta.email, 'phone', ta.phone
    ),
    'assignments', COALESCE((
      SELECT json_agg(json_build_object(
        'id', ca.id, 'personal_note', ca.personal_note, 'is_active', ca.is_active,
        'created_at', ca.created_at,
        'tools', COALESCE((
          SELECT json_agg(json_build_object(
            'id', at.id, 'tool_key', at.tool_key, 'title', at.title,
            'therapist_note', at.therapist_note, 'due_date', at.due_date,
            'config', at.config, 'status', at.status, 'created_at', at.created_at
          ) ORDER BY at.created_at DESC)
          FROM public.assignment_tools at WHERE at.assignment_id = ca.id
        ), '[]'::json)
      ) ORDER BY ca.created_at DESC)
      FROM public.client_assignments ca WHERE ca.client_id = c.id
    ), '[]'::json),
    'submissions', COALESCE((
      SELECT json_agg(json_build_object(
        'id', ts.id, 'tool_key', at.tool_key, 'title', at.title,
        'payload', ts.payload, 'mood_score', ts.mood_score,
        'screening_score', ts.screening_score, 'screening_severity', ts.screening_severity,
        'safety_flag', ts.safety_flag, 'submission_type', ts.submission_type,
        'submitted_at', ts.submitted_at
      ) ORDER BY ts.submitted_at DESC)
      FROM public.tool_submissions ts
      JOIN public.assignment_tools at ON at.id = ts.assignment_tool_id
      JOIN public.client_assignments ca ON ca.id = at.assignment_id
      WHERE ca.client_id = c.id
    ), '[]'::json),
    'safety_alerts', COALESCE((
      SELECT json_agg(json_build_object(
        'id', sa.id, 'severity', sa.severity, 'payload', sa.payload,
        'resolved', sa.resolved, 'created_at', sa.created_at
      ) ORDER BY sa.created_at DESC)
      FROM public.safety_alerts sa WHERE sa.client_id = c.id
    ), '[]'::json),
    'session_logs', COALESCE((
      SELECT json_agg(json_build_object(
        'id', tsf.id, 'session_date', tsf.session_date,
        'is_new_client', tsf.is_new_client, 'service_delivered', tsf.service_delivered,
        'duration', tsf.duration, 'progress_status', tsf.progress_status,
        'homework_given', tsf.homework_given, 'homework_text', tsf.homework_text,
        'next_appt_booked', tsf.next_appt_booked, 'next_appt_date', tsf.next_appt_date,
        'notes', tsf.notes, 'created_at', tsf.created_at
      ) ORDER BY tsf.session_date DESC)
      FROM public.therapist_session_feedback tsf WHERE tsf.client_id = c.id
    ), '[]'::json)
  )
  INTO result
  FROM public.therapist_clients c
  JOIN public.therapist_accounts ta ON ta.id = c.therapist_id
  WHERE c.id = _client_id;

  RETURN result;
END;
$$;

-- Admin: all session logs across all therapists
CREATE OR REPLACE FUNCTION public.admin_list_session_logs()
RETURNS json
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
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
      tsf.id, tsf.session_date, tsf.is_new_client, tsf.service_delivered,
      tsf.duration, tsf.progress_status, tsf.homework_given, tsf.homework_text,
      tsf.next_appt_booked, tsf.next_appt_date, tsf.next_appt_service,
      tsf.notes, tsf.created_at,
      ta.id AS therapist_id, ta.full_name AS therapist_name, ta.email AS therapist_email,
      c.id AS client_id, c.full_name AS client_name, c.phone AS client_phone
    FROM public.therapist_session_feedback tsf
    JOIN public.therapist_accounts ta ON ta.id = tsf.therapist_id
    JOIN public.therapist_clients c ON c.id = tsf.client_id
    ORDER BY tsf.created_at DESC
  ) x;

  RETURN COALESCE(result, '[]'::json);
END;
$$;

-- Admin: high-level overview stats (top of dashboard)
CREATE OR REPLACE FUNCTION public.admin_overview_stats()
RETURNS json
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _now timestamptz := now();
  _week_start timestamptz := date_trunc('week', _now);
  _prev_week_start timestamptz := _week_start - interval '7 days';
  _today_start timestamptz := date_trunc('day', _now AT TIME ZONE 'Africa/Nairobi') AT TIME ZONE 'Africa/Nairobi';
  result JSON;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  SELECT json_build_object(
    'active_clients', (SELECT count(*) FROM public.therapist_clients),
    'sessions_this_week', (SELECT count(*) FROM public.therapist_session_feedback WHERE created_at >= _week_start),
    'sessions_last_week', (SELECT count(*) FROM public.therapist_session_feedback WHERE created_at >= _prev_week_start AND created_at < _week_start),
    'revenue_this_week_ugx', (SELECT COALESCE(SUM(amount),0) FROM public.payments WHERE payment_date >= _week_start::date),
    'revenue_last_week_ugx', (SELECT COALESCE(SUM(amount),0) FROM public.payments WHERE payment_date >= _prev_week_start::date AND payment_date < _week_start::date),
    'open_safety_flags', (SELECT count(*) FROM public.safety_alerts WHERE resolved = false),
    'therapists_active', (SELECT count(*) FROM public.therapist_accounts WHERE is_active = true),
    'homework_completion_rate', (
      SELECT CASE WHEN count(*) = 0 THEN 0
             ELSE round((count(*) FILTER (WHERE at.status = 'completed'))::numeric * 100 / count(*)::numeric, 1)
             END
      FROM public.assignment_tools at
      JOIN public.client_assignments ca ON ca.id = at.assignment_id
      WHERE ca.is_active = true
        AND at.created_at >= _week_start
    ),
    'new_enquiries_today', (
      (SELECT count(*) FROM public.chat_leads WHERE created_at >= _today_start) +
      (SELECT count(*) FROM public.contact_submissions WHERE created_at >= _today_start) +
      (SELECT count(*) FROM public.callback_requests WHERE created_at >= _today_start)
    ),
    'inactive_clients_7d', (
      SELECT count(*) FROM public.therapist_clients c
      WHERE (c.last_seen_at IS NULL OR c.last_seen_at < _now - interval '7 days')
        AND c.created_at < _now - interval '7 days'
    ),
    'clients_needing_followup', (
      SELECT count(DISTINCT c.id) FROM public.therapist_clients c
      JOIN public.safety_alerts sa ON sa.client_id = c.id AND sa.resolved = false
    ),
    'sessions_today', (SELECT count(*) FROM public.therapist_session_feedback WHERE created_at >= _today_start),
    'crisis_sessions_this_month', (
      SELECT count(*) FROM public.therapist_session_feedback
      WHERE created_at >= date_trunc('month', _now)
        AND progress_status IN ('at_risk','crisis_protocol_activated')
    )
  ) INTO result;

  RETURN result;
END;
$$;

-- Unified enquiries feed (Amani chat leads, contact form, WhatsApp callbacks)
CREATE OR REPLACE FUNCTION public.admin_list_enquiries()
RETURNS json
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
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
      cl.id::text AS id,
      'amani'::text AS source,
      cl.name,
      cl.phone,
      cl.email,
      cl.message AS concern,
      cl.status,
      cl.handled_at IS NOT NULL AS handled,
      cl.source_path,
      cl.created_at
    FROM public.chat_leads cl
    UNION ALL
    SELECT
      cs.id::text AS id,
      'website'::text AS source,
      cs.name,
      cs.phone,
      cs.email,
      COALESCE(cs.subject || ' — ', '') || cs.message AS concern,
      NULL::text AS status,
      false AS handled,
      NULL::text AS source_path,
      cs.created_at
    FROM public.contact_submissions cs
    UNION ALL
    SELECT
      cr.id::text AS id,
      'whatsapp_callback'::text AS source,
      cr.full_name AS name,
      cr.phone_number AS phone,
      NULL::text AS email,
      'Wellbeing score: ' || cr.wellbeing_score::text AS concern,
      cr.status,
      cr.status = 'contacted' AS handled,
      cr.source AS source_path,
      cr.created_at
    FROM public.callback_requests cr
    ORDER BY created_at DESC
    LIMIT 500
  ) x;

  RETURN COALESCE(result, '[]'::json);
END;
$$;

-- Admin: therapist performance metrics (last 30 days)
CREATE OR REPLACE FUNCTION public.admin_therapist_performance()
RETURNS json
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
  _cutoff timestamptz := now() - interval '30 days';
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  SELECT COALESCE(json_agg(row_to_json(x) ORDER BY x.sessions_month DESC), '[]'::json)
  INTO result FROM (
    SELECT
      ta.id, ta.full_name, ta.email, ta.is_active,
      (SELECT count(*) FROM public.therapist_clients c WHERE c.therapist_id = ta.id) AS total_clients,
      (SELECT count(*) FROM public.therapist_session_feedback tsf WHERE tsf.therapist_id = ta.id AND tsf.created_at >= _cutoff) AS sessions_month,
      (SELECT count(*) FROM public.therapist_session_feedback tsf WHERE tsf.therapist_id = ta.id AND tsf.homework_given = true AND tsf.created_at >= _cutoff) AS homework_given_count,
      (SELECT count(*) FROM public.therapist_session_feedback tsf WHERE tsf.therapist_id = ta.id AND tsf.next_appt_booked = 'yes' AND tsf.created_at >= _cutoff) AS next_appt_count
    FROM public.therapist_accounts ta
    ORDER BY ta.full_name
  ) x;

  RETURN COALESCE(result, '[]'::json);
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_all_clients() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_client_detail(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_session_logs() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_overview_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_enquiries() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_therapist_performance() TO authenticated;
