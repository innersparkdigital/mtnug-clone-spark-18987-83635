create table if not exists public.ad_sales_leads (
  id uuid primary key default gen_random_uuid(),
  lead_reference text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text,
  phone text,
  booking_type text,
  session_format text,
  expected_value_ugx numeric not null default 0,
  gclid text,
  gbraid text,
  wbraid text,
  utm_source text,
  utm_campaign text,
  status text not null default 'new' check (status in ('new','paid','lost')),
  paid_amount_ugx numeric,
  paid_at timestamptz
);

alter table public.ad_sales_leads enable row level security;

create or replace function public.admin_list_ad_sales_leads()
returns setof public.ad_sales_leads
language sql security definer set search_path = public
as $$
  select * from public.ad_sales_leads
  where public.has_role(auth.uid(), 'admin')
  order by created_at desc;
$$;

grant execute on function public.admin_list_ad_sales_leads() to authenticated;

create or replace function public.admin_update_ad_sales_lead(
  _id uuid,
  _status text,
  _paid_amount_ugx numeric default null,
  _paid_at timestamptz default null
) returns boolean
language plpgsql security definer set search_path = public
as $$
begin
  if not public.has_role(auth.uid(), 'admin') then
    raise exception 'Admin access required';
  end if;
  if _status not in ('new','paid','lost') then
    raise exception 'Invalid status';
  end if;
  update public.ad_sales_leads
  set status=_status,
      paid_amount_ugx=case when _status='paid' then _paid_amount_ugx else null end,
      paid_at=case when _status='paid' then coalesce(_paid_at, now()) else null end,
      updated_at=now()
  where id=_id;
  return found;
end;
$$;

grant execute on function public.admin_update_ad_sales_lead(uuid,text,numeric,timestamptz) to authenticated;
