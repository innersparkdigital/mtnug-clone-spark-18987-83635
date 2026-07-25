
-- ============================================================
-- BATCH 1 — Blog SEO + Client Tracker + Receipt/Finance sync
-- ============================================================

-- 1) Blog SEO fields
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS meta_keywords TEXT;

-- 2) Extend therapist_clients with clinical/financial tracker fields
ALTER TABLE public.therapist_clients
  ADD COLUMN IF NOT EXISTS client_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Uganda',
  ADD COLUMN IF NOT EXISTS session_type TEXT,
  ADD COLUMN IF NOT EXISTS duration_mins INTEGER,
  ADD COLUMN IF NOT EXISTS session_rating INTEGER CHECK (session_rating BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS next_session_date DATE,
  ADD COLUMN IF NOT EXISTS would_rebook BOOLEAN,
  ADD COLUMN IF NOT EXISTS amount_ugx NUMERIC(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS therapist_share_ugx NUMERIC(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS innerspark_share_ugx NUMERIC(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS paid_status TEXT DEFAULT 'unpaid' CHECK (paid_status IN ('unpaid','paid','partially_paid','refunded')),
  ADD COLUMN IF NOT EXISTS last_session_date DATE,
  ADD COLUMN IF NOT EXISTS receipt_number TEXT,
  ADD COLUMN IF NOT EXISTS receipt_url TEXT;

-- 3) Auto-generate client_code (INS-XXXX) on insert
CREATE SEQUENCE IF NOT EXISTS public.client_code_seq START 1000;

CREATE OR REPLACE FUNCTION public.set_client_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.client_code IS NULL OR NEW.client_code = '' THEN
    NEW.client_code := 'INS' || lpad(nextval('public.client_code_seq')::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_client_code ON public.therapist_clients;
CREATE TRIGGER trg_set_client_code
  BEFORE INSERT ON public.therapist_clients
  FOR EACH ROW EXECUTE FUNCTION public.set_client_code();

-- Backfill existing rows without a client_code
UPDATE public.therapist_clients
  SET client_code = 'INS' || lpad(nextval('public.client_code_seq')::text, 4, '0')
  WHERE client_code IS NULL;

-- 4) Auto-sync paid client entries into income_entries (finance)
CREATE OR REPLACE FUNCTION public.sync_client_payment_to_income()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _service_type TEXT;
BEGIN
  -- Only fire when paid_status flips to 'paid'
  IF (TG_OP = 'UPDATE' AND OLD.paid_status IS DISTINCT FROM NEW.paid_status AND NEW.paid_status = 'paid')
     OR (TG_OP = 'INSERT' AND NEW.paid_status = 'paid') THEN

    _service_type := CASE
      WHEN NEW.session_type ILIKE '%group%' THEN 'support_group'
      WHEN NEW.session_type ILIKE '%chat%' THEN 'chat_consultation'
      WHEN NEW.session_type ILIKE '%video%' OR NEW.session_type ILIKE '%whatsapp%' THEN 'therapy'
      ELSE 'therapy'
    END;

    -- Prevent duplicates: skip if we already recorded an income for this client + amount + date
    IF NOT EXISTS (
      SELECT 1 FROM public.income_entries
      WHERE reference = COALESCE(NEW.receipt_number, NEW.client_code)
        AND amount = NEW.amount_ugx
    ) THEN
      INSERT INTO public.income_entries (
        source, service_type, amount, income_date, client_name, reference,
        payment_method, notes
      ) VALUES (
        'client_session', _service_type, COALESCE(NEW.amount_ugx, 0),
        COALESCE(NEW.last_session_date, CURRENT_DATE),
        NEW.full_name,
        COALESCE(NEW.receipt_number, NEW.client_code),
        'mobile_money',
        'Auto-recorded from client session · therapist_share=' ||
          COALESCE(NEW.therapist_share_ugx,0)::text ||
          ' innerspark_share=' || COALESCE(NEW.innerspark_share_ugx,0)::text
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_client_payment_income ON public.therapist_clients;
CREATE TRIGGER trg_sync_client_payment_income
  AFTER INSERT OR UPDATE OF paid_status ON public.therapist_clients
  FOR EACH ROW EXECUTE FUNCTION public.sync_client_payment_to_income();

-- 5) Admin RPC to update tracker fields (bypasses therapist-only RLS)
CREATE OR REPLACE FUNCTION public.admin_update_client_tracker(
  _client_id UUID,
  _session_type TEXT DEFAULT NULL,
  _duration_mins INTEGER DEFAULT NULL,
  _session_rating INTEGER DEFAULT NULL,
  _next_session_date DATE DEFAULT NULL,
  _would_rebook BOOLEAN DEFAULT NULL,
  _amount_ugx NUMERIC DEFAULT NULL,
  _therapist_share_ugx NUMERIC DEFAULT NULL,
  _innerspark_share_ugx NUMERIC DEFAULT NULL,
  _paid_status TEXT DEFAULT NULL,
  _last_session_date DATE DEFAULT NULL,
  _country TEXT DEFAULT NULL,
  _receipt_number TEXT DEFAULT NULL,
  _receipt_url TEXT DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  UPDATE public.therapist_clients SET
    session_type          = COALESCE(_session_type, session_type),
    duration_mins         = COALESCE(_duration_mins, duration_mins),
    session_rating        = COALESCE(_session_rating, session_rating),
    next_session_date     = COALESCE(_next_session_date, next_session_date),
    would_rebook          = COALESCE(_would_rebook, would_rebook),
    amount_ugx            = COALESCE(_amount_ugx, amount_ugx),
    therapist_share_ugx   = COALESCE(_therapist_share_ugx, therapist_share_ugx),
    innerspark_share_ugx  = COALESCE(_innerspark_share_ugx, innerspark_share_ugx),
    paid_status           = COALESCE(_paid_status, paid_status),
    last_session_date     = COALESCE(_last_session_date, last_session_date),
    country               = COALESCE(_country, country),
    receipt_number        = COALESCE(_receipt_number, receipt_number),
    receipt_url           = COALESCE(_receipt_url, receipt_url)
  WHERE id = _client_id;

  RETURN FOUND;
END;
$$;

-- 6) Admin RPC: revenue breakdown by session_type
CREATE OR REPLACE FUNCTION public.admin_revenue_by_session_type()
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

  SELECT COALESCE(json_agg(row_to_json(x)), '[]'::json) INTO result FROM (
    SELECT
      COALESCE(NULLIF(session_type,''), 'Unspecified') AS session_type,
      count(*) AS sessions,
      COALESCE(SUM(amount_ugx),0) AS total_ugx,
      COALESCE(SUM(therapist_share_ugx),0) AS therapist_ugx,
      COALESCE(SUM(innerspark_share_ugx),0) AS innerspark_ugx,
      COALESCE(SUM(amount_ugx) FILTER (WHERE paid_status='paid'),0) AS collected_ugx
    FROM public.therapist_clients
    WHERE amount_ugx > 0
    GROUP BY 1
    ORDER BY total_ugx DESC
  ) x;

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_update_client_tracker TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_revenue_by_session_type TO authenticated;
