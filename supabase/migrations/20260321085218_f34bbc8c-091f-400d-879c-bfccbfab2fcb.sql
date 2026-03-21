
-- Function to clear mind check analytics data (admin only)
CREATE OR REPLACE FUNCTION public.clear_mindcheck_data(tables_to_clear text[])
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result json;
  deleted_counts json := '{}'::json;
  tbl text;
  cnt integer;
BEGIN
  -- Verify caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  -- Clear requested tables
  FOREACH tbl IN ARRAY tables_to_clear
  LOOP
    CASE tbl
      WHEN 'assessment_sessions' THEN
        DELETE FROM public.assessment_sessions;
        GET DIAGNOSTICS cnt = ROW_COUNT;
      WHEN 'assessment_emails' THEN
        DELETE FROM public.assessment_emails;
        GET DIAGNOSTICS cnt = ROW_COUNT;
      WHEN 'mindcheck_page_visits' THEN
        DELETE FROM public.mindcheck_page_visits;
        GET DIAGNOSTICS cnt = ROW_COUNT;
      WHEN 'who5_sessions' THEN
        DELETE FROM public.who5_sessions;
        GET DIAGNOSTICS cnt = ROW_COUNT;
      WHEN 'who5_cta_clicks' THEN
        DELETE FROM public.who5_cta_clicks;
        GET DIAGNOSTICS cnt = ROW_COUNT;
      WHEN 'callback_requests' THEN
        DELETE FROM public.callback_requests;
        GET DIAGNOSTICS cnt = ROW_COUNT;
      ELSE
        RAISE EXCEPTION 'Unknown table: %', tbl;
    END CASE;
  END LOOP;

  RETURN json_build_object('success', true, 'message', 'Data cleared successfully');
END;
$$;

-- Allow admins to delete from analytics tables
CREATE POLICY "Admins can delete assessment sessions"
ON public.assessment_sessions FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete assessment emails"
ON public.assessment_emails FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete page visits"
ON public.mindcheck_page_visits FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete WHO-5 sessions"
ON public.who5_sessions FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete WHO-5 CTA clicks"
ON public.who5_cta_clicks FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete callback requests"
ON public.callback_requests FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));
