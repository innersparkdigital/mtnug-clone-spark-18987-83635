
-- 1. Tax codes table
CREATE TABLE IF NOT EXISTS public.tax_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  type TEXT NOT NULL DEFAULT 'sales', -- 'sales', 'withholding', 'exempt'
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tax_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage tax codes" ON public.tax_codes
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'finance_admin'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'finance_admin'));

CREATE POLICY "Authenticated can view tax codes" ON public.tax_codes
  FOR SELECT TO authenticated USING (true);

CREATE TRIGGER update_tax_codes_updated_at
  BEFORE UPDATE ON public.tax_codes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default Uganda tax codes
INSERT INTO public.tax_codes (name, code, rate, type, description) VALUES
  ('VAT 18%', 'VAT18', 18.00, 'sales', 'Uganda standard VAT'),
  ('Withholding Tax 6%', 'WHT6', 6.00, 'withholding', 'Standard withholding tax for services'),
  ('Exempt', 'EXEMPT', 0.00, 'exempt', 'Tax exempt transactions')
ON CONFLICT (code) DO NOTHING;

-- 2. Add offsetting + tax columns to income_entries
ALTER TABLE public.income_entries
  ADD COLUMN IF NOT EXISTS linked_expense_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS net_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tax_code_id UUID REFERENCES public.tax_codes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_taxable BOOLEAN NOT NULL DEFAULT true;

-- Initialize net_amount to amount for existing rows
UPDATE public.income_entries SET net_amount = amount WHERE net_amount = 0;

-- 3. Add linking + tax columns to expenses
ALTER TABLE public.expenses
  ADD COLUMN IF NOT EXISTS linked_income_id UUID REFERENCES public.income_entries(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS tax_code_id UUID REFERENCES public.tax_codes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_tax_deductible BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_expenses_linked_income ON public.expenses(linked_income_id);

-- 4. Trigger: recalc income_entries.linked_expense_total + net_amount
CREATE OR REPLACE FUNCTION public.recalc_income_net()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _income_id UUID;
  _total_linked NUMERIC(12,2);
BEGIN
  -- Handle both new and old (for updates that change linked_income_id, and deletes)
  FOR _income_id IN
    SELECT DISTINCT id FROM (
      SELECT NEW.linked_income_id AS id WHERE TG_OP IN ('INSERT','UPDATE') AND NEW.linked_income_id IS NOT NULL
      UNION
      SELECT OLD.linked_income_id AS id WHERE TG_OP IN ('UPDATE','DELETE') AND OLD.linked_income_id IS NOT NULL
    ) sub WHERE id IS NOT NULL
  LOOP
    SELECT COALESCE(SUM(amount), 0) INTO _total_linked
    FROM public.expenses WHERE linked_income_id = _income_id;

    UPDATE public.income_entries
      SET linked_expense_total = _total_linked,
          net_amount = amount - _total_linked
      WHERE id = _income_id;
  END LOOP;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_expenses_recalc_net ON public.expenses;
CREATE TRIGGER trg_expenses_recalc_net
  AFTER INSERT OR UPDATE OR DELETE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.recalc_income_net();

-- 5. Trigger: keep net_amount in sync when income.amount changes
CREATE OR REPLACE FUNCTION public.recalc_income_net_on_amount()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.net_amount := NEW.amount - COALESCE(NEW.linked_expense_total, 0);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_income_recalc_net ON public.income_entries;
CREATE TRIGGER trg_income_recalc_net
  BEFORE INSERT OR UPDATE OF amount, linked_expense_total ON public.income_entries
  FOR EACH ROW EXECUTE FUNCTION public.recalc_income_net_on_amount();

-- 6. Financial snapshots (optional saved Balance Sheets)
CREATE TABLE IF NOT EXISTS public.financial_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  label TEXT NOT NULL,
  total_assets NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_liabilities NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_equity NUMERIC(14,2) NOT NULL DEFAULT 0,
  cash_balance NUMERIC(14,2) NOT NULL DEFAULT 0,
  receivables NUMERIC(14,2) NOT NULL DEFAULT 0,
  retained_earnings NUMERIC(14,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.financial_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage snapshots" ON public.financial_snapshots
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'finance_admin'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'finance_admin'));

-- 7. Update default invoice payment instructions to new numbers
ALTER TABLE public.invoices
  ALTER COLUMN payment_instructions SET DEFAULT 'Mobile Money (MTN): 0740 616 404 | Bank Transfer: 9030016556032';

-- Update existing invoices that still have the old default
UPDATE public.invoices
  SET payment_instructions = 'Mobile Money (MTN): 0740 616 404 | Bank Transfer: 9030016556032'
  WHERE payment_instructions = 'Payment via Mobile Money: +256 792 085 773 (MTN) or Bank Transfer'
     OR payment_instructions IS NULL;

-- 8. Realtime for new tables
ALTER TABLE public.tax_codes REPLICA IDENTITY FULL;
ALTER TABLE public.financial_snapshots REPLICA IDENTITY FULL;

DO $$
BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.tax_codes; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.financial_snapshots; EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;
