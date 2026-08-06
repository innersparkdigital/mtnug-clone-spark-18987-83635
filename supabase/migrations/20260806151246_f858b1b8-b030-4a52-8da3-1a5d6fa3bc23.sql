DROP FUNCTION IF EXISTS public.admin_update_client_tracker(uuid, text, integer, integer, date, boolean, numeric, numeric, numeric, text, date, text, text, text);

CREATE OR REPLACE FUNCTION public.admin_update_client_tracker(
  _client_id uuid,
  _session_type text DEFAULT NULL,
  _duration_mins integer DEFAULT NULL,
  _session_rating integer DEFAULT NULL,
  _next_session_date date DEFAULT NULL,
  _would_rebook boolean DEFAULT NULL,
  _amount_ugx numeric DEFAULT NULL,
  _therapist_share_ugx numeric DEFAULT NULL,
  _innerspark_share_ugx numeric DEFAULT NULL,
  _paid_status text DEFAULT NULL,
  _last_session_date date DEFAULT NULL,
  _country text DEFAULT NULL,
  _receipt_number text DEFAULT NULL,
  _receipt_url text DEFAULT NULL,
  _client_type text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  UPDATE public.therapist_clients SET
    session_type          = COALESCE(_session_type, session_type),
    duration_mins         = COALESCE(_duration_mins, duration_mins),
    session_rating        = COALESCE(_session_rating, session_rating),
    next_session_date     = COALESCE(_next_session_date, next_session_date),
    would_rebook          = COALESCE(_would_rebook, would_rebook),
    amount_ugx            = COALESCE(_amount_ugx, amount_ugx),
    therapist_share_ugx   = COALESCE(_therapist_share_ugx, therapist_share_ugx),
    innerspark_share_ugx  = COALESCE(_innerspark_share_ugx, innerspark_share_ugx),
    paid_status           = COALESCE(_paid_status, paid_status),
    last_session_date     = COALESCE(_last_session_date, last_session_date),
    country               = COALESCE(_country, country),
    receipt_number        = COALESCE(_receipt_number, receipt_number),
    receipt_url           = COALESCE(_receipt_url, receipt_url),
    client_type           = COALESCE(_client_type, client_type)
  WHERE id = _client_id;

  RETURN FOUND;
END;
$function$;

CREATE OR REPLACE FUNCTION public.admin_list_all_clients()
RETURNS json
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;