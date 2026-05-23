
-- Specialists: kenya tag
ALTER TABLE public.specialists ADD COLUMN IF NOT EXISTS kenya boolean NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_specialists_kenya ON public.specialists (kenya) WHERE kenya = true;

-- Session feedback: display consent
ALTER TABLE public.session_feedback ADD COLUMN IF NOT EXISTS client_consented_to_display boolean NOT NULL DEFAULT false;
ALTER TABLE public.session_feedback ADD COLUMN IF NOT EXISTS client_display_name text;

-- Public read of consented testimonials (only minimal fields)
CREATE OR REPLACE FUNCTION public.get_public_testimonials(_market text DEFAULT 'all', _limit int DEFAULT 3)
RETURNS TABLE (
  id uuid,
  client_display_name text,
  star_rating integer,
  open_comment text,
  submitted_at timestamptz
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT id, client_display_name, star_rating, open_comment, submitted_at
  FROM public.session_feedback
  WHERE client_consented_to_display = true
    AND star_rating = 5
    AND open_comment IS NOT NULL
  ORDER BY submitted_at DESC
  LIMIT GREATEST(_limit, 1);
$$;

-- ============================================================
-- REFERRAL LINKS SYSTEM
-- ============================================================

CREATE TABLE IF NOT EXISTS public.referral_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  referrer_name text NOT NULL,
  referrer_phone text NOT NULL,
  referrer_email text,
  market text NOT NULL DEFAULT 'ke' CHECK (market IN ('ke','ug')),
  link_type text NOT NULL DEFAULT 'client' CHECK (link_type IN ('client','corporate','therapist')),
  is_active boolean NOT NULL DEFAULT true,
  discount_amount_kes integer NOT NULL DEFAULT 0,
  reward_type text NOT NULL DEFAULT 'none' CHECK (reward_type IN ('free_session','airtime','cash','none')),
  reward_value integer NOT NULL DEFAULT 0,
  custom_message text,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_referral_links_slug ON public.referral_links (slug);
CREATE INDEX IF NOT EXISTS idx_referral_links_active ON public.referral_links (is_active);

CREATE TABLE IF NOT EXISTS public.referral_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_link_id uuid NOT NULL REFERENCES public.referral_links(id) ON DELETE CASCADE,
  clicked_at timestamptz NOT NULL DEFAULT now(),
  ip_hash text,
  user_agent text,
  converted boolean NOT NULL DEFAULT false,
  booking_id uuid
);
CREATE INDEX IF NOT EXISTS idx_referral_clicks_link ON public.referral_clicks (referral_link_id);
CREATE INDEX IF NOT EXISTS idx_referral_clicks_at ON public.referral_clicks (clicked_at DESC);

CREATE TABLE IF NOT EXISTS public.referral_conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_link_id uuid NOT NULL REFERENCES public.referral_links(id) ON DELETE CASCADE,
  booking_id uuid,
  booking_reference text,
  client_name text,
  client_phone text,
  converted_at timestamptz NOT NULL DEFAULT now(),
  session_amount_kes integer NOT NULL DEFAULT 0,
  discount_applied integer NOT NULL DEFAULT 0,
  reward_issued boolean NOT NULL DEFAULT false,
  reward_issued_at timestamptz,
  reward_issued_by uuid,
  notes text
);
CREATE INDEX IF NOT EXISTS idx_referral_conv_link ON public.referral_conversions (referral_link_id);
CREATE INDEX IF NOT EXISTS idx_referral_conv_at ON public.referral_conversions (converted_at DESC);
CREATE INDEX IF NOT EXISTS idx_referral_conv_reward_pending ON public.referral_conversions (reward_issued) WHERE reward_issued = false;

-- updated_at trigger
CREATE TRIGGER trg_referral_links_updated_at
BEFORE UPDATE ON public.referral_links
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.referral_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_conversions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage referral links" ON public.referral_links
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins view referral clicks" ON public.referral_clicks
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage referral conversions" ON public.referral_conversions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Public RPC: fetch link by slug (only active)
CREATE OR REPLACE FUNCTION public.get_referral_link_by_slug(_slug text)
RETURNS json
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE result json;
BEGIN
  SELECT json_build_object(
    'id', id,
    'slug', slug,
    'referrer_name', referrer_name,
    'market', market,
    'is_active', is_active,
    'discount_amount_kes', discount_amount_kes,
    'custom_message', custom_message
  ) INTO result
  FROM public.referral_links
  WHERE slug = _slug;
  RETURN result;
END;
$$;

-- Public RPC: log a click
CREATE OR REPLACE FUNCTION public.log_referral_click(_slug text, _ip_hash text DEFAULT NULL, _user_agent text DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE _link_id uuid; _click_id uuid;
BEGIN
  SELECT id INTO _link_id FROM public.referral_links WHERE slug = _slug AND is_active = true;
  IF _link_id IS NULL THEN RETURN NULL; END IF;
  INSERT INTO public.referral_clicks (referral_link_id, ip_hash, user_agent)
  VALUES (_link_id, _ip_hash, _user_agent)
  RETURNING id INTO _click_id;
  RETURN _click_id;
END;
$$;

-- Public RPC: record a conversion (called from booking form when ref cookie present)
CREATE OR REPLACE FUNCTION public.record_referral_conversion(
  _slug text,
  _booking_reference text DEFAULT NULL,
  _client_name text DEFAULT NULL,
  _client_phone text DEFAULT NULL,
  _session_amount_kes int DEFAULT 2600
)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE _link_id uuid; _discount int; _conv_id uuid;
BEGIN
  SELECT id, discount_amount_kes INTO _link_id, _discount
  FROM public.referral_links WHERE slug = _slug AND is_active = true;
  IF _link_id IS NULL THEN RETURN NULL; END IF;

  INSERT INTO public.referral_conversions (
    referral_link_id, booking_reference, client_name, client_phone,
    session_amount_kes, discount_applied
  ) VALUES (
    _link_id, _booking_reference, _client_name, _client_phone,
    _session_amount_kes, COALESCE(_discount, 0)
  ) RETURNING id INTO _conv_id;

  -- Mark most recent click for this link as converted
  UPDATE public.referral_clicks
  SET converted = true
  WHERE id = (
    SELECT id FROM public.referral_clicks
    WHERE referral_link_id = _link_id AND converted = false
    ORDER BY clicked_at DESC LIMIT 1
  );

  RETURN _conv_id;
END;
$$;

-- Admin RPC: aggregated metrics per link
CREATE OR REPLACE FUNCTION public.get_referral_link_stats(_link_id uuid)
RETURNS json
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE result json;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  SELECT json_build_object(
    'clicks', (SELECT count(*) FROM public.referral_clicks WHERE referral_link_id = _link_id),
    'conversions', (SELECT count(*) FROM public.referral_conversions WHERE referral_link_id = _link_id),
    'rewards_pending', (SELECT count(*) FROM public.referral_conversions WHERE referral_link_id = _link_id AND reward_issued = false),
    'total_value_kes', (SELECT COALESCE(SUM(session_amount_kes - discount_applied), 0) FROM public.referral_conversions WHERE referral_link_id = _link_id)
  ) INTO result;
  RETURN result;
END;
$$;
