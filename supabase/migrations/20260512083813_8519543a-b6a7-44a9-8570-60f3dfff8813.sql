
ALTER TABLE public.corporate_crisis_alerts
  ADD COLUMN IF NOT EXISTS assigned_to text,
  ADD COLUMN IF NOT EXISTS sla_deadline timestamp with time zone,
  ADD COLUMN IF NOT EXISTS outreach_attempts jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS alert_code text;

UPDATE public.corporate_crisis_alerts
SET sla_deadline = created_at + CASE level
  WHEN 1 THEN interval '2 hours'
  WHEN 2 THEN interval '24 hours'
  ELSE interval '72 hours'
END
WHERE sla_deadline IS NULL;

CREATE OR REPLACE FUNCTION public.set_crisis_alert_defaults()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  yr text := to_char(now() AT TIME ZONE 'UTC', 'YYYY');
  cnt int;
BEGIN
  IF NEW.sla_deadline IS NULL THEN
    NEW.sla_deadline := NEW.created_at + CASE NEW.level
      WHEN 1 THEN interval '2 hours'
      WHEN 2 THEN interval '24 hours'
      ELSE interval '72 hours'
    END;
  END IF;
  IF NEW.alert_code IS NULL THEN
    SELECT COUNT(*) + 1 INTO cnt FROM public.corporate_crisis_alerts
      WHERE created_at >= date_trunc('year', now());
    NEW.alert_code := 'ISA-CR-' || yr || '-' || lpad(cnt::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_crisis_alert_defaults ON public.corporate_crisis_alerts;
CREATE TRIGGER trg_set_crisis_alert_defaults
BEFORE INSERT ON public.corporate_crisis_alerts
FOR EACH ROW EXECUTE FUNCTION public.set_crisis_alert_defaults();

WITH numbered AS (
  SELECT id, 'ISA-CR-' || to_char(created_at, 'YYYY') || '-' ||
         lpad(row_number() OVER (PARTITION BY date_trunc('year', created_at) ORDER BY created_at)::text, 4, '0') AS new_code
  FROM public.corporate_crisis_alerts
  WHERE alert_code IS NULL
)
UPDATE public.corporate_crisis_alerts a
SET alert_code = n.new_code
FROM numbered n
WHERE a.id = n.id;

ALTER TABLE public.corporate_reports
  ADD COLUMN IF NOT EXISTS sections jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS business_impact jsonb,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft';
