-- Minor / parent-guardian fields for child clients + parent consent link payload

alter table public.therapist_clients
  add column if not exists is_minor boolean not null default false,
  add column if not exists date_of_birth date,
  add column if not exists age integer,
  add column if not exists parent_name text,
  add column if not exists parent_relationship text,
  add column if not exists parent_contact text,
  add column if not exists parent_email text,
  add column if not exists emergency_contact_name text,
  add column if not exists emergency_contact_relationship text,
  add column if not exists emergency_contact_phone text;

-- Consent link returns adult or parent-guardian payload
create or replace function public.get_client_consent(_token uuid)
returns json
language sql
stable
security definer
set search_path to 'public'
as $$
  select row_to_json(x) from (
    select
      c.full_name as client_name,
      ta.full_name as therapist_name,
      coalesce(nullif(ta.professional_title,''), nullif(ta.specialisation,''), 'Licensed mental health professional') as professional_title,
      coalesce(c.session_type, 'Video individual session') as session_type,
      case
        when lower(coalesce(c.session_type,'')) like '%chat%' then 30000
        when lower(coalesce(c.session_type,'')) like '%couple%' then 120000
        else 75000
      end as session_price_ugx,
      c.consent_signed,
      c.consent_signed_at,
      coalesce(c.updated_at, c.created_at) as generated_at,
      coalesce(c.is_minor, false) as is_minor,
      c.date_of_birth,
      c.age,
      c.parent_name,
      c.parent_relationship,
      c.parent_contact,
      c.parent_email,
      c.emergency_contact_name,
      c.emergency_contact_relationship,
      c.emergency_contact_phone,
      coalesce(c.duration_mins, 60) as duration_mins
    from public.therapist_clients c
    join public.therapist_accounts ta on ta.id = c.therapist_id
    where c.consent_token = _token
    limit 1
  ) x;
$$;

revoke all on function public.get_client_consent(uuid) from public;
grant execute on function public.get_client_consent(uuid) to anon, authenticated;

-- Therapist overview includes minor flag for badges
create or replace function public.therapist_client_overview()
returns json
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  _therapist_id uuid;
  result json;
begin
  select ta.id into _therapist_id from public.therapist_accounts ta
  where ta.user_id = auth.uid() and ta.is_active = true;
  if _therapist_id is null then raise exception 'Not a therapist'; end if;

  select json_agg(row_to_json(x)) into result from (
    select
      c.id,
      c.full_name,
      c.email,
      c.phone,
      c.presenting_concern,
      c.access_token,
      c.created_at,
      c.last_seen_at,
      c.consent_signed,
      c.consent_signed_at,
      coalesce(c.is_minor, false) as is_minor,
      c.parent_name,
      c.age,
      c.sessions_purchased,
      c.sessions_used,
      (select count(*) from public.assignment_tools at
        join public.client_assignments ca on ca.id = at.assignment_id
        where ca.client_id = c.id and ca.is_active = true and at.status <> 'completed') as active_tools,
      (select count(*) from public.assignment_tools at
        join public.client_assignments ca on ca.id = at.assignment_id
        where ca.client_id = c.id and ca.is_active = true
          and at.due_date is not null and at.due_date < current_date
          and at.status <> 'completed') as overdue_tools,
      (select count(*) from public.safety_alerts sa
        where sa.client_id = c.id and sa.resolved = false) as open_alerts,
      (select json_agg(json_build_object(
          'date', d::date,
          'completed', (
            select count(*) from public.tool_submissions ts
            join public.assignment_tools at on at.id = ts.assignment_tool_id
            join public.client_assignments ca on ca.id = at.assignment_id
            where ca.client_id = c.id and ts.submission_type = 'final'
              and (ts.submitted_at at time zone 'Africa/Nairobi')::date = d::date
          )
        ) order by d)
        from generate_series(current_date - interval '6 days', current_date, interval '1 day') d
      ) as week_activity
    from public.therapist_clients c
    where c.therapist_id = _therapist_id
    order by c.created_at desc
  ) x;

  return coalesce(result, '[]'::json);
end;
$$;

-- Admin list includes minor + parent for tracker
create or replace function public.admin_list_all_clients()
returns json
language plpgsql
stable security definer
set search_path to 'public'
as $$
declare
  result json;
