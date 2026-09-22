-- Day-before / 2-day-before session email reminders
-- 1) Dedup log table
CREATE TABLE IF NOT EXISTS public.client_reminder_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.therapist_clients(id) ON DELETE CASCADE,
  kind text NOT NULL,
  sent_for_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (client_id, kind, sent_for_date)
);

CREATE INDEX IF NOT EXISTS client_reminder_log_date_idx
  ON public.client_reminder_log (sent_for_date, kind);

ALTER TABLE public.client_reminder_log ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS; no public policies needed for this log.

-- 2) Schedule the edge function every morning (Africa/Nairobi ~ 07:00)
-- Requires pg_cron + pg_net (standard on Supabase). Safe to re-run.
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Remove previous job name if present, then recreate
DO $$
BEGIN
  PERFORM cron.unschedule(jobid)
  FROM cron.job
  WHERE jobname = 'send-session-reminders-daily';
EXCEPTION WHEN OTHERS THEN
  -- cron may not be available on every environment; ignore
  NULL;
END $$;

-- 04:00 UTC = 07:00 EAT (Africa/Nairobi)
SELECT cron.schedule(
  'send-session-reminders-daily',
  '0 4 * * *',
  $$
  SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url' LIMIT 1)
           || '/functions/v1/send-session-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || COALESCE(
        (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1),
        current_setting('app.settings.service_role_key', true)
      )
    ),
    body := '{}'::jsonb
  );
  $$
);
