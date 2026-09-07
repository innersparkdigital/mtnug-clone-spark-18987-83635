CREATE OR REPLACE FUNCTION public.match_specialist_by_name(_name text)
RETURNS uuid
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tokens text[];
  v_id uuid;
  v_count int;
BEGIN
  IF _name IS NULL OR trim(_name) = '' THEN RETURN NULL; END IF;
  v_tokens := array_remove(regexp_split_to_array(lower(regexp_replace(_name, '[^a-zA-Z]+', ' ', 'g')), '\s+'), '');
  IF array_length(v_tokens, 1) IS NULL THEN RETURN NULL; END IF;

  -- exact token-set match (order independent)
  SELECT s.id INTO v_id
  FROM public.specialists s
  WHERE (
    SELECT array_agg(t ORDER BY t) FROM unnest(array_remove(regexp_split_to_array(lower(regexp_replace(s.name, '[^a-zA-Z]+', ' ', 'g')), '\s+'), '')) t
  ) = (SELECT array_agg(t ORDER BY t) FROM unnest(v_tokens) t)
  ORDER BY s.is_active DESC
  LIMIT 1;
  IF v_id IS NOT NULL THEN RETURN v_id; END IF;

  -- subset match: every token of the given name appears in the specialist name
  SELECT count(*), min(s.id) INTO v_count, v_id
  FROM public.specialists s
  WHERE v_tokens <@ array_remove(regexp_split_to_array(lower(regexp_replace(s.name, '[^a-zA-Z]+', ' ', 'g')), '\s+'), '');
  IF v_count = 1 THEN RETURN v_id; END IF;

  -- restrict ambiguous matches to active specialists
  SELECT count(*), min(s.id) INTO v_count, v_id
  FROM public.specialists s
  WHERE s.is_active
    AND v_tokens <@ array_remove(regexp_split_to_array(lower(regexp_replace(s.name, '[^a-zA-Z]+', ' ', 'g')), '\s+'), '');
  IF v_count = 1 THEN RETURN v_id; END IF;

  RETURN NULL;
END;
$$;

REVOKE ALL ON FUNCTION public.match_specialist_by_name(text) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.propagate_session_feedback()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_specialist_id uuid;
  v_client_id uuid;
  v_rebook boolean;
BEGIN
  v_specialist_id := public.match_specialist_by_name(coalesce(NEW.therapist_slug, NEW.therapist_name));
  IF v_specialist_id IS NULL THEN
    v_specialist_id := public.match_specialist_by_name(NEW.therapist_name);
  END IF;

  v_rebook := CASE WHEN NEW.would_rebook ILIKE 'Yes%' THEN true
                   WHEN NEW.would_rebook IS NULL THEN NULL
                   ELSE false END;

  IF v_specialist_id IS NOT NULL THEN
    INSERT INTO public.specialist_reviews (specialist_id, reviewer_name, rating, comment, is_verified, source_feedback_id)
    VALUES (
      v_specialist_id,
      coalesce(nullif(trim(NEW.client_display_name), ''), 'Verified client'),
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