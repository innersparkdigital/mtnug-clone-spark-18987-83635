CREATE OR REPLACE FUNCTION public.psych_create_order(_company_id uuid, _pack_id text, _payer_name text DEFAULT NULL, _payer_phone text DEFAULT NULL, _payer_email text DEFAULT NULL, _payment_method text DEFAULT 'mobile_money')
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _ok boolean; _admin_id uuid; _pack record; _order_id uuid;
BEGIN
  SELECT public.is_corporate_hr_admin_for(_company_id) INTO _ok;
  IF NOT _ok THEN RAISE EXCEPTION 'not authorized'; END IF;
  SELECT id INTO _admin_id FROM public.corporate_hr_admins WHERE user_id = auth.uid() AND company_id = _company_id AND is_active LIMIT 1;
  SELECT * INTO _pack FROM public.psych_credit_packs WHERE id = _pack_id AND is_active;
  IF _pack.id IS NULL THEN RAISE EXCEPTION 'invalid pack'; END IF;
  INSERT INTO public.psych_orders (company_id, admin_id, pack_id, credits, amount_ugx, status, payment_method, payer_name, payer_phone, payer_email)
  VALUES (_company_id, _admin_id, _pack.id, _pack.credits, _pack.price_ugx, 'awaiting_payment', _payment_method, _payer_name, _payer_phone, _payer_email)
  RETURNING id INTO _order_id;
  RETURN jsonb_build_object('order_id', _order_id, 'credits', _pack.credits, 'amount_ugx', _pack.price_ugx, 'pack_name', _pack.name, 'status', 'awaiting_payment',
    'pay_instructions', 'Pay via Mobile Money or card. WhatsApp +256 792 085 773 with your order reference to activate credits.');
END; $$;

