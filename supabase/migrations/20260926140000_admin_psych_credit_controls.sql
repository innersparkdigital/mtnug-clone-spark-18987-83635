-- Staff controls for company psychometric wallets (Demo Ltd, etc.)
-- Approve payment orders, grant/renew packs, suspend (zero) credits, set exact balance.

alter table public.psych_company_wallets
  add column if not exists credits_suspended boolean not null default false,
  add column if not exists suspended_at timestamptz,
  add column if not exists suspended_reason text;

-- Snapshot for admin UI (includes packs + suspended flag)
create or replace function public.admin_corporate_account_overview(_company_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  _admins jsonb; _requests jsonb; _orders jsonb; _invites jsonb;
  _balance integer; _suspended boolean; _packs jsonb; _ledger jsonb;
begin
  if not coalesce(public.has_role(auth.uid(), 'admin'), false) then raise exception 'not authorized'; end if;
  if not exists (select 1 from public.corporate_companies where id = _company_id) then raise exception 'company not found'; end if;

  select coalesce(jsonb_agg(jsonb_build_object(
      'id', id, 'full_name', full_name, 'email', email, 'is_active', is_active, 'created_at', created_at
    ) order by created_at desc), '[]'::jsonb)
    into _admins from public.corporate_hr_admins where company_id = _company_id;

  select coalesce(jsonb_agg(jsonb_build_object(
      'id', id, 'request_type', request_type, 'service_code', service_code,
      'message', message, 'status', status, 'created_at', created_at
    ) order by created_at desc), '[]'::jsonb)
    into _requests from public.corporate_hr_service_requests where company_id = _company_id;

  select coalesce(jsonb_agg(jsonb_build_object(
      'id', id, 'pack_id', pack_id, 'credits', credits, 'amount_ugx', amount_ugx,
      'status', status, 'payment_ref', payment_ref, 'payment_method', payment_method,
      'payer_name', payer_name, 'payer_phone', payer_phone,
      'created_at', created_at, 'paid_at', paid_at, 'notes', notes
    ) order by created_at desc), '[]'::jsonb)
    into _orders from public.psych_orders where company_id = _company_id;

  select coalesce(credit_balance, 0), coalesce(credits_suspended, false)
    into _balance, _suspended
    from public.psych_company_wallets where company_id = _company_id;

  select jsonb_build_object(
      'issued', count(*),
      'completed', count(*) filter (where status = 'completed'),
      'pending', count(*) filter (where status in ('pending','opened'))
    ) into _invites
    from public.psych_invites where company_id = _company_id;

  select coalesce(jsonb_agg(jsonb_build_object(
      'id', id, 'name', name, 'credits', credits, 'price_ugx', price_ugx
    ) order by sort_order), '[]'::jsonb)
    into _packs from public.psych_credit_packs where is_active;

  select coalesce(jsonb_agg(jsonb_build_object(
      'id', id, 'delta', delta, 'balance_after', balance_after,
      'reason', reason, 'created_at', created_at
    ) order by created_at desc), '[]'::jsonb)
    into _ledger from (
      select id, delta, balance_after, reason, created_at
      from public.psych_credit_ledger
      where company_id = _company_id
      order by created_at desc
      limit 30
    ) l;

  return jsonb_build_object(
    'admins', _admins,
    'requests', _requests,
    'orders', _orders,
    'credit_balance', coalesce(_balance, 0),
    'credits_suspended', coalesce(_suspended, false),
    'assessment_invites', _invites,
    'packs', _packs,
    'ledger', _ledger
  );
end; $$;

-- Grant or remove credits (positive or negative delta). Cannot go below 0.
create or replace function public.admin_psych_adjust_credits(
  _company_id uuid,
  _delta integer,
  _reason text default 'admin_adjust',
  _note text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  _bal integer;
  _new integer;
  _suspended boolean;
  _reason_full text;
begin
  if not coalesce(public.has_role(auth.uid(), 'admin'), false) then raise exception 'not authorized'; end if;
  if _delta = 0 then raise exception 'delta must not be zero'; end if;
  if abs(_delta) > 10000 then raise exception 'delta too large'; end if;

  insert into public.psych_company_wallets (company_id, credit_balance)
  values (_company_id, 0) on conflict (company_id) do nothing;

  select credit_balance, coalesce(credits_suspended, false)
    into _bal, _suspended
    from public.psych_company_wallets where company_id = _company_id for update;

  _new := greatest(coalesce(_bal, 0) + _delta, 0);
  _reason_full := coalesce(nullif(trim(_reason), ''), 'admin_adjust');
  if nullif(trim(_note), '') is not null then
    _reason_full := _reason_full || ': ' || left(trim(_note), 200);
  end if;

  update public.psych_company_wallets
  set credit_balance = _new,
      credits_suspended = case when _new > 0 then false else credits_suspended end,
      suspended_at = case when _new > 0 then null else suspended_at end,
      suspended_reason = case when _new > 0 then null else suspended_reason end,
      updated_at = now()
  where company_id = _company_id;

  insert into public.psych_credit_ledger (company_id, delta, balance_after, reason, created_by)
  values (_company_id, _new - coalesce(_bal, 0), _new, _reason_full, auth.uid());

  return jsonb_build_object(
    'ok', true,
    'previous_balance', coalesce(_bal, 0),
    'delta', _new - coalesce(_bal, 0),
    'balance', _new,
    'credits_suspended', case when _new > 0 then false else _suspended end
  );
end; $$;

-- Set exact balance (e.g. renew to pack size, or clear)
create or replace function public.admin_psych_set_credits(
  _company_id uuid,
  _balance integer,
  _reason text default 'admin_set',
  _note text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  _bal integer;
  _delta integer;
  _reason_full text;
begin
  if not coalesce(public.has_role(auth.uid(), 'admin'), false) then raise exception 'not authorized'; end if;
  if _balance is null or _balance < 0 or _balance > 10000 then raise exception 'balance must be 0–10000'; end if;

  insert into public.psych_company_wallets (company_id, credit_balance)
  values (_company_id, 0) on conflict (company_id) do nothing;

  select credit_balance into _bal from public.psych_company_wallets where company_id = _company_id for update;
  _delta := _balance - coalesce(_bal, 0);
  if _delta = 0 then
    return jsonb_build_object('ok', true, 'balance', _balance, 'unchanged', true);
  end if;

  _reason_full := coalesce(nullif(trim(_reason), ''), 'admin_set');
  if nullif(trim(_note), '') is not null then
    _reason_full := _reason_full || ': ' || left(trim(_note), 200);
  end if;

  update public.psych_company_wallets
  set credit_balance = _balance,
      credits_suspended = (_balance = 0 and coalesce(credits_suspended, false)),
      updated_at = now()
  where company_id = _company_id;

  insert into public.psych_credit_ledger (company_id, delta, balance_after, reason, created_by)
  values (_company_id, _delta, _balance, _reason_full, auth.uid());

  return jsonb_build_object('ok', true, 'previous_balance', coalesce(_bal, 0), 'delta', _delta, 'balance', _balance);
end; $$;

-- Suspend: zero balance + flag so HR cannot use credits until restored
create or replace function public.admin_psych_suspend_credits(
  _company_id uuid,
  _reason text default 'suspended by InnerSpark staff'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  _bal integer;
  _reason_full text;
begin
  if not coalesce(public.has_role(auth.uid(), 'admin'), false) then raise exception 'not authorized'; end if;

  insert into public.psych_company_wallets (company_id, credit_balance)
  values (_company_id, 0) on conflict (company_id) do nothing;

  select credit_balance into _bal from public.psych_company_wallets where company_id = _company_id for update;
  _reason_full := 'suspend: ' || left(coalesce(nullif(trim(_reason), ''), 'staff action'), 200);

  update public.psych_company_wallets
  set credit_balance = 0,
      credits_suspended = true,
      suspended_at = now(),
      suspended_reason = left(coalesce(nullif(trim(_reason), ''), 'staff action'), 300),
      updated_at = now()
  where company_id = _company_id;

  if coalesce(_bal, 0) <> 0 then
    insert into public.psych_credit_ledger (company_id, delta, balance_after, reason, created_by)
    values (_company_id, -coalesce(_bal, 0), 0, _reason_full, auth.uid());
  else
    insert into public.psych_credit_ledger (company_id, delta, balance_after, reason, created_by)
    values (_company_id, 0, 0, _reason_full, auth.uid());
  end if;

  return jsonb_build_object('ok', true, 'previous_balance', coalesce(_bal, 0), 'balance', 0, 'credits_suspended', true);
end; $$;

-- Restore after suspend (does not auto-add credits — use grant/renew)
create or replace function public.admin_psych_unsuspend_credits(_company_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare _bal integer;
begin
  if not coalesce(public.has_role(auth.uid(), 'admin'), false) then raise exception 'not authorized'; end if;
  insert into public.psych_company_wallets (company_id, credit_balance)
  values (_company_id, 0) on conflict (company_id) do nothing;
  update public.psych_company_wallets
  set credits_suspended = false, suspended_at = null, suspended_reason = null, updated_at = now()
  where company_id = _company_id
  returning credit_balance into _bal;
  insert into public.psych_credit_ledger (company_id, delta, balance_after, reason, created_by)
  values (_company_id, 0, coalesce(_bal, 0), 'unsuspend', auth.uid());
  return jsonb_build_object('ok', true, 'balance', coalesce(_bal, 0), 'credits_suspended', false);
end; $$;

-- Renew = grant a pack's credits (and create a paid staff order for audit)
create or replace function public.admin_psych_renew_pack(
  _company_id uuid,
  _pack_id text,
  _note text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  _pack record;
  _order_id uuid;
  _bal integer;
  _note_full text;
begin
  if not coalesce(public.has_role(auth.uid(), 'admin'), false) then raise exception 'not authorized'; end if;
  select * into _pack from public.psych_credit_packs where id = _pack_id and is_active;
  if _pack.id is null then raise exception 'invalid pack'; end if;

  _note_full := coalesce(nullif(trim(_note), ''), 'Staff renewal');

  insert into public.psych_orders (
    company_id, pack_id, credits, amount_ugx, status, payment_method, payment_ref, notes, paid_at
  ) values (
    _company_id, _pack.id, _pack.credits, _pack.price_ugx, 'paid', 'staff_grant',
    'STAFF-' || to_char(now() at time zone 'utc', 'YYYYMMDD-HH24MISS'),
    _note_full, now()
  ) returning id into _order_id;

  insert into public.psych_company_wallets (company_id, credit_balance)
  values (_company_id, 0) on conflict (company_id) do nothing;

  update public.psych_company_wallets
  set credit_balance = credit_balance + _pack.credits,
      credits_suspended = false,
      suspended_at = null,
      suspended_reason = null,
      updated_at = now()
  where company_id = _company_id
  returning credit_balance into _bal;

  insert into public.psych_credit_ledger (company_id, delta, balance_after, reason, order_id, created_by)
  values (_company_id, _pack.credits, _bal, 'renew:' || _pack.id || ' · ' || left(_note_full, 120), _order_id, auth.uid());

  return jsonb_build_object(
    'ok', true,
    'order_id', _order_id,
    'pack_id', _pack.id,
    'pack_name', _pack.name,
    'credits_added', _pack.credits,
    'balance', _bal
  );
end; $$;

-- Reject a pending HR credit order (no wallet change)
create or replace function public.admin_psych_reject_order(
  _order_id uuid,
  _note text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare _ord record;
begin
  if not coalesce(public.has_role(auth.uid(), 'admin'), false) then raise exception 'not authorized'; end if;
  select * into _ord from public.psych_orders where id = _order_id for update;
  if _ord.id is null then raise exception 'order not found'; end if;
  if _ord.status = 'paid' then raise exception 'cannot reject a paid order'; end if;
  if _ord.status = 'rejected' then return jsonb_build_object('ok', true, 'already_rejected', true); end if;
  update public.psych_orders
  set status = 'rejected',
      notes = case
        when nullif(trim(_note), '') is null then coalesce(notes, 'Rejected by staff')
        else left(trim(_note), 300)
      end
  where id = _order_id;
  return jsonb_build_object('ok', true, 'order_id', _order_id, 'status', 'rejected');
end; $$;

-- Block invites while suspended
create or replace function public.psych_create_invite(
  _company_id uuid,
  _catalog_id text,
  _employee_name text,
  _employee_email text default null,
  _employee_role text default null,
  _department text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  _ok boolean; _admin_id uuid; _cat record; _bal integer; _invite_id uuid; _token text; _new_bal integer; _suspended boolean;
begin
  select public.is_corporate_hr_admin_for(_company_id) into _ok;
  if not _ok then raise exception 'not authorized'; end if;
  if length(trim(_employee_name)) < 2 then raise exception 'employee name required'; end if;
  select id into _admin_id from public.corporate_hr_admins where user_id = auth.uid() and company_id = _company_id and is_active limit 1;
  select * into _cat from public.psych_assessment_catalog where id = _catalog_id and is_active;
  if _cat.id is null then raise exception 'invalid assessment'; end if;
  insert into public.psych_company_wallets (company_id, credit_balance) values (_company_id, 0) on conflict (company_id) do nothing;
  select credit_balance, coalesce(credits_suspended, false) into _bal, _suspended
    from public.psych_company_wallets where company_id = _company_id for update;
  if _suspended then raise exception 'credits suspended — contact InnerSpark to restore access'; end if;
  if _bal < _cat.credit_cost then raise exception 'insufficient credits: need %, have %', _cat.credit_cost, _bal; end if;
  update public.psych_company_wallets set credit_balance = credit_balance - _cat.credit_cost, updated_at = now()
    where company_id = _company_id returning credit_balance into _new_bal;
  insert into public.psych_invites (company_id, admin_id, catalog_id, employee_name, employee_email, employee_role, department, credits_charged)
  values (_company_id, _admin_id, _cat.id, trim(_employee_name), nullif(trim(_employee_email),''), _employee_role, _department, _cat.credit_cost)
  returning id, token into _invite_id, _token;
  insert into public.psych_credit_ledger (company_id, delta, balance_after, reason, invite_id, created_by)
  values (_company_id, -_cat.credit_cost, _new_bal, 'invite:' || _cat.id, _invite_id, auth.uid());
  return jsonb_build_object('invite_id', _invite_id, 'token', _token, 'path', '/assess/' || _token,
    'assessment', _cat.name, 'employee_name', trim(_employee_name), 'credits_left', _new_bal);
end; $$;

revoke all on function public.admin_psych_adjust_credits(uuid, integer, text, text) from public;
grant execute on function public.admin_psych_adjust_credits(uuid, integer, text, text) to authenticated;
revoke all on function public.admin_psych_set_credits(uuid, integer, text, text) from public;
grant execute on function public.admin_psych_set_credits(uuid, integer, text, text) to authenticated;
revoke all on function public.admin_psych_suspend_credits(uuid, text) from public;
grant execute on function public.admin_psych_suspend_credits(uuid, text) to authenticated;
revoke all on function public.admin_psych_unsuspend_credits(uuid) from public;
grant execute on function public.admin_psych_unsuspend_credits(uuid) to authenticated;
revoke all on function public.admin_psych_renew_pack(uuid, text, text) from public;
grant execute on function public.admin_psych_renew_pack(uuid, text, text) to authenticated;
revoke all on function public.admin_psych_reject_order(uuid, text) from public;
grant execute on function public.admin_psych_reject_order(uuid, text) to authenticated;

notify pgrst, 'reload schema';
