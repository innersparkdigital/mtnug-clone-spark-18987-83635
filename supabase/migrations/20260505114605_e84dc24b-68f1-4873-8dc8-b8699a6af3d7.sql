
-- 1. Add Employee Digital Mental Health Package to catalog
INSERT INTO public.corporate_service_catalog (name, description, physical_price, virtual_price, per_employee_price, unit_label, sort_order, is_active)
VALUES (
  'Employee Digital Mental Health Package',
  'Insurance-style yearly subscription per employee. Includes 12 video teletherapy sessions, 48 weekly support group sessions, ~12 chat consultations/month, and quarterly Mind-Check & WHO-5 screenings. Fully virtual and accessible via the InnerSpark App.',
  NULL,
  NULL,
  1000000,
  'employee / year',
  0,
  true
)
ON CONFLICT DO NOTHING;

-- 2. Per-service reasoning on each report
ALTER TABLE public.corporate_reports
  ADD COLUMN IF NOT EXISTS service_notes jsonb NOT NULL DEFAULT '{}'::jsonb;

-- 3. Extend interests with form data
ALTER TABLE public.corporate_service_interests
  ADD COLUMN IF NOT EXISTS contact_name text,
  ADD COLUMN IF NOT EXISTS contact_email text,
  ADD COLUMN IF NOT EXISTS contact_phone text,
  ADD COLUMN IF NOT EXISTS message text,
  ADD COLUMN IF NOT EXISTS preferred_mode text,
  ADD COLUMN IF NOT EXISTS submitted boolean NOT NULL DEFAULT false;

-- 4. Public-safe lookup so the HR form page can render service + company info without auth
CREATE OR REPLACE FUNCTION public.get_service_recommendation_details(_report_id uuid, _service_id uuid)
RETURNS json
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'service', json_build_object(
      'id', s.id,
      'name', s.name,
      'description', s.description,
      'physical_price', s.physical_price,
      'virtual_price', s.virtual_price,
      'per_employee_price', s.per_employee_price,
      'unit_label', s.unit_label
    ),
    'company', json_build_object(
      'name', c.name,
      'contact_person', c.contact_person,
      'contact_email', c.contact_email,
      'contact_phone', c.contact_phone
    ),
    'report', json_build_object(
      'id', r.id,
      'period_label', r.period_label,
      'reason', COALESCE(r.service_notes ->> _service_id::text, NULL)
    )
  ) INTO result
  FROM public.corporate_reports r
  JOIN public.corporate_companies c ON c.id = r.company_id
  JOIN public.corporate_service_catalog s ON s.id = _service_id
  WHERE r.id = _report_id;

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_service_recommendation_details(uuid, uuid) TO anon, authenticated;
