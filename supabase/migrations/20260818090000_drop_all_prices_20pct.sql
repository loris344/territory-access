-- Across-the-board 20% price cut on all 23 tours. price_eur (legacy ~0.92x
-- column) dropped by the same 20%; deposit_amount_usd recomputed to stay at
-- 30% of the new price_usd (see 20260726090000_deposit_as_percentage.sql).
UPDATE public.expeditions e
SET price_usd = v.usd,
    price_eur = v.eur,
    deposit_amount_usd = ROUND(v.usd * 0.30)
FROM (VALUES
  ('afghanistan-wakhan-corridor',          5520, 5080),  -- was 6900 / 6350
  ('papua-sepik-baliem-bougainville',      4480, 4120),  -- was 5600 / 5150
  ('svalbard-arctic-survival',             4320, 3960),  -- was 5400 / 4950
  ('socotra-extreme-isolation',            3920, 3600),  -- was 4900 / 4500
  ('north-korea-total-system-immersion',   3600, 3320),  -- was 4500 / 4150
  ('pamir-highway-tajikistan',             3360, 3080),  -- was 4200 / 3850
  ('iraqi-kurdistan-peshmerga-lines',      3120, 2880),  -- was 3900 / 3600
  ('libya-gaddafi-legacy',                 3120, 2880),  -- was 3900 / 3600
  ('somaliland-unrecognized-territory',    3120, 2880),  -- was 3900 / 3600
  ('virunga-militarized-gorilla-trek',     3120, 2880),  -- was 3900 / 3600
  ('altai-mongolia-eagle-hunters',         2960, 2720),  -- was 3700 / 3400
  ('eritrea-sealed-state',                 2880, 2640),  -- was 3600 / 3300
  ('chechnya-authority-reconstruction',    2880, 2640),  -- was 3600 / 3300
  ('mauritania-lost-cities-sahara',        2880, 2640),  -- was 3600 / 3300
  ('xinjiang-surveillance-frontier',       2720, 2520),  -- was 3400 / 3150
  ('indian-kashmir-line-of-control',       2640, 2440),  -- was 3300 / 3050
  ('abkhazia-suspended-republic',          2640, 2440),  -- was 3300 / 3050
  ('turkmenistan-closed-kingdom',          2560, 2360),  -- was 3200 / 2950
  ('syria-after-the-regime',               2480, 2280),  -- was 3100 / 2850
  ('south-ossetia-unrecognized-frontier',  2000, 1840),  -- was 2500 / 2300
  ('lebanon-business-of-war',              1920, 1760),  -- was 2400 / 2200
  ('kaliningrad-soviet-exclave',           1400, 1280),  -- was 1750 / 1600
  ('transnistria-soviet-ghost-state',      1160, 1067)   -- was 1450 / 1334
) AS v(slug, usd, eur)
WHERE e.slug = v.slug;
