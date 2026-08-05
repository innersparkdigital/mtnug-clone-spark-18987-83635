GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;

ALTER TABLE public.therapist_clients
  ADD COLUMN IF NOT EXISTS client_type text NOT NULL DEFAULT 'new';

CREATE OR REPLACE FUNCTION public.admin_create_client(
  _therapist_id uuid, _full_name text, _email text DEFAULT NULL::text, _phone text DEFAULT NULL::text,
  _presenting_concern text DEFAULT NULL::text, _country text DEFAULT 'Uganda'::text,
  _session_type text DEFAULT NULL::text, _duration_mins integer DEFAULT NULL::integer,
  _last_session_date date DEFAULT NULL::date, _next_session_date date DEFAULT NULL::date,
  _amount_ugx numeric DEFAULT NULL::numeric, _therapist_share_ugx numeric DEFAULT NULL::numeric,
  _paid_status text DEFAULT NULL::text, _session_rating integer DEFAULT NULL::integer,
  _would_rebook boolean DEFAULT NULL::boolean, _client_type text DEFAULT 'new'::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE new_id uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  INSERT INTO public.therapist_clients (
    therapist_id, full_name, email, phone, presenting_concern, country,
    session_type, duration_mins, last_session_date, next_session_date,
    amount_ugx, therapist_share_ugx, innerspark_share_ugx, paid_status,
    session_rating, would_rebook, client_type
  ) VALUES (
    _therapist_id, _full_name, NULLIF(_email,''), NULLIF(_phone,''),
    NULLIF(_presenting_concern,''), COALESCE(NULLIF(_country,''),'Uganda'),
    NULLIF(_session_type,''), _duration_mins, _last_session_date, _next_session_date,
    _amount_ugx,
    COALESCE(_therapist_share_ugx, CASE WHEN _amount_ugx IS NOT NULL THEN round(_amount_ugx * 0.85) END),
    CASE WHEN _amount_ugx IS NOT NULL
      THEN _amount_ugx - COALESCE(_therapist_share_ugx, round(_amount_ugx * 0.85)) END,
    COALESCE(NULLIF(_paid_status,''),'unpaid'),
    _session_rating, _would_rebook, COALESCE(NULLIF(_client_type,''),'new')
  ) RETURNING id INTO new_id;

  RETURN new_id;
END;
$function$;