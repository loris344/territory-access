-- Telegram notifications on every new newsletter / waitlist / application row.
--
-- Design notes (why earlier attempts failed):
--  * net.http_post (pg_net) is ASYNC: it queues the request and returns at once,
--    so the user's INSERT is never blocked or failed by the HTTP call.
--  * Each trigger has an EXCEPTION guard, so a notification problem can never
--    roll back the insert.
--  * The bot token + chat id are read from Supabase Vault, never hard-coded, so
--    no secret is committed to the (public) repo.
--
-- One-time secret setup — run SEPARATELY in the SQL editor, do NOT commit:
--   select vault.create_secret('<BOT_TOKEN>', 'telegram_bot_token');
--   select vault.create_secret('<CHAT_ID>',  'telegram_chat_id');

CREATE OR REPLACE FUNCTION public.notify_telegram(message text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  tok  text;
  chat text;
BEGIN
  SELECT decrypted_secret INTO tok  FROM vault.decrypted_secrets WHERE name = 'telegram_bot_token' LIMIT 1;
  SELECT decrypted_secret INTO chat FROM vault.decrypted_secrets WHERE name = 'telegram_chat_id'   LIMIT 1;
  IF tok IS NULL OR chat IS NULL THEN
    RAISE WARNING 'notify_telegram: telegram secrets not set in vault';
    RETURN;
  END IF;
  PERFORM net.http_post(
    url     := 'https://api.telegram.org/bot' || tok || '/sendMessage',
    body    := jsonb_build_object('chat_id', chat, 'text', message, 'disable_web_page_preview', true),
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notify_telegram failed: %', SQLERRM;
END;
$$;

CREATE OR REPLACE FUNCTION public.tg_notify_newsletter()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
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

CREATE OR REPLACE FUNCTION public.tg_notify_waitlist()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE exp_name text; price numeric; people int; total numeric;
BEGIN
  SELECT name, price_usd INTO exp_name, price FROM public.expeditions WHERE id = NEW.expedition_id;
  people := coalesce(NEW.number_of_people, 1);
  total  := coalesce(price, 0) * people;
  PERFORM public.notify_telegram(
    '🕓 New waitlist entry' || chr(10) ||
    'Name: '          || coalesce(NEW.first_name, '') || ' ' || coalesce(NEW.last_name, '') || chr(10) ||
    'Email: '         || coalesce(NEW.email, '-') || chr(10) ||
    'Expedition: '    || coalesce(exp_name, '-') || chr(10) ||
    'People: '        || people || chr(10) ||
    'Price/person: $' || to_char(coalesce(price, 0), 'FM999,999,990') || chr(10) ||
    'Total: $'        || to_char(total, 'FM999,999,990') || chr(10) ||
    'Nationality: '   || coalesce(NEW.nationality, '-')
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'tg_notify_waitlist failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.tg_notify_application()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE exp_name text; price numeric; people int; total numeric;
BEGIN
  SELECT name, price_usd INTO exp_name, price FROM public.expeditions WHERE id = NEW.expedition_id;
  -- Apply.tsx stores the participant count as a "[N participant(s)]" prefix.
  people := coalesce(nullif(substring(coalesce(NEW.physical_condition, '') from '^\[(\d+)'), '')::int, 1);
  total  := coalesce(price, 0) * people;
  PERFORM public.notify_telegram(
    '🚩 New application' || chr(10) ||
    'Name: '          || coalesce(NEW.first_name, '') || ' ' || coalesce(NEW.last_name, '') || chr(10) ||
    'Email: '         || coalesce(NEW.email, '-') || chr(10) ||
    'Phone: '         || coalesce(NEW.phone, '-') || chr(10) ||
    'Expedition: '    || coalesce(exp_name, '-') || chr(10) ||
    'People: '        || people || chr(10) ||
    'Price/person: $' || to_char(coalesce(price, 0), 'FM999,999,990') || chr(10) ||
    'Total: $'        || to_char(total, 'FM999,999,990') || chr(10) ||
    'Nationality: '   || coalesce(NEW.nationality, '-')
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'tg_notify_application failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tg_notify_newsletter ON public.newsletter_subscribers;
CREATE TRIGGER tg_notify_newsletter AFTER INSERT ON public.newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION public.tg_notify_newsletter();

DROP TRIGGER IF EXISTS tg_notify_waitlist ON public.waitlist;
CREATE TRIGGER tg_notify_waitlist AFTER INSERT ON public.waitlist
  FOR EACH ROW EXECUTE FUNCTION public.tg_notify_waitlist();

DROP TRIGGER IF EXISTS tg_notify_application ON public.applications;
CREATE TRIGGER tg_notify_application AFTER INSERT ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.tg_notify_application();
