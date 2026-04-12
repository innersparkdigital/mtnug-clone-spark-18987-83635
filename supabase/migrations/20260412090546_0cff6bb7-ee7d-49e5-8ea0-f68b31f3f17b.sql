
-- 1. Allow admins to read email_send_log
CREATE POLICY "Admins can view email send log"
ON public.email_send_log
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 2. Fix clear_mindcheck_data: add WHERE true to all DELETE statements
CREATE OR REPLACE FUNCTION public.clear_mindcheck_data(tables_to_clear text[])
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  tbl text;
  cnt integer;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  FOREACH tbl IN ARRAY tables_to_clear
  LOOP
    CASE tbl
      WHEN 'assessment_sessions' THEN
        DELETE FROM public.assessment_sessions WHERE true;
        GET DIAGNOSTICS cnt = ROW_COUNT;
      WHEN 'assessment_emails' THEN
        DELETE FROM public.assessment_emails WHERE true;
        GET DIAGNOSTICS cnt = ROW_COUNT;
      WHEN 'mindcheck_page_visits' THEN
        DELETE FROM public.mindcheck_page_visits WHERE true;
        GET DIAGNOSTICS cnt = ROW_COUNT;
      WHEN 'who5_sessions' THEN
        DELETE FROM public.who5_sessions WHERE true;
        GET DIAGNOSTICS cnt = ROW_COUNT;
      WHEN 'who5_cta_clicks' THEN
        DELETE FROM public.who5_cta_clicks WHERE true;
        GET DIAGNOSTICS cnt = ROW_COUNT;
      WHEN 'callback_requests' THEN
        DELETE FROM public.callback_requests WHERE true;
        GET DIAGNOSTICS cnt = ROW_COUNT;
      ELSE
        RAISE EXCEPTION 'Unknown table: %', tbl;
    END CASE;
  END LOOP;

  RETURN json_build_object('success', true, 'message', 'Data cleared successfully');
END;
$function$;

-- 3. Add scheduled_at column to newsletters
ALTER TABLE public.newsletters
ADD COLUMN IF NOT EXISTS scheduled_at timestamp with time zone DEFAULT NULL;

-- 4. Function to sync all form emails into newsletter_subscribers
CREATE OR REPLACE FUNCTION public.sync_form_emails_to_subscribers()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  inserted_count integer := 0;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  WITH all_emails AS (
    SELECT DISTINCT lower(trim(email)) AS email
    FROM (
      SELECT email FROM public.contact_submissions
      UNION
      SELECT email FROM public.career_applications
      UNION
      SELECT email FROM public.training_registrations
      UNION
      SELECT email FROM public.assessment_emails
    ) combined
    WHERE email IS NOT NULL AND trim(email) != ''
  )
  INSERT INTO public.newsletter_subscribers (email, is_active)
  SELECT email, true FROM all_emails
  ON CONFLICT (email) DO NOTHING;

  GET DIAGNOSTICS inserted_count = ROW_COUNT;

  RETURN json_build_object('success', true, 'new_subscribers', inserted_count);
END;
$function$;
