CREATE OR REPLACE FUNCTION public.admin_overview_stats()
 RETURNS json
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    'new_clients', (SELECT count(*) FROM public.therapist_clients WHERE COALESCE(client_type,'new') <> 'returning'),
    'returning_clients', (SELECT count(*) FROM public.therapist_clients WHERE client_type = 'returning'),
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
$function$;