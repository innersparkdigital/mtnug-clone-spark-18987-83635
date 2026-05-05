
-- Catalog of services that can be recommended to companies
CREATE TABLE public.corporate_service_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  physical_price numeric(12,2),
  virtual_price numeric(12,2),
  per_employee_price numeric(12,2),
  unit_label text DEFAULT 'session',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.corporate_service_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage service catalog" ON public.corporate_service_catalog
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view active services" ON public.corporate_service_catalog
  FOR SELECT USING (is_active = true);

CREATE TRIGGER trg_corporate_service_catalog_updated_at
  BEFORE UPDATE ON public.corporate_service_catalog
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Manual reports composed by admins for a company
CREATE TABLE public.corporate_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  period_label text,
  observations text,
  recommended_service_ids uuid[] NOT NULL DEFAULT '{}',
  sent_at timestamptz,
  sent_to_email text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.corporate_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage corporate reports" ON public.corporate_reports
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_corporate_reports_updated_at
  BEFORE UPDATE ON public.corporate_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- HR clicks on a recommended service
CREATE TABLE public.corporate_service_interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid,
  company_id uuid,
  service_id uuid,
  service_name_snapshot text,
  ip_address text,
  user_agent text,
  clicked_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.corporate_service_interests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view service interests" ON public.corporate_service_interests
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can log service interest" ON public.corporate_service_interests
  FOR INSERT WITH CHECK (true);

-- Seed default services
INSERT INTO public.corporate_service_catalog (name, description, physical_price, virtual_price, per_employee_price, unit_label, sort_order) VALUES
  ('Mental Health Training Session', 'Targeted training session for staff on a chosen mental health topic (e.g. burnout, anxiety, leadership wellbeing).', 650000, 400000, NULL, 'session', 1),
  ('Employee Screening', 'Confidential mental health & wellbeing screening per employee, including WHO-5 and a workplace assessment.', NULL, NULL, 5000, 'employee', 2),
  ('1:1 Therapy Sessions', 'Individual virtual therapy sessions for employees flagged as needing support.', NULL, 75000, NULL, 'session', 3),
  ('Manager Wellbeing Workshop', 'Workshop for managers on supportive conversations, spotting burnout, and team mental health.', 650000, 400000, NULL, 'workshop', 4);
