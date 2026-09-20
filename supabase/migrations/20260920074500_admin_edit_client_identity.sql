create or replace function public.admin_update_client_identity(
  _client_id uuid,
  _full_name text,
  _phone text default null,
  _email text default null,
  _country text default null
) returns boolean
language plpgsql security definer set search_path = public
as $$
begin
  if not public.has_role(auth.uid(), 'admin') then
    raise exception 'Admin access required';
  end if;
  if nullif(trim(_full_name), '') is null then
    raise exception 'Client name is required';
  end if;
  update public.therapist_clients
  set full_name=trim(_full_name),
      phone=nullif(trim(coalesce(_phone,'')),''),
      email=nullif(lower(trim(coalesce(_email,''))),''),
      country=nullif(trim(coalesce(_country,'')),''),
      updated_at=now()
  where id=_client_id;
  return found;
end;
$$;
grant execute on function public.admin_update_client_identity(uuid,text,text,text,text) to authenticated;
