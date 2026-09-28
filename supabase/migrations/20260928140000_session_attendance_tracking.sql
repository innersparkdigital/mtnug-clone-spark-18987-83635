-- Track session attendance / no-shows for admin follow-up
-- Status lives on therapist_clients next to next_session_date

alter table public.therapist_clients
  add column if not exists session_attendance_status text
    check (session_attendance_status is null or session_attendance_status in (
      'scheduled',   -- default when next session set
      'confirmed',   -- client confirmed they will attend
      'no_response', -- outreach sent, client silent
      'attended',    -- showed up
      'missed',      -- no-show / missed appointment
      'cancelled'    -- cancelled in advance
    )),
  add column if not exists session_outreach_count integer not null default 0,
  add column if not exists session_last_outreach_at timestamptz null,
  add column if not exists session_attendance_note text null,
  add column if not exists session_attendance_updated_at timestamptz null,
  add column if not exists session_attendance_updated_by uuid null;

create index if not exists therapist_clients_session_attendance_idx
  on public.therapist_clients (session_attendance_status, next_session_date)
  where next_session_date is not null;

-- When next session date is set/changed, reset attendance to scheduled (unless already terminal for that date)
create or replace function public.trg_reset_session_attendance()
returns trigger
language plpgsql
as $$
begin
  if new.next_session_date is distinct from old.next_session_date then
    if new.next_session_date is null then
      new.session_attendance_status := null;
      new.session_outreach_count := 0;
      new.session_last_outreach_at := null;
      new.session_attendance_note := null;
    else
      new.session_attendance_status := coalesce(new.session_attendance_status, 'scheduled');
      -- Fresh date → clear prior outcome unless caller already set a status
      if old.next_session_date is distinct from new.next_session_date then
        new.session_attendance_status := 'scheduled';
        new.session_outreach_count := 0;
        new.session_last_outreach_at := null;
        new.session_attendance_note := null;
        new.session_attendance_updated_at := now();
      end if;
    end if;
  elsif new.next_session_date is not null and new.session_attendance_status is null then
    new.session_attendance_status := 'scheduled';
  end if;
  return new;
end;
$$;

drop trigger if exists therapist_clients_session_attendance_trg on public.therapist_clients;
create trigger therapist_clients_session_attendance_trg
  before insert or update of next_session_date on public.therapist_clients
  for each row execute function public.trg_reset_session_attendance();

-- Admin: set attendance status (and optional note / outreach bump)
create or replace function public.admin_set_session_attendance(
  _client_id uuid,
  _status text,
  _note text default null,
  _bump_outreach boolean default false
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not coalesce(public.has_role(auth.uid(), 'admin'), false) then
    raise exception 'not authorized';
  end if;
  if _status is null or _status not in ('scheduled','confirmed','no_response','attended','missed','cancelled') then
    raise exception 'invalid status';
  end if;

  update public.therapist_clients
  set session_attendance_status = _status,
      session_attendance_note = case
        when _note is null then session_attendance_note
        when nullif(trim(_note), '') is null then null
        else left(trim(_note), 500)
      end,
      session_outreach_count = case
        when _bump_outreach then coalesce(session_outreach_count, 0) + 1
        else session_outreach_count
      end,
      session_last_outreach_at = case
        when _bump_outreach then now()
        else session_last_outreach_at
      end,
      session_attendance_updated_at = now(),
      session_attendance_updated_by = auth.uid(),
      -- If attended/missed/cancelled and date was in past, keep date for history;
      -- admin can clear next_session separately when rescheduling.
      updated_at = now()
  where id = _client_id;

  return found;
end;
$$;

revoke all on function public.admin_set_session_attendance(uuid, text, text, boolean) from public;
grant execute on function public.admin_set_session_attendance(uuid, text, text, boolean) to authenticated;

-- Auto-mark overdue scheduled sessions as missed (callable from admin refresh)
create or replace function public.admin_auto_flag_missed_sessions()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  n integer;
begin
  if not coalesce(public.has_role(auth.uid(), 'admin'), false) then
    raise exception 'not authorized';
  end if;

  update public.therapist_clients
  set session_attendance_status = 'missed',
      session_attendance_updated_at = now(),
      session_attendance_note = coalesce(
        session_attendance_note,
        'Auto-flagged: next session date passed without attendance marked'
      ),
      updated_at = now()
  where next_session_date is not null
    and next_session_date < (timezone('Africa/Nairobi', now()))::date
    and coalesce(session_attendance_status, 'scheduled') in ('scheduled', 'confirmed', 'no_response');

  get diagnostics n = row_count;
  return n;
end;
$$;

revoke all on function public.admin_auto_flag_missed_sessions() from public;
grant execute on function public.admin_auto_flag_missed_sessions() to authenticated;

-- Backfill: past next_session_date with no terminal status → missed
update public.therapist_clients
set session_attendance_status = 'missed',
    session_attendance_updated_at = now(),
    session_attendance_note = coalesce(
      session_attendance_note,
      'Backfill: session date already passed'
    )
where next_session_date is not null
  and next_session_date < (timezone('Africa/Nairobi', now()))::date
  and session_attendance_status is null;

update public.therapist_clients
set session_attendance_status = 'scheduled'
where next_session_date is not null
  and next_session_date >= (timezone('Africa/Nairobi', now()))::date
  and session_attendance_status is null;

notify pgrst, 'reload schema';
