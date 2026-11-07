-- Amani widget: anonymous counts per organisation. No conversation text is ever stored.

create table if not exists public.amani_partners (
  org_key text primary key check (org_key ~ '^[a-z0-9-]{2,40}$'),
  name text not null check (char_length(name) between 1 and 120),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.amani_event_counts (
  org_key text not null references public.amani_partners(org_key) on delete cascade,
  event_type text not null,
  day date not null default ((now() at time zone 'utc')::date),
  count bigint not null default 0,
  primary key (org_key, event_type, day)
);

alter table public.amani_partners enable row level security;
alter table public.amani_event_counts enable row level security;

revoke all on public.amani_partners from anon;
revoke all on public.amani_event_counts from anon;

create or replace function public.amani_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role::text = 'admin'
  );
$$;

drop policy if exists "Admins manage Amani partners" on public.amani_partners;
create policy "Admins manage Amani partners" on public.amani_partners
  for all to authenticated
  using (public.amani_is_admin())
  with check (public.amani_is_admin());

drop policy if exists "Admins read Amani counts" on public.amani_event_counts;
create policy "Admins read Amani counts" on public.amani_event_counts
  for select to authenticated
  using (public.amani_is_admin());

-- The only public write path: add 1 to a daily counter for an active organisation.
create or replace function public.amani_record_event(_org text, _event text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if _event is null or _event not in (
    'chat_started', 'message_sent', 'chip_used', 'crisis_card_shown',
    'urgent_help_opened', 'counsellor_prompt_shown', 'counsellor_prompt_dismissed',
    'next_step_clicked', 'privacy_notice_opened'
  ) then
    return;
  end if;

  insert into public.amani_event_counts (org_key, event_type, day, count)
  select p.org_key, _event, (now() at time zone 'utc')::date, 1
  from public.amani_partners p
  where p.org_key = _org and p.active
  on conflict (org_key, event_type, day)
  do update set count = public.amani_event_counts.count + 1;
end;
$$;

revoke all on function public.amani_record_event(text, text) from public;
grant execute on function public.amani_record_event(text, text) to anon, authenticated;

insert into public.amani_partners (org_key, name)
values ('innerspark', 'InnerSpark Africa')
on conflict (org_key) do nothing;
