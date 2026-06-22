-- Send a welcome email to every new newsletter subscriber, via the
-- notify-newsletter edge function (Resend). Mirrors the application/waitlist
-- triggers: net.http_post is async so the user's INSERT is never blocked, and
-- the EXCEPTION guard makes sure an email problem can't roll back the signup.
CREATE OR REPLACE FUNCTION public.notify_new_newsletter()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://hyeqshzcujnupxxeocfy.supabase.co/functions/v1/notify-newsletter'::text,
    body := json_build_object('subscriber_id', NEW.id)::jsonb,
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notify_new_newsletter failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_new_newsletter_notify ON public.newsletter_subscribers;
CREATE TRIGGER on_new_newsletter_notify
  AFTER INSERT ON public.newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_newsletter();
