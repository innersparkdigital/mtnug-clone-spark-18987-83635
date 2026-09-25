-- Phase A: secure client portal sessions + one-time invitations (additive only)

CREATE TABLE public.client_portal_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.therapist_clients(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  purpose text NOT NULL DEFAULT 'portal' CHECK (purpose IN ('portal','reset')),
  reset_request_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  revoked_reason text
);
CREATE INDEX client_portal_sessions_client_idx ON public.client_portal_sessions(client_id);
GRANT ALL ON public.client_portal_sessions TO service_role;
ALTER TABLE public.client_portal_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view client portal sessions" ON public.client_portal_sessions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
GRANT SELECT ON public.client_portal_sessions TO authenticated;

CREATE TABLE public.client_portal_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.therapist_clients(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  issued_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  revoked_at timestamptz
);
CREATE INDEX client_portal_invites_client_idx ON public.client_portal_invites(client_id);
GRANT SELECT ON public.client_portal_invites TO authenticated;
GRANT ALL ON public.client_portal_invites TO service_role;
ALTER TABLE public.client_portal_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins or own therapist can view invites" ON public.client_portal_invites
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.is_client_therapist(client_id));

CREATE TABLE public.client_login_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_hash text NOT NULL,
  success boolean NOT NULL,
  attempted_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX client_login_attempts_key_idx ON public.client_login_attempts(key_hash, attempted_at DESC);
GRANT ALL ON public.client_login_attempts TO service_role;
ALTER TABLE public.client_login_attempts ENABLE ROW LEVEL SECURITY;
-- no client-facing policies: only definer functions touch this table

-- ---------- helpers (not callable by clients) ----------
CREATE OR REPLACE FUNCTION public._cp_hash(_v text) RETURNS text
LANGUAGE sql IMMUTABLE SET search_path = public, extensions
AS $$ SELECT encode(extensions.digest(_v, 'sha256'), 'hex') $$;

CREATE OR REPLACE FUNCTION public._cp_new_token() RETURNS text
LANGUAGE sql VOLATILE SET search_path = public, extensions
AS $$ SELECT encode(extensions.gen_random_bytes(32), 'hex') $$;

CREATE OR REPLACE FUNCTION public._cp_norm_phone(_p text) RETURNS text
LANGUAGE sql IMMUTABLE SET search_path = public
AS $$
  SELECT CASE
    WHEN d IS NULL OR d = '' THEN NULL
    WHEN length(d) = 10 AND left(d,1) = '0' THEN '256' || substr(d,2)
    ELSE d END
  FROM (SELECT regexp_replace(coalesce(_p,''), '\D', '', 'g') AS d) s
$$;

CREATE OR REPLACE FUNCTION public._cp_create_session(_client_id uuid, _purpose text, _reset_request_id uuid DEFAULT NULL)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions
AS $$
DECLARE t text := public._cp_new_token();
BEGIN
  INSERT INTO public.client_portal_sessions(client_id, token_hash, purpose, reset_request_id, expires_at)
  VALUES (_client_id, public._cp_hash(t), _purpose, _reset_request_id,
          now() + CASE WHEN _purpose = 'reset' THEN interval '15 minutes' ELSE interval '12 hours' END);
  RETURN t;
END $$;

-- Returns client id for a live session of the given purpose; refreshes idle timer.
CREATE OR REPLACE FUNCTION public._cp_session_client(_session text, _purpose text DEFAULT 'portal')
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions
AS $$
DECLARE s public.client_portal_sessions%rowtype;
BEGIN
  IF _session IS NULL OR length(_session) < 32 THEN RETURN NULL; END IF;
  SELECT * INTO s FROM public.client_portal_sessions WHERE token_hash = public._cp_hash(_session) FOR UPDATE;
  IF s.id IS NULL OR s.revoked_at IS NOT NULL OR s.purpose <> _purpose THEN RETURN NULL; END IF;
  IF s.expires_at <= now() OR s.last_seen_at <= now() - interval '30 minutes' THEN
    UPDATE public.client_portal_sessions SET revoked_at = now(), revoked_reason = 'expired' WHERE id = s.id;
    RETURN NULL;
  END IF;
  UPDATE public.client_portal_sessions SET last_seen_at = now() WHERE id = s.id;
  RETURN s.client_id;
