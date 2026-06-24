-- Two more expeditions: Virunga militarized gorilla trek (DR Congo) and the
-- Lost Cities of the Sahara (Mauritania). Same structure as the seed migration.
-- price_usd is the displayed price; price_eur is the legacy column (~0.92x).

-- 1) Parent rows ------------------------------------------------------------
INSERT INTO public.expeditions
  (slug, name, location, country, continent, coordinates, start_date, end_date,
   duration_days, capacity_max, spots_taken, price_eur, price_usd,
   intensity_level, intensity_type, difficulty_level,
   short_description, long_description, status, expedition_status)
VALUES
  ('virunga-militarized-gorilla-trek', $$Virunga – Militarized Gorilla Trek$$, 'Virunga National Park', 'DR Congo', 'Africa', '[29.49, -1.47]'::jsonb, '2026-12-05', '2026-12-10',
   6, 8, 0, 3600, 3900, 'Hard', 'conflict', 'hard',
   $$6-day mountain-gorilla trek through eastern Congo's war-torn Virunga, escorted by the park's armed rangers.$$,
   $$6-day expedition into Virunga, Africa's oldest national park and one of its most dangerous: the active Nyiragongo volcano and its lava lake, a militarized trek to habituated mountain gorillas under armed ranger escort, and the front line of a conservation war fought against poachers and armed groups in the shadow of the M23 conflict.$$,
   'limited', 'upcoming'),

  ('mauritania-lost-cities-sahara', $$Mauritania – Lost Cities of the Sahara$$, 'Adrar & Chinguetti', 'Mauritania', 'Africa', '[-12.36, 20.46]'::jsonb, '2026-11-28', '2026-12-05',
   8, 12, 0, 3300, 3600, 'Hard', 'desert', 'hard',
   $$8-day Saharan expedition through Mauritania's lost caravan cities, riding the legendary iron ore train.$$,
   $$8-day expedition across the Mauritanian Sahara: a ride on the iron ore train, one of the longest in the world, the medieval caravan cities of Chinguetti and Ouadane with their crumbling manuscript libraries, ghost ksars swallowed by the dunes, palm oases and nights of total desert isolation.$$,
   'open', 'upcoming')
ON CONFLICT (slug) DO NOTHING;

-- 2) Itinerary --------------------------------------------------------------
INSERT INTO public.expedition_days_itinerary (expedition_id, day_number, title, description)
SELECT e.id, v.day_number, v.title, v.description
FROM public.expeditions e
JOIN (VALUES
  -- Virunga
  ('virunga-militarized-gorilla-trek', 1, $$Goma arrival$$, $$Arrival in Goma on Lake Kivu. Security brief on the M23 conflict zone. Meeting with park staff. First walk through a city under tension.$$),
  ('virunga-militarized-gorilla-trek', 2, $$Nyiragongo ascent$$, $$Climb the active Nyiragongo volcano. Overnight in summit shelters above the world's largest lava lake.$$),
  ('virunga-militarized-gorilla-trek', 3, $$Descent & transfer$$, $$Descend Nyiragongo. Transfer to the Mikeno sector under armed ranger escort. Patrol-post overnight.$$),
  ('virunga-militarized-gorilla-trek', 4, $$Militarized gorilla trek$$, $$Full-day jungle trek to a mountain gorilla family, escorted by the park's armed rangers. One hour with the gorillas. Ranger debrief on the anti-poaching war.$$),
  ('virunga-militarized-gorilla-trek', 5, $$Rangers & front lines$$, $$Ranger memorial (over 200 killed in the line of duty). Patrol immersion. Displaced-community meeting. Conflict-economy reading: charcoal, minerals, armed groups.$$),
  ('virunga-militarized-gorilla-trek', 6, $$Departure$$, $$Return to Goma. Debrief on protecting a park inside a war. End of expedition.$$),
  -- Mauritania
  ('mauritania-lost-cities-sahara', 1, $$Nouakchott arrival$$, $$Arrival in Nouakchott. Sahara and security brief. Atlantic fish market. First walk through the capital of a desert state.$$),
  ('mauritania-lost-cities-sahara', 2, $$Iron ore train$$, $$Drive to Choum. Board the iron ore train, one of the world's longest, riding the open ore wagons across the desert at dusk. Raw, dust-covered crossing.$$),
  ('mauritania-lost-cities-sahara', 3, $$Adrar & Atar$$, $$Arrival in the Adrar. Atar oasis town. Caravan-history briefing. 4x4 convoy formation.$$),
  ('mauritania-lost-cities-sahara', 4, $$Chinguetti$$, $$Chinguetti, the ancient caravan city and seventh holy city of Islam. Medieval libraries with crumbling manuscripts. Sand encroaching on the old town.$$),
  ('mauritania-lost-cities-sahara', 5, $$Ouadane$$, $$Track to Ouadane, a UNESCO ghost city of stone half-swallowed by the desert. Abandoned alleys. Sunset over the ksar.$$),
  ('mauritania-lost-cities-sahara', 6, $$Dunes & isolation$$, $$Erg dune crossing. Camel approach. Wild bivouac under a total desert sky. Full off-grid day.$$),
  ('mauritania-lost-cities-sahara', 7, $$Terjit & return$$, $$Terjit oasis. Palm canyon and springs. Return drive toward Atar and Nouakchott.$$),
  ('mauritania-lost-cities-sahara', 8, $$Departure$$, $$End of expedition.$$)
) AS v(slug, day_number, title, description) ON v.slug = e.slug;

-- 3) Inclusions -------------------------------------------------------------
INSERT INTO public.expedition_inclusions (expedition_id, item_text)
SELECT e.id, inc.item_text
FROM public.expeditions e
CROSS JOIN (VALUES
  ('All meals'),
  ('All drinks (water and soft drinks)'),
  ('All ground transport'),
  ('English-speaking local tour guide'),
  ('Ligne Rouge Tours tour leader'),
  ('Visa support documents'),
  ('All entry fees to sites'),
  ('Airport transfers')
) AS inc(item_text)
WHERE e.slug IN ('virunga-militarized-gorilla-trek', 'mauritania-lost-cities-sahara');

-- 4) Exclusions -------------------------------------------------------------
INSERT INTO public.expedition_exclusions (expedition_id, item_text)
SELECT e.id, exc.item_text
FROM public.expeditions e
CROSS JOIN (VALUES
  ('Round-trip airfare'),
  ('Travel insurance'),
  ('Visa fees'),
  ('Tips'),
  ('Personal spending money')
) AS exc(item_text)
WHERE e.slug IN ('virunga-militarized-gorilla-trek', 'mauritania-lost-cities-sahara');

-- 5) One departure date per expedition --------------------------------------
INSERT INTO public.expedition_dates (expedition_id, start_date, end_date, capacity_max, spots_taken, status)
SELECT e.id, v.start_date::date, v.end_date::date, v.capacity_max, 0, v.status
FROM public.expeditions e
JOIN (VALUES
  ('virunga-militarized-gorilla-trek', '2026-12-05', '2026-12-10', 8, 'limited'),
  ('mauritania-lost-cities-sahara', '2026-11-28', '2026-12-05', 12, 'open')
) AS v(slug, start_date, end_date, capacity_max, status) ON v.slug = e.slug;
