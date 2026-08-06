-- 1. Link type support
ALTER TABLE public.referral_links
  ADD COLUMN IF NOT EXISTS reward_kind text NOT NULL DEFAULT 'client_discount';

UPDATE public.referral_links
SET reward_kind = CASE
  WHEN link_type IN ('public','partner','public_partner') THEN 'public_partner'
  ELSE 'client_discount' END;

ALTER TABLE public.referral_links
  DROP CONSTRAINT IF EXISTS referral_links_reward_kind_check;
ALTER TABLE public.referral_links
  ADD CONSTRAINT referral_links_reward_kind_check
  CHECK (reward_kind IN ('client_discount','public_partner'));

-- 2. Rewards ledger
CREATE TABLE IF NOT EXISTS public.referral_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_link_id uuid NOT NULL REFERENCES public.referral_links(id) ON DELETE CASCADE,
  conversion_id uuid REFERENCES public.referral_conversions(id) ON DELETE SET NULL,
  referrer_name text,
  referrer_phone text,
  referrer_email text,
  reward_kind text NOT NULL DEFAULT 'client_discount',
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'UGX',
  status text NOT NULL DEFAULT 'pending',
  approved_by uuid,
  approved_at timestamptz,
  redeemed_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT referral_rewards_status_check CHECK (status IN ('pending','approved','redeemed','rejected')),
  CONSTRAINT referral_rewards_kind_check CHECK (reward_kind IN ('client_discount','public_partner'))
);

CREATE UNIQUE INDEX IF NOT EXISTS referral_rewards_conversion_uniq
  ON public.referral_rewards(conversion_id) WHERE conversion_id IS NOT NULL;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.referral_rewards TO authenticated;
GRANT ALL ON public.referral_rewards TO service_role;

ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage referral rewards"
ON public.referral_rewards FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER referral_rewards_updated_at
BEFORE UPDATE ON public.referral_rewards
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Auto-create a PENDING reward when a conversion is marked paid
CREATE OR REPLACE FUNCTION public.create_pending_referral_reward()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _link public.referral_links;
  _amount numeric;
BEGIN
  IF NEW.stage IS DISTINCT FROM 'paid' THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.stage = 'paid' THEN
    RETURN NEW;
  END IF;

  SELECT * INTO _link FROM public.referral_links WHERE id = NEW.referral_link_id;
  IF _link.id IS NULL THEN RETURN NEW; END IF;

  _amount := COALESCE(
    NULLIF(_link.reward_value, 0),
    NULLIF(_link.discount_amount, 0),
    CASE WHEN COALESCE(_link.reward_percent, 0) > 0
      THEN ROUND(COALESCE(NEW.session_amount_kes, 0) * _link.reward_percent / 100.0)
      ELSE 0 END
  );

  INSERT INTO public.referral_rewards (
    referral_link_id, conversion_id, referrer_name, referrer_phone, referrer_email,
    reward_kind, amount, currency, status
  ) VALUES (
    _link.id, NEW.id, _link.referrer_name, _link.referrer_phone, _link.referrer_email,
    _link.reward_kind, COALESCE(_amount, 0), COALESCE(_link.currency, 'UGX'), 'pending'
  )
  ON CONFLICT (conversion_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_create_pending_referral_reward ON public.referral_conversions;
CREATE TRIGGER trg_create_pending_referral_reward
AFTER INSERT OR UPDATE OF stage ON public.referral_conversions
FOR EACH ROW EXECUTE FUNCTION public.create_pending_referral_reward();

-- 4. Admin RPCs
CREATE OR REPLACE FUNCTION public.admin_list_referral_rewards()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _out json;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  SELECT COALESCE(json_agg(t ORDER BY t.created_at DESC), '[]'::json) INTO _out
  FROM (
    SELECT r.*, l.slug, l.reward_kind AS link_reward_kind,
           c.client_name, c.booking_reference, c.session_amount_kes
    FROM public.referral_rewards r
    JOIN public.referral_links l ON l.id = r.referral_link_id
    LEFT JOIN public.referral_conversions c ON c.id = r.conversion_id
  ) t;

  RETURN _out;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_referral_reward_status(
  _reward_id uuid, _status text, _amount numeric DEFAULT NULL, _notes text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;
  IF _status NOT IN ('pending','approved','redeemed','rejected') THEN
    RAISE EXCEPTION 'Invalid status';
  END IF;

  UPDATE public.referral_rewards
  SET status = _status,
      amount = COALESCE(_amount, amount),
      notes = COALESCE(_notes, notes),
      approved_by = CASE WHEN _status IN ('approved','redeemed') THEN auth.uid() ELSE approved_by END,
      approved_at = CASE WHEN _status IN ('approved','redeemed') AND approved_at IS NULL THEN now() ELSE approved_at END,
      redeemed_at = CASE WHEN _status = 'redeemed' THEN now() ELSE redeemed_at END
  WHERE id = _reward_id;

  RETURN json_build_object('success', true, 'status', _status);
END;
$$;