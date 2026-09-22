-- Full corporate HR wellbeing dashboard schema (standalone).
-- Safe to run on empty or existing projects.

CREATE TABLE IF NOT EXISTS public.corporate_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  industry text,
  country text DEFAULT 'Uganda',
  employee_count integer NOT NULL DEFAULT 0,
  context_notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.corporate_employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.corporate_companies(id) ON DELETE CASCADE,
  employee_code text,
  department text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.corporate_screenings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.corporate_companies(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES public.corporate_employees(id) ON DELETE CASCADE,
  who5_percentage integer,
  total_score integer,
  wellbeing_category text CHECK (wellbeing_category IN ('green','yellow','red')),
  workplace_responses jsonb DEFAULT '{}'::jsonb,
  completed_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.corporate_hr_admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.corporate_companies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  must_change_password boolean NOT NULL DEFAULT true,
  consent_accepted_at timestamptz,
  consent_version text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS public.corporate_hr_service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.corporate_companies(id) ON DELETE CASCADE,
  admin_id uuid REFERENCES public.corporate_hr_admins(id) ON DELETE SET NULL,
  request_type text NOT NULL CHECK (request_type IN ('screening','training','eap','other')),
  service_code text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','in_progress','done','closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.corporate_trainings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.corporate_companies(id) ON DELETE CASCADE,
  title text NOT NULL,
  module_code text,
  scheduled_at timestamptz,
  completed_at timestamptz,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('requested','scheduled','completed','cancelled')),
  attendees_count integer,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_corp_emp_company ON public.corporate_employees(company_id);
CREATE INDEX IF NOT EXISTS idx_corp_scr_company ON public.corporate_screenings(company_id);
CREATE INDEX IF NOT EXISTS idx_corp_scr_employee ON public.corporate_screenings(employee_id);
CREATE INDEX IF NOT EXISTS idx_corp_hr_admins_user ON public.corporate_hr_admins(user_id);

ALTER TABLE public.corporate_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_screenings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_hr_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_hr_service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_trainings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  ALTER TABLE public.corporate_companies ADD COLUMN IF NOT EXISTS employee_count integer NOT NULL DEFAULT 0;
  ALTER TABLE public.corporate_companies ADD COLUMN IF NOT EXISTS context_notes text;
  ALTER TABLE public.corporate_companies ADD COLUMN IF NOT EXISTS industry text;
  ALTER TABLE public.corporate_companies ADD COLUMN IF NOT EXISTS country text DEFAULT 'Uganda';
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE OR REPLACE FUNCTION public.is_corporate_hr_admin_for(_company_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.corporate_hr_admins a
    WHERE a.user_id = auth.uid() AND a.company_id = _company_id AND a.is_active = true
  );
$$;

DROP POLICY IF EXISTS corp_hr_admins_self_select ON public.corporate_hr_admins;
CREATE POLICY corp_hr_admins_self_select ON public.corporate_hr_admins
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS corp_hr_admins_self_update ON public.corporate_hr_admins;
CREATE POLICY corp_hr_admins_self_update ON public.corporate_hr_admins
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS corp_hr_req_select ON public.corporate_hr_service_requests;
CREATE POLICY corp_hr_req_select ON public.corporate_hr_service_requests
  FOR SELECT TO authenticated USING (public.is_corporate_hr_admin_for(company_id));

DROP POLICY IF EXISTS corp_hr_req_insert ON public.corporate_hr_service_requests;
CREATE POLICY corp_hr_req_insert ON public.corporate_hr_service_requests
  FOR INSERT TO authenticated WITH CHECK (public.is_corporate_hr_admin_for(company_id));

DROP POLICY IF EXISTS corp_companies_hr_select ON public.corporate_companies;
CREATE POLICY corp_companies_hr_select ON public.corporate_companies
  FOR SELECT TO authenticated USING (public.is_corporate_hr_admin_for(id));

DROP POLICY IF EXISTS corp_trainings_hr_select ON public.corporate_trainings;
CREATE POLICY corp_trainings_hr_select ON public.corporate_trainings
  FOR SELECT TO authenticated USING (public.is_corporate_hr_admin_for(company_id));

CREATE OR REPLACE FUNCTION public.get_company_hr_dashboard_stats(_company_id uuid, _min_group integer DEFAULT 5)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _ok boolean; _name text; _enrolled integer; _context text;
  _completed integer := 0; _avg_who5 numeric := null; _avg_overall numeric := null;
  _green integer := 0; _yellow integer := 0; _red integer := 0;
  _can boolean := false; _phases jsonb := '[]'::jsonb; _qavgs jsonb := '[]'::jsonb;
  _trainings jsonb := '[]'::jsonb;
