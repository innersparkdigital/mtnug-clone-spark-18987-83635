
-- 1. Client tracker: therapist payout + receipt tracking
ALTER TABLE public.therapist_clients
  ADD COLUMN IF NOT EXISTS therapist_paid boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS therapist_paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS therapist_payout_expense_id uuid,
  ADD COLUMN IF NOT EXISTS receipt_sent_at timestamptz;

-- 2. Referral links: country / currency / percentage reward
ALTER TABLE public.referral_links
  ADD COLUMN IF NOT EXISTS country text NOT NULL DEFAULT 'Uganda',
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'UGX',
  ADD COLUMN IF NOT EXISTS discount_amount integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS reward_percent numeric NOT NULL DEFAULT 5;

UPDATE public.referral_links
SET discount_amount = discount_amount_kes
WHERE discount_amount = 0 AND discount_amount_kes > 0;

ALTER TABLE public.referral_links ALTER COLUMN referrer_phone DROP NOT NULL;

-- 3. Referral conversions: progression tracking
ALTER TABLE public.referral_conversions
  ADD COLUMN IF NOT EXISTS client_email text,
  ADD COLUMN IF NOT EXISTS stage text NOT NULL DEFAULT 'contacted',
  ADD COLUMN IF NOT EXISTS stage_updated_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS reward_amount numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS reward_currency text NOT NULL DEFAULT 'UGX',
  ADD COLUMN IF NOT EXISTS stages_notified text[] NOT NULL DEFAULT '{}';

-- 4. Extend admin client list with new fields
CREATE OR REPLACE FUNCTION public.admin_list_all_clients()
RETURNS json
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  SELECT COALESCE(json_agg(row_to_json(x) ORDER BY x.created_at DESC), '[]'::json)
  INTO result FROM (
    SELECT
      c.id, c.full_name, c.email, c.phone, c.presenting_concern, c.access_token,
      c.created_at, c.last_seen_at, c.client_code, c.country, c.session_type,
      c.duration_mins, c.session_rating, c.would_rebook, c.amount_ugx,
      c.therapist_share_ugx, c.innerspark_share_ugx, c.paid_status,
      c.receipt_number, c.receipt_url, c.last_session_date,
      c.therapist_paid, c.therapist_paid_at, c.receipt_sent_at,
      ta.id AS therapist_id,
      ta.full_name AS therapist_name,
      ta.email AS therapist_email,
      (SELECT count(*) FROM public.assignment_tools at
        JOIN public.client_assignments ca ON ca.id = at.assignment_id
        WHERE ca.client_id = c.id AND ca.is_active = true AND at.status <> 'completed') AS active_tools,
      (SELECT count(*) FROM public.assignment_tools at
        JOIN public.client_assignments ca ON ca.id = at.assignment_id
        WHERE ca.client_id = c.id AND ca.is_active = true) AS total_tools,
      (SELECT count(*) FROM public.assignment_tools at
        JOIN public.client_assignments ca ON ca.id = at.assignment_id
        WHERE ca.client_id = c.id AND ca.is_active = true AND at.status = 'completed') AS completed_tools,
      (SELECT count(*) FROM public.safety_alerts sa
        WHERE sa.client_id = c.id AND sa.resolved = false) AS open_alerts,
      (SELECT max(ts.submitted_at) FROM public.tool_submissions ts
        JOIN public.assignment_tools at ON at.id = ts.assignment_tool_id
        JOIN public.client_assignments ca ON ca.id = at.assignment_id
        WHERE ca.client_id = c.id AND ts.submission_type = 'final') AS last_submission_at,
      COALESCE(
        c.next_session_date,
        (SELECT tsf.next_appt_date FROM public.therapist_session_feedback tsf
          WHERE tsf.client_id = c.id AND tsf.next_appt_date IS NOT NULL
          ORDER BY tsf.session_date DESC LIMIT 1)
      ) AS next_session_date
    FROM public.therapist_clients c
    JOIN public.therapist_accounts ta ON ta.id = c.therapist_id
    ORDER BY c.created_at DESC
  ) x;

  RETURN COALESCE(result, '[]'::json);
END;
$$;

