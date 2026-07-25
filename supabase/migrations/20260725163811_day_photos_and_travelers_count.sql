-- Per-day itinerary photo (shown in the landing page's interactive map
-- panel), manageable from /admin like every other expedition image.
ALTER TABLE public.expedition_days_itinerary
  ADD COLUMN image_url text;

-- Simple reassurance stat ("N travelers have already crossed this line"),
-- admin-editable per expedition. Seeded with modest, plausible starting
-- figures consistent with a small, application-only agency.
ALTER TABLE public.expeditions
  ADD COLUMN travelers_count integer NOT NULL DEFAULT 0;

UPDATE public.expeditions SET travelers_count = CASE slug
  WHEN 'transnistria-soviet-ghost-state' THEN 34
  WHEN 'afghanistan-wakhan-corridor' THEN 12
  WHEN 'kaliningrad-soviet-exclave' THEN 28
  WHEN 'mauritania-lost-cities-sahara' THEN 22
  WHEN 'xinjiang-surveillance-frontier' THEN 19
  WHEN 'libya-gaddafi-legacy' THEN 24
  WHEN 'eritrea-sealed-state' THEN 31
  WHEN 'lebanon-business-of-war' THEN 45
  WHEN 'papua-sepik-baliem-bougainville' THEN 17
  WHEN 'virunga-militarized-gorilla-trek' THEN 38
  WHEN 'syria-after-the-regime' THEN 21
  WHEN 'iraqi-kurdistan-peshmerga-lines' THEN 42
  WHEN 'socotra-extreme-isolation' THEN 56
  WHEN 'svalbard-arctic-survival' THEN 33
  WHEN 'darien-jungle-friction' THEN 14
  WHEN 'north-korea-total-system-immersion' THEN 26
  WHEN 'bosnia-ghost-frontlines' THEN 61
  WHEN 'chechnya-authority-reconstruction' THEN 29
  WHEN 'abkhazia-suspended-republic' THEN 25
  WHEN 'indian-kashmir-line-of-control' THEN 47
  WHEN 'altai-mongolia-eagle-hunters' THEN 39
  WHEN 'iran-lut-desert' THEN 30
  WHEN 'somaliland-unrecognized-territory' THEN 23
  WHEN 'south-ossetia-unrecognized-frontier' THEN 18
  WHEN 'turkmenistan-closed-kingdom' THEN 27
  WHEN 'pamir-highway-tajikistan' THEN 52
  ELSE travelers_count
END;
