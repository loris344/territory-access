-- "Notify me about this cancelled destination" capture.
-- Visitors on a cancelled expedition page can leave their email to be alerted
-- if it returns. Stored in newsletter_subscribers with the destination name.

-- 1. Extra column: which (cancelled) destination the person is interested in.
ALTER TABLE public.newsletter_subscribers
  ADD COLUMN IF NOT EXISTS interested_destination TEXT;

-- 2. RPC that does the whole flow in one shot, as SECURITY DEFINER so it can
--    upsert past RLS and notify reliably. A plain client INSERT would fail
--    silently on a duplicate email (23505) -> no row change, no Telegram, the
--    team would never hear about the interest. Upsert + explicit notify fixes
--    that, and works whether the email is new or already subscribed.
CREATE OR REPLACE FUNCTION public.register_destination_interest(p_email text, p_destination text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text := lower(trim(p_email));
  v_id    uuid;
BEGIN
  IF v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' THEN
    RAISE EXCEPTION 'invalid email';
  END IF;

  INSERT INTO public.newsletter_subscribers (email, source, interested_destination)
  VALUES (v_email, 'cancelled-expedition', p_destination)
  ON CONFLICT (email) DO UPDATE
    SET interested_destination = EXCLUDED.interested_destination
  RETURNING id INTO v_id;

  -- Notifications must never roll back the saved interest.
  BEGIN
    -- Tell the team which cancelled destination this person wants.
    PERFORM public.notify_telegram(
      '🔔 Cancelled-destination interest' || chr(10) ||
      'Email: '       || v_email || chr(10) ||
      'Destination: ' || coalesce(p_destination, '-')
    );
    -- Destination-tailored confirmation email (Resend via edge function).
    PERFORM net.http_post(
      url := 'https://hyeqshzcujnupxxeocfy.supabase.co/functions/v1/notify-newsletter'::text,
      body := json_build_object('subscriber_id', v_id, 'destination', p_destination)::jsonb,
      headers := '{"Content-Type": "application/json"}'::jsonb
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'register_destination_interest notify failed: %', SQLERRM;
  END;
END;
$$;

GRANT EXECUTE ON FUNCTION public.register_destination_interest(text, text) TO anon, authenticated;

-- 3. The generic newsletter triggers must NOT also fire for these rows, or the
--    team gets a duplicate Telegram and the person gets the generic welcome
--    instead of the destination-tailored one. Skip when a destination is set.
CREATE OR REPLACE FUNCTION public.tg_notify_newsletter()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF NEW.interested_destination IS NOT NULL THEN
    RETURN NEW;  -- handled by register_destination_interest
  END IF;
  PERFORM public.notify_telegram(
    '📩 New newsletter subscriber' || chr(10) ||
    'Email: '  || coalesce(NEW.email, '-') || chr(10) ||
    'Source: ' || coalesce(NEW.source, '-')
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'tg_notify_newsletter failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_new_newsletter()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.interested_destination IS NOT NULL THEN
    RETURN NEW;  -- handled by register_destination_interest
  END IF;
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
