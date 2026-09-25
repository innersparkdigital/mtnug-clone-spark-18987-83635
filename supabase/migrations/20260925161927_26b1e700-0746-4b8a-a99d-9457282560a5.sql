-- Staff-only overview. Keep employee-level answers and reports out of this response.
CREATE OR REPLACE FUNCTION public.admin_corporate_account_overview(_company_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE _admins jsonb; _requests jsonb; _orders jsonb; _invites jsonb; _balance integer;
BEGIN
  IF NOT COALESCE(public.has_role(auth.uid(), 'admin'), false) THEN RAISE EXCEPTION 'not authorized'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.corporate_companies WHERE id = _company_id) THEN RAISE EXCEPTION 'company not found'; END IF;
  SELECT COALESCE(jsonb_agg(jsonb_build_object('id', id, 'full_name', full_name, 'email', email, 'is_active', is_active, 'created_at', created_at) ORDER BY created_at DESC), '[]'::jsonb)
    INTO _admins FROM public.corporate_hr_admins WHERE company_id = _company_id;
  SELECT COALESCE(jsonb_agg(jsonb_build_object('id', id, 'request_type', request_type, 'service_code', service_code, 'message', message, 'status', status, 'created_at', created_at) ORDER BY created_at DESC), '[]'::jsonb)
    INTO _requests FROM public.corporate_hr_service_requests WHERE company_id = _company_id;
  SELECT COALESCE(jsonb_agg(jsonb_build_object('id', id, 'credits', credits, 'amount_ugx', amount_ugx, 'status', status, 'payment_ref', payment_ref, 'created_at', created_at, 'paid_at', paid_at) ORDER BY created_at DESC), '[]'::jsonb)
    INTO _orders FROM public.psych_orders WHERE company_id = _company_id;
  SELECT COALESCE(credit_balance, 0) INTO _balance FROM public.psych_company_wallets WHERE company_id = _company_id;
  SELECT jsonb_build_object('issued', COUNT(*), 'completed', COUNT(*) FILTER (WHERE status = 'completed')) INTO _invites
    FROM public.psych_invites WHERE company_id = _company_id;
  RETURN jsonb_build_object('admins', _admins, 'requests', _requests, 'orders', _orders, 'credit_balance', COALESCE(_balance, 0), 'assessment_invites', _invites);
END; $$;
REVOKE ALL ON FUNCTION public.admin_corporate_account_overview(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_corporate_account_overview(uuid) TO authenticated;

-- Only staff may verify a payment and grant credits. Lock the order row for idempotency.
CREATE OR REPLACE FUNCTION public.psych_confirm_order_paid(_order_id uuid, _payment_ref text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _ord record; _bal integer;
BEGIN
  IF NOT COALESCE(public.has_role(auth.uid(), 'admin'), false) THEN RAISE EXCEPTION 'not authorized'; END IF;
  IF NULLIF(trim(_payment_ref), '') IS NULL THEN RAISE EXCEPTION 'payment reference required'; END IF;
  SELECT * INTO _ord FROM public.psych_orders WHERE id = _order_id FOR UPDATE;
  IF _ord.id IS NULL THEN RAISE EXCEPTION 'order not found'; END IF;
  IF _ord.status = 'paid' THEN RETURN jsonb_build_object('ok', true, 'already_paid', true); END IF;
  IF _ord.status <> 'awaiting_payment' THEN RAISE EXCEPTION 'order is not awaiting payment'; END IF;
  UPDATE public.psych_orders SET status = 'paid', paid_at = now(), payment_ref = trim(_payment_ref) WHERE id = _order_id;
  INSERT INTO public.psych_company_wallets (company_id, credit_balance) VALUES (_ord.company_id, 0) ON CONFLICT (company_id) DO NOTHING;
  UPDATE public.psych_company_wallets SET credit_balance = credit_balance + _ord.credits, updated_at = now()
    WHERE company_id = _ord.company_id RETURNING credit_balance INTO _bal;
  INSERT INTO public.psych_credit_ledger (company_id, delta, balance_after, reason, order_id, created_by)
    VALUES (_ord.company_id, _ord.credits, _bal, 'purchase', _order_id, auth.uid());
  RETURN jsonb_build_object('ok', true, 'credits_added', _ord.credits, 'balance', _bal);
END; $$;
REVOKE ALL ON FUNCTION public.psych_confirm_order_paid(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.psych_confirm_order_paid(uuid, text) TO authenticated;

-- HR creates orders and invites through checked functions only, never arbitrary row inserts.
DROP POLICY IF EXISTS psych_orders_hr_ins ON public.psych_orders;
DROP POLICY IF EXISTS psych_invites_hr_ins ON public.psych_invites;
DROP POLICY IF EXISTS psych_invites_hr_upd ON public.psych_invites;
-- HR may record consent/change-password completion but cannot transfer its account to another company.
REVOKE UPDATE ON public.corporate_hr_admins FROM authenticated;
GRANT UPDATE (consent_accepted_at, consent_version, must_change_password) ON public.corporate_hr_admins TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_set_corporate_hr_active(_company_id uuid, _admin_id uuid, _active boolean)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT COALESCE(public.has_role(auth.uid(), 'admin'), false) THEN RAISE EXCEPTION 'not authorized'; END IF;
  UPDATE public.corporate_hr_admins SET is_active = _active, updated_at = now() WHERE id = _admin_id AND company_id = _company_id;
  RETURN FOUND;
END; $$;
REVOKE ALL ON FUNCTION public.admin_set_corporate_hr_active(uuid, uuid, boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_set_corporate_hr_active(uuid, uuid, boolean) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_update_corporate_request(_request_id uuid, _status text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT COALESCE(public.has_role(auth.uid(), 'admin'), false) THEN RAISE EXCEPTION 'not authorized'; END IF;
  IF _status NOT IN ('new','in_progress','done','closed') THEN RAISE EXCEPTION 'invalid status'; END IF;
  UPDATE public.corporate_hr_service_requests SET status = _status WHERE id = _request_id;
  RETURN FOUND;
END; $$;
REVOKE ALL ON FUNCTION public.admin_update_corporate_request(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_update_corporate_request(uuid, text) TO authenticated;