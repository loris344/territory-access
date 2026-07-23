-- Per-day coordinates for the itinerary route map on landing pages.
-- Approximate, illustrative waypoints (not surveyed GPS) — good enough to
-- draw a route line across the region, not turn-by-turn navigation.
ALTER TABLE public.expedition_days_itinerary
  ADD COLUMN IF NOT EXISTS latitude double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision;

UPDATE public.expedition_days_itinerary AS d
SET latitude = v.lat, longitude = v.lng
FROM public.expeditions e
JOIN (VALUES
  -- Kashmir: Srinagar, then out toward Sonamarg's mountains, and back
  ('indian-kashmir-line-of-control', 1, 34.0837, 74.7973),
  ('indian-kashmir-line-of-control', 2, 34.0837, 74.7973),
  ('indian-kashmir-line-of-control', 3, 34.3033, 75.2996),
  ('indian-kashmir-line-of-control', 4, 34.3200, 75.3500),
  ('indian-kashmir-line-of-control', 5, 34.3000, 75.3000),
  ('indian-kashmir-line-of-control', 6, 34.0837, 74.7973),
  ('indian-kashmir-line-of-control', 7, 34.0837, 74.7973),

  -- Transnistria + Moldova: Chisinau, Cricova wine cellars, Tiraspol, Bender, back to Chisinau
  ('transnistria-soviet-ghost-state', 1, 47.0105, 28.8638),
  ('transnistria-soviet-ghost-state', 2, 47.2167, 28.8500),
  ('transnistria-soviet-ghost-state', 3, 46.8403, 29.6433),
  ('transnistria-soviet-ghost-state', 4, 46.8393, 29.4833),
  ('transnistria-soviet-ghost-state', 5, 47.0105, 28.8638),

  -- Mongolia: Ulaanbaatar, out to Bayan-Olgii/Altai, back to Ulaanbaatar
  ('altai-mongolia-eagle-hunters', 1, 47.8864, 106.9057),
  ('altai-mongolia-eagle-hunters', 2, 48.9694, 89.9644),
  ('altai-mongolia-eagle-hunters', 3, 49.1500, 89.7000),
  ('altai-mongolia-eagle-hunters', 4, 49.3000, 89.4000),
  ('altai-mongolia-eagle-hunters', 5, 49.3000, 89.4000),
  ('altai-mongolia-eagle-hunters', 6, 49.1500, 89.7000),
  ('altai-mongolia-eagle-hunters', 7, 48.9694, 89.9644),
  ('altai-mongolia-eagle-hunters', 8, 47.8864, 106.9057)
) AS v(slug, day_number, lat, lng) ON v.slug = e.slug
WHERE d.expedition_id = e.id AND d.day_number = v.day_number;
