-- 1) One-time data fix: revoke admin-level roles from any user that is registered as a doctor
DELETE FROM public.user_roles ur
WHERE ur.role IN ('admin', 'finance_admin', 'operations_admin', 'content_admin')
  AND EXISTS (SELECT 1 FROM public.doctors d WHERE d.user_id = ur.user_id);

-- 2) Guard trigger: prevent doctors from being granted admin-level roles in the future
CREATE OR REPLACE FUNCTION public.prevent_doctor_admin_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IN ('admin', 'finance_admin', 'operations_admin', 'content_admin')
     AND EXISTS (SELECT 1 FROM public.doctors WHERE user_id = NEW.user_id) THEN
    RAISE EXCEPTION 'Doctors cannot be granted admin-level roles (user_id: %)', NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_doctor_admin_role_trg ON public.user_roles;
CREATE TRIGGER prevent_doctor_admin_role_trg
  BEFORE INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_doctor_admin_role();