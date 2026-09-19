create extension if not exists pgcrypto;

create table if not exists public.manual_password_reset_requests (
  id uuid primary key default gen_random_uuid(),
  account_type text not null check (account_type in ('client','therapist')),
  account_id uuid not null,
  user_id uuid null,
  identifier_masked text not null,
  status text not null default 'pending' check (status in ('pending','processing','sent','used','completed','expired','cancelled')),
  temp_secret_hash text null,
  requested_at timestamptz not null default now(),
  expires_at timestamptz null,
  revealed_at timestamptz null,
  revealed_by uuid null,
  consumed_at timestamptz null,
  completed_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists manual_password_reset_status_idx
  on public.manual_password_reset_requests(status, requested_at desc);
create index if not exists manual_password_reset_account_idx
  on public.manual_password_reset_requests(account_type, account_id, requested_at desc);

alter table public.manual_password_reset_requests enable row level security;

create policy "admins read password reset requests"
on public.manual_password_reset_requests for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create or replace function public.claim_manual_password_reset(_request_id uuid, _admin_id uuid)
returns boolean
language plpgsql security definer set search_path = public
as $$
begin
  update public.manual_password_reset_requests
  set status='processing', revealed_by=_admin_id, updated_at=now()
  where id=_request_id and status='pending' and revealed_at is null;
  return found;
end;
$$;
revoke all on function public.claim_manual_password_reset(uuid,uuid) from public, anon, authenticated;
grant execute on function public.claim_manual_password_reset(uuid,uuid) to service_role;

create or replace function public.admin_set_client_temporary_passcode(
  _request_id uuid,
  _client_id uuid,
  _temporary_passcode text
) returns boolean
language plpgsql security definer set search_path = public
as $$
begin
  update public.therapist_clients
  set passcode_hash = crypt(_temporary_passcode, gen_salt('bf'))
  where id = _client_id;
  if not found then return false; end if;
  update public.manual_password_reset_requests
  set temp_secret_hash = encode(digest(_temporary_passcode, 'sha256'), 'hex'),
      status = 'sent', revealed_at = now(), expires_at = now() + interval '60 minutes', updated_at = now()
  where id = _request_id and account_type = 'client' and account_id = _client_id and status = 'processing';
  return found;
end;
$$;
revoke all on function public.admin_set_client_temporary_passcode(uuid,uuid,text) from public, anon, authenticated;
grant execute on function public.admin_set_client_temporary_passcode(uuid,uuid,text) to service_role;

create or replace function public.verify_client_portal_credential(_token text, _passcode text)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  c public.therapist_clients%rowtype;
  r public.manual_password_reset_requests%rowtype;
begin
  select * into c from public.therapist_clients where access_token = _token limit 1;
  if c.id is null or c.passcode_hash is null or crypt(_passcode, c.passcode_hash) <> c.passcode_hash then
    return jsonb_build_object('valid', false, 'temporary', false);
  end if;

  select * into r from public.manual_password_reset_requests
  where account_type = 'client' and account_id = c.id and status = 'sent'
  order by revealed_at desc limit 1;

  if r.id is not null then
    if r.expires_at <= now() then
      update public.manual_password_reset_requests set status='expired', updated_at=now() where id=r.id;
      update public.therapist_clients set passcode_hash = null where id=c.id;
      return jsonb_build_object('valid', false, 'temporary', true, 'expired', true);
    end if;
    update public.manual_password_reset_requests
    set status='used', consumed_at=now(), updated_at=now() where id=r.id and status='sent';
    update public.therapist_clients set passcode_hash = null where id=c.id;
    return jsonb_build_object('valid', true, 'temporary', true, 'request_id', r.id);
  end if;

  return jsonb_build_object('valid', true, 'temporary', false);
end;
$$;
grant execute on function public.verify_client_portal_credential(text,text) to anon, authenticated;

create or replace function public.complete_client_temporary_reset(
  _token text,
  _request_id uuid,
  _new_passcode text
) returns boolean
language plpgsql security definer set search_path = public
as $$
declare cid uuid;
begin
  if length(_new_passcode) < 6 then return false; end if;
  select id into cid from public.therapist_clients where access_token=_token limit 1;
  if cid is null then return false; end if;
  update public.manual_password_reset_requests
  set status='completed', completed_at=now(), updated_at=now()
  where id=_request_id and account_type='client' and account_id=cid and status='used';
  if not found then return false; end if;
  update public.therapist_clients
  set passcode_hash=crypt(_new_passcode, gen_salt('bf')) where id=cid;
  return true;
end;
$$;
grant execute on function public.complete_client_temporary_reset(text,uuid,text) to anon, authenticated;

create or replace function public.set_or_complete_client_passcode(_token text, _new_passcode text)
returns boolean
language plpgsql security definer set search_path = public
as $$
declare cid uuid; rid uuid;
begin
  if length(_new_passcode) < 6 then return false; end if;
  select id into cid from public.therapist_clients where access_token=_token limit 1;
  if cid is null then return false; end if;
  select id into rid from public.manual_password_reset_requests
    where account_type='client' and account_id=cid and status='used'
    order by consumed_at desc limit 1;
  update public.therapist_clients set passcode_hash=crypt(_new_passcode, gen_salt('bf')) where id=cid;
  if rid is not null then
    update public.manual_password_reset_requests
      set status='completed', completed_at=now(), updated_at=now() where id=rid and status='used';
  end if;
  return true;
end;
$$;
grant execute on function public.set_or_complete_client_passcode(text,text) to anon, authenticated;
