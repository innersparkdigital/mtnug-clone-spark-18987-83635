
CREATE TABLE public.session_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_code TEXT NOT NULL UNIQUE,
  therapist_name TEXT NOT NULL,
  therapist_slug TEXT,
  client_name TEXT,
  star_rating INTEGER NOT NULL CHECK (star_rating BETWEEN 1 AND 5),
  therapist_fit TEXT NOT NULL,
  session_addressed TEXT NOT NULL,
  would_rebook TEXT NOT NULL,
  would_recommend TEXT NOT NULL,
  open_comment TEXT,
  flagged_for_review BOOLEAN NOT NULL DEFAULT false,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_session_feedback_therapist_name ON public.session_feedback (lower(therapist_name));
CREATE INDEX idx_session_feedback_submitted_at ON public.session_feedback (submitted_at DESC);

ALTER TABLE public.session_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit session feedback"
  ON public.session_feedback FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view session feedback"
  ON public.session_feedback FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update session feedback"
  ON public.session_feedback FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete session feedback"
  ON public.session_feedback FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.set_session_feedback_flag()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.star_rating <= 2 OR NEW.therapist_fit = 'Not the right fit for me' THEN
    NEW.flagged_for_review := true;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_set_session_feedback_flag
  BEFORE INSERT ON public.session_feedback
  FOR EACH ROW EXECUTE FUNCTION public.set_session_feedback_flag();

-- Allow admin to merge typed-name variants
CREATE OR REPLACE FUNCTION public.merge_feedback_therapist_names(_from TEXT, _to TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cnt INTEGER;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;
  UPDATE public.session_feedback SET therapist_name = _to WHERE therapist_name = _from;
  GET DIAGNOSTICS cnt = ROW_COUNT;
  RETURN cnt;
END;
$$;
