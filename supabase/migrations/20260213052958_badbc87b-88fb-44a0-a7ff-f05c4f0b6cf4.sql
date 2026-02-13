
-- Fix admin panel: drop the restrictive "No public reads" policy that blocks even admins
DROP POLICY IF EXISTS "No public reads on applications" ON public.applications;
DROP POLICY IF EXISTS "No public updates on applications" ON public.applications;

-- Fix email trigger: use hardcoded URL since vault is empty
CREATE OR REPLACE FUNCTION public.notify_new_application()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://udqjkewpugdmjyrzqmbk.supabase.co/functions/v1/notify-application'::text,
    body := json_build_object('application_id', NEW.id)::jsonb,
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notify_new_application failed: %', SQLERRM;
  RETURN NEW;
END;
$$;
