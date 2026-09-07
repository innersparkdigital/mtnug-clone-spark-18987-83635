CREATE OR REPLACE FUNCTION public.admin_list_session_logs()
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

  SELECT COALESCE(json_agg(row_to_json(x) ORDER BY x.session_date DESC NULLS LAST, x.created_at DESC), '[]'::json)
  INTO result FROM (
    SELECT
      tsf.id::text AS id, 'feedback'::text AS source,
      tsf.session_date, tsf.is_new_client, tsf.service_delivered,
      tsf.duration, tsf.progress_status::text AS progress_status,
      tsf.homework_given, tsf.homework_text,
      tsf.next_appt_booked, tsf.next_appt_date, tsf.next_appt_service,
      tsf.notes, tsf.created_at,
      ta.id AS therapist_id, ta.full_name AS therapist_name, ta.email AS therapist_email,
      c.id AS client_id, c.full_name AS client_name, c.phone AS client_phone,
      NULL::integer AS session_rating, NULL::numeric AS amount_ugx, NULL::text AS paid_status
    FROM public.therapist_session_feedback tsf
    JOIN public.therapist_accounts ta ON ta.id = tsf.therapist_id
    JOIN public.therapist_clients c ON c.id = tsf.client_id

    UNION ALL

    SELECT
      'client-' || c.id::text AS id, 'client_record'::text AS source,
      c.last_session_date AS session_date,
      (c.client_type = 'new') AS is_new_client,
      COALESCE(c.session_type, 'Session') AS service_delivered,
      CASE WHEN c.duration_mins IS NULL THEN NULL ELSE c.duration_mins || ' mins' END AS duration,
      NULL::text AS progress_status,
      NULL::boolean AS homework_given,
      NULL::text AS homework_text,
      CASE WHEN c.next_session_date IS NULL THEN 'no' ELSE 'yes' END AS next_appt_booked,
      c.next_session_date AS next_appt_date,
      NULL::text AS next_appt_service,
      NULL::text AS notes,
      c.updated_at AS created_at,
      ta.id AS therapist_id, ta.full_name AS therapist_name, ta.email AS therapist_email,
      c.id AS client_id, c.full_name AS client_name, c.phone AS client_phone,
      c.session_rating, c.amount_ugx, c.paid_status
    FROM public.therapist_clients c
    JOIN public.therapist_accounts ta ON ta.id = c.therapist_id
    WHERE c.last_session_date IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM public.therapist_session_feedback f
        WHERE f.client_id = c.id AND f.session_date = c.last_session_date
      )
  ) x;

  RETURN COALESCE(result, '[]'::json);
END;
$function$;