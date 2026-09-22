CREATE TABLE IF NOT EXISTS public.psych_assessment_catalog (
  id text PRIMARY KEY,
  name text NOT NULL,
  short_name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 15,
  question_count integer NOT NULL DEFAULT 20,
  credit_cost integer NOT NULL DEFAULT 1,
  unit_price_ugx integer NOT NULL DEFAULT 45000,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.psych_credit_packs (
  id text PRIMARY KEY,
  name text NOT NULL,
  credits integer NOT NULL,
  price_ugx integer NOT NULL,
  price_usd numeric(10,2),
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.psych_company_wallets (
  company_id uuid PRIMARY KEY REFERENCES public.corporate_companies(id) ON DELETE CASCADE,
  credit_balance integer NOT NULL DEFAULT 0 CHECK (credit_balance >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.psych_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.corporate_companies(id) ON DELETE CASCADE,
  admin_id uuid REFERENCES public.corporate_hr_admins(id) ON DELETE SET NULL,
  pack_id text REFERENCES public.psych_credit_packs(id),
  credits integer NOT NULL,
  amount_ugx integer NOT NULL,
  currency text NOT NULL DEFAULT 'UGX',
  status text NOT NULL DEFAULT 'pending',
  payment_method text,
  payment_ref text,
  payer_name text,
  payer_phone text,
  payer_email text,
  notes text,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.psych_credit_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.corporate_companies(id) ON DELETE CASCADE,
  delta integer NOT NULL,
  balance_after integer NOT NULL,
  reason text NOT NULL,
  order_id uuid REFERENCES public.psych_orders(id) ON DELETE SET NULL,
  invite_id uuid,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.psych_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.corporate_companies(id) ON DELETE CASCADE,
  admin_id uuid REFERENCES public.corporate_hr_admins(id) ON DELETE SET NULL,
  catalog_id text NOT NULL REFERENCES public.psych_assessment_catalog(id),
  token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(18), 'hex'),
  employee_name text NOT NULL,
  employee_email text,
  employee_role text,
  department text,
  status text NOT NULL DEFAULT 'pending',
  credits_charged integer NOT NULL DEFAULT 1,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  opened_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.psych_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_id uuid NOT NULL UNIQUE REFERENCES public.psych_invites(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.corporate_companies(id) ON DELETE CASCADE,
  catalog_id text NOT NULL REFERENCES public.psych_assessment_catalog(id),
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  report jsonb NOT NULL DEFAULT '{}'::jsonb,
  completed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_psych_orders_company ON public.psych_orders(company_id);
CREATE INDEX IF NOT EXISTS idx_psych_invites_company ON public.psych_invites(company_id);
CREATE INDEX IF NOT EXISTS idx_psych_invites_token ON public.psych_invites(token);

ALTER TABLE public.psych_assessment_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psych_credit_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psych_company_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psych_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psych_credit_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psych_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psych_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS psych_catalog_read ON public.psych_assessment_catalog;
CREATE POLICY psych_catalog_read ON public.psych_assessment_catalog FOR SELECT TO authenticated USING (is_active = true);
DROP POLICY IF EXISTS psych_catalog_anon ON public.psych_assessment_catalog;
CREATE POLICY psych_catalog_anon ON public.psych_assessment_catalog FOR SELECT TO anon USING (is_active = true);
DROP POLICY IF EXISTS psych_packs_read ON public.psych_credit_packs;
CREATE POLICY psych_packs_read ON public.psych_credit_packs FOR SELECT TO authenticated USING (is_active = true);
DROP POLICY IF EXISTS psych_wallet_hr ON public.psych_company_wallets;
CREATE POLICY psych_wallet_hr ON public.psych_company_wallets FOR SELECT TO authenticated USING (public.is_corporate_hr_admin_for(company_id));
DROP POLICY IF EXISTS psych_orders_hr_sel ON public.psych_orders;
CREATE POLICY psych_orders_hr_sel ON public.psych_orders FOR SELECT TO authenticated USING (public.is_corporate_hr_admin_for(company_id));
DROP POLICY IF EXISTS psych_orders_hr_ins ON public.psych_orders;
CREATE POLICY psych_orders_hr_ins ON public.psych_orders FOR INSERT TO authenticated WITH CHECK (public.is_corporate_hr_admin_for(company_id));
DROP POLICY IF EXISTS psych_ledger_hr ON public.psych_credit_ledger;
CREATE POLICY psych_ledger_hr ON public.psych_credit_ledger FOR SELECT TO authenticated USING (public.is_corporate_hr_admin_for(company_id));
DROP POLICY IF EXISTS psych_invites_hr_sel ON public.psych_invites;
CREATE POLICY psych_invites_hr_sel ON public.psych_invites FOR SELECT TO authenticated USING (public.is_corporate_hr_admin_for(company_id));
DROP POLICY IF EXISTS psych_invites_hr_ins ON public.psych_invites;
CREATE POLICY psych_invites_hr_ins ON public.psych_invites FOR INSERT TO authenticated WITH CHECK (public.is_corporate_hr_admin_for(company_id));
DROP POLICY IF EXISTS psych_invites_hr_upd ON public.psych_invites;
CREATE POLICY psych_invites_hr_upd ON public.psych_invites FOR UPDATE TO authenticated USING (public.is_corporate_hr_admin_for(company_id));
DROP POLICY IF EXISTS psych_resp_hr_sel ON public.psych_responses;
CREATE POLICY psych_resp_hr_sel ON public.psych_responses FOR SELECT TO authenticated USING (public.is_corporate_hr_admin_for(company_id));

INSERT INTO public.psych_assessment_catalog (id, name, short_name, category, description, duration_minutes, question_count, credit_cost, unit_price_ugx, sort_order) VALUES
('workplace-personality', 'Workplace Personality Profile', 'Personality', 'Personality', 'Big-Five style profile for how someone shows up at work. Development and placement — not a clinical diagnosis.', 12, 25, 1, 45000, 1),
('stress-resilience', 'Stress Resilience at Work', 'Resilience', 'Wellbeing', 'Maps recovery capacity, workload coping and support-seeking at work.', 10, 20, 1, 45000, 2),
('leadership-style', 'Leadership Style Snapshot', 'Leadership', 'Leadership', 'How a people-manager sets direction, gives feedback and holds standards.', 12, 24, 1, 55000, 3),
('team-collaboration', 'Team Collaboration Style', 'Collaboration', 'Team', 'Preferred ways of contributing in a team for project staffing.', 10, 20, 1, 45000, 4),
('role-fit-interest', 'Role Fit and Interest Map', 'Role fit', 'Career', 'Interest map across people, process, problem-solving and delivery work.', 15, 28, 1, 50000, 5),
('workplace-aptitude', 'Workplace Aptitude Lite', 'Aptitude', 'Aptitude', 'Short checks of verbal reasoning, numerical sense and practical judgement.', 18, 18, 2, 75000, 6)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, unit_price_ugx = EXCLUDED.unit_price_ugx, is_active = true;

INSERT INTO public.psych_credit_packs (id, name, credits, price_ugx, price_usd, sort_order) VALUES
('pack-1', 'Single seat', 1, 45000, 12, 1),
('pack-5', 'Starter pack (5)', 5, 200000, 54, 2),
('pack-10', 'Team pack (10)', 10, 360000, 97, 3),
('pack-25', 'Department pack (25)', 25, 800000, 215, 4)
ON CONFLICT (id) DO UPDATE SET credits = EXCLUDED.credits, price_ugx = EXCLUDED.price_ugx, is_active = true;

INSERT INTO public.psych_company_wallets (company_id, credit_balance)
SELECT id, 0 FROM public.corporate_companies ON CONFLICT (company_id) DO NOTHING;
