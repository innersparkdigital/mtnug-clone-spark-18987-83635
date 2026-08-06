CREATE TABLE public.therapist_question_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id uuid NOT NULL REFERENCES public.therapist_accounts(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  intro text,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  scoring_enabled boolean NOT NULL DEFAULT false,
  max_score integer,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.therapist_question_sets TO authenticated;
GRANT ALL ON public.therapist_question_sets TO service_role;

ALTER TABLE public.therapist_question_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapists manage own question sets"
  ON public.therapist_question_sets FOR ALL
  TO authenticated
  USING (therapist_id IN (SELECT ta.id FROM public.therapist_accounts ta WHERE ta.user_id = auth.uid()))
  WITH CHECK (therapist_id IN (SELECT ta.id FROM public.therapist_accounts ta WHERE ta.user_id = auth.uid()));

CREATE POLICY "Admins manage question sets"
  ON public.therapist_question_sets FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_therapist_question_sets_therapist ON public.therapist_question_sets(therapist_id);

CREATE TRIGGER trg_therapist_question_sets_updated
  BEFORE UPDATE ON public.therapist_question_sets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.therapist_question_set_stats()
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH me AS (
    SELECT id FROM public.therapist_accounts WHERE user_id = auth.uid()
  ),
  sets AS (
    SELECT qs.* FROM public.therapist_question_sets qs
    WHERE qs.therapist_id IN (SELECT id FROM me)
  ),
  usage AS (
    SELECT
      (at.config->>'question_set_id')::uuid AS set_id,
      count(DISTINCT at.id) AS times_assigned,
      count(ts.id) AS responses,
      round(avg(ts.screening_score)::numeric, 1) AS avg_score,
      max(ts.submitted_at) AS last_response_at
    FROM public.assignment_tools at
    JOIN public.client_assignments ca ON ca.id = at.assignment_id
    LEFT JOIN public.tool_submissions ts
      ON ts.assignment_tool_id = at.id AND ts.submission_type = 'final'
    WHERE ca.therapist_id IN (SELECT id FROM me)
      AND at.config->>'question_set_id' IS NOT NULL
    GROUP BY 1
  )
  SELECT COALESCE(json_agg(row_to_json(x) ORDER BY x.created_at DESC), '[]'::json)
  FROM (
    SELECT s.id, s.title, s.description, s.intro, s.questions,
           s.scoring_enabled, s.max_score, s.is_active, s.created_at, s.updated_at,
           COALESCE(u.times_assigned, 0) AS times_assigned,
           COALESCE(u.responses, 0) AS responses,
           u.avg_score,
           u.last_response_at
    FROM sets s
    LEFT JOIN usage u ON u.set_id = s.id
  ) x;
$$;

REVOKE ALL ON FUNCTION public.therapist_question_set_stats() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.therapist_question_set_stats() TO authenticated;