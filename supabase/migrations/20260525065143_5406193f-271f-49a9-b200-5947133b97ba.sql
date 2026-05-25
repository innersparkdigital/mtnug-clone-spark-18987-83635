CREATE OR REPLACE FUNCTION public.normalize_referral_link_type()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.link_type := CASE
    WHEN NEW.link_type IN ('client', 'corporate', 'therapist') THEN NEW.link_type
    WHEN NEW.link_type IN ('individual', 'influencer', 'partner') THEN 'client'
    WHEN NEW.link_type IS NULL OR trim(NEW.link_type) = '' THEN 'client'
    ELSE 'client'
  END;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS normalize_referral_link_type_before_write ON public.referral_links;

CREATE TRIGGER normalize_referral_link_type_before_write
BEFORE INSERT OR UPDATE ON public.referral_links
FOR EACH ROW
EXECUTE FUNCTION public.normalize_referral_link_type();