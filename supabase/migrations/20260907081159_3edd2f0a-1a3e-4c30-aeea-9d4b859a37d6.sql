ALTER TABLE public.specialist_reviews ADD COLUMN IF NOT EXISTS source_feedback_id uuid;
CREATE UNIQUE INDEX IF NOT EXISTS specialist_reviews_source_feedback_key ON public.specialist_reviews(source_feedback_id) WHERE source_feedback_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.propagate_session_feedback()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_slug text;
  v_specialist_id uuid;
  v_client_id uuid;
  v_rebook boolean;
  v_display_name text;
BEGIN
  v_slug := regexp_replace(lower(coalesce(NEW.therapist_slug, NEW.therapist_name, '')), '[^a-z0-9]+', '-', 'g');
  v_slug := trim(both '-' from v_slug);

  IF v_slug <> '' THEN
    SELECT s.id INTO v_specialist_id
    FROM public.specialists s
    WHERE trim(both '-' from regexp_replace(lower(s.name), '[^a-z0-9]+', '-', 'g')) = v_slug
    ORDER BY s.is_active DESC
    LIMIT 1;
  END IF;

  v_rebook := CASE WHEN NEW.would_rebook ILIKE 'Yes%' THEN true
                   WHEN NEW.would_rebook IS NULL THEN NULL
                   ELSE false END;

  IF v_specialist_id IS NOT NULL THEN
    v_display_name := coalesce(nullif(trim(NEW.client_display_name), ''), 'Verified client');
    INSERT INTO public.specialist_reviews (specialist_id, reviewer_name, rating, comment, is_verified, source_feedback_id)
    VALUES (
      v_specialist_id,
      v_display_name,
      NEW.star_rating,
      CASE WHEN NEW.client_consented_to_display THEN nullif(trim(NEW.open_comment), '') ELSE NULL END,
      true,
      NEW.id
    )
    ON CONFLICT (source_feedback_id) DO NOTHING;
  END IF;

  IF nullif(trim(coalesce(NEW.client_name, '')), '') IS NOT NULL THEN
    SELECT tc.id INTO v_client_id
    FROM public.therapist_clients tc
    WHERE lower(trim(tc.full_name)) = lower(trim(NEW.client_name))
    ORDER BY coalesce(tc.last_session_date, tc.created_at::date) DESC
    LIMIT 1;

    IF v_client_id IS NOT NULL THEN
      UPDATE public.therapist_clients
      SET session_rating = NEW.star_rating,
          would_rebook = coalesce(v_rebook, would_rebook),
          updated_at = now()
      WHERE id = v_client_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_propagate_session_feedback ON public.session_feedback;
CREATE TRIGGER trg_propagate_session_feedback
AFTER INSERT ON public.session_feedback
FOR EACH ROW EXECUTE FUNCTION public.propagate_session_feedback();