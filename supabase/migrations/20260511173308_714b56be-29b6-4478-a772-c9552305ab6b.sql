
ALTER TABLE public.corporate_screenings
  ADD COLUMN IF NOT EXISTS per_question jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS triggered_flags text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS triggered_clusters text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS crisis_alert_level integer,
  ADD COLUMN IF NOT EXISTS risk_category text;

CREATE TABLE IF NOT EXISTS public.corporate_crisis_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  employee_id uuid NOT NULL,
  screening_id uuid,
  level integer NOT NULL CHECK (level IN (1,2,3)),
  triggers text[] NOT NULL DEFAULT '{}'::text[],
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','contacted','resolved')),
  notes text,
  resolved_by uuid,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crisis_alerts_status_level ON public.corporate_crisis_alerts(status, level, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crisis_alerts_company ON public.corporate_crisis_alerts(company_id);

ALTER TABLE public.corporate_crisis_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert crisis alerts" ON public.corporate_crisis_alerts;
CREATE POLICY "Anyone can insert crisis alerts"
  ON public.corporate_crisis_alerts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins view crisis alerts" ON public.corporate_crisis_alerts;
CREATE POLICY "Admins view crisis alerts"
  ON public.corporate_crisis_alerts FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins update crisis alerts" ON public.corporate_crisis_alerts;
CREATE POLICY "Admins update crisis alerts"
  ON public.corporate_crisis_alerts FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins delete crisis alerts" ON public.corporate_crisis_alerts;
CREATE POLICY "Admins delete crisis alerts"
  ON public.corporate_crisis_alerts FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP TRIGGER IF EXISTS trg_corporate_crisis_alerts_updated_at ON public.corporate_crisis_alerts;
CREATE TRIGGER trg_corporate_crisis_alerts_updated_at
  BEFORE UPDATE ON public.corporate_crisis_alerts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
