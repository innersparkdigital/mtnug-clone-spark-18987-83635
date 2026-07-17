
ALTER TABLE public.chat_leads
  ADD COLUMN IF NOT EXISTS remind_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS delivery_status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS delivery_error TEXT,
  ADD COLUMN IF NOT EXISTS delivery_attempts INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_attempt_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_chat_leads_remind_at
  ON public.chat_leads (remind_at)
  WHERE remind_at IS NOT NULL AND delivery_status IN ('pending','scheduled');

-- default remind_at for whatsapp_reminder rows: 24 hours after creation, if not set
CREATE OR REPLACE FUNCTION public.set_default_reminder_time()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.intent = 'whatsapp_reminder' AND NEW.remind_at IS NULL THEN
    NEW.remind_at := now() + INTERVAL '24 hours';
    NEW.delivery_status := 'scheduled';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS chat_leads_default_reminder ON public.chat_leads;
CREATE TRIGGER chat_leads_default_reminder
  BEFORE INSERT ON public.chat_leads
  FOR EACH ROW EXECUTE FUNCTION public.set_default_reminder_time();
