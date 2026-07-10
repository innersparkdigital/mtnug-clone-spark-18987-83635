
CREATE TABLE public.therapist_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  specialisation TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  must_change_password BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.therapist_accounts TO authenticated;
GRANT ALL ON public.therapist_accounts TO service_role;
ALTER TABLE public.therapist_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage therapist accounts" ON public.therapist_accounts
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Therapists view own account" ON public.therapist_accounts
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Therapists update own account" ON public.therapist_accounts
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.therapist_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id UUID NOT NULL REFERENCES public.therapist_accounts(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  presenting_concern TEXT,
  access_token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  passcode_hash TEXT,
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_therapist_clients_therapist ON public.therapist_clients(therapist_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.therapist_clients TO authenticated;
GRANT ALL ON public.therapist_clients TO service_role;
ALTER TABLE public.therapist_clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage therapist clients" ON public.therapist_clients
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Therapists manage own clients" ON public.therapist_clients
  FOR ALL TO authenticated
  USING (therapist_id IN (SELECT id FROM public.therapist_accounts WHERE user_id = auth.uid()))
  WITH CHECK (therapist_id IN (SELECT id FROM public.therapist_accounts WHERE user_id = auth.uid()));

CREATE TABLE public.client_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.therapist_clients(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES public.therapist_accounts(id) ON DELETE CASCADE,
  personal_note TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_client_assignments_client ON public.client_assignments(client_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_assignments TO authenticated;
GRANT ALL ON public.client_assignments TO service_role;
ALTER TABLE public.client_assignments ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.assignment_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.client_assignments(id) ON DELETE CASCADE,
  tool_key TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_assignment_tools_assignment ON public.assignment_tools(assignment_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assignment_tools TO authenticated;
GRANT ALL ON public.assignment_tools TO service_role;
ALTER TABLE public.assignment_tools ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.tool_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_tool_id UUID NOT NULL REFERENCES public.assignment_tools(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.therapist_clients(id) ON DELETE CASCADE,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  mood_score INTEGER,
  screening_score INTEGER,
  safety_flag BOOLEAN NOT NULL DEFAULT false,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_tool_submissions_client ON public.tool_submissions(client_id);
CREATE INDEX idx_tool_submissions_tool ON public.tool_submissions(assignment_tool_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tool_submissions TO authenticated;
GRANT ALL ON public.tool_submissions TO service_role;
ALTER TABLE public.tool_submissions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.safety_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.therapist_clients(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES public.therapist_accounts(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES public.tool_submissions(id) ON DELETE SET NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  notified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_safety_alerts_therapist ON public.safety_alerts(therapist_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.safety_alerts TO authenticated;
GRANT ALL ON public.safety_alerts TO service_role;
ALTER TABLE public.safety_alerts ENABLE ROW LEVEL SECURITY;

-- Helper (tables now exist)
CREATE OR REPLACE FUNCTION public.is_client_therapist(_client_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.therapist_clients tc
    JOIN public.therapist_accounts ta ON ta.id = tc.therapist_id
    WHERE tc.id = _client_id AND ta.user_id = auth.uid()
  );
$$;

CREATE POLICY "Admins manage assignments" ON public.client_assignments
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Therapists manage own assignments" ON public.client_assignments
  FOR ALL TO authenticated USING (public.is_client_therapist(client_id)) WITH CHECK (public.is_client_therapist(client_id));

CREATE POLICY "Admins manage assignment tools" ON public.assignment_tools
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Therapists manage own assignment tools" ON public.assignment_tools
  FOR ALL TO authenticated
  USING (assignment_id IN (SELECT ca.id FROM public.client_assignments ca WHERE public.is_client_therapist(ca.client_id)))
  WITH CHECK (assignment_id IN (SELECT ca.id FROM public.client_assignments ca WHERE public.is_client_therapist(ca.client_id)));

CREATE POLICY "Admins view submissions" ON public.tool_submissions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Therapists view own client submissions" ON public.tool_submissions
  FOR SELECT TO authenticated USING (public.is_client_therapist(client_id));

CREATE POLICY "Admins manage safety alerts" ON public.safety_alerts
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Therapists view own safety alerts" ON public.safety_alerts
  FOR SELECT TO authenticated
  USING (therapist_id IN (SELECT id FROM public.therapist_accounts WHERE user_id = auth.uid()));
CREATE POLICY "Therapists resolve own safety alerts" ON public.safety_alerts
  FOR UPDATE TO authenticated
  USING (therapist_id IN (SELECT id FROM public.therapist_accounts WHERE user_id = auth.uid()))
  WITH CHECK (therapist_id IN (SELECT id FROM public.therapist_accounts WHERE user_id = auth.uid()));

CREATE TRIGGER trg_therapist_accounts_updated BEFORE UPDATE ON public.therapist_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_therapist_clients_updated BEFORE UPDATE ON public.therapist_clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_client_assignments_updated BEFORE UPDATE ON public.client_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_assignment_tools_updated BEFORE UPDATE ON public.assignment_tools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.get_client_by_token(_token UUID)
RETURNS JSON LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE result JSON;
BEGIN
  SELECT json_build_object(
    'client', json_build_object('id', c.id, 'full_name', c.full_name, 'has_passcode', c.passcode_hash IS NOT NULL),
    'therapist', json_build_object('full_name', ta.full_name),
    'assignment', (
      SELECT json_build_object(
        'id', ca.id, 'personal_note', ca.personal_note,
        'tools', COALESCE((
          SELECT json_agg(json_build_object('id', at.id, 'tool_key', at.tool_key, 'config', at.config, 'status', at.status))
          FROM public.assignment_tools at WHERE at.assignment_id = ca.id
        ), '[]'::json)
      )
      FROM public.client_assignments ca WHERE ca.client_id = c.id AND ca.is_active = true
      ORDER BY ca.created_at DESC LIMIT 1
    )
  ) INTO result
  FROM public.therapist_clients c
  JOIN public.therapist_accounts ta ON ta.id = c.therapist_id
  WHERE c.access_token = _token;
  RETURN result;
END;
$$;
