alter table public.therapist_accounts
  add column if not exists professional_title text;

alter table public.therapist_clients
  add column if not exists referral_code text unique,
  add column if not exists referral_discount_percent numeric not null default 0,
  add column if not exists referred_by_client_id uuid references public.therapist_clients(id);

create table if not exists public.client_referral_events (
  id uuid primary key default gen_random_uuid(),
  referrer_client_id uuid not null references public.therapist_clients(id),
  referred_client_id uuid references public.therapist_clients(id),
  referred_name text,
  referred_phone text,
  status text not null default 'pending' check (status in ('pending','paid','rewarded','cancelled')),
  reward_percent numeric not null default 5,
  reward_amount_ugx numeric,
  rewarded_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.client_referral_events enable row level security;
create policy "admins manage client referrals" on public.client_referral_events
  for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

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
grant execute on function public.admin_ensure_client_referral_link(uuid) to authenticated;

create or replace function public.admin_list_client_referrals()
returns table(id uuid, referrer_name text, referrer_code text, referred_name text, referred_phone text, status text, reward_percent numeric, reward_amount_ugx numeric, created_at timestamptz)
language sql security definer set search_path=public as $$
  select e.id, r.full_name, r.referral_code, coalesce(c.full_name, e.referred_name), coalesce(c.phone, e.referred_phone),
         e.status, e.reward_percent, e.reward_amount_ugx, e.created_at
  from public.client_referral_events e
  join public.therapist_clients r on r.id=e.referrer_client_id
  left join public.therapist_clients c on c.id=e.referred_client_id
  where public.has_role(auth.uid(), 'admin')
  order by e.created_at desc;
$$;
grant execute on function public.admin_list_client_referrals() to authenticated;

create or replace function public.admin_mark_client_referral_rewarded(_event_id uuid, _amount_ugx numeric)
returns boolean language plpgsql security definer set search_path=public as $$
begin
  if not public.has_role(auth.uid(), 'admin') then raise exception 'Admin access required'; end if;
  update public.client_referral_events
  set status='rewarded', reward_amount_ugx=_amount_ugx, rewarded_at=now(), updated_at=now()
  where id=_event_id;
  update public.therapist_clients c
  set referral_discount_percent = greatest(coalesce(c.referral_discount_percent,0), 5)
  from public.client_referral_events e
  where e.id=_event_id and c.id=e.referrer_client_id;
  return found;
end; $$;
grant execute on function public.admin_mark_client_referral_rewarded(uuid,numeric) to authenticated;

create or replace function public.get_client_consent(_token text)
returns json language plpgsql security definer set search_path=public as $$
declare r record;
begin
  select c.full_name as client_name,
         t.full_name as therapist_name,
         coalesce(nullif(t.professional_title,''), nullif(t.specialisation,''), 'Licensed mental health professional') as professional_title,
         coalesce(c.session_type, 'Individual Therapy — Video Session') as session_type,
         case
           when lower(coalesce(c.session_type,'')) like '%chat%' then 30000
           else 75000
         end as session_price_ugx,
         c.consent_signed,
         c.consent_signed_at,
         coalesce(c.updated_at, c.created_at) as generated_at
  into r
  from public.therapist_clients c
  join public.therapist_accounts t on t.id=c.therapist_id
  where c.consent_token=_token
  limit 1;
  if not found then return null; end if;
  return to_json(r);
end; $$;
grant execute on function public.get_client_consent(text) to anon, authenticated;

-- Corporate company admins
create table if not exists public.corporate_company_admins (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  user_id uuid not null unique,
  full_name text not null,
  email text not null,
  must_change_password boolean not null default true,
  consent_accepted_at timestamptz,
  consent_version text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.corporate_company_admins enable row level security;
create policy "company admins read self" on public.corporate_company_admins
  for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
