-- Preparing to permanently delete retired tour catalog entries (old
-- geopolitical/conflict-zone positioning, replaced by the new adventure
-- catalog). Real customer data must survive that deletion:
--   - applications.expedition_id currently blocks deletion outright
--     (plain REFERENCES, no ON DELETE clause = NO ACTION/RESTRICT) —
--     good instinct by whoever wrote it, but it means we can't delete a
--     retired tour at all while it does.
--   - waitlist.expedition_id currently CASCADEs — deleting a tour would
--     silently wipe every lead who joined its waitlist.
-- Fix: make both nullable with ON DELETE SET NULL, and add a denormalized
-- name snapshot so the record stays meaningful even after the tour it
-- referenced is gone. Constraint names are preserved exactly
-- (applications_expedition_id_fkey, waitlist_expedition_id_fkey) because
-- several Edge Functions and ApplicationsPanel embed on those names via
-- PostgREST (`expeditions!applications_expedition_id_fkey(name)` etc.).

-- 1) Snapshot columns, backfilled before anything else changes -------------
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS expedition_name_snapshot TEXT;
ALTER TABLE public.waitlist ADD COLUMN IF NOT EXISTS expedition_name_snapshot TEXT;

UPDATE public.applications a
SET expedition_name_snapshot = e.name
FROM public.expeditions e
WHERE a.expedition_id = e.id AND a.expedition_name_snapshot IS NULL;

UPDATE public.waitlist w
SET expedition_name_snapshot = e.name
FROM public.expeditions e
WHERE w.expedition_id = e.id AND w.expedition_name_snapshot IS NULL;

-- 2) applications: drop both existing FKs (the implicit one from the
--    original CREATE TABLE, plus the later explicit fk_applications_expedition
--    duplicate), make the column nullable, re-add as SET NULL. --------------
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_expedition_id_fkey;
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS fk_applications_expedition;
ALTER TABLE public.applications ALTER COLUMN expedition_id DROP NOT NULL;
ALTER TABLE public.applications
  ADD CONSTRAINT applications_expedition_id_fkey
  FOREIGN KEY (expedition_id) REFERENCES public.expeditions(id) ON DELETE SET NULL;

-- 3) waitlist: same treatment, starting from CASCADE instead of RESTRICT. --
ALTER TABLE public.waitlist DROP CONSTRAINT IF EXISTS waitlist_expedition_id_fkey;
ALTER TABLE public.waitlist ALTER COLUMN expedition_id DROP NOT NULL;
ALTER TABLE public.waitlist
  ADD CONSTRAINT waitlist_expedition_id_fkey
  FOREIGN KEY (expedition_id) REFERENCES public.expeditions(id) ON DELETE SET NULL;
