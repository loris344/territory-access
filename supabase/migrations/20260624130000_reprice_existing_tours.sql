-- Reprice the original 14 expeditions to a "premium but not ultra-luxury"
-- band (~$380-770/day depending on real logistics). Trims the high-end
-- outliers (Afghanistan, Socotra, Svalbard, North Korea, Kurdistan, Somaliland).
-- price_usd is the displayed price; price_eur is the legacy column (~0.92x).

UPDATE public.expeditions e
SET price_usd = v.usd, price_eur = v.eur
FROM (VALUES
  ('socotra-extreme-isolation',          4900, 4500),  -- was 7500
  ('svalbard-arctic-survival',           5400, 4950),  -- was 6800
  ('darien-jungle-friction',             4200, 3850),  -- was 5200
  ('north-korea-total-system-immersion', 4500, 4150),  -- was 6500
  ('bosnia-ghost-frontlines',            2200, 2000),  -- was 2400
  ('chechnya-authority-reconstruction',  3600, 3300),  -- was 4500
  ('transnistria-soviet-ghost-state',    1750, 1600),  -- was 1950
  ('abkhazia-suspended-republic',        3300, 3050),  -- was 3800
  ('afghanistan-wakhan-corridor',        6900, 6350),  -- was 8900
  ('indian-kashmir-line-of-control',     3300, 3050),  -- was 3700
  ('altai-mongolia-eagle-hunters',       3700, 3400),  -- was 4100
  ('iraqi-kurdistan-peshmerga-lines',    3900, 3600),  -- was 5200
  ('iran-lut-desert',                    3500, 3200),  -- was 3900
  ('somaliland-unrecognized-territory',  3900, 3600)   -- was 5000
) AS v(slug, usd, eur)
WHERE e.slug = v.slug;
