-- Reassurance numbers were too modest to actually read as reassuring.
-- Raised (~2.5-3x, relative ordering kept: easier/more accessible tours
-- higher, extreme/cancelled ones lower) while staying plausible for a
-- small, application-only agency running for a few years.
UPDATE public.expeditions SET travelers_count = CASE slug
  WHEN 'transnistria-soviet-ghost-state' THEN 95
  WHEN 'afghanistan-wakhan-corridor' THEN 38
  WHEN 'kaliningrad-soviet-exclave' THEN 85
  WHEN 'mauritania-lost-cities-sahara' THEN 68
  WHEN 'xinjiang-surveillance-frontier' THEN 62
  WHEN 'libya-gaddafi-legacy' THEN 71
  WHEN 'eritrea-sealed-state' THEN 89
  WHEN 'lebanon-business-of-war' THEN 124
  WHEN 'papua-sepik-baliem-bougainville' THEN 52
  WHEN 'virunga-militarized-gorilla-trek' THEN 105
  WHEN 'syria-after-the-regime' THEN 64
  WHEN 'iraqi-kurdistan-peshmerga-lines' THEN 118
  WHEN 'socotra-extreme-isolation' THEN 152
  WHEN 'svalbard-arctic-survival' THEN 92
  WHEN 'darien-jungle-friction' THEN 44
  WHEN 'north-korea-total-system-immersion' THEN 78
  WHEN 'bosnia-ghost-frontlines' THEN 168
  WHEN 'chechnya-authority-reconstruction' THEN 86
  WHEN 'abkhazia-suspended-republic' THEN 74
  WHEN 'indian-kashmir-line-of-control' THEN 129
  WHEN 'altai-mongolia-eagle-hunters' THEN 108
  WHEN 'iran-lut-desert' THEN 88
  WHEN 'somaliland-unrecognized-territory' THEN 69
  WHEN 'south-ossetia-unrecognized-frontier' THEN 56
  WHEN 'turkmenistan-closed-kingdom' THEN 81
  WHEN 'pamir-highway-tajikistan' THEN 143
  ELSE travelers_count
END;
