-- The portal link is text in the UI but therapist_clients.access_token is uuid.
-- Compare its text representation without throwing for an invalid token.
create or replace function public.verify_client_portal_credential(_token text, _passcode text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare c public.therapist_clients%rowtype; r public.manual_password_reset_requests%rowtype;
begin
  select * into c from public.therapist_clients where access_token::text = _token limit 1;
  if c.id is null or c.passcode_hash is null or crypt(_passcode, c.passcode_hash) <> c.passcode_hash then
    return jsonb_build_object('valid', false, 'temporary', false);
  end if;
  select * into r from public.manual_password_reset_requests
    where account_type = 'client' and account_id = c.id and status in ('ready','sent')
    order by revealed_at desc limit 1;
  if r.id is not null then
    if r.expires_at is null or r.expires_at <= now() then
      update public.manual_password_reset_requests set status='expired', updated_at=now() where id=r.id;
      update public.therapist_clients set passcode_hash=null where id=c.id;
      return jsonb_build_object('valid', false, 'temporary', true, 'expired', true);
    end if;
    update public.manual_password_reset_requests set status='used', consumed_at=now(), updated_at=now()
      where id=r.id and status in ('ready','sent');
    update public.therapist_clients set passcode_hash=null where id=c.id;
    return jsonb_build_object('valid', true, 'temporary', true, 'request_id', r.id);
  end if;
  return jsonb_build_object('valid', true, 'temporary', false);
end; $$;

create or replace function public.complete_client_temporary_reset(_token text, _request_id uuid, _new_passcode text)
returns boolean language plpgsql security definer set search_path = public, extensions as $$
declare cid uuid;
begin
  if length(_new_passcode) < 6 then return false; end if;
  select id into cid from public.therapist_clients where access_token::text = _token limit 1;
  if cid is null then return false; end if;
  update public.manual_password_reset_requests set status='completed', completed_at=now(), updated_at=now()
    where id=_request_id and account_type='client' and account_id=cid and status='used';
  if not found then return false; end if;
  update public.therapist_clients set passcode_hash=crypt(_new_passcode, gen_salt('bf')) where id=cid;
  return true;
end; $$;

create or replace function public.set_or_complete_client_passcode(_token text, _new_passcode text)
returns boolean language plpgsql security definer set search_path = public, extensions as $$
declare cid uuid; rid uuid;
begin
  if length(_new_passcode) < 6 then return false; end if;
  select id into cid from public.therapist_clients where access_token::text = _token limit 1;
  if cid is null then return false; end if;
  select id into rid from public.manual_password_reset_requests
    where account_type='client' and account_id=cid and status='used' order by consumed_at desc limit 1;
  update public.therapist_clients set passcode_hash=crypt(_new_passcode, gen_salt('bf')) where id=cid;
  if rid is not null then
    update public.manual_password_reset_requests set status='completed', completed_at=now(), updated_at=now()
      where id=rid and status='used';
  end if;
  return true;
end; $$;
notify pgrst, 'reload schema';
