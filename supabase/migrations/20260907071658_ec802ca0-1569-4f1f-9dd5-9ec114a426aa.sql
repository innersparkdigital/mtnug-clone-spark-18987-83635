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
  sid uuid;
BEGIN
  IF _phone IS NULL OR length(regexp_replace(_phone, '\D', '', 'g')) < 8 THEN
    RAISE EXCEPTION 'A valid phone number is required';
  END IF;

  BEGIN
    sid := NULLIF(_session_id, '')::uuid;
  EXCEPTION WHEN others THEN
    sid := NULL;
  END;

  INSERT INTO public.chat_leads (session_id, anonymous_id, phone, intent, source_path)
  VALUES (sid, _anonymous_id, _phone, _intent, _source_path)
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;