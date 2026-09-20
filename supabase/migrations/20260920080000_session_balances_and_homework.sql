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

create or replace function public.admin_list_homework_activity()
returns table(
  id uuid, client_id uuid, client_name text, therapist_name text, tool_key text,
  title text, therapist_note text, due_date date, status text, assigned_at timestamptz,
  submitted_at timestamptz, submission_type text
)
language sql security definer set search_path = public
as $$
  select a.id, a.client_id, c.full_name, t.full_name, a.tool_key, a.title,
         a.therapist_note, a.due_date, a.status, a.assigned_at, a.submitted_at, a.submission_type
  from public.therapist_client_assignments a
  join public.therapist_clients c on c.id=a.client_id
  join public.therapist_accounts t on t.id=a.therapist_id
  where public.has_role(auth.uid(), 'admin')
  order by a.assigned_at desc;
$$;
grant execute on function public.admin_list_homework_activity() to authenticated;
