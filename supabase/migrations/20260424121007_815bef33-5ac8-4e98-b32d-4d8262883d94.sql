
-- Tier-based monthly commission model
-- Per-patient commission amounts (UGX): T1=3375 (1-5), T2=4500 (6-15), T3=5625 (15+)
-- Calculation runs over successful referrals in the same calendar month per doctor.

CREATE OR REPLACE FUNCTION public.recalc_doctor_monthly_commissions(_doctor_id uuid, _month_start timestamptz)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _month_end timestamptz := (_month_start + interval '1 month');
  _success_count int;
  _tier_amount numeric;
BEGIN
  -- Count successful referrals this month for this doctor
  SELECT COUNT(*) INTO _success_count
  FROM public.doctor_referrals
  WHERE doctor_id = _doctor_id
    AND created_at >= _month_start
    AND created_at < _month_end
    AND status = 'completed'
    AND payment_status = 'paid';

  IF _success_count <= 5 THEN
    _tier_amount := 3375;
  ELSIF _success_count <= 15 THEN
    _tier_amount := 4500;
  ELSE
    _tier_amount := 5625;
  END IF;

  -- Update all successful referrals for the month to the tier amount
  -- Skip ones already paid out (commission_status='paid')
  UPDATE public.doctor_referrals
  SET commission_amount = _tier_amount
  WHERE doctor_id = _doctor_id
    AND created_at >= _month_start
    AND created_at < _month_end
    AND status = 'completed'
    AND payment_status = 'paid'
    AND commission_status <> 'paid';
END;
$$;

-- Replace the old per-row commission calc with tier-aware logic
CREATE OR REPLACE FUNCTION public.update_referral_commission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _month_start timestamptz;
BEGIN
  -- Earned/unearned promotion (preserve previous behaviour)
  IF NEW.status = 'completed' AND NEW.payment_status = 'paid' THEN
    IF NEW.commission_status = 'unearned' OR NEW.commission_status IS NULL THEN
      NEW.commission_status := 'earned';
    END IF;
  ELSE
    IF NEW.commission_status = 'earned' THEN
      NEW.commission_status := 'unearned';
      NEW.commission_amount := 0;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- After insert/update, recompute the whole month bucket so tier rate applies to ALL successes that month
CREATE OR REPLACE FUNCTION public.trigger_recalc_month_after_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _month_start timestamptz;
BEGIN
  _month_start := date_trunc('month', NEW.created_at);
  PERFORM public.recalc_doctor_monthly_commissions(NEW.doctor_id, _month_start);
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS doctor_referrals_recalc_month ON public.doctor_referrals;
CREATE TRIGGER doctor_referrals_recalc_month
AFTER INSERT OR UPDATE OF status, payment_status, commission_status ON public.doctor_referrals
FOR EACH ROW
EXECUTE FUNCTION public.trigger_recalc_month_after_change();

-- Recompute commissions for all existing successful referrals using the new tier model
DO $$
DECLARE
  _row record;
BEGIN
  FOR _row IN
    SELECT DISTINCT doctor_id, date_trunc('month', created_at) AS month_start
    FROM public.doctor_referrals
    WHERE status = 'completed' AND payment_status = 'paid'
  LOOP
    PERFORM public.recalc_doctor_monthly_commissions(_row.doctor_id, _row.month_start);
  END LOOP;
END $$;
