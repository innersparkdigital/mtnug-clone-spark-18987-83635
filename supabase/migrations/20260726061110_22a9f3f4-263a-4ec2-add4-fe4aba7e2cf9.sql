
CREATE OR REPLACE FUNCTION public.admin_overview_stats()
RETURNS JSON
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $fn$
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
      WHERE ca.is_active = true AND at.created_at >= _week_start
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
        AND progress_status IN ('at_risk','crisis_activated')
    )
  ) INTO result;

  RETURN result;
END;
$fn$;

CREATE OR REPLACE FUNCTION public.admin_list_all_clients()
RETURNS JSON
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $fn$
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
      c.client_code,
      c.country,
      c.session_type,
      c.duration_mins,
      c.session_rating,
      c.would_rebook,
      c.amount_ugx,
      c.therapist_share_ugx,
      c.innerspark_share_ugx,
      c.paid_status,
      c.receipt_number,
      c.receipt_url,
      c.last_session_date,
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
$fn$;

CREATE OR REPLACE FUNCTION public.admin_revenue_by_session_type()
RETURNS JSON
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  result JSON;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  SELECT json_build_object(
    'by_type', COALESCE((
      SELECT json_agg(row_to_json(t) ORDER BY t.total_ugx DESC) FROM (
        SELECT
          COALESCE(NULLIF(session_type, ''), 'unspecified') AS session_type,
          count(*) AS sessions,
          COALESCE(SUM(amount_ugx),0) AS total_ugx,
          COALESCE(SUM(therapist_share_ugx),0) AS therapist_ugx,
          COALESCE(SUM(innerspark_share_ugx),0) AS innerspark_ugx
        FROM public.therapist_clients
        WHERE COALESCE(amount_ugx,0) > 0
        GROUP BY 1
      ) t
    ), '[]'::json),
    'totals', (
      SELECT json_build_object(
        'total_ugx', COALESCE(SUM(amount_ugx),0),
        'therapist_ugx', COALESCE(SUM(therapist_share_ugx),0),
        'innerspark_ugx', COALESCE(SUM(innerspark_share_ugx),0),
        'paid_ugx', COALESCE(SUM(amount_ugx) FILTER (WHERE paid_status = 'paid'),0),
        'unpaid_ugx', COALESCE(SUM(amount_ugx) FILTER (WHERE paid_status IS DISTINCT FROM 'paid'),0),
        'sessions', count(*) FILTER (WHERE COALESCE(amount_ugx,0) > 0)
      ) FROM public.therapist_clients
    )
  ) INTO result;

  RETURN result;
END;
$fn$;
