-- Therapists can set how many paid sessions a client still has.
-- Balances live on therapist_clients.sessions_purchased / sessions_used
-- (remaining = purchased - used). Admin trackers already read these fields.

create or replace function public.therapist_get_session_balance(_client_id uuid)
returns table (sessions_purchased int, sessions_used int, sessions_remaining int)
language plpgsql
security definer
set search_path = public
as $$
declare
  tid uuid;
begin
  select ta.id into tid
  from public.therapist_accounts ta
  where ta.user_id = auth.uid() and ta.is_active = true
  limit 1;
  if tid is null then
    raise exception 'Not authorised';
  end if;

  return query
  select
    coalesce(c.sessions_purchased, 0)::int,
    coalesce(c.sessions_used, 0)::int,
    greatest(coalesce(c.sessions_purchased, 0) - coalesce(c.sessions_used, 0), 0)::int
  from public.therapist_clients c
  where c.id = _client_id and c.therapist_id = tid;
end;
$$;

revoke all on function public.therapist_get_session_balance(uuid) from public;
grant execute on function public.therapist_get_session_balance(uuid) to authenticated;

-- Set remaining sessions after a visit. Does not delete clinical data.
-- First balance: purchased = remaining, used = 0.
-- Later: keep purchased when remaining <= purchased (used = purchased - remaining);
-- if remaining > purchased, raise purchased to remaining and set used = 0.
create or replace function public.therapist_set_sessions_remaining(_client_id uuid, _remaining int)
returns table (sessions_purchased int, sessions_used int, sessions_remaining int)
language plpgsql
security definer
set search_path = public
as $$
declare
  tid uuid;
  cur_purchased int;
  cur_used int;
  new_purchased int;
  new_used int;
begin
  if _remaining is null or _remaining < 0 or _remaining > 500 then
    raise exception 'Sessions left must be between 0 and 500';
  end if;

  select ta.id into tid
  from public.therapist_accounts ta
  where ta.user_id = auth.uid() and ta.is_active = true
  limit 1;
  if tid is null then
    raise exception 'Not authorised';
  end if;

  select coalesce(c.sessions_purchased, 0), coalesce(c.sessions_used, 0)
    into cur_purchased, cur_used
  from public.therapist_clients c
  where c.id = _client_id and c.therapist_id = tid
  for update;

  if not found then
    raise exception 'Client not found';
  end if;

  if cur_purchased = 0 and cur_used = 0 then
    new_purchased := _remaining;
    new_used := 0;
  elsif _remaining > cur_purchased then
    new_purchased := _remaining;
    new_used := 0;
  else
    new_purchased := cur_purchased;
    new_used := greatest(cur_purchased - _remaining, 0);
  end if;

  update public.therapist_clients c
  set sessions_purchased = new_purchased,
      sessions_used = new_used,
      updated_at = now()
  where c.id = _client_id and c.therapist_id = tid;

  return query
  select new_purchased, new_used, greatest(new_purchased - new_used, 0);
end;
$$;

revoke all on function public.therapist_set_sessions_remaining(uuid, int) from public;
grant execute on function public.therapist_set_sessions_remaining(uuid, int) to authenticated;

notify pgrst, 'reload schema';
