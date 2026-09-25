-- Admin: edit client identity
create or replace function public.admin_update_client_identity(_client_id uuid, _full_name text, _phone text default null, _email text default null, _country text default null)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if not public.has_role(auth.uid(), 'admin') then raise exception 'Admin access required'; end if;
  if nullif(trim(_full_name), '') is null then raise exception 'Client name is required'; end if;
  update public.therapist_clients set full_name=trim(_full_name),
    phone=nullif(trim(coalesce(_phone,'')),''), email=nullif(lower(trim(coalesce(_email,''))),''),
    country=nullif(trim(coalesce(_country,'')),''), updated_at=now() where id=_client_id;
  return found;
end; $$;
revoke all on function public.admin_update_client_identity(uuid,text,text,text,text) from public, anon;
grant execute on function public.admin_update_client_identity(uuid,text,text,text,text) to authenticated;

-- Session balances
alter table public.therapist_clients
  add column if not exists sessions_purchased integer not null default 1 check (sessions_purchased >= 0),
  add column if not exists sessions_used integer not null default 0 check (sessions_used >= 0);

create or replace function public.admin_client_session_balances()
returns table(client_id uuid, sessions_purchased integer, sessions_used integer, sessions_remaining integer)
language sql stable security definer set search_path = public as $$
  select c.id, c.sessions_purchased, c.sessions_used, greatest(c.sessions_purchased - c.sessions_used, 0)
  from public.therapist_clients c where public.has_role(auth.uid(), 'admin');
$$;
revoke all on function public.admin_client_session_balances() from public, anon;
grant execute on function public.admin_client_session_balances() to authenticated;

create or replace function public.admin_set_client_session_balance(_client_id uuid, _sessions_purchased integer, _sessions_used integer)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if not public.has_role(auth.uid(), 'admin') then raise exception 'Admin access required'; end if;
  if _sessions_purchased < 0 or _sessions_used < 0 then raise exception 'Session counts cannot be negative'; end if;
  update public.therapist_clients set sessions_purchased=_sessions_purchased, sessions_used=_sessions_used, updated_at=now() where id=_client_id;
  return found;
end; $$;
revoke all on function public.admin_set_client_session_balance(uuid,integer,integer) from public, anon;
grant execute on function public.admin_set_client_session_balance(uuid,integer,integer) to authenticated;

-- Client referrals (5%)
alter table public.therapist_accounts add column if not exists professional_title text;
alter table public.therapist_clients
  add column if not exists referral_code text unique,
  add column if not exists referral_discount_percent numeric not null default 0,
  add column if not exists referred_by_client_id uuid references public.therapist_clients(id);

create table if not exists public.client_referral_events (
  id uuid primary key default gen_random_uuid(),
  referrer_client_id uuid not null references public.therapist_clients(id),
  referred_client_id uuid references public.therapist_clients(id),
  referred_name text, referred_phone text,
  status text not null default 'pending' check (status in ('pending','paid','rewarded','cancelled')),
  reward_percent numeric not null default 5, reward_amount_ugx numeric, rewarded_at timestamptz, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.client_referral_events to authenticated;
grant all on public.client_referral_events to service_role;
alter table public.client_referral_events enable row level security;
create policy "admins manage client referrals" on public.client_referral_events for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create or replace function public.admin_ensure_client_referral_link(_client_id uuid)
returns text language plpgsql security definer set search_path=public as $$
declare code text;
begin
  if not public.has_role(auth.uid(), 'admin') then raise exception 'Admin access required'; end if;
  select referral_code into code from public.therapist_clients where id=_client_id;
  if code is null then
    code := lower(substr(replace(gen_random_uuid()::text,'-',''),1,10));
    update public.therapist_clients set referral_code=code, updated_at=now() where id=_client_id;
  end if;
  return code;
end; $$;
revoke all on function public.admin_ensure_client_referral_link(uuid) from public, anon;
grant execute on function public.admin_ensure_client_referral_link(uuid) to authenticated;

create or replace function public.admin_list_client_referrals()
returns table(id uuid, referrer_name text, referrer_code text, referred_name text, referred_phone text, status text, reward_percent numeric, reward_amount_ugx numeric, created_at timestamptz)
language sql stable security definer set search_path=public as $$
  select e.id, r.full_name, r.referral_code, coalesce(c.full_name, e.referred_name), coalesce(c.phone, e.referred_phone),
         e.status, e.reward_percent, e.reward_amount_ugx, e.created_at
  from public.client_referral_events e
  join public.therapist_clients r on r.id=e.referrer_client_id
  left join public.therapist_clients c on c.id=e.referred_client_id
  where public.has_role(auth.uid(), 'admin') order by e.created_at desc;
$$;
revoke all on function public.admin_list_client_referrals() from public, anon;
grant execute on function public.admin_list_client_referrals() to authenticated;

create or replace function public.admin_mark_client_referral_rewarded(_event_id uuid, _amount_ugx numeric)
returns boolean language plpgsql security definer set search_path=public as $$
begin
  if not public.has_role(auth.uid(), 'admin') then raise exception 'Admin access required'; end if;
  update public.client_referral_events set status='rewarded', reward_amount_ugx=_amount_ugx, rewarded_at=now(), updated_at=now() where id=_event_id;
  update public.therapist_clients c set referral_discount_percent = greatest(coalesce(c.referral_discount_percent,0), 5)
    from public.client_referral_events e where e.id=_event_id and c.id=e.referrer_client_id;
  return found;
end; $$;
revoke all on function public.admin_mark_client_referral_rewarded(uuid,numeric) from public, anon;
grant execute on function public.admin_mark_client_referral_rewarded(uuid,numeric) to authenticated;

-- Dynamic consent by session type (same uuid signature)
create or replace function public.get_client_consent(_token uuid)
returns json language sql stable security definer set search_path to 'public' as $$
  select row_to_json(x) from (
    select c.full_name as client_name, ta.full_name as therapist_name,
      coalesce(nullif(ta.professional_title,''), nullif(ta.specialisation,''), 'Licensed mental health professional') as professional_title,
      coalesce(c.session_type, 'Video individual session') as session_type,
      case when lower(coalesce(c.session_type,'')) like '%chat%' then 30000
           when lower(coalesce(c.session_type,'')) like '%couple%' then 120000
           else 75000 end as session_price_ugx,
      c.consent_signed, c.consent_signed_at, coalesce(c.updated_at, c.created_at) as generated_at
    from public.therapist_clients c join public.therapist_accounts ta on ta.id = c.therapist_id
    where c.consent_token = _token limit 1
  ) x;
$$;