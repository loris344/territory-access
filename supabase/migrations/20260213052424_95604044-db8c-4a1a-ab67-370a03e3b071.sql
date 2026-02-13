
-- Fix: Make admin read/update policies PERMISSIVE (they were restrictive, blocking all access)
DROP POLICY IF EXISTS "Admins can read applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.applications;

CREATE POLICY "Admins can read applications"
ON public.applications
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update applications"
ON public.applications
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Enable pg_net extension for HTTP calls from triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Create trigger function to notify on new application
CREATE OR REPLACE FUNCTION public.notify_new_application()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  supabase_url text;
  service_key text;
BEGIN
  SELECT decrypted_secret INTO supabase_url FROM vault.decrypted_secrets WHERE name = 'SUPABASE_URL' LIMIT 1;
  SELECT decrypted_secret INTO service_key FROM vault.decrypted_secrets WHERE name = 'SUPABASE_SERVICE_ROLE_KEY' LIMIT 1;
  
  PERFORM extensions.http_post(
    url := supabase_url || '/functions/v1/notify-application',
    body := json_build_object('application_id', NEW.id)::jsonb,
    headers := json_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_key
    )::jsonb
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_new_application_notify ON public.applications;
CREATE TRIGGER on_new_application_notify
AFTER INSERT ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_application();
