
-- 1. Fix corporate_employees SELECT: only allow viewing by matching secure_token
DROP POLICY IF EXISTS "Anyone can view employees by token" ON public.corporate_employees;
CREATE POLICY "Employees can view own record by token" 
  ON public.corporate_employees 
  FOR SELECT 
  TO anon, authenticated
  USING (
    secure_token = coalesce(
      current_setting('request.headers', true)::json->>'x-employee-token',
      ''
    )
  );

-- 2. Fix corporate_employees UPDATE: only allow updating screening_completed on own record
DROP POLICY IF EXISTS "Anyone can update employee screening status" ON public.corporate_employees;
CREATE POLICY "Employees can update own screening status"
  ON public.corporate_employees
  FOR UPDATE
  TO anon, authenticated
  USING (
    secure_token = coalesce(
      current_setting('request.headers', true)::json->>'x-employee-token',
      ''
    )
  )
  WITH CHECK (
    secure_token = coalesce(
      current_setting('request.headers', true)::json->>'x-employee-token',
      ''
    )
  );

-- 3. Fix career_applications SELECT: restrict to admin only
DROP POLICY IF EXISTS "Admins can view career applications" ON public.career_applications;
CREATE POLICY "Admins can view career applications"
  ON public.career_applications
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 4. Fix resume storage SELECT: restrict to admin only
DROP POLICY IF EXISTS "Users can view resumes" ON storage.objects;
CREATE POLICY "Admins can view resumes"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'resumes' 
    AND public.has_role(auth.uid(), 'admin'::app_role)
  );

-- 5. Fix function search paths
CREATE OR REPLACE FUNCTION public.read_email_batch(queue_name text, batch_size integer, vt integer)
 RETURNS TABLE(msg_id bigint, read_ct integer, message jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY SELECT r.msg_id, r.read_ct, r.message FROM pgmq.read(queue_name, vt, batch_size) r;
EXCEPTION WHEN undefined_table THEN
  PERFORM pgmq.create(queue_name);
  RETURN;
END;
$function$;

CREATE OR REPLACE FUNCTION public.move_to_dlq(source_queue text, dlq_name text, message_id bigint, payload jsonb)
 RETURNS bigint
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE new_id BIGINT;
BEGIN
  SELECT pgmq.send(dlq_name, payload) INTO new_id;
  PERFORM pgmq.delete(source_queue, message_id);
  RETURN new_id;
EXCEPTION WHEN undefined_table THEN
  BEGIN
    PERFORM pgmq.create(dlq_name);
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  SELECT pgmq.send(dlq_name, payload) INTO new_id;
  BEGIN
    PERFORM pgmq.delete(source_queue, message_id);
  EXCEPTION WHEN undefined_table THEN
    NULL;
  END;
  RETURN new_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.enqueue_email(queue_name text, payload jsonb)
 RETURNS bigint
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN pgmq.send(queue_name, payload);
EXCEPTION WHEN undefined_table THEN
  PERFORM pgmq.create(queue_name);
  RETURN pgmq.send(queue_name, payload);
END;
$function$;

CREATE OR REPLACE FUNCTION public.delete_email(queue_name text, message_id bigint)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN pgmq.delete(queue_name, message_id);
EXCEPTION WHEN undefined_table THEN
  RETURN FALSE;
END;
$function$;
