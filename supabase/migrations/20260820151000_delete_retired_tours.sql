-- Permanently delete the retired (old-positioning) tour catalog, now that
-- applications/waitlist are protected (see 20260820150000). Keeps:
--   - altai-mongolia-eagle-hunters: updated in place to the new "Mongolia —
--     No Roads" concept in the next migration, not deleted.
--   - transnistria-soviet-ghost-state: kept alive specifically so its
--     landing page (/lp/transnistria) keeps working, per explicit request.
-- Everything else — the other 21 tours from the static fallback catalog,
-- plus bosnia-ghost-frontlines (Supabase-only, no static fallback entry) —
-- is deleted, cascading their itinerary/inclusions/exclusions/dates/gallery/
-- landing pages (kashmir's landing page goes with it).

-- 1) Storage cleanup: Postgres refuses direct DELETE on storage.objects
--    ("Direct deletion from storage tables is not allowed. Use the Storage
--    API instead.") — so photo cleanup for these tours is handled separately
--    via the Storage API, not in this migration. See the paths captured for
--    that purpose.

-- 2) Delete the tour rows themselves. ---------------------------------------
DELETE FROM public.expeditions
WHERE slug NOT IN ('altai-mongolia-eagle-hunters', 'transnistria-soviet-ghost-state');
