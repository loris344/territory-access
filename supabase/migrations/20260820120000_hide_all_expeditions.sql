-- Hide every currently-visible expedition from the public site while the
-- tour catalog is reworked to match the new brand positioning. Uses the
-- existing is_hidden mechanism (see 20260725171133_hide_expeditions.sql),
-- already in use for bosnia-ghost-frontlines. Reversible per-tour via the
-- admin panel's "Hide from site" toggle.
UPDATE public.expeditions
SET is_hidden = true
WHERE is_hidden = false;
