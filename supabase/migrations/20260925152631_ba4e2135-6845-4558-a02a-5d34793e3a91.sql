CREATE TABLE IF NOT EXISTS public.ad_sales_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_reference text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  name text,
  email text,
  phone text,
  booking_type text,
  session_format text,
  expected_value_ugx numeric NOT NULL DEFAULT 0,
  landing_path text,
  gclid text,
  gbraid text,
  wbraid text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'paid', 'lost')),
  paid_amount_ugx numeric,
  paid_at timestamptz,
  exported_at timestamptz,
  source_client_id uuid
);
GRANT ALL ON public.ad_sales_leads TO service_role;
ALTER TABLE public.ad_sales_leads ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS ad_sales_leads_created_at_idx ON public.ad_sales_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS ad_sales_leads_status_idx ON public.ad_sales_leads (status);
CREATE UNIQUE INDEX IF NOT EXISTS ad_sales_leads_source_client_id_idx ON public.ad_sales_leads (source_client_id) WHERE source_client_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.create_ad_sales_lead(
  _lead_reference text, _name text DEFAULT NULL, _email text DEFAULT NULL, _phone text DEFAULT NULL,
  _booking_type text DEFAULT NULL, _session_format text DEFAULT NULL, _expected_value_ugx numeric DEFAULT 0,
  _landing_path text DEFAULT NULL, _gclid text DEFAULT NULL, _gbraid text DEFAULT NULL, _wbraid text DEFAULT NULL,
  _utm_source text DEFAULT NULL, _utm_medium text DEFAULT NULL, _utm_campaign text DEFAULT NULL,
  _utm_content text DEFAULT NULL, _utm_term text DEFAULT NULL
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _id uuid;
BEGIN
  IF _lead_reference !~ '^ISA-[A-Z0-9]{8}$' THEN RAISE EXCEPTION 'Invalid lead reference'; END IF;
  INSERT INTO public.ad_sales_leads (lead_reference, name, email, phone, booking_type, session_format,
    expected_value_ugx, landing_path, gclid, gbraid, wbraid, utm_source, utm_medium, utm_campaign, utm_content, utm_term)
  VALUES (_lead_reference, NULLIF(trim(_name),''), NULLIF(trim(_email),''), NULLIF(trim(_phone),''), _booking_type, _session_format,
    GREATEST(COALESCE(_expected_value_ugx,0),0), _landing_path, NULLIF(trim(_gclid),''), NULLIF(trim(_gbraid),''), NULLIF(trim(_wbraid),''),
    NULLIF(trim(_utm_source),''), NULLIF(trim(_utm_medium),''), NULLIF(trim(_utm_campaign),''), NULLIF(trim(_utm_content),''), NULLIF(trim(_utm_term),''))
  ON CONFLICT (lead_reference) DO UPDATE SET name=EXCLUDED.name, email=EXCLUDED.email, phone=EXCLUDED.phone, updated_at=now()
  RETURNING id INTO _id;
  RETURN _id;
END; $$;
REVOKE ALL ON FUNCTION public.create_ad_sales_lead(text,text,text,text,text,text,numeric,text,text,text,text,text,text,text,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_ad_sales_lead(text,text,text,text,text,text,numeric,text,text,text,text,text,text,text,text,text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.admin_list_ad_sales_leads()
RETURNS json LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE result json;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Unauthorized: admin role required'; END IF;
  SELECT COALESCE(json_agg(row_to_json(x) ORDER BY x.created_at DESC), '[]'::json) INTO result
  FROM (SELECT * FROM public.ad_sales_leads ORDER BY created_at DESC LIMIT 2000) x;
  RETURN result;
END; $$;
REVOKE ALL ON FUNCTION public.admin_list_ad_sales_leads() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_list_ad_sales_leads() TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_update_ad_sales_lead(_id uuid, _status text, _paid_amount_ugx numeric DEFAULT NULL, _paid_at timestamptz DEFAULT NULL)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Unauthorized: admin role required'; END IF;
  IF _status NOT IN ('new','paid','lost') THEN RAISE EXCEPTION 'Invalid status'; END IF;
  IF _status = 'paid' AND COALESCE(_paid_amount_ugx,0) <= 0 THEN RAISE EXCEPTION 'Paid sales require an amount'; END IF;
  UPDATE public.ad_sales_leads SET status=_status,
    paid_amount_ugx = CASE WHEN _status='paid' THEN _paid_amount_ugx ELSE NULL END,
    paid_at = CASE WHEN _status='paid' THEN COALESCE(_paid_at, now()) ELSE NULL END,
    updated_at = now()
  WHERE id=_id;
  RETURN FOUND;
END; $$;
REVOKE ALL ON FUNCTION public.admin_update_ad_sales_lead(uuid,text,numeric,timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_update_ad_sales_lead(uuid,text,numeric,timestamptz) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_send_paid_client_to_whatsapp_sales(
  _client_id uuid, _name text, _phone text, _amount_ugx numeric, _paid_at timestamptz,
  _booking_type text DEFAULT NULL, _country text DEFAULT NULL
) RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _lead_id uuid; _reference text;
  _phone_digits text := regexp_replace(COALESCE(_phone,''), '[^0-9]', '', 'g');
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Unauthorized: admin role required'; END IF;
  IF COALESCE(_amount_ugx,0) <= 0 THEN RAISE EXCEPTION 'A paid amount is required'; END IF;
  IF _paid_at IS NULL THEN RAISE EXCEPTION 'A payment date is required'; END IF;
  SELECT id, lead_reference INTO _lead_id, _reference FROM public.ad_sales_leads
  WHERE source_client_id=_client_id OR (_phone_digits <> '' AND regexp_replace(COALESCE(phone,''), '[^0-9]', '', 'g') = _phone_digits)
  ORDER BY CASE WHEN source_client_id=_client_id THEN 0 ELSE 1 END, created_at DESC LIMIT 1;
  IF _lead_id IS NULL THEN
    _reference := 'ISA-' || upper(substr(md5(_client_id::text),1,8));
    INSERT INTO public.ad_sales_leads (lead_reference, source_client_id, name, phone, booking_type, utm_source, utm_content, status, paid_amount_ugx, paid_at)
    VALUES (_reference, _client_id, NULLIF(trim(_name),''), NULLIF(trim(_phone),''), _booking_type, 'whatsapp', NULLIF(trim(_country),''), 'paid', _amount_ugx, _paid_at);
  ELSE
    UPDATE public.ad_sales_leads SET source_client_id=_client_id,
      name=COALESCE(NULLIF(trim(_name),''), name), phone=COALESCE(NULLIF(trim(_phone),''), phone),
      booking_type=COALESCE(_booking_type, booking_type), utm_content=COALESCE(NULLIF(trim(_country),''), utm_content),
      status='paid', paid_amount_ugx=_amount_ugx, paid_at=_paid_at, updated_at=now()
    WHERE id=_lead_id;
  END IF;
  RETURN _reference;
END; $$;
REVOKE ALL ON FUNCTION public.admin_send_paid_client_to_whatsapp_sales(uuid,text,text,numeric,timestamptz,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_send_paid_client_to_whatsapp_sales(uuid,text,text,numeric,timestamptz,text,text) TO authenticated;