BEGIN
  SELECT public.is_corporate_hr_admin_for(_company_id) INTO _ok;
  IF NOT _ok THEN RAISE EXCEPTION 'not authorized'; END IF;

  SELECT c.name,
         COALESCE(NULLIF(c.employee_count,0), (SELECT COUNT(*)::int FROM public.corporate_employees e WHERE e.company_id = c.id AND e.is_active)),
         c.context_notes
    INTO _name, _enrolled, _context
  FROM public.corporate_companies c WHERE c.id = _company_id;

  WITH latest AS (
    SELECT DISTINCT ON (s.employee_id)
      s.employee_id, s.who5_percentage, s.total_score, s.wellbeing_category, s.workplace_responses, s.completed_at
    FROM public.corporate_screenings s
    WHERE s.company_id = _company_id
    ORDER BY s.employee_id, s.completed_at DESC
  )
  SELECT COUNT(*)::int,
         ROUND(AVG(who5_percentage)::numeric, 1),
         ROUND(AVG(CASE WHEN total_score IS NOT NULL THEN (total_score::numeric / 40) * 100 END), 1),
         COUNT(*) FILTER (WHERE wellbeing_category = 'green'),
         COUNT(*) FILTER (WHERE wellbeing_category = 'yellow'),
         COUNT(*) FILTER (WHERE wellbeing_category = 'red')
    INTO _completed, _avg_who5, _avg_overall, _green, _yellow, _red
  FROM latest;

  _can := _completed >= _min_group;

  SELECT COALESCE(jsonb_agg(to_jsonb(p) ORDER BY p.period), '[]'::jsonb)
    INTO _phases
  FROM (
    SELECT to_char(date_trunc('month', s.completed_at), 'YYYY-MM') AS period,
           COUNT(DISTINCT s.employee_id)::int AS completed,
           CASE WHEN COUNT(DISTINCT s.employee_id) >= _min_group
                THEN ROUND(AVG(s.who5_percentage)::numeric, 1) ELSE NULL END AS avg_who5
    FROM public.corporate_screenings s
    WHERE s.company_id = _company_id
    GROUP BY date_trunc('month', s.completed_at)
  ) p;

  IF _can THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(d) ORDER BY d.avg_score ASC NULLS LAST), '[]'::jsonb)
      INTO _qavgs
    FROM (
      SELECT * FROM (VALUES
        (1, 'Cheerful and in good spirits',
          (SELECT ROUND(AVG((x.workplace_responses->>'q1')::numeric), 2) FROM (
            SELECT DISTINCT ON (employee_id) workplace_responses FROM public.corporate_screenings
            WHERE company_id = _company_id AND workplace_responses ? 'q1'
            ORDER BY employee_id, completed_at DESC) x)),
        (2, 'Calm and relaxed',
          (SELECT ROUND(AVG((x.workplace_responses->>'q2')::numeric), 2) FROM (
            SELECT DISTINCT ON (employee_id) workplace_responses FROM public.corporate_screenings
            WHERE company_id = _company_id AND workplace_responses ? 'q2'
            ORDER BY employee_id, completed_at DESC) x)),
        (3, 'Active and vigorous',
          (SELECT ROUND(AVG((x.workplace_responses->>'q3')::numeric), 2) FROM (
            SELECT DISTINCT ON (employee_id) workplace_responses FROM public.corporate_screenings
            WHERE company_id = _company_id AND workplace_responses ? 'q3'
            ORDER BY employee_id, completed_at DESC) x)),
        (4, 'Fresh and rested',
          (SELECT ROUND(AVG((x.workplace_responses->>'q4')::numeric), 2) FROM (
            SELECT DISTINCT ON (employee_id) workplace_responses FROM public.corporate_screenings
            WHERE company_id = _company_id AND workplace_responses ? 'q4'
            ORDER BY employee_id, completed_at DESC) x)),
        (5, 'Daily life filled with interest',
          (SELECT ROUND(AVG((x.workplace_responses->>'q5')::numeric), 2) FROM (
            SELECT DISTINCT ON (employee_id) workplace_responses FROM public.corporate_screenings
            WHERE company_id = _company_id AND workplace_responses ? 'q5'
            ORDER BY employee_id, completed_at DESC) x))
      ) AS t(ord, dimension, avg_score)
      WHERE avg_score IS NOT NULL
    ) d;
  END IF;

  SELECT COALESCE(jsonb_agg(to_jsonb(t) ORDER BY COALESCE(t.scheduled_at, t.created_at) DESC), '[]'::jsonb)
    INTO _trainings
  FROM (
    SELECT id, title, module_code, scheduled_at, completed_at, status, attendees_count, notes, created_at
    FROM public.corporate_trainings WHERE company_id = _company_id
  ) t;

  RETURN jsonb_build_object(
    'company_name', _name,
    'enrolled', COALESCE(_enrolled, 0),
    'context_notes', _context,
    'min_group', _min_group,
    'completed', _completed,
    'participation_rate', CASE WHEN COALESCE(_enrolled,0) > 0
      THEN ROUND((_completed::numeric / _enrolled) * 100, 1) ELSE NULL END,
    'can_show_breakdown', _can,
    'avg_who5', CASE WHEN _can THEN _avg_who5 ELSE NULL END,
    'avg_overall', CASE WHEN _can THEN _avg_overall ELSE NULL END,
    'avg_percentage', CASE WHEN _can THEN _avg_who5 ELSE NULL END,
    'risk', CASE WHEN _can THEN jsonb_build_object('low', _green, 'moderate', _yellow, 'high', _red) ELSE NULL END,
    'drivers', CASE WHEN _can THEN COALESCE(_qavgs, '[]'::jsonb) ELSE '[]'::jsonb END,
    'phases', _phases,
    'trainings', _trainings,
    'rounds', '[]'::jsonb
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_company_hr_dashboard_stats(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_corporate_hr_admin_for(uuid) TO authenticated;
