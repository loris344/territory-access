-- Extend the Transnistria tour to 5 days by adding a Chisinau (Moldova) leg
-- before crossing the border — makes the route coherent (you don't just
-- appear in Tiraspol) and slightly raises the price for the extra day.

-- 1) Parent expedition: location/country/duration/price/descriptions --------
UPDATE public.expeditions
SET location = 'Chisinau & Tiraspol',
    country = 'Moldova & Transnistria',
    duration_days = 5,
    price_eur = 1900,
    price_usd = 2100,
    short_description = $$5 days between Chisinau and a Soviet-era time capsule most people don't know exists.$$,
    long_description = $$5 days across Moldova and Transnistria: Chisinau's Soviet-tinged capital and wine culture, then Tiraspol and Bender's Soviet-era streets frozen in time, the historic Bender Fortress, a local distillery, and a guided shooting range session, a fascinating look at how an unrecognized state actually functions day to day.$$,
    start_date = '2026-08-14',
    end_date = '2026-08-18'
WHERE slug = 'transnistria-soviet-ghost-state';

-- 2) Itinerary: shift existing days' content down one slot, add new day 1 ---
UPDATE public.expedition_days_itinerary AS d
SET title = v.title, description = v.description
FROM public.expeditions e
JOIN (VALUES
  ('transnistria-soviet-ghost-state', 1, $$Arrival in Chisinau$$, $$A first walk through Moldova's Soviet-tinged capital, its markets, and a taste of the country's renowned wine cellars.$$),
  ('transnistria-soviet-ghost-state', 2, $$Crossing the Border$$, $$An easy land crossing into Transnistria and a walk through Tiraspol, past Soviet statues and government buildings frozen in time.$$),
  ('transnistria-soviet-ghost-state', 3, $$Bender Fortress$$, $$A visit to the historic Bender Fortress with a local historian, and the story of how this small territory came to be.$$),
  ('transnistria-soviet-ghost-state', 4, $$Local Life$$, $$A visit to a historic distillery or local factory, followed by a guided session at a licensed shooting range.$$)
) AS v(slug, day_number, title, description) ON v.slug = e.slug
WHERE d.expedition_id = e.id AND d.day_number = v.day_number;

INSERT INTO public.expedition_days_itinerary (expedition_id, day_number, title, description)
SELECT e.id, 5, $$Departure$$, $$Back to Chisinau for departure, with a final conversation on how this unusual, unrecognized state actually works day to day.$$
FROM public.expeditions e
WHERE e.slug = 'transnistria-soviet-ghost-state'
ON CONFLICT DO NOTHING;

-- 3) Extend the two upcoming departures by one day (past June date is left
--    untouched: it already ran as a 4-day trip). ---------------------------
UPDATE public.expedition_dates AS d
SET end_date = d.end_date + INTERVAL '1 day'
FROM public.expeditions e
WHERE d.expedition_id = e.id
  AND e.slug = 'transnistria-soviet-ghost-state'
  AND d.start_date > CURRENT_DATE;
