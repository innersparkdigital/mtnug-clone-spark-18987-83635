
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

SELECT cron.unschedule('send-chat-reminders-every-15m')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'send-chat-reminders-every-15m');

SELECT cron.schedule(
  'send-chat-reminders-every-15m',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://hnjpsvpudwwyzrrwzbpa.supabase.co/functions/v1/send-chat-reminders',
    headers := jsonb_build_object('Content-Type','application/json'),
    body := '{}'::jsonb
  );
  $$
);