END $$;

REVOKE ALL ON FUNCTION public._cp_hash(text), public._cp_new_token(), public._cp_norm_phone(text),
  public._cp_create_session(uuid, text, uuid), public._cp_session_client(text, text) FROM PUBLIC, anon, authenticated;

-- ---------- login ----------
CREATE OR REPLACE FUNCTION public.client_login(_contact text, _passcode text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions
AS $$
DECLARE
  _c text := lower(trim(coalesce(_contact,'')));
  _is_email boolean := position('@' in _c) > 0;
  _norm text;
  _key text;
  _matches uuid[] := '{}';
  _cid uuid;
  r record;
  rr public.manual_password_reset_requests%rowtype;
  _generic jsonb := jsonb_build_object('ok', false, 'error', 'invalid',
    'message', 'We could not sign you in with those details. Check them and try again, or contact InnerSpark support.');
BEGIN
  _norm := CASE WHEN _is_email THEN _c ELSE public._cp_norm_phone(_c) END;
  IF _norm IS NULL OR length(_norm) < 5 OR coalesce(length(_passcode),0) < 4 OR length(_passcode) > 128 THEN
    RETURN _generic;
  END IF;
  _key := public._cp_hash('contact:' || _norm);

  IF (SELECT count(*) FROM public.client_login_attempts
      WHERE key_hash = _key AND NOT success AND attempted_at > now() - interval '15 minutes') >= 5 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'locked',
      'message', 'Too many attempts. Please wait 15 minutes, or contact InnerSpark support.');
  END IF;

  FOR r IN
    SELECT id, passcode_hash FROM public.therapist_clients
    WHERE passcode_hash IS NOT NULL AND (
      (_is_email AND lower(trim(email)) = _norm) OR
      (NOT _is_email AND public._cp_norm_phone(phone) = _norm))
  LOOP
    IF extensions.crypt(_passcode, r.passcode_hash) = r.passcode_hash THEN
      _matches := _matches || r.id;
    END IF;
  END LOOP;

  IF array_length(_matches, 1) IS NULL THEN
    INSERT INTO public.client_login_attempts(key_hash, success) VALUES (_key, false);
    RETURN _generic;
  END IF;

  IF array_length(_matches, 1) > 1 THEN
    -- Fail closed: never pick a record when several share contact + passcode.
    INSERT INTO public.client_login_attempts(key_hash, success) VALUES (_key, false);
    RETURN jsonb_build_object('ok', false, 'error', 'ambiguous',
      'message', 'We could not sign you in automatically. Please contact InnerSpark support so we can help.');
  END IF;

  _cid := _matches[1];
  INSERT INTO public.client_login_attempts(key_hash, success) VALUES (_key, true);

  -- Temporary passcode issued through the manual reset workflow?
  SELECT * INTO rr FROM public.manual_password_reset_requests
  WHERE account_type = 'client' AND account_id = _cid AND status IN ('ready','sent')
  ORDER BY revealed_at DESC LIMIT 1;
  IF rr.id IS NOT NULL THEN
    IF rr.expires_at IS NULL OR rr.expires_at <= now() THEN
      UPDATE public.manual_password_reset_requests SET status='expired', updated_at=now() WHERE id=rr.id;
      UPDATE public.therapist_clients SET passcode_hash = NULL WHERE id = _cid;
      RETURN jsonb_build_object('ok', false, 'error', 'expired',
        'message', 'That temporary passcode has expired. Please request a new one.');
    END IF;
    UPDATE public.manual_password_reset_requests SET status='used', consumed_at=now(), updated_at=now()
      WHERE id = rr.id AND status IN ('ready','sent');
    UPDATE public.therapist_clients SET passcode_hash = NULL WHERE id = _cid;
    RETURN jsonb_build_object('ok', true, 'must_set_passcode', true,
      'session', public._cp_create_session(_cid, 'reset', rr.id));
  END IF;

  RETURN jsonb_build_object('ok', true, 'must_set_passcode', false,
    'session', public._cp_create_session(_cid, 'portal'));
