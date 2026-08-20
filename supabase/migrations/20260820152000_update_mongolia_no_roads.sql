-- Update the existing Mongolia tour in place to the new "No Roads" concept
-- (Gobi desert + steppe, 12 days) instead of the old 8-day Altai eagle-hunter
-- trip. Keeping the same row/slug (altai-mongolia-eagle-hunters) preserves
-- its URL, its landing page (/lp/mongolia), and any applications/waitlist
-- tied to it — only the content changes.

UPDATE public.expeditions
SET
  name = 'Mongolia – No Roads',
  location = 'Gobi Desert & Central Steppe',
  coordinates = '[103.5, 43.5]'::jsonb,
  start_date = '2026-09-06',
  end_date = '2026-09-17',
  duration_days = 12,
  capacity_max = 10,
  price_eur = 2935,
  price_usd = 3190,
  intensity_level = 'Hard',
  intensity_type = 'nomadic',
  difficulty_level = 'hard',
  short_description = '12 days off-road through the Gobi and the steppe, by 4x4, horse and on foot, sleeping in gers and isolated camps.',
  long_description = $$12-day expedition through the Gobi Desert and the central steppe with no fixed roads to follow: long 4x4 days navigating by landmark, stretches on horseback across open grassland, nights in family gers and isolated camps under some of the clearest night skies on Earth. The near-total absence of tourism infrastructure here is exactly the point — this is Mongolia the way herders still live it, not a circuit built for buses.$$,
  status = 'open',
  expedition_status = 'upcoming'
WHERE slug = 'altai-mongolia-eagle-hunters';

-- Replace the old 8-day Altai itinerary with the new 12-day Gobi route.
DELETE FROM public.expedition_days_itinerary
WHERE expedition_id = (SELECT id FROM public.expeditions WHERE slug = 'altai-mongolia-eagle-hunters');

INSERT INTO public.expedition_days_itinerary (expedition_id, day_number, title, description)
SELECT e.id, v.day_number, v.title, v.description
FROM public.expeditions e
JOIN (VALUES
  (1, $$Arrival Ulaanbaatar$$, $$Briefing, gear check, last supplies before leaving the paved road behind.$$),
  (2, $$Into the Steppe$$, $$Long drive south, first ger camp with a nomadic family.$$),
  (3, $$Baga Gazriin Chuluu$$, $$Granite rock formations and hidden temple ruins, off-road navigation practice.$$),
  (4, $$Deeper into the Gobi$$, $$Full driving day with no fixed track, reading the land like the drivers do.$$),
  (5, $$Yolyn Am Canyon$$, $$Walk into a canyon that holds ice well into summer, surrounded by desert.$$),
  (6, $$Flaming Cliffs$$, $$Sunset at the Bayanzag cliffs, where the first dinosaur eggs were ever found.$$),
  (7, $$Khongoryn Els$$, $$Arrival at the singing dunes, on-foot climb to the ridge at sunset.$$),
  (8, $$Horseback on the Steppe$$, $$A full day on horseback across open grassland with a local family.$$),
  (9, $$Nomadic Life$$, $$Helping with herding and daily camp life, a night entirely off any track.$$),
  (10, $$Orkhon Valley$$, $$Long drive north into greener country, waterfalls and ancient burial mounds.$$),
  (11, $$Kharkhorin$$, $$The ruins of the old Mongol capital, monastery visit.$$),
  (12, $$Return to Ulaanbaatar$$, $$Final drive back, debrief. End of expedition.$$)
) AS v(day_number, title, description) ON e.slug = 'altai-mongolia-eagle-hunters';

-- Replace the old (shorter) departure date with one matching the new
-- 12-day duration.
DELETE FROM public.expedition_dates
WHERE expedition_id = (SELECT id FROM public.expeditions WHERE slug = 'altai-mongolia-eagle-hunters');

INSERT INTO public.expedition_dates (expedition_id, start_date, end_date, capacity_max, spots_taken, status)
SELECT e.id, '2026-09-06'::date, '2026-09-17'::date, 10, 0, 'open'
FROM public.expeditions e WHERE e.slug = 'altai-mongolia-eagle-hunters';
