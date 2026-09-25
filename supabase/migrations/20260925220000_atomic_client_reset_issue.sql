-- Issue the client passcode and mark the request ready in one transaction.
-- A failed lookup or hashing operation must leave both the account and request untouched.
create or replace function public.issue_client_temporary_passcode(
  _request_id uuid, _admin_id uuid, _temporary_passcode text
) returns boolean language plpgsql security definer set search_path = public, extensions as $$
declare r public.manual_password_reset_requests%rowtype;
begin
  select * into r from public.manual_password_reset_requests where id = _request_id for update;
  if r.id is null or r.account_type <> 'client' or r.status <> 'pending'
     or r.revealed_at is not null or r.temp_secret_hash is not null then
    return false;
  end if;
  if not exists (select 1 from public.therapist_clients where id = r.account_id) then
    return false;
  end if;
  update public.therapist_clients
    set passcode_hash = crypt(_temporary_passcode, gen_salt('bf'))
    where id = r.account_id;
  if not found then raise exception 'Client no longer available'; end if;
  update public.manual_password_reset_requests
    set temp_secret_hash = encode(digest(_temporary_passcode, 'sha256'), 'hex'),
        status = 'ready', revealed_at = now(), revealed_by = _admin_id,
        expires_at = now() + interval '60 minutes', updated_at = now()
    where id = r.id and status = 'pending';
  if not found then raise exception 'Reset request changed during issuance'; end if;
  return true;
end; $$;
revoke all on function public.issue_client_temporary_passcode(uuid,uuid,text) from public, anon, authenticated;
grant execute on function public.issue_client_temporary_passcode(uuid,uuid,text) to service_role;
-- pgcrypto is installed in extensions in the live Cloud database. Include it in
-- the fixed search path for issuing, verifying, and completing client passcodes.
alter function public.admin_set_client_temporary_passcode(uuid,uuid,text) set search_path = public, extensions;
alter function public.verify_client_portal_credential(text,text) set search_path = public, extensions;
alter function public.complete_client_temporary_reset(text,uuid,text) set search_path = public, extensions;
alter function public.set_or_complete_client_passcode(text,text) set search_path = public, extensions;
notify pgrst, 'reload schema';
