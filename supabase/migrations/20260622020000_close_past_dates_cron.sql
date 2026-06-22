-- Auto-close expedition dates once they are in the past, every night.
-- Past 'open'/'limited' dates become 'closed'; 'cancelled'/'postponed' are left
-- as-is. The sync_expedition_status trigger then cascades the change up to the
-- parent expedition's status (so an expedition whose dates are all past/closed
-- becomes 'closed' on its own).

CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE OR REPLACE FUNCTION public.close_past_expedition_dates()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  UPDATE public.expedition_dates
  SET status = 'closed'
  WHERE end_date < CURRENT_DATE
    AND status IN ('open', 'limited');
$$;

-- Nightly at 00:10 UTC.
SELECT cron.schedule(
  'close-past-expedition-dates',
  '10 0 * * *',
  $$ SELECT public.close_past_expedition_dates(); $$
);

-- Close any dates that are already in the past, right now.
SELECT public.close_past_expedition_dates();
