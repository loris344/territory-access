
CREATE OR REPLACE FUNCTION public.notify_new_waitlist()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $function$
BEGIN
  PERFORM net.http_post(
    url := 'https://udqjkewpugdmjyrzqmbk.supabase.co/functions/v1/notify-waitlist'::text,
    body := json_build_object('waitlist_id', NEW.id)::jsonb,
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notify_new_waitlist failed: %', SQLERRM;
  RETURN NEW;
END;
$function$;

CREATE TRIGGER on_new_waitlist_notify
  AFTER INSERT ON public.waitlist
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_waitlist();
