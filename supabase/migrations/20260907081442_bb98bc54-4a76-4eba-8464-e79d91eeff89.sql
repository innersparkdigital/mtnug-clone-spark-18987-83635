CREATE SCHEMA IF NOT EXISTS extensions;
ALTER EXTENSION pg_trgm SET SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.match_specialist_by_name(_name text)
RETURNS uuid
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_tokens text[];
  v_sorted text;
  v_id uuid;
  v_count int;
BEGIN
  IF _name IS NULL OR trim(_name) = '' THEN RETURN NULL; END IF;
  v_tokens := array_remove(regexp_split_to_array(lower(regexp_replace(_name, '[^a-zA-Z]+', ' ', 'g')), '\s+'), '');
  IF array_length(v_tokens, 1) IS NULL THEN RETURN NULL; END IF;
  SELECT string_agg(t, ' ' ORDER BY t) INTO v_sorted FROM unnest(v_tokens) t;

  SELECT s.id INTO v_id
  FROM public.specialists s
  WHERE (
    SELECT string_agg(t, ' ' ORDER BY t) FROM unnest(array_remove(regexp_split_to_array(lower(regexp_replace(s.name, '[^a-zA-Z]+', ' ', 'g')), '\s+'), '')) t
  ) = v_sorted
  ORDER BY s.is_active DESC
  LIMIT 1;
  IF v_id IS NOT NULL THEN RETURN v_id; END IF;

  SELECT count(*), min(s.id::text)::uuid INTO v_count, v_id
  FROM public.specialists s
  WHERE v_tokens <@ array_remove(regexp_split_to_array(lower(regexp_replace(s.name, '[^a-zA-Z]+', ' ', 'g')), '\s+'), '');
  IF v_count = 1 THEN RETURN v_id; END IF;

  SELECT count(*), min(s.id::text)::uuid INTO v_count, v_id
  FROM public.specialists s
  WHERE s.is_active
    AND v_tokens <@ array_remove(regexp_split_to_array(lower(regexp_replace(s.name, '[^a-zA-Z]+', ' ', 'g')), '\s+'), '');
  IF v_count = 1 THEN RETURN v_id; END IF;

  SELECT count(*), min(x.id::text)::uuid INTO v_count, v_id
  FROM (
    SELECT s.id,
           extensions.similarity(
             (SELECT string_agg(t, ' ' ORDER BY t) FROM unnest(array_remove(regexp_split_to_array(lower(regexp_replace(s.name, '[^a-zA-Z]+', ' ', 'g')), '\s+'), '')) t),
             v_sorted
           ) AS sim
    FROM public.specialists s
  ) x
  WHERE x.sim >= 0.6;
  IF v_count = 1 THEN RETURN v_id; END IF;

  RETURN NULL;
END;
$$;

REVOKE ALL ON FUNCTION public.match_specialist_by_name(text) FROM PUBLIC, anon, authenticated;