-- 5. Admin create client
CREATE OR REPLACE FUNCTION public.admin_create_client(
  _therapist_id uuid,
  _full_name text,
  _email text DEFAULT NULL,
  _phone text DEFAULT NULL,
  _presenting_concern text DEFAULT NULL,
  _country text DEFAULT 'Uganda',
  _session_type text DEFAULT NULL,
  _duration_mins integer DEFAULT NULL,
  _last_session_date date DEFAULT NULL,
  _next_session_date date DEFAULT NULL,
  _amount_ugx numeric DEFAULT NULL,
  _therapist_share_ugx numeric DEFAULT NULL,
  _paid_status text DEFAULT NULL,
  _session_rating integer DEFAULT NULL,
  _would_rebook boolean DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE new_id uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  INSERT INTO public.therapist_clients (
    therapist_id, full_name, email, phone, presenting_concern, country,
    session_type, duration_mins, last_session_date, next_session_date,
    amount_ugx, therapist_share_ugx, innerspark_share_ugx, paid_status,
    session_rating, would_rebook
  ) VALUES (
    _therapist_id, _full_name, NULLIF(_email,''), NULLIF(_phone,''),
    NULLIF(_presenting_concern,''), COALESCE(NULLIF(_country,''),'Uganda'),
    NULLIF(_session_type,''), _duration_mins, _last_session_date, _next_session_date,
    _amount_ugx,
    COALESCE(_therapist_share_ugx, CASE WHEN _amount_ugx IS NOT NULL THEN round(_amount_ugx * 0.6) END),
    CASE WHEN _amount_ugx IS NOT NULL
      THEN _amount_ugx - COALESCE(_therapist_share_ugx, round(_amount_ugx * 0.6)) END,
    NULLIF(_paid_status,''), _session_rating, _would_rebook
  ) RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

-- 6. Admin delete client
CREATE OR REPLACE FUNCTION public.admin_delete_client(_client_id uuid)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;
  DELETE FROM public.therapist_clients WHERE id = _client_id;
  RETURN true;
END;
$$;

-- 7. Mark therapist payout paid/unpaid -> posts an expense in Finance
CREATE OR REPLACE FUNCTION public.admin_set_therapist_paid(_client_id uuid, _paid boolean)
RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  c public.therapist_clients%ROWTYPE;
  t_name text;
  exp_id uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') AND NOT public.has_role(auth.uid(), 'finance_admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  SELECT * INTO c FROM public.therapist_clients WHERE id = _client_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Client not found'; END IF;
  SELECT full_name INTO t_name FROM public.therapist_accounts WHERE id = c.therapist_id;

  IF _paid THEN
    IF COALESCE(c.therapist_share_ugx, 0) <= 0 THEN
      RAISE EXCEPTION 'Set the therapist share before marking it paid';
    END IF;
    IF c.therapist_payout_expense_id IS NULL THEN
      INSERT INTO public.expenses (category, description, amount, expense_date, recorded_by)
      VALUES (
        'therapist_payout',
        'Therapist payout — ' || COALESCE(t_name,'Therapist') || ' · ' || c.full_name ||
          COALESCE(' (' || c.client_code || ')', ''),
        c.therapist_share_ugx,
        COALESCE(c.last_session_date, CURRENT_DATE),
        auth.uid()
      ) RETURNING id INTO exp_id;
    ELSE
      exp_id := c.therapist_payout_expense_id;
    END IF;

    UPDATE public.therapist_clients
    SET therapist_paid = true, therapist_paid_at = now(), therapist_payout_expense_id = exp_id
    WHERE id = _client_id;
  ELSE
    IF c.therapist_payout_expense_id IS NOT NULL THEN
      DELETE FROM public.expenses WHERE id = c.therapist_payout_expense_id;
    END IF;
    UPDATE public.therapist_clients
    SET therapist_paid = false, therapist_paid_at = NULL, therapist_payout_expense_id = NULL
    WHERE id = _client_id;
  END IF;

  RETURN json_build_object('success', true, 'paid', _paid, 'expense_id', exp_id);
END;
$$;

-- 8. Advance a referral conversion stage
CREATE OR REPLACE FUNCTION public.admin_set_referral_stage(_conversion_id uuid, _stage text)
RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;
  IF _stage NOT IN ('contacted','booked','paid','reward_ready','reward_claimed') THEN
    RAISE EXCEPTION 'Invalid stage';
  END IF;

  UPDATE public.referral_conversions
  SET stage = _stage,
      stage_updated_at = now(),
      reward_issued = CASE WHEN _stage = 'reward_claimed' THEN true ELSE reward_issued END,
      reward_issued_at = CASE WHEN _stage = 'reward_claimed' THEN now() ELSE reward_issued_at END
  WHERE id = _conversion_id;

  RETURN json_build_object('success', true, 'stage', _stage);
END;
$$;
