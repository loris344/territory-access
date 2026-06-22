-- Keep expeditions.status automatically in sync with their dates.
-- Rule (availability-first): the expedition reflects the "most available" date.
--   open > limited > postponed > cancelled > closed
-- So when every date shares a status, the expedition takes it (e.g. all dates
-- cancelled -> expedition cancelled). Expeditions with no dates are left as-is
-- (their status stays whatever was set manually).

CREATE OR REPLACE FUNCTION public.expedition_status_from_dates(exp_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  SELECT CASE
    WHEN count(*) = 0 THEN NULL
    WHEN bool_or(status = 'open') THEN 'open'
    WHEN bool_or(status = 'limited') THEN 'limited'
    WHEN bool_or(status = 'postponed') THEN 'postponed'
    WHEN bool_or(status = 'cancelled') THEN 'cancelled'
    ELSE 'closed'
  END
  FROM public.expedition_dates
  WHERE expedition_id = exp_id;
$$;

CREATE OR REPLACE FUNCTION public.sync_expedition_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  derived TEXT;
BEGIN
  -- Recompute for the affected expedition.
  derived := public.expedition_status_from_dates(COALESCE(NEW.expedition_id, OLD.expedition_id));
  IF derived IS NOT NULL THEN
    UPDATE public.expeditions
      SET status = derived
      WHERE id = COALESCE(NEW.expedition_id, OLD.expedition_id)
        AND status IS DISTINCT FROM derived;
  END IF;

  -- If a date was moved to another expedition, refresh the previous one too.
  IF TG_OP = 'UPDATE' AND OLD.expedition_id IS DISTINCT FROM NEW.expedition_id THEN
    derived := public.expedition_status_from_dates(OLD.expedition_id);
    IF derived IS NOT NULL THEN
      UPDATE public.expeditions
        SET status = derived
        WHERE id = OLD.expedition_id
          AND status IS DISTINCT FROM derived;
    END IF;
  END IF;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS sync_expedition_status_on_dates ON public.expedition_dates;
CREATE TRIGGER sync_expedition_status_on_dates
  AFTER INSERT OR DELETE OR UPDATE OF status, expedition_id ON public.expedition_dates
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_expedition_status();

-- One-time backfill so existing expeditions immediately match their dates.
UPDATE public.expeditions e
SET status = public.expedition_status_from_dates(e.id)
WHERE public.expedition_status_from_dates(e.id) IS NOT NULL
  AND e.status IS DISTINCT FROM public.expedition_status_from_dates(e.id);