CREATE OR REPLACE FUNCTION public.psych_confirm_order_paid(_order_id uuid, _payment_ref text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _ord record; _bal integer; _ok boolean;
BEGIN
  SELECT * INTO _ord FROM public.psych_orders WHERE id = _order_id FOR UPDATE;
  IF _ord.id IS NULL THEN RAISE EXCEPTION 'order not found'; END IF;
  IF _ord.status = 'paid' THEN RETURN jsonb_build_object('ok', true, 'already_paid', true); END IF;
  SELECT public.is_corporate_hr_admin_for(_ord.company_id) INTO _ok;
  IF NOT _ok THEN RAISE EXCEPTION 'not authorized'; END IF;
  UPDATE public.psych_orders SET status = 'paid', paid_at = now(), payment_ref = COALESCE(_payment_ref, payment_ref) WHERE id = _order_id;
  INSERT INTO public.psych_company_wallets (company_id, credit_balance) VALUES (_ord.company_id, 0) ON CONFLICT (company_id) DO NOTHING;
  UPDATE public.psych_company_wallets SET credit_balance = credit_balance + _ord.credits, updated_at = now() WHERE company_id = _ord.company_id RETURNING credit_balance INTO _bal;
  INSERT INTO public.psych_credit_ledger (company_id, delta, balance_after, reason, order_id, created_by) VALUES (_ord.company_id, _ord.credits, _bal, 'purchase', _order_id, auth.uid());
  RETURN jsonb_build_object('ok', true, 'credits_added', _ord.credits, 'balance', _bal);
END; $$;

CREATE OR REPLACE FUNCTION public.psych_create_invite(_company_id uuid, _catalog_id text, _employee_name text, _employee_email text DEFAULT NULL, _employee_role text DEFAULT NULL, _department text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _ok boolean; _admin_id uuid; _cat record; _bal integer; _invite_id uuid; _token text; _new_bal integer;
BEGIN
  SELECT public.is_corporate_hr_admin_for(_company_id) INTO _ok;
  IF NOT _ok THEN RAISE EXCEPTION 'not authorized'; END IF;
  IF length(trim(_employee_name)) < 2 THEN RAISE EXCEPTION 'employee name required'; END IF;
  SELECT id INTO _admin_id FROM public.corporate_hr_admins WHERE user_id = auth.uid() AND company_id = _company_id AND is_active LIMIT 1;
  SELECT * INTO _cat FROM public.psych_assessment_catalog WHERE id = _catalog_id AND is_active;
  IF _cat.id IS NULL THEN RAISE EXCEPTION 'invalid assessment'; END IF;
  INSERT INTO public.psych_company_wallets (company_id, credit_balance) VALUES (_company_id, 0) ON CONFLICT (company_id) DO NOTHING;
  SELECT credit_balance INTO _bal FROM public.psych_company_wallets WHERE company_id = _company_id FOR UPDATE;
  IF _bal < _cat.credit_cost THEN RAISE EXCEPTION 'insufficient credits: need %, have %', _cat.credit_cost, _bal; END IF;
  UPDATE public.psych_company_wallets SET credit_balance = credit_balance - _cat.credit_cost, updated_at = now() WHERE company_id = _company_id RETURNING credit_balance INTO _new_bal;
  INSERT INTO public.psych_invites (company_id, admin_id, catalog_id, employee_name, employee_email, employee_role, department, credits_charged)
  VALUES (_company_id, _admin_id, _cat.id, trim(_employee_name), nullif(trim(_employee_email),''), _employee_role, _department, _cat.credit_cost)
  RETURNING id, token INTO _invite_id, _token;
  INSERT INTO public.psych_credit_ledger (company_id, delta, balance_after, reason, invite_id, created_by)
  VALUES (_company_id, -_cat.credit_cost, _new_bal, 'invite:' || _cat.id, _invite_id, auth.uid());
  RETURN jsonb_build_object('invite_id', _invite_id, 'token', _token, 'path', '/assess/' || _token, 'assessment', _cat.name, 'employee_name', trim(_employee_name), 'credits_left', _new_bal);
END; $$;

CREATE OR REPLACE FUNCTION public.psych_get_invite_public(_token text)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE _inv record; _cat record; _co text;
BEGIN
  SELECT * INTO _inv FROM public.psych_invites WHERE token = _token;
  IF _inv.id IS NULL THEN RETURN NULL; END IF;
  IF _inv.status = 'cancelled' OR _inv.expires_at < now() THEN
    RETURN jsonb_build_object('status', 'expired', 'message', 'This assessment link is no longer valid.');
  END IF;
  IF _inv.status = 'completed' THEN
    RETURN jsonb_build_object('status', 'completed', 'message', 'This assessment was already completed. Thank you.');
  END IF;
  SELECT * INTO _cat FROM public.psych_assessment_catalog WHERE id = _inv.catalog_id;
  SELECT name INTO _co FROM public.corporate_companies WHERE id = _inv.company_id;
  IF _inv.status = 'pending' THEN
    UPDATE public.psych_invites SET status = 'opened', opened_at = now() WHERE id = _inv.id AND status = 'pending';
  END IF;
  RETURN jsonb_build_object('status', 'open', 'invite_id', _inv.id, 'token', _inv.token, 'employee_name', _inv.employee_name,
    'company_name', _co, 'catalog_id', _cat.id, 'assessment_name', _cat.name, 'description', _cat.description,
    'duration_minutes', _cat.duration_minutes, 'question_count', _cat.question_count);
END; $$;

CREATE OR REPLACE FUNCTION public.psych_submit_response(_token text, _answers jsonb, _scores jsonb, _report jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _inv record;
BEGIN
  SELECT * INTO _inv FROM public.psych_invites WHERE token = _token FOR UPDATE;
  IF _inv.id IS NULL THEN RAISE EXCEPTION 'invalid link'; END IF;
  IF _inv.status = 'completed' THEN RETURN jsonb_build_object('ok', true, 'already', true); END IF;
  IF _inv.expires_at < now() OR _inv.status = 'cancelled' THEN RAISE EXCEPTION 'link expired'; END IF;
  INSERT INTO public.psych_responses (invite_id, company_id, catalog_id, answers, scores, report)
  VALUES (_inv.id, _inv.company_id, _inv.catalog_id, _answers, _scores, _report)
  ON CONFLICT (invite_id) DO UPDATE SET answers = EXCLUDED.answers, scores = EXCLUDED.scores, report = EXCLUDED.report, completed_at = now();
  UPDATE public.psych_invites SET status = 'completed', completed_at = now() WHERE id = _inv.id;
  RETURN jsonb_build_object('ok', true, 'invite_id', _inv.id);
END; $$;

CREATE OR REPLACE FUNCTION public.psych_hr_overview(_company_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE _ok boolean; _bal integer := 0; _invites jsonb; _orders jsonb; _catalog jsonb; _packs jsonb;
BEGIN
  SELECT public.is_corporate_hr_admin_for(_company_id) INTO _ok;
  IF NOT _ok THEN RAISE EXCEPTION 'not authorized'; END IF;
  SELECT COALESCE(credit_balance, 0) INTO _bal FROM public.psych_company_wallets WHERE company_id = _company_id;
  -- credits_suspended column added in later migration; overview still returns balance only here
  SELECT COALESCE(jsonb_agg(to_jsonb(i) ORDER BY i.created_at DESC), '[]'::jsonb) INTO _invites FROM (
    SELECT inv.id, inv.token, inv.employee_name, inv.employee_email, inv.employee_role, inv.department, inv.status,
      inv.created_at, inv.completed_at, inv.expires_at, inv.catalog_id, c.name AS assessment_name, c.short_name,
      r.scores, r.report, r.id AS response_id
    FROM public.psych_invites inv
    JOIN public.psych_assessment_catalog c ON c.id = inv.catalog_id
    LEFT JOIN public.psych_responses r ON r.invite_id = inv.id
    WHERE inv.company_id = _company_id
  ) i;
  SELECT COALESCE(jsonb_agg(to_jsonb(o) ORDER BY o.created_at DESC), '[]'::jsonb) INTO _orders FROM (
    SELECT id, pack_id, credits, amount_ugx, status, payment_method, payment_ref, created_at, paid_at FROM public.psych_orders WHERE company_id = _company_id
  ) o;
  SELECT COALESCE(jsonb_agg(to_jsonb(c) ORDER BY c.sort_order), '[]'::jsonb) INTO _catalog FROM public.psych_assessment_catalog c WHERE c.is_active;
  SELECT COALESCE(jsonb_agg(to_jsonb(p) ORDER BY p.sort_order), '[]'::jsonb) INTO _packs FROM public.psych_credit_packs p WHERE p.is_active;
  RETURN jsonb_build_object('credit_balance', COALESCE(_bal, 0), 'invites', _invites, 'orders', _orders, 'catalog', _catalog, 'packs', _packs);
END; $$;

GRANT EXECUTE ON FUNCTION public.psych_create_order(uuid, text, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.psych_confirm_order_paid(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.psych_create_invite(uuid, text, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.psych_get_invite_public(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.psych_submit_response(text, jsonb, jsonb, jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.psych_hr_overview(uuid) TO authenticated;
