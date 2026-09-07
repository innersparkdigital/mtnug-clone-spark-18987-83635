CREATE OR REPLACE FUNCTION public.sync_next_session_to_client()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.next_appt_date IS NOT NULL THEN
    UPDATE public.therapist_clients
       SET next_session_date = NEW.next_appt_date,
           updated_at = now()
     WHERE id = NEW.client_id
       AND (next_session_date IS DISTINCT FROM NEW.next_appt_date);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_next_session_to_client ON public.therapist_session_feedback;
CREATE TRIGGER trg_sync_next_session_to_client
AFTER INSERT OR UPDATE OF next_appt_date ON public.therapist_session_feedback
FOR EACH ROW EXECUTE FUNCTION public.sync_next_session_to_client();