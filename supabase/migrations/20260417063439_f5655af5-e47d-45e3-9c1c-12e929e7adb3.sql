CREATE TABLE public.account_deletion_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  reason TEXT,
  comments TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a deletion request"
ON public.account_deletion_requests
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view deletion requests"
ON public.account_deletion_requests
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update deletion requests"
ON public.account_deletion_requests
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));