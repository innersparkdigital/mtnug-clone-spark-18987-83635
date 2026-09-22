-- Corporate HR Dashboard: stats function + optional demo seed
-- Run this ENTIRE file once in Supabase SQL Editor -> Run

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

CREATE OR REPLACE FUNCTION public.get_company_hr_dashboard_stats(
  _company_id uuid,
  _min_group integer DEFAULT 5
)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _ok boolean; _name text; _enrolled integer; _context text;
  _completed integer := 0; _avg_who5 numeric := null;
  _green integer := 0; _yellow integer := 0; _red integer := 0;
  _can boolean := false;
  _phases jsonb := '[]'::jsonb;
  _drivers jsonb := '[]'::jsonb;
  _trainings jsonb := '[]'::jsonb;
BEGIN
  SELECT public.is_corporate_hr_admin_for(_company_id) INTO _ok;
  IF NOT _ok THEN RAISE EXCEPTION 'not authorized'; END IF;

  SELECT c.name,
         COALESCE(NULLIF(c.employee_count, 0),
           (SELECT COUNT(*)::int FROM public.corporate_employees e
            WHERE e.company_id = c.id AND e.is_active)),
         c.context_notes
    INTO _name, _enrolled, _context
  FROM public.corporate_companies c WHERE c.id = _company_id;

  WITH latest AS (
    SELECT DISTINCT ON (s.employee_id)
      s.who5_percentage, s.wellbeing_category, s.workplace_responses
    FROM public.corporate_screenings s
    WHERE s.company_id = _company_id
    ORDER BY s.employee_id, s.completed_at DESC
  )
  SELECT COUNT(*)::int,
         ROUND(AVG(who5_percentage)::numeric, 1),
         COUNT(*) FILTER (WHERE wellbeing_category = 'green'),
         COUNT(*) FILTER (WHERE wellbeing_category = 'yellow'),
         COUNT(*) FILTER (WHERE wellbeing_category = 'red')
    INTO _completed, _avg_who5, _green, _yellow, _red
  FROM latest;

  _can := _completed >= _min_group;

  SELECT COALESCE(jsonb_agg(to_jsonb(p) ORDER BY p.period), '[]'::jsonb)
    INTO _phases
  FROM (
    SELECT to_char(date_trunc('month', s.completed_at), 'YYYY-MM') AS period,
           COUNT(DISTINCT s.employee_id)::int AS completed,
           CASE WHEN COUNT(DISTINCT s.employee_id) >= _min_group
                THEN ROUND(AVG(s.who5_percentage)::numeric, 1) ELSE NULL END AS avg_who5,
           CASE WHEN COUNT(DISTINCT s.employee_id) >= _min_group
                THEN ROUND(AVG(s.who5_percentage)::numeric, 1) ELSE NULL END AS avg_percentage,
           to_char(date_trunc('month', s.completed_at), 'YYYY-MM') AS phase_label,
           to_char(date_trunc('month', s.completed_at), 'YYYY-MM') AS name,
           to_char(date_trunc('month', s.completed_at), 'YYYY-MM') AS id,
           (date_trunc('month', s.completed_at))::date AS starts_at,
           'completed' AS status,
           false AS is_off_cycle
    FROM public.corporate_screenings s
    WHERE s.company_id = _company_id
    GROUP BY date_trunc('month', s.completed_at)
  ) p;

  IF _can THEN
    WITH latest AS (
      SELECT DISTINCT ON (s.employee_id) s.workplace_responses
      FROM public.corporate_screenings s
      WHERE s.company_id = _company_id AND s.workplace_responses IS NOT NULL
      ORDER BY s.employee_id, s.completed_at DESC
    )
    SELECT COALESCE(jsonb_agg(to_jsonb(d) ORDER BY d.avg_score ASC NULLS LAST), '[]'::jsonb)
      INTO _drivers
    FROM (
      SELECT 'Cheerful and in good spirits' AS dimension,
             ROUND(AVG((workplace_responses->>'q1')::numeric), 2) AS avg_score
      FROM latest WHERE workplace_responses ? 'q1'
      UNION ALL
      SELECT 'Calm and relaxed', ROUND(AVG((workplace_responses->>'q2')::numeric), 2)
      FROM latest WHERE workplace_responses ? 'q2'
      UNION ALL
      SELECT 'Active and vigorous', ROUND(AVG((workplace_responses->>'q3')::numeric), 2)
      FROM latest WHERE workplace_responses ? 'q3'
      UNION ALL
      SELECT 'Fresh and rested', ROUND(AVG((workplace_responses->>'q4')::numeric), 2)
      FROM latest WHERE workplace_responses ? 'q4'
      UNION ALL
      SELECT 'Daily life filled with interest', ROUND(AVG((workplace_responses->>'q5')::numeric), 2)
      FROM latest WHERE workplace_responses ? 'q5'
    ) d WHERE d.avg_score IS NOT NULL;
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
    'participation_rate', CASE WHEN COALESCE(_enrolled, 0) > 0
      THEN ROUND((_completed::numeric / _enrolled) * 100, 1) ELSE NULL END,
    'can_show_breakdown', _can,
    'avg_who5', CASE WHEN _can THEN _avg_who5 ELSE NULL END,
    'avg_percentage', CASE WHEN _can THEN _avg_who5 ELSE NULL END,
    'risk', CASE WHEN _can THEN jsonb_build_object('low', _green, 'moderate', _yellow, 'high', _red) ELSE NULL END,
    'drivers', CASE WHEN _can THEN COALESCE(_drivers, '[]'::jsonb) ELSE '[]'::jsonb END,
    'phases', _phases,
    'trainings', _trainings,
    'rounds', '[]'::jsonb
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_corporate_hr_admin_for(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_company_hr_dashboard_stats(uuid, integer) TO authenticated;

-- Demo company + 12 screens (above privacy threshold of 5)
INSERT INTO public.corporate_companies (id, name, industry, country, employee_count, context_notes)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Demo Co Ltd',
  'Technology',
  'Uganda',
  40,
  'Q3 delivery peak and a recent team restructure.'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  employee_count = EXCLUDED.employee_count,
  context_notes = EXCLUDED.context_notes;

DELETE FROM public.corporate_screenings WHERE company_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
DELETE FROM public.corporate_employees WHERE company_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
DELETE FROM public.corporate_trainings WHERE company_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

INSERT INTO public.corporate_employees (id, company_id, employee_code, department)
SELECT
  ('bbbbbbbb-bbbb-bbbb-bbbb-' || lpad(g::text, 12, '0'))::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'E' || g,
  CASE WHEN g % 3 = 0 THEN 'Ops' WHEN g % 3 = 1 THEN 'Sales' ELSE 'Product' END
FROM generate_series(1, 12) g;

INSERT INTO public.corporate_screenings (
  company_id, employee_id, who5_percentage, total_score, wellbeing_category, workplace_responses, completed_at
)
SELECT
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  e.id,
  (35 + (g * 4) % 50)::int,
  (8 + (g * 2) % 28)::int,
  (ARRAY['green','yellow','red','green','yellow','green'])[1 + ((g - 1) % 6)],
  jsonb_build_object(
    'q1', 1 + ((g) % 5),
    'q2', 1 + ((g + 1) % 4),
    'q3', 1 + ((g + 2) % 5),
    'q4', 1 + ((g + 3) % 3),
    'q5', 1 + ((g + 4) % 5)
  ),
  now() - ((g % 20) || ' days')::interval
FROM public.corporate_employees e
JOIN generate_series(1, 12) g ON e.employee_code = 'E' || g
WHERE e.company_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

INSERT INTO public.corporate_trainings (company_id, title, module_code, scheduled_at, status, attendees_count)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'S.P.A.R.K Resilience',
  'SPARK_RESILIENCE',
  now() + interval '14 days',
  'scheduled',
  25
);

SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name LIKE 'corporate%'
ORDER BY 1;
