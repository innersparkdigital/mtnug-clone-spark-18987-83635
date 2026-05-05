CREATE TABLE IF NOT EXISTS public.chat_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE SET NULL,
  anonymous_id TEXT,
  name TEXT,
  phone TEXT,
  email TEXT,
  intent TEXT,
  message TEXT,
  source_path TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  handled_by UUID,
  handled_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a chat lead"
  ON public.chat_leads
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view chat leads"
  ON public.chat_leads
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update chat leads"
  ON public.chat_leads
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete chat leads"
  ON public.chat_leads
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_chat_leads_status ON public.chat_leads(status);
CREATE INDEX IF NOT EXISTS idx_chat_leads_created_at ON public.chat_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_leads_session ON public.chat_leads(session_id);

CREATE TRIGGER update_chat_leads_updated_at
  BEFORE UPDATE ON public.chat_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();