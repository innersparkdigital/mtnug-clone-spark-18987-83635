ALTER TABLE public.ad_sales_leads
  ADD COLUMN IF NOT EXISTS source_client_id uuid;

CREATE UNIQUE INDEX IF NOT EXISTS ad_sales_leads_source_client_id_idx
  ON public.ad_sales_leads (source_client_id)
  WHERE source_client_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.admin_send_paid_client_to_whatsapp_sales(
  _client_id uuid,
  _name text,
  _phone text,
  _amount_ugx numeric,
  _paid_at timestamptz,
  _booking_type text DEFAULT NULL,
  _country text DEFAULT NULL
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _lead_id uuid;
  _reference text;
  _phone_digits text := regexp_replace(COALESCE(_phone, ''), '[^0-9]', '', 'g');
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;
  IF COALESCE(_amount_ugx, 0) <= 0 THEN
    RAISE EXCEPTION 'A paid amount is required';
  END IF;
  IF _paid_at IS NULL THEN
    RAISE EXCEPTION 'A payment date is required';
  END IF;

  SELECT id, lead_reference
  INTO _lead_id, _reference
  FROM public.ad_sales_leads
  WHERE source_client_id = _client_id
     OR (
       _phone_digits <> ''
       AND regexp_replace(COALESCE(phone, ''), '[^0-9]', '', 'g') = _phone_digits
     )
  ORDER BY
    CASE WHEN source_client_id = _client_id THEN 0 ELSE 1 END,
    created_at DESC
  LIMIT 1;

  IF _lead_id IS NULL THEN
    _reference := 'ISA-' || upper(substr(md5(_client_id::text), 1, 8));
    INSERT INTO public.ad_sales_leads (
      lead_reference, source_client_id, name, phone, booking_type,
      utm_source, utm_content, status, paid_amount_ugx, paid_at
    ) VALUES (
      _reference, _client_id, NULLIF(trim(_name), ''), NULLIF(trim(_phone), ''),
      _booking_type, 'whatsapp', NULLIF(trim(_country), ''), 'paid',
      _amount_ugx, _paid_at
    );
  ELSE
    UPDATE public.ad_sales_leads
    SET source_client_id = _client_id,
        name = COALESCE(NULLIF(trim(_name), ''), name),
        phone = COALESCE(NULLIF(trim(_phone), ''), phone),
        booking_type = COALESCE(_booking_type, booking_type),
        utm_content = COALESCE(NULLIF(trim(_country), ''), utm_content),
        status = 'paid',
        paid_amount_ugx = _amount_ugx,
        paid_at = _paid_at,
        updated_at = now()
    WHERE id = _lead_id;
  END IF;

  RETURN _reference;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_send_paid_client_to_whatsapp_sales(uuid,text,text,numeric,timestamptz,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_send_paid_client_to_whatsapp_sales(uuid,text,text,numeric,timestamptz,text,text) TO authenticated;
