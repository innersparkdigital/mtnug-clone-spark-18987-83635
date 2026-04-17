-- Income entries table for tracking revenue from various services
CREATE TABLE IF NOT EXISTS public.income_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL DEFAULT 'manual', -- 'manual', 'invoice_payment', 'pesapal'
  service_type TEXT NOT NULL DEFAULT 'therapy', -- therapy, support_group, chat_consultation, corporate, app_service, training, other
  custom_service TEXT, -- when service_type is 'other'
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  income_date DATE NOT NULL DEFAULT CURRENT_DATE,
  client_name TEXT,
  reference TEXT, -- invoice number, receipt no, transaction id
  payment_method TEXT DEFAULT 'cash', -- cash, mobile_money, bank, card
  notes TEXT,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  recorded_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_income_entries_date ON public.income_entries(income_date DESC);
CREATE INDEX IF NOT EXISTS idx_income_entries_service ON public.income_entries(service_type);

ALTER TABLE public.income_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage income"
ON public.income_entries
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'finance_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'finance_admin'::app_role));

CREATE TRIGGER update_income_entries_updated_at
BEFORE UPDATE ON public.income_entries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add custom_category to expenses
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS custom_category TEXT;

-- Auto-create income entry when payment is recorded against an invoice
CREATE OR REPLACE FUNCTION public.create_income_from_payment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _client_name TEXT;
  _invoice_number TEXT;
  _service_type TEXT;
BEGIN
  SELECT c.company_name, i.invoice_number,
         COALESCE((SELECT service_type FROM public.invoice_items WHERE invoice_id = NEW.invoice_id LIMIT 1), 'therapy')
    INTO _client_name, _invoice_number, _service_type
  FROM public.invoices i
  LEFT JOIN public.admin_clients c ON c.id = i.client_id
  WHERE i.id = NEW.invoice_id;

  -- Map invoice service_type to income service_type
  _service_type := CASE
    WHEN _service_type ILIKE '%therapy%' OR _service_type ILIKE '%counsel%' THEN 'therapy'
    WHEN _service_type ILIKE '%group%' THEN 'support_group'
    WHEN _service_type ILIKE '%chat%' THEN 'chat_consultation'
    WHEN _service_type ILIKE '%corporate%' OR _service_type ILIKE '%company%' THEN 'corporate'
    WHEN _service_type ILIKE '%training%' THEN 'training'
    WHEN _service_type ILIKE '%app%' THEN 'app_service'
    ELSE 'therapy'
  END;

  INSERT INTO public.income_entries (
    source, service_type, amount, income_date, client_name, reference,
    payment_method, invoice_id, payment_id, recorded_by, notes
  ) VALUES (
    'invoice_payment', _service_type, NEW.amount, NEW.payment_date, _client_name, _invoice_number,
    NEW.payment_method, NEW.invoice_id, NEW.id, NEW.recorded_by,
    'Auto-recorded from invoice ' || COALESCE(_invoice_number, '')
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS create_income_after_payment ON public.payments;
CREATE TRIGGER create_income_after_payment
AFTER INSERT ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.create_income_from_payment();