begin
  if not public.has_role(auth.uid(), 'admin') then
    raise exception 'Unauthorized: admin role required';
  end if;

  select coalesce(json_agg(row_to_json(x) order by x.created_at desc), '[]'::json)
  into result from (
    select
      c.id, c.full_name, c.email, c.phone, c.presenting_concern, c.access_token,
      c.created_at, c.last_seen_at, c.client_code, c.country, c.session_type,
      c.duration_mins, c.session_rating, c.would_rebook, c.amount_ugx,
      c.therapist_share_ugx, c.innerspark_share_ugx, c.paid_status,
      c.receipt_number, c.receipt_url, c.last_session_date,
      c.therapist_paid, c.therapist_paid_at, c.receipt_sent_at,
      c.consent_signed, c.consent_signed_at,
      coalesce(c.client_type, 'new') as client_type,
      coalesce(c.is_minor, false) as is_minor,
      c.date_of_birth, c.age,
      c.parent_name, c.parent_relationship, c.parent_contact, c.parent_email,
      c.emergency_contact_name, c.emergency_contact_relationship, c.emergency_contact_phone,
      ta.id as therapist_id,
      ta.full_name as therapist_name,
      ta.email as therapist_email,
      (select count(*) from public.assignment_tools at
        join public.client_assignments ca on ca.id = at.assignment_id
        where ca.client_id = c.id and ca.is_active = true and at.status <> 'completed') as active_tools,
      (select count(*) from public.assignment_tools at
        join public.client_assignments ca on ca.id = at.assignment_id
        where ca.client_id = c.id and ca.is_active = true) as total_tools,
      (select count(*) from public.assignment_tools at
        join public.client_assignments ca on ca.id = at.assignment_id
        where ca.client_id = c.id and ca.is_active = true and at.status = 'completed') as completed_tools,
      (select count(*) from public.safety_alerts sa
        where sa.client_id = c.id and sa.resolved = false) as open_alerts,
      (select max(ts.submitted_at) from public.tool_submissions ts
        join public.assignment_tools at on at.id = ts.assignment_tool_id
        join public.client_assignments ca on ca.id = at.assignment_id
        where ca.client_id = c.id and ts.submission_type = 'final') as last_submission_at,
      coalesce(
        c.next_session_date,
        (select tsf.next_appt_date from public.therapist_session_feedback tsf
          where tsf.client_id = c.id and tsf.next_appt_date is not null
          order by tsf.session_date desc limit 1)
      ) as next_session_date
    from public.therapist_clients c
    join public.therapist_accounts ta on ta.id = c.therapist_id
    order by c.created_at desc
  ) x;

  return coalesce(result, '[]'::json);
end;
$$;

-- Set / update guardian details (admin)
create or replace function public.admin_set_client_guardian(
  _client_id uuid,
  _is_minor boolean default false,
  _date_of_birth date default null,
  _age integer default null,
  _parent_name text default null,
  _parent_relationship text default null,
  _parent_contact text default null,
  _parent_email text default null,
  _emergency_contact_name text default null,
  _emergency_contact_relationship text default null,
  _emergency_contact_phone text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.has_role(auth.uid(), 'admin') then
    raise exception 'Admin access required';
  end if;
  if _is_minor and nullif(trim(coalesce(_parent_name,'')),'') is null then
    raise exception 'Parent / guardian name is required for a child client';
  end if;
  update public.therapist_clients set
    is_minor = coalesce(_is_minor, false),
    date_of_birth = _date_of_birth,
    age = _age,
    parent_name = case when coalesce(_is_minor, false) then nullif(trim(coalesce(_parent_name,'')),'') else null end,
    parent_relationship = case when coalesce(_is_minor, false) then nullif(trim(coalesce(_parent_relationship,'')),'') else null end,
    parent_contact = case when coalesce(_is_minor, false) then nullif(trim(coalesce(_parent_contact,'')),'') else null end,
    parent_email = case when coalesce(_is_minor, false) then nullif(lower(trim(coalesce(_parent_email,''))),'') else null end,
    emergency_contact_name = nullif(trim(coalesce(_emergency_contact_name,'')),''),
    emergency_contact_relationship = nullif(trim(coalesce(_emergency_contact_relationship,'')),''),
    emergency_contact_phone = nullif(trim(coalesce(_emergency_contact_phone,'')),''),
    updated_at = now()
  where id = _client_id;
  return found;
end;
$$;

revoke all on function public.admin_set_client_guardian(uuid,boolean,date,integer,text,text,text,text,text,text,text) from public, anon;
grant execute on function public.admin_set_client_guardian(uuid,boolean,date,integer,text,text,text,text,text,text,text) to authenticated;

notify pgrst, 'reload schema';
