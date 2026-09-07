CREATE OR REPLACE FUNCTION public.admin_client_homework(_client_id uuid)
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

  SELECT COALESCE(json_agg(row_to_json(x) ORDER BY x.assigned_at DESC), '[]'::json)
  INTO result FROM (
    SELECT
      at.id,
      at.tool_key,
      at.title,
      at.therapist_note,
      at.due_date,
      at.status,
      at.created_at AS assigned_at,
      s.submitted_at,
      s.submission_type,
      s.payload,
      s.mood_score,
      s.screening_score,
      s.screening_severity,
      s.safety_flag
    FROM public.assignment_tools at
    JOIN public.client_assignments ca ON ca.id = at.assignment_id
    LEFT JOIN LATERAL (
      SELECT ts.* FROM public.tool_submissions ts
      WHERE ts.assignment_tool_id = at.id
      ORDER BY (ts.submission_type = 'final') DESC, ts.submitted_at DESC
      LIMIT 1
    ) s ON TRUE
    WHERE ca.client_id = _client_id
  ) x;

  RETURN COALESCE(result, '[]'::json);
END;
$function$;

GRANT EXECUTE ON FUNCTION public.admin_client_homework(uuid) TO authenticated;