
ALTER TABLE public.chat_sessions
  ADD COLUMN IF NOT EXISTS review_status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS review_notes TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_chat_sessions_high_risk_review
  ON public.chat_sessions (high_risk_triggered, review_status, created_at DESC)
  WHERE high_risk_triggered = true;

DROP POLICY IF EXISTS "Admins can update review status" ON public.chat_sessions;
CREATE POLICY "Admins can update review status"
  ON public.chat_sessions
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
