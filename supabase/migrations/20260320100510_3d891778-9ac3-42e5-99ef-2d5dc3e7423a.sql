
-- Table for storing callback requests from low-wellbeing users
CREATE TABLE public.callback_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone_number text NOT NULL,
  wellbeing_score integer NOT NULL,
  wellbeing_percentage integer NOT NULL,
  session_id text,
  source text DEFAULT 'website',
  device_type text DEFAULT 'desktop',
  status text DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.callback_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert callback requests"
ON public.callback_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view callback requests"
ON public.callback_requests FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update callback requests"
ON public.callback_requests FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
