
-- Drop the header-based policies we just created (they won't work with JS client)
DROP POLICY IF EXISTS "Employees can view own record by token" ON public.corporate_employees;
DROP POLICY IF EXISTS "Employees can update own screening status" ON public.corporate_employees;

-- Create RPC for token lookup
CREATE OR REPLACE FUNCTION public.lookup_employee_by_token(_token text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'id', e.id,
    'name', e.name,
    'email', e.email,
    'company_id', e.company_id,
    'screening_completed', e.screening_completed
  ) INTO result
  FROM public.corporate_employees e
  WHERE e.secure_token = _token;

  IF result IS NULL THEN
    RETURN NULL;
  END IF;

  RETURN result;
END;
$$;

-- Create RPC for access code lookup
CREATE OR REPLACE FUNCTION public.lookup_employee_by_code(_code text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'id', e.id,
    'name', e.name,
    'email', e.email,
    'company_id', e.company_id,
    'screening_completed', e.screening_completed
  ) INTO result
  FROM public.corporate_employees e
  WHERE e.access_code = _code;

  IF result IS NULL THEN
    RETURN NULL;
  END IF;

  RETURN result;
END;
$$;

-- Create RPC for completing screening
CREATE OR REPLACE FUNCTION public.complete_employee_screening(_employee_id uuid, _gender text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.corporate_employees
  SET screening_completed = true, gender = _gender, updated_at = now()
  WHERE id = _employee_id;

  RETURN FOUND;
END;
$$;
