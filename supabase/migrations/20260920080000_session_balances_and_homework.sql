alter table public.therapist_clients
  add column if not exists sessions_purchased integer not null default 1 check (sessions_purchased >= 0),
  add column if not exists sessions_used integer not null default 0 check (sessions_used >= 0);

create or replace function public.admin_client_session_balances()
returns table(client_id uuid, sessions_purchased integer, sessions_used integer, sessions_remaining integer)
language sql security definer set search_path = public
as $$
  select c.id, c.sessions_purchased, c.sessions_used,
         greatest(c.sessions_purchased - c.sessions_used, 0)
  from public.therapist_clients c
  where public.has_role(auth.uid(), 'admin');
$$;
grant execute on function public.admin_client_session_balances() to authenticated;

create or replace function public.admin_set_client_session_balance(
  _client_id uuid, _sessions_purchased integer, _sessions_used integer
) returns boolean
language plpgsql security definer set search_path = public
as $$
begin
  if not public.has_role(auth.uid(), 'admin') then raise exception 'Admin access required'; end if;
  if _sessions_purchased < 0 or _sessions_used < 0 then raise exception 'Session counts cannot be negative'; end if;
  update public.therapist_clients set sessions_purchased=_sessions_purchased, sessions_used=_sessions_used, updated_at=now() where id=_client_id;
  return found;
end;
$$;
grant execute on function public.admin_set_client_session_balance(uuid,integer,integer) to authenticated;

create or replace function public.admin_client_homework(_client_id uuid)
returns table(
  id uuid, tool_key text, title text, therapist_note text, due_date date, status text,
  assigned_at timestamptz, submitted_at timestamptz, submission_type text, payload jsonb,
  screening_score numeric, screening_severity text, mood_score numeric, safety_flag boolean
)
language sql security definer set search_path = public
as $$
  select * from public.admin_list_homework_activity(_client_id)
  -- keep column names expected by the admin UI
  -- admin_list_homework_activity already returns the homework fields plus client context
$$;

-- Compatibility wrapper with the exact columns the Session Logs UI expects
drop function if exists public.admin_client_homework(uuid);
create or replace function public.admin_client_homework(_client_id uuid)
returns table(
  id uuid, tool_key text, title text, therapist_note text, due_date date, status text,
  assigned_at timestamptz, submitted_at timestamptz, submission_type text, payload jsonb,
  screening_score numeric, screening_severity text, mood_score numeric, safety_flag boolean
)
language sql security definer set search_path = public
as $$
  select
    at.id,
    at.tool_key,
    coalesce(at.title, at.tool_key),
    at.therapist_note,
    at.due_date,
    at.status,
    at.created_at,
    s.submitted_at,
    s.submission_type,
    s.payload,
    s.screening_score,
    s.screening_severity,
    s.mood_score,
    s.safety_flag
  from public.assignment_tools at
  join public.client_assignments ca on ca.id = at.assignment_id
  left join lateral (
    select ts.submitted_at, ts.submission_type, ts.payload, ts.screening_score,
           ts.screening_severity, ts.mood_score, ts.safety_flag
    from public.tool_submissions ts
    where ts.assignment_tool_id = at.id
    order by ts.submitted_at desc nulls last
    limit 1
  ) s on true
  where public.has_role(auth.uid(), 'admin')
    and ca.client_id = _client_id
  order by at.created_at desc;
$$;
grant execute on function public.admin_client_homework(uuid) to authenticated;

create or replace function public.admin_list_homework_activity(_client_id uuid default null)
returns table(
  id uuid, client_id uuid, client_name text, therapist_name text, tool_key text,
  title text, therapist_note text, due_date date, status text, assigned_at timestamptz,
  submitted_at timestamptz, submission_type text, payload jsonb,
  screening_score numeric, screening_severity text, mood_score numeric, safety_flag boolean
)
language sql security definer set search_path = public
as $$
  select
    at.id,
    ca.client_id,
    c.full_name,
    t.full_name,
    at.tool_key,
    coalesce(at.title, at.tool_key),
    at.therapist_note,
    at.due_date,
    at.status,
    at.created_at,
    s.submitted_at,
    s.submission_type,
    s.payload,
    s.screening_score,
    s.screening_severity,
    s.mood_score,
    s.safety_flag
  from public.assignment_tools at
  join public.client_assignments ca on ca.id = at.assignment_id
  join public.therapist_clients c on c.id = ca.client_id
  join public.therapist_accounts t on t.id = ca.therapist_id
  left join lateral (
    select ts.submitted_at, ts.submission_type, ts.payload, ts.screening_score,
           ts.screening_severity, ts.mood_score, ts.safety_flag
    from public.tool_submissions ts
    where ts.assignment_tool_id = at.id
    order by ts.submitted_at desc nulls last
    limit 1
  ) s on true
  where public.has_role(auth.uid(), 'admin')
    and (_client_id is null or ca.client_id = _client_id)
  order by at.created_at desc;
$$;
grant execute on function public.admin_list_homework_activity(uuid) to authenticated;