END $$;

-- Completes a temporary reset: new passcode required before any portal data.
CREATE OR REPLACE FUNCTION public.client_complete_reset(_session text, _new_passcode text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions
AS $$
DECLARE s public.client_portal_sessions%rowtype; _cid uuid;
BEGIN
  IF coalesce(length(_new_passcode),0) < 6 OR length(_new_passcode) > 128 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'weak', 'message', 'Passcode must be at least 6 characters.');
  END IF;
  _cid := public._cp_session_client(_session, 'reset');
  IF _cid IS NULL THEN RETURN jsonb_build_object('ok', false, 'error', 'session'); END IF;
  SELECT * INTO s FROM public.client_portal_sessions WHERE token_hash = public._cp_hash(_session);
  UPDATE public.therapist_clients SET passcode_hash = extensions.crypt(_new_passcode, extensions.gen_salt('bf')) WHERE id = _cid;
  UPDATE public.manual_password_reset_requests SET status='completed', completed_at=now(), updated_at=now()
    WHERE id = s.reset_request_id AND account_id = _cid AND status = 'used';
  UPDATE public.client_portal_sessions SET revoked_at = now(), revoked_reason = 'passcode_changed'
    WHERE client_id = _cid AND revoked_at IS NULL;
  RETURN jsonb_build_object('ok', true, 'session', public._cp_create_session(_cid, 'portal'));
END $$;

-- ---------- invitations ----------
CREATE OR REPLACE FUNCTION public.issue_client_invite(_client_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions
AS $$
DECLARE t text; _exp timestamptz := now() + interval '48 hours';
BEGIN
  IF auth.uid() IS NULL OR NOT (public.has_role(auth.uid(), 'admin') OR public.is_client_therapist(_client_id)) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.therapist_clients WHERE id = _client_id AND passcode_hash IS NULL) THEN
    RAISE EXCEPTION 'Client already has a passcode; use the reset workflow instead';
  END IF;
  UPDATE public.client_portal_invites SET revoked_at = now()
    WHERE client_id = _client_id AND used_at IS NULL AND revoked_at IS NULL;
  t := public._cp_new_token();
  INSERT INTO public.client_portal_invites(client_id, token_hash, issued_by, expires_at)
  VALUES (_client_id, public._cp_hash(t), auth.uid(), _exp);
  RETURN jsonb_build_object('invite', t, 'expires_at', _exp);
END $$;

CREATE OR REPLACE FUNCTION public.client_accept_invite(_invite text, _new_passcode text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions
AS $$
DECLARE i public.client_portal_invites%rowtype; _has_contact boolean;
  _bad jsonb := jsonb_build_object('ok', false, 'error', 'invalid',
    'message', 'This invitation link is not valid or has expired. Ask your therapist for a new one.');
BEGIN
  IF coalesce(length(_new_passcode),0) < 6 OR length(_new_passcode) > 128 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'weak', 'message', 'Passcode must be at least 6 characters.');
  END IF;
  IF _invite IS NULL OR length(_invite) < 32 THEN RETURN _bad; END IF;
  SELECT * INTO i FROM public.client_portal_invites WHERE token_hash = public._cp_hash(_invite) FOR UPDATE;
  IF i.id IS NULL OR i.used_at IS NOT NULL OR i.revoked_at IS NOT NULL OR i.expires_at <= now() THEN RETURN _bad; END IF;
  UPDATE public.client_portal_invites SET used_at = now() WHERE id = i.id;
  UPDATE public.therapist_clients SET passcode_hash = extensions.crypt(_new_passcode, extensions.gen_salt('bf'))
    WHERE id = i.client_id AND passcode_hash IS NULL;
  IF NOT FOUND THEN RETURN _bad; END IF;
  SELECT (nullif(trim(email),'') IS NOT NULL OR public._cp_norm_phone(phone) IS NOT NULL) INTO _has_contact
    FROM public.therapist_clients WHERE id = i.client_id;
  RETURN jsonb_build_object('ok', true, 'session', public._cp_create_session(i.client_id, 'portal'),
    'needs_contact', NOT _has_contact);
