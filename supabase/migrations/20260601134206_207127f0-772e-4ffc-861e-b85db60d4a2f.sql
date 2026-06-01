UPDATE public.corporate_screenings
SET total_score = who5_score
  + COALESCE((workplace_responses->>'workload')::int, 0)
  + COALESCE((workplace_responses->>'support')::int, 0)
  + (6 - COALESCE((workplace_responses->>'overwhelm')::int, 3))
WHERE workplace_responses ? 'overwhelm'
  AND COALESCE((workplace_responses->>'overwhelm')::int, 0) BETWEEN 1 AND 5;