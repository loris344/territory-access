-- Email notification on every new tour info request (mirrors applications /
-- waitlist): an AFTER INSERT trigger fires the notify-tour-info-request edge
-- function via pg_net, which emails contact@lignerougetours.com through Resend.
-- This is the reliable channel (the Telegram trigger needs Vault secrets).

CREATE OR REPLACE FUNCTION public.notify_new_tour_info_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://hyeqshzcujnupxxeocfy.supabase.co/functions/v1/notify-tour-info-request'::text,
    body := json_build_object('info_request_id', NEW.id)::jsonb,
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notify_new_tour_info_request failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notify_new_tour_info_request ON public.tour_info_requests;
CREATE TRIGGER notify_new_tour_info_request AFTER INSERT ON public.tour_info_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_tour_info_request();
