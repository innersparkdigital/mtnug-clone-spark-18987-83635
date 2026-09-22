-- Corporate Wellbeing Dashboard
-- Individual employee answers are NEVER exposed to company admins.
-- Admins only receive aggregate stats via get_corporate_dashboard_stats when n >= min_group.

CREATE TABLE IF NOT EXISTS public.corporate_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  industry text,
  country text DEFAULT 'Uganda',
  employee_count_enrolled integer NOT NULL DEFAULT 0,
  context_notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.corporate_company_admins (
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

CREATE TABLE IF NOT EXISTS public.corporate_screening_rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.corporate_companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  phase_label text NOT NULL,
  starts_at date NOT NULL,
  ends_at date,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','open','completed','cancelled')),
  is_off_cycle boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.corporate_screening_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id uuid NOT NULL REFERENCES public.corporate_screening_rounds(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.corporate_companies(id) ON DELETE CASCADE,
  anonymous_token text NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  q1_cheerful integer NOT NULL CHECK (q1_cheerful BETWEEN 0 AND 5),
  q2_calm integer NOT NULL CHECK (q2_calm BETWEEN 0 AND 5),
  q3_active integer NOT NULL CHECK (q3_active BETWEEN 0 AND 5),
  q4_rested integer NOT NULL CHECK (q4_rested BETWEEN 0 AND 5),
  q5_interest integer NOT NULL CHECK (q5_interest BETWEEN 0 AND 5),
  raw_score integer GENERATED ALWAYS AS (q1_cheerful + q2_calm + q3_active + q4_rested + q5_interest) STORED,
  percentage integer GENERATED ALWAYS AS ((q1_cheerful + q2_calm + q3_active + q4_rested + q5_interest) * 4) STORED,
  risk_band text GENERATED ALWAYS AS (
    CASE
      WHEN ((q1_cheerful + q2_calm + q3_active + q4_rested + q5_interest) * 4) <= 28 THEN 'high'
      WHEN ((q1_cheerful + q2_calm + q3_active + q4_rested + q5_interest) * 4) <= 50 THEN 'moderate'
      ELSE 'low'
    END
  ) STORED,
  completed_at timestamptz NOT NULL DEFAULT now()
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

CREATE TABLE IF NOT EXISTS public.corporate_service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.corporate_companies(id) ON DELETE CASCADE,
  admin_id uuid REFERENCES public.corporate_company_admins(id) ON DELETE SET NULL,
  request_type text NOT NULL CHECK (request_type IN ('screening','training','eap','other')),
  service_code text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','in_progress','done','closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_corp_admins_user ON public.corporate_company_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_corp_rounds_company ON public.corporate_screening_rounds(company_id);
CREATE INDEX IF NOT EXISTS idx_corp_responses_round ON public.corporate_screening_responses(round_id);
CREATE INDEX IF NOT EXISTS idx_corp_responses_company ON public.corporate_screening_responses(company_id);

ALTER TABLE public.corporate_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_company_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_screening_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_screening_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_service_requests ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_corporate_admin_for(_company_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.corporate_company_admins a
    WHERE a.user_id = auth.uid()
      AND a.company_id = _company_id
      AND a.is_active = true
  );
$$;

DROP POLICY IF EXISTS corp_admins_self_select ON public.corporate_company_admins;
CREATE POLICY corp_admins_self_select ON public.corporate_company_admins
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS corp_admins_self_update ON public.corporate_company_admins;
CREATE POLICY corp_admins_self_update ON public.corporate_company_admins
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS corp_companies_admin_select ON public.corporate_companies;
CREATE POLICY corp_companies_admin_select ON public.corporate_companies
  FOR SELECT TO authenticated
  USING (public.is_corporate_admin_for(id));

DROP POLICY IF EXISTS corp_rounds_admin_select ON public.corporate_screening_rounds;
CREATE POLICY corp_rounds_admin_select ON public.corporate_screening_rounds
  FOR SELECT TO authenticated
  USING (public.is_corporate_admin_for(company_id));

-- No SELECT policy on corporate_screening_responses for authenticated =
-- individual answers blocked under RLS. Only SECURITY DEFINER aggregates.

DROP POLICY IF EXISTS corp_trainings_admin_select ON public.corporate_trainings;
CREATE POLICY corp_trainings_admin_select ON public.corporate_trainings
  FOR SELECT TO authenticated
  USING (public.is_corporate_admin_for(company_id));

DROP POLICY IF EXISTS corp_requests_admin_select ON public.corporate_service_requests;
CREATE POLICY corp_requests_admin_select ON public.corporate_service_requests
  FOR SELECT TO authenticated
  USING (public.is_corporate_admin_for(company_id));

DROP POLICY IF EXISTS corp_requests_admin_insert ON public.corporate_service_requests;
CREATE POLICY corp_requests_admin_insert ON public.corporate_service_requests
  FOR INSERT TO authenticated
  WITH CHECK (public.is_corporate_admin_for(company_id));

CREATE OR REPLACE FUNCTION public.get_corporate_dashboard_stats(_company_id uuid, _min_group integer DEFAULT 5)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _ok boolean;
  _enrolled integer;
  _company_name text;
  _context text;
  _latest_round record;
  _completed integer := 0;
  _avg_pct numeric := null;
  _low integer := 0;
  _mod integer := 0;
  _high integer := 0;
  _d1 numeric; _d2 numeric; _d3 numeric; _d4 numeric; _d5 numeric;
  _phases jsonb := '[]'::jsonb;
  _trainings jsonb := '[]'::jsonb;
  _rounds jsonb := '[]'::jsonb;
  _can_breakdown boolean := false;
  _drivers jsonb := '[]'::jsonb;
BEGIN
  SELECT public.is_corporate_admin_for(_company_id) INTO _ok;
  IF NOT _ok THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  SELECT name, employee_count_enrolled, context_notes
    INTO _company_name, _enrolled, _context
  FROM public.corporate_companies WHERE id = _company_id;

  SELECT COALESCE(jsonb_agg(to_jsonb(x) ORDER BY x.starts_at), '[]'::jsonb)
    INTO _phases
  FROM (
    SELECT r.id, r.name, r.phase_label, r.starts_at, r.status, r.is_off_cycle,
           COUNT(resp.id)::int AS completed,
           CASE WHEN COUNT(resp.id) >= _min_group
                THEN ROUND(AVG(resp.percentage)::numeric, 1)
                ELSE NULL END AS avg_percentage
    FROM public.corporate_screening_rounds r
    LEFT JOIN public.corporate_screening_responses resp ON resp.round_id = r.id
    WHERE r.company_id = _company_id
    GROUP BY r.id
  ) x;

  SELECT r.* INTO _latest_round
  FROM public.corporate_screening_rounds r
  WHERE r.company_id = _company_id
  ORDER BY
    CASE WHEN EXISTS (SELECT 1 FROM public.corporate_screening_responses s WHERE s.round_id = r.id) THEN 0 ELSE 1 END,
    r.starts_at DESC
  LIMIT 1;

  IF _latest_round.id IS NOT NULL THEN
    SELECT COUNT(*)::int,
           ROUND(AVG(percentage)::numeric, 1),
           COUNT(*) FILTER (WHERE risk_band = 'low'),
           COUNT(*) FILTER (WHERE risk_band = 'moderate'),
           COUNT(*) FILTER (WHERE risk_band = 'high'),
           ROUND(AVG(q1_cheerful)::numeric, 2),
           ROUND(AVG(q2_calm)::numeric, 2),
           ROUND(AVG(q3_active)::numeric, 2),
           ROUND(AVG(q4_rested)::numeric, 2),
           ROUND(AVG(q5_interest)::numeric, 2)
      INTO _completed, _avg_pct, _low, _mod, _high, _d1, _d2, _d3, _d4, _d5
    FROM public.corporate_screening_responses
    WHERE round_id = _latest_round.id;

    _can_breakdown := _completed >= _min_group;

    IF _can_breakdown THEN
      SELECT COALESCE(jsonb_agg(to_jsonb(d) ORDER BY d.avg_score ASC), '[]'::jsonb)
        INTO _drivers
      FROM (
        SELECT * FROM (VALUES
          ('Cheerful and in good spirits', _d1),
          ('Calm and relaxed', _d2),
          ('Active and vigorous', _d3),
          ('Fresh and rested', _d4),
          ('Daily life filled with things that interest me', _d5)
        ) AS t(dimension, avg_score)
      ) d;
    END IF;
  END IF;

  SELECT COALESCE(jsonb_agg(to_jsonb(t) ORDER BY COALESCE(t.scheduled_at, t.created_at) DESC), '[]'::jsonb)
    INTO _trainings
  FROM (
    SELECT id, title, module_code, scheduled_at, completed_at, status, attendees_count, notes, created_at
    FROM public.corporate_trainings
    WHERE company_id = _company_id
  ) t;

  SELECT COALESCE(jsonb_agg(to_jsonb(r) ORDER BY r.starts_at DESC), '[]'::jsonb)
    INTO _rounds
  FROM (
    SELECT id, name, phase_label, starts_at, ends_at, status, is_off_cycle
    FROM public.corporate_screening_rounds
    WHERE company_id = _company_id
  ) r;

  RETURN jsonb_build_object(
    'company_name', _company_name,
    'enrolled', COALESCE(_enrolled, 0),
    'context_notes', _context,
    'min_group', _min_group,
    'latest_round', CASE WHEN _latest_round.id IS NULL THEN NULL ELSE jsonb_build_object(
      'id', _latest_round.id,
      'name', _latest_round.name,
      'phase_label', _latest_round.phase_label,
      'starts_at', _latest_round.starts_at,
      'status', _latest_round.status
    ) END,
    'completed', _completed,
    'participation_rate', CASE WHEN COALESCE(_enrolled,0) > 0
      THEN ROUND((_completed::numeric / _enrolled) * 100, 1) ELSE NULL END,
    'can_show_breakdown', _can_breakdown,
    'avg_percentage', CASE WHEN _can_breakdown THEN _avg_pct ELSE NULL END,
    'risk', CASE WHEN _can_breakdown THEN jsonb_build_object(
      'low', _low, 'moderate', _mod, 'high', _high
    ) ELSE NULL END,
    'drivers', CASE WHEN _can_breakdown THEN _drivers ELSE '[]'::jsonb END,
    'phases', _phases,
    'trainings', _trainings,
    'rounds', _rounds
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_corporate_dashboard_stats(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_corporate_admin_for(uuid) TO authenticated;