END $$;

-- ---------- session-bound portal wrappers ----------
CREATE OR REPLACE FUNCTION public.client_session_snapshot(_session text)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE _cid uuid; _tok uuid;
BEGIN
  _cid := public._cp_session_client(_session, 'portal');
  IF _cid IS NULL THEN RAISE EXCEPTION 'session_invalid' USING ERRCODE = '28000'; END IF;
  SELECT access_token INTO _tok FROM public.therapist_clients WHERE id = _cid;
  RETURN public.client_snapshot(_tok);
END $$;

CREATE OR REPLACE FUNCTION public.client_session_reactions(_session text)
RETURNS SETOF json LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE _cid uuid; _tok uuid;
BEGIN
  _cid := public._cp_session_client(_session, 'portal');
  IF _cid IS NULL THEN RAISE EXCEPTION 'session_invalid' USING ERRCODE = '28000'; END IF;
  SELECT access_token INTO _tok FROM public.therapist_clients WHERE id = _cid;
  RETURN QUERY SELECT row_to_json(x) FROM public.get_client_reactions_by_token(_tok) x;
END $$;

CREATE OR REPLACE FUNCTION public.client_session_save_submission(
  _session text, _assignment_tool_id uuid, _payload jsonb, _final boolean,
  _mood_score integer DEFAULT NULL, _screening_score integer DEFAULT NULL,
  _screening_severity text DEFAULT NULL, _safety_flag boolean DEFAULT false)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE _cid uuid; _tok uuid;
BEGIN
  _cid := public._cp_session_client(_session, 'portal');
  IF _cid IS NULL THEN RAISE EXCEPTION 'session_invalid' USING ERRCODE = '28000'; END IF;
  SELECT access_token INTO _tok FROM public.therapist_clients WHERE id = _cid;
  -- save_tool_submission verifies the tool belongs to this client's assignment
  RETURN public.save_tool_submission(_tok, _assignment_tool_id, _payload, _final,
    _mood_score, _screening_score, _screening_severity, _safety_flag);
END $$;

CREATE OR REPLACE FUNCTION public.client_logout(_session text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions
AS $$
BEGIN
  IF _session IS NULL THEN RETURN false; END IF;
  UPDATE public.client_portal_sessions SET revoked_at = now(), revoked_reason = 'logout'
    WHERE token_hash = public._cp_hash(_session) AND revoked_at IS NULL;
  RETURN FOUND;
END $$;

CREATE OR REPLACE FUNCTION public.revoke_client_sessions(_client_id uuid)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE n integer;
BEGIN
  IF auth.uid() IS NULL OR NOT (public.has_role(auth.uid(), 'admin') OR public.is_client_therapist(_client_id)) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  UPDATE public.client_portal_sessions SET revoked_at = now(), revoked_reason = 'staff_revoked'
    WHERE client_id = _client_id AND revoked_at IS NULL;
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n;
END $$;

REVOKE ALL ON FUNCTION public.client_login(text,text), public.client_complete_reset(text,text),
  public.issue_client_invite(uuid), public.client_accept_invite(text,text),
  public.client_session_snapshot(text), public.client_session_reactions(text),
  public.client_session_save_submission(text,uuid,jsonb,boolean,integer,integer,text,boolean),
  public.client_logout(text), public.revoke_client_sessions(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.client_login(text,text), public.client_complete_reset(text,text),
  public.client_accept_invite(text,text), public.client_session_snapshot(text),
  public.client_session_reactions(text),
  public.client_session_save_submission(text,uuid,jsonb,boolean,integer,integer,text,boolean),
  public.client_logout(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.issue_client_invite(uuid), public.revoke_client_sessions(uuid) TO authenticated;