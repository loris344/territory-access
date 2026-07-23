-- Rebalance the Transnistria tour to a real 2 days Moldova / 2 days
-- Transnistria / 1 departure-day split (was 1/3/1), with a distinct Moldova
-- activity (the underground wine cellars) instead of just an overnight stop,
-- and an explicit mention of the local border-registration step: a basic
-- crossing slip only covers a short stay, so a 2-night stay in Transnistria
-- needs registration with local authorities, handled here by the local fixer.

UPDATE public.expeditions
SET long_description = $$5 days across Moldova and Transnistria: Chisinau's Soviet-tinged capital and underground wine cellars, then Tiraspol and Bender's Soviet-era streets frozen in time, the historic Bender Fortress, a local distillery, and a guided shooting range session, a fascinating look at how an unrecognized state actually functions day to day.$$
WHERE slug = 'transnistria-soviet-ghost-state';

UPDATE public.expedition_days_itinerary AS d
SET title = v.title, description = v.description
FROM public.expeditions e
JOIN (VALUES
  ('transnistria-soviet-ghost-state', 1, $$Arrival in Chisinau$$, $$A first walk through Moldova's Soviet-tinged capital: wide boulevards, local markets, and a first taste of the country's food and wine.$$),
  ('transnistria-soviet-ghost-state', 2, $$Underground Wine Cellars$$, $$A day trip to one of Moldova's famous underground wine cities, dug decades ago and stretching for kilometers, followed by free time back in Chisinau.$$),
  ('transnistria-soviet-ghost-state', 3, $$Crossing into Transnistria$$, $$A land crossing into Transnistria, with registration handled by our local fixer, and a first walk through Tiraspol, past Soviet statues and government buildings frozen in time.$$),
  ('transnistria-soviet-ghost-state', 4, $$Bender & Local Life$$, $$The historic Bender Fortress with a local historian, followed by a visit to a local distillery and a guided session at a licensed shooting range.$$),
  ('transnistria-soviet-ghost-state', 5, $$Departure$$, $$Back to Chisinau for departure, with a final conversation on how this unusual, unrecognized state actually works day to day.$$)
) AS v(slug, day_number, title, description) ON v.slug = e.slug
WHERE d.expedition_id = e.id AND d.day_number = v.day_number;
