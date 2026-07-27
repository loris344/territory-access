-- Tracks the gap between "applied" and "reached/submitted the deposit
-- payment step" — separate from deposit_paid, which is reserved for an
-- actually-confirmed Stripe charge (currently dormant: the deposit UI shows
-- CardEntryFormPlaceholder, a visual-only form that always ends in a fake
-- decline, while the real Stripe Checkout button is disconnected). Set by
-- notify-application when CardEntryFormPlaceholder submits, and by
-- confirm-deposit once real payments reconnect.
ALTER TABLE public.applications
  ADD COLUMN deposit_attempted_at timestamptz,
  ADD COLUMN deposit_reminder_sent_at timestamptz;

-- Telegram ping the moment someone reaches/submits the deposit step, mirrors
-- tg_notify_application (see 20260622030000_telegram_notifications.sql).
CREATE OR REPLACE FUNCTION public.tg_notify_deposit_attempt()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE exp_name text;
BEGIN
  IF NEW.deposit_attempted_at IS NOT NULL AND OLD.deposit_attempted_at IS NULL THEN
    SELECT name INTO exp_name FROM public.expeditions WHERE id = NEW.expedition_id;
    PERFORM public.notify_telegram(
      '💳 Deposit step completed' || chr(10) ||
      'Name: '       || coalesce(NEW.first_name, '') || ' ' || coalesce(NEW.last_name, '') || chr(10) ||
      'Email: '      || coalesce(NEW.email, '-') || chr(10) ||
      'Expedition: ' || coalesce(exp_name, '-') || chr(10) ||
      'Deposit: $'   || to_char(coalesce(NEW.deposit_amount_usd, 0), 'FM999,999,990')
    );
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'tg_notify_deposit_attempt failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tg_notify_deposit_attempt ON public.applications;
CREATE TRIGGER tg_notify_deposit_attempt AFTER UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.tg_notify_deposit_attempt();

-- Separate ping for a real confirmed charge, for whenever Stripe Checkout
-- reconnects — harmless to ship now, matches deposit_paid's existing plumbing
-- in confirm-deposit.
CREATE OR REPLACE FUNCTION public.tg_notify_deposit_paid()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE exp_name text;
BEGIN
  IF NEW.deposit_paid IS TRUE AND OLD.deposit_paid IS NOT TRUE THEN
    SELECT name INTO exp_name FROM public.expeditions WHERE id = NEW.expedition_id;
    PERFORM public.notify_telegram(
      '✅ Deposit PAID' || chr(10) ||
      'Name: '       || coalesce(NEW.first_name, '') || ' ' || coalesce(NEW.last_name, '') || chr(10) ||
      'Email: '      || coalesce(NEW.email, '-') || chr(10) ||
      'Expedition: ' || coalesce(exp_name, '-') || chr(10) ||
      'Deposit: $'   || to_char(coalesce(NEW.deposit_amount_usd, 0), 'FM999,999,990')
    );
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'tg_notify_deposit_paid failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tg_notify_deposit_paid ON public.applications;
CREATE TRIGGER tg_notify_deposit_paid AFTER UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.tg_notify_deposit_paid();

-- Every 15 minutes, email a one-time nudge (via notify-deposit-reminder,
-- Resend) to anyone who applied to a deposit-gated tour, hasn't reached the
-- deposit step at all, and hasn't already been reminded. The 2-hour grace
-- period avoids nagging someone still mid-flow. Marking deposit_reminder_sent_at
-- in the same UPDATE...RETURNING (before the async net.http_post even fires)
-- guarantees at-most-once delivery even if the cron overlaps itself.
CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE OR REPLACE FUNCTION public.send_deposit_reminders()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE rec record;
BEGIN
  FOR rec IN
    UPDATE public.applications
    SET deposit_reminder_sent_at = now()
    WHERE deposit_required = true
      AND deposit_paid = false
      AND deposit_attempted_at IS NULL
      AND deposit_reminder_sent_at IS NULL
      AND created_at < now() - interval '2 hours'
    RETURNING id
  LOOP
    PERFORM net.http_post(
      url := 'https://hyeqshzcujnupxxeocfy.supabase.co/functions/v1/notify-deposit-reminder'::text,
      body := json_build_object('application_id', rec.id)::jsonb,
      headers := '{"Content-Type": "application/json"}'::jsonb
    );
  END LOOP;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'send_deposit_reminders failed: %', SQLERRM;
END;
$$;

SELECT cron.schedule(
  'send-deposit-reminders',
  '*/15 * * * *',
  $$ SELECT public.send_deposit_reminders(); $$
);
