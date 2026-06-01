UPDATE public.corporate_screenings
SET total_score = COALESCE(who5_score, 0)
                + COALESCE((workplace_responses->>'workload')::int, 0)
                + COALESCE((workplace_responses->>'support')::int, 0)
                + (5 - COALESCE((workplace_responses->>'overwhelm')::int, 0))
WHERE workplace_responses ? 'overwhelm'
  AND (workplace_responses->>'overwhelm') ~ '^[0-9]+$'
  AND ((workplace_responses->>'overwhelm')::int BETWEEN 0 AND 5);