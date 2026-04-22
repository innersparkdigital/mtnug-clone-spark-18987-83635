
-- Add payment tracking to doctor_referrals
ALTER TABLE public.doctor_referrals
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'not_paid',
  ADD COLUMN IF NOT EXISTS payment_amount NUMERIC(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS commission_rate NUMERIC(5,2) NOT NULL DEFAULT 10.00,
  ADD COLUMN IF NOT EXISTS commission_amount NUMERIC(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS commission_status TEXT NOT NULL DEFAULT 'unearned';

-- commission_status values: unearned | earned | claimed | paid
-- payment_status values: not_paid | paid

-- Trigger to compute commission_amount and commission_status
CREATE OR REPLACE FUNCTION public.update_referral_commission()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.commission_amount := COALESCE(NEW.payment_amount, 0) * COALESCE(NEW.commission_rate, 0) / 100;
  IF NEW.status = 'completed' AND NEW.payment_status = 'paid' THEN
    -- Only auto-promote to 'earned' if currently 'unearned'
    IF NEW.commission_status = 'unearned' OR NEW.commission_status IS NULL THEN
      NEW.commission_status := 'earned';
    END IF;
  ELSE
    -- Revert to unearned if conditions no longer met and not already claimed/paid
    IF NEW.commission_status = 'earned' THEN
      NEW.commission_status := 'unearned';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_referral_commission ON public.doctor_referrals;
CREATE TRIGGER trg_referral_commission
  BEFORE INSERT OR UPDATE OF status, payment_status, payment_amount, commission_rate
  ON public.doctor_referrals
  FOR EACH ROW EXECUTE FUNCTION public.update_referral_commission();

-- Commission claims table
CREATE TABLE IF NOT EXISTS public.commission_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  doctor_name TEXT NOT NULL,
  doctor_phone TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  payout_method TEXT,
  payout_details TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | approved | paid | rejected
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ
);

ALTER TABLE public.commission_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can view their own claims"
  ON public.commission_claims FOR SELECT TO authenticated
  USING (doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()));

CREATE POLICY "Doctors can create their own claims"
  ON public.commission_claims FOR INSERT TO authenticated
  WITH CHECK (doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all claims"
  ON public.commission_claims FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all claims"
  ON public.commission_claims FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete claims"
  ON public.commission_claims FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_commission_claims_updated_at
  BEFORE UPDATE ON public.commission_claims
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Link referrals to claims (which referrals are part of which claim)
CREATE TABLE IF NOT EXISTS public.commission_claim_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID NOT NULL REFERENCES public.commission_claims(id) ON DELETE CASCADE,
  referral_id UUID NOT NULL REFERENCES public.doctor_referrals(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(referral_id)
);

ALTER TABLE public.commission_claim_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can view their own claim items"
  ON public.commission_claim_items FOR SELECT TO authenticated
  USING (claim_id IN (
    SELECT id FROM public.commission_claims
    WHERE doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid())
  ));

CREATE POLICY "Doctors can insert their own claim items"
  ON public.commission_claim_items FOR INSERT TO authenticated
  WITH CHECK (claim_id IN (
    SELECT id FROM public.commission_claims
    WHERE doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid())
  ));

CREATE POLICY "Admins can manage all claim items"
  ON public.commission_claim_items FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_commission_claims_doctor ON public.commission_claims(doctor_id);
CREATE INDEX IF NOT EXISTS idx_commission_claim_items_claim ON public.commission_claim_items(claim_id);
CREATE INDEX IF NOT EXISTS idx_doctor_referrals_status_payment ON public.doctor_referrals(status, payment_status);

-- Trigger function: when claim moves to 'paid', update referrals to commission_status='paid'
CREATE OR REPLACE FUNCTION public.sync_referrals_on_claim_paid()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'paid' AND (OLD.status IS DISTINCT FROM 'paid') THEN
    UPDATE public.doctor_referrals dr
      SET commission_status = 'paid'
      FROM public.commission_claim_items ci
      WHERE ci.claim_id = NEW.id AND ci.referral_id = dr.id;
    NEW.paid_at := now();
  ELSIF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN
    UPDATE public.doctor_referrals dr
      SET commission_status = 'claimed'
      FROM public.commission_claim_items ci
      WHERE ci.claim_id = NEW.id AND ci.referral_id = dr.id
        AND dr.commission_status NOT IN ('paid');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_sync_referrals_on_claim_paid
  BEFORE UPDATE OF status ON public.commission_claims
  FOR EACH ROW EXECUTE FUNCTION public.sync_referrals_on_claim_paid();

-- When claim items are inserted, mark referrals as 'claimed'
CREATE OR REPLACE FUNCTION public.mark_referral_claimed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.doctor_referrals
    SET commission_status = 'claimed'
    WHERE id = NEW.referral_id AND commission_status = 'earned';
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_mark_referral_claimed
  AFTER INSERT ON public.commission_claim_items
  FOR EACH ROW EXECUTE FUNCTION public.mark_referral_claimed();
