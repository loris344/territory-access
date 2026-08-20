-- Diagnostic only: print the Storage paths referenced by tours about to be
-- retired, so they can be removed via `supabase storage rm` (direct SQL
-- DELETE on storage.objects is blocked). No data is modified.
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT hero_image_url AS url FROM public.expeditions
    WHERE slug NOT IN ('altai-mongolia-eagle-hunters', 'transnistria-soviet-ghost-state')
      AND hero_image_url LIKE '%/storage/v1/object/public/%'
    UNION ALL
    SELECT g.image_url AS url FROM public.expedition_gallery g
    JOIN public.expeditions e ON e.id = g.expedition_id
    WHERE e.slug NOT IN ('altai-mongolia-eagle-hunters', 'transnistria-soviet-ghost-state')
      AND g.image_url LIKE '%/storage/v1/object/public/%'
  LOOP
    RAISE NOTICE 'STORAGE_PATH: %', regexp_replace(r.url, '^.*/storage/v1/object/public/', '');
  END LOOP;
END $$;
