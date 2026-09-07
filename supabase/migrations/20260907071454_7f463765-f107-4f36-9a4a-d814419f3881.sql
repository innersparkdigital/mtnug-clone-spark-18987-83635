CREATE OR REPLACE FUNCTION public.submit_chat_lead(
  _session_id text,
  _anonymous_id text,
  _phone text,
  _intent text,
  _source_path text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  IF _phone IS NULL OR length(regexp_replace(_phone, '\D', '', 'g')) < 8 THEN
    RAISE EXCEPTION 'A valid phone number is required';
  END IF;

  INSERT INTO public.chat_leads (session_id, anonymous_id, phone, intent, source_path)
  VALUES (_session_id, _anonymous_id, _phone, _intent, _source_path)
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.enrich_chat_lead(
  _id uuid,
  _name text,
  _email text,
  _message text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated int;
BEGIN
  UPDATE public.chat_leads
     SET name = COALESCE(NULLIF(_name, ''), name),
         email = COALESCE(NULLIF(_email, ''), email),
         message = COALESCE(NULLIF(_message, ''), message)
   WHERE id = _id
     AND created_at > now() - interval '2 hours';

  GET DIAGNOSTICS updated = ROW_COUNT;
  RETURN updated > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_chat_lead(text, text, text, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.enrich_chat_lead(uuid, text, text, text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.submit_chat_lead(text, text, text, text, text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.enrich_chat_lead(uuid, text, text, text) TO anon, authenticated, service_role;