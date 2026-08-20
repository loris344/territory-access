-- Mongolia (updated to the new "No Roads" concept) and Transnistria (kept
-- alive solely to preserve its landing page, /lp/transnistria) were both
-- still is_hidden=true from the earlier "hide all tours" pass. is_hidden
-- gates the landing page too, not just the main grid (see
-- 20260725171133_hide_expeditions.sql) — there is no way with the current
-- schema to keep a landing page working while hiding its tour from the main
-- catalog. Un-hiding both restores the landing pages; Transnistria will
-- also reappear in the main /expeditions grid and homepage as a side effect
-- of that same flag.
UPDATE public.expeditions
SET is_hidden = false
WHERE slug IN ('altai-mongolia-eagle-hunters', 'transnistria-soviet-ghost-state');
