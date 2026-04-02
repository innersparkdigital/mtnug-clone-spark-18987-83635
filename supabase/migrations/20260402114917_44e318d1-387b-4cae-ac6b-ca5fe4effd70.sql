
-- Corporate Companies table
CREATE TABLE public.corporate_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT,
  employee_count INTEGER,
  contact_person TEXT,
  contact_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.corporate_companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage companies" ON public.corporate_companies
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view companies" ON public.corporate_companies
  FOR SELECT USING (true);

CREATE TRIGGER update_corporate_companies_updated_at
  BEFORE UPDATE ON public.corporate_companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Corporate Employees table
CREATE TABLE public.corporate_employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.corporate_companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  access_code TEXT NOT NULL UNIQUE DEFAULT upper(substr(md5(random()::text), 1, 8)),
  secure_token TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
  invitation_sent BOOLEAN NOT NULL DEFAULT false,
  invitation_sent_at TIMESTAMP WITH TIME ZONE,
  screening_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.corporate_employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage employees" ON public.corporate_employees
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view employees by token" ON public.corporate_employees
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update employee screening status" ON public.corporate_employees
  FOR UPDATE TO anon, authenticated
  USING (true);

CREATE TRIGGER update_corporate_employees_updated_at
  BEFORE UPDATE ON public.corporate_employees
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_corporate_employees_access_code ON public.corporate_employees(access_code);
CREATE INDEX idx_corporate_employees_secure_token ON public.corporate_employees(secure_token);
CREATE INDEX idx_corporate_employees_company_id ON public.corporate_employees(company_id);

-- Corporate Screenings table
CREATE TABLE public.corporate_screenings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.corporate_employees(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.corporate_companies(id) ON DELETE CASCADE,
  who5_score INTEGER NOT NULL DEFAULT 0,
  who5_percentage INTEGER NOT NULL DEFAULT 0,
  workplace_responses JSONB DEFAULT '{}',
  total_score INTEGER NOT NULL DEFAULT 0,
  wellbeing_category TEXT NOT NULL DEFAULT 'green',
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.corporate_screenings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all screenings" ON public.corporate_screenings
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert screenings" ON public.corporate_screenings
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can delete screenings" ON public.corporate_screenings
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_corporate_screenings_company_id ON public.corporate_screenings(company_id);
CREATE INDEX idx_corporate_screenings_employee_id ON public.corporate_screenings(employee_id);
