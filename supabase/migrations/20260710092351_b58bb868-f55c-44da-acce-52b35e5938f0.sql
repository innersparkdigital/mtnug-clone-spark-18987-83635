CREATE OR REPLACE FUNCTION public.client_snapshot(_token uuid)
 RETURNS json
 LANGUAGE plpgsql
 VOLATILE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;