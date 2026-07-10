CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.set_client_passcode(_token uuid, _passcode text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE _row public.therapist_clients%ROWTYPE;
BEGIN
  IF length(coalesce(_passcode,'')) < 4 THEN RAISE EXCEPTION 'Passcode too short'; END IF;
  SELECT * INTO _row FROM public.therapist_clients WHERE access_token = _token;
  IF NOT FOUND THEN RETURN false; END IF;
  IF _row.passcode_hash IS NOT NULL THEN RAISE EXCEPTION 'Passcode already set'; END IF;
  UPDATE public.therapist_clients
     SET passcode_hash = extensions.crypt(_passcode, extensions.gen_salt('bf', 10)),
         last_seen_at = now()
   WHERE id = _row.id;
  RETURN true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.verify_client_passcode(_token uuid, _passcode text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE _hash TEXT; _id UUID;
BEGIN
  SELECT id, passcode_hash INTO _id, _hash FROM public.therapist_clients WHERE access_token = _token;
  IF NOT FOUND OR _hash IS NULL THEN RETURN false; END IF;
  IF _hash = extensions.crypt(_passcode, _hash) THEN
    UPDATE public.therapist_clients SET last_seen_at = now() WHERE id = _id;
    RETURN true;
  END IF;
  RETURN false;
END;
$function$;