-- Restrict access to sensitive meeting credentials at column level.
-- Public can still read training info, but meeting_link/meeting_password
-- are only readable by admins/content_admins (who use service role or have ALL policy).
REVOKE SELECT (meeting_link, meeting_password) ON public.trainings FROM anon, authenticated;
GRANT SELECT (
  id, title, description, facilitator_name, facilitator_title,
  training_date, end_time, flier_image_url, target_audience,
  session_focus, is_active, created_at, updated_at
) ON public.trainings TO anon, authenticated;