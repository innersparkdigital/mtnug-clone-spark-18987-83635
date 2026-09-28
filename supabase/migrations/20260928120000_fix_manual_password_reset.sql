-- Fix password reset non-2xx failures.
-- Root cause: edge function selects admin_notified_at / admin_notification_error
-- and calls issue_client_temporary_passcode, neither of which existed in the base migration.

alter table public.manual_password_reset_requests
  add column if not exists admin_notified_at timestamptz null,
  add column if not exists admin_notification_error text null;

-- RPC name the edge function already calls (one atomic claim + set passcode).
create or replace function public.issue_client_temporary_passcode(
  _request_id uuid,
  _admin_id uuid,
  _temporary_passcode text
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  _account_id uuid;
begin
  if _temporary_passcode is null or length(_temporary_passcode) < 6 then
    return false;
  end if;

  update public.manual_password_reset_requests
  set status = 'processing',
      revealed_by = _admin_id,
      updated_at = now()
  where id = _request_id
    and account_type = 'client'
    and status = 'pending'
    and revealed_at is null
  returning account_id into _account_id;

  if _account_id is null then
    return false;
  end if;

  update public.therapist_clients
  set passcode_hash = crypt(_temporary_passcode, gen_salt('bf'))
  where id = _account_id;

  if not found then
    update public.manual_password_reset_requests
    set status = 'pending', revealed_by = null, updated_at = now()
    where id = _request_id and status = 'processing';
    return false;
  end if;

  update public.manual_password_reset_requests
  set temp_secret_hash = encode(digest(_temporary_passcode, 'sha256'), 'hex'),
      status = 'ready',
      revealed_at = now(),
      revealed_by = _admin_id,
      expires_at = now() + interval '60 minutes',
      updated_at = now()
  where id = _request_id
    and status = 'processing';

  return found;
end;
$$;

revoke all on function public.issue_client_temporary_passcode(uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.issue_client_temporary_passcode(uuid, uuid, text) to service_role;

-- Keep legacy helper in sync if anything still calls it.
create or replace function public.admin_set_client_temporary_passcode(
  _request_id uuid,
  _client_id uuid,
  _temporary_passcode text
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.therapist_clients
  set passcode_hash = crypt(_temporary_passcode, gen_salt('bf'))
  where id = _client_id;
  if not found then return false; end if;

  update public.manual_password_reset_requests
  set temp_secret_hash = encode(digest(_temporary_passcode, 'sha256'), 'hex'),
      status = 'ready',
      revealed_at = coalesce(revealed_at, now()),
      expires_at = now() + interval '60 minutes',
      updated_at = now()
  where id = _request_id
    and account_type = 'client'
    and account_id = _client_id
    and status in ('processing', 'pending');

  return found;
end;
$$;

notify pgrst, 'reload schema';
