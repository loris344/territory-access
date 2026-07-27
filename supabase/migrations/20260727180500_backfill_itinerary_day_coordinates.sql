-- Backfills day-by-day latitude/longitude for the itinerary map (ItineraryMap.tsx)
-- on the 23 tours that didn't have any yet (only Mongolia/Kashmir/Transnistria did).
-- Points are illustrative route markers derived from the real place names already
-- in each day's title/description, same standard as those 3 existing tours (see
-- ItineraryMap.tsx's own comment: "illustrative route ... not a surveyed GPS track").

UPDATE public.expedition_days_itinerary d
SET latitude = v.lat, longitude = v.lng
FROM (VALUES
    (1, 43.0034, 41.0219),
    (2, 43.0034, 41.0219),
    (3, 43.4794, 40.5486),
    (4, 43.0906, 40.8264),
    (5, 43.2818, 40.2467),
    (6, 43.0034, 41.0219)
) AS v(day_number, lat, lng)
WHERE d.expedition_id = (SELECT id FROM public.expeditions WHERE slug = 'abkhazia-suspended-republic')
  AND d.day_number = v.day_number;

UPDATE public.expedition_days_itinerary d
SET latitude = v.lat, longitude = v.lng
FROM (VALUES
    (1, 36.7167, 71.5667),
    (2, 36.75, 71.85),
    (3, 36.83, 72.35),
    (4, 36.87, 72.79),
    (5, 37.05, 73.8),
    (6, 37.15, 74.1),
    (7, 37.27, 74.53),
    (8, 36.87, 72.79),
    (9, 36.7167, 71.5667),
    (10, 36.7167, 71.5667)
) AS v(day_number, lat, lng)
WHERE d.expedition_id = (SELECT id FROM public.expeditions WHERE slug = 'afghanistan-wakhan-corridor')
  AND d.day_number = v.day_number;

UPDATE public.expedition_days_itinerary d
SET latitude = v.lat, longitude = v.lng
FROM (VALUES
    (1, 43.8563, 18.4131),
    (2, 43.8244, 18.3372),
    (3, 43.8214, 18.4547),
    (4, 44.1445, 19.2941),
    (5, 43.8563, 18.4131)
) AS v(day_number, lat, lng)
WHERE d.expedition_id = (SELECT id FROM public.expeditions WHERE slug = 'bosnia-ghost-frontlines')
  AND d.day_number = v.day_number;

UPDATE public.expedition_days_itinerary d
SET latitude = v.lat, longitude = v.lng
FROM (VALUES
    (1, 43.3169, 45.6982),
    (2, 43.3169, 45.6982),
    (3, 43.1, 45.75),
    (4, 42.9667, 46.0833),
    (5, 43.3169, 45.6982),
    (6, 43.3169, 45.6982)
) AS v(day_number, lat, lng)
WHERE d.expedition_id = (SELECT id FROM public.expeditions WHERE slug = 'chechnya-authority-reconstruction')
  AND d.day_number = v.day_number;

UPDATE public.expedition_days_itinerary d
SET latitude = v.lat, longitude = v.lng
FROM (VALUES
    (1, 8.9824, -79.5199),
    (2, 8.15, -77.7167),
    (3, 8.05, -77.5),
    (4, 7.95, -77.35),
    (5, 8.0, -77.4),
    (6, 8.15, -77.65),
    (7, 8.9824, -79.5199)
) AS v(day_number, lat, lng)
WHERE d.expedition_id = (SELECT id FROM public.expeditions WHERE slug = 'darien-jungle-friction')
  AND d.day_number = v.day_number;

UPDATE public.expedition_days_itinerary d
SET latitude = v.lat, longitude = v.lng
FROM (VALUES
    (1, 15.3229, 38.9251),
    (2, 15.3229, 38.9251),
    (3, 15.45, 39.05),
    (4, 15.61, 39.4498),
    (5, 15.67, 39.62),
    (6, 15.3229, 38.9251),
    (7, 15.3229, 38.9251),
    (8, 15.292, 38.9106)
) AS v(day_number, lat, lng)
WHERE d.expedition_id = (SELECT id FROM public.expeditions WHERE slug = 'eritrea-sealed-state')
  AND d.day_number = v.day_number;

UPDATE public.expedition_days_itinerary d
SET latitude = v.lat, longitude = v.lng
FROM (VALUES
    (1, 30.2839, 57.0834),
    (2, 30.4256, 57.7189),
    (3, 31.15, 58.25),
    (4, 30.95, 58.55),
    (5, 30.7, 58.45),
    (6, 30.4256, 57.7189),
    (7, 30.2839, 57.0834)
) AS v(day_number, lat, lng)
WHERE d.expedition_id = (SELECT id FROM public.expeditions WHERE slug = 'iran-lut-desert')
  AND d.day_number = v.day_number;

UPDATE public.expedition_days_itinerary d
SET latitude = v.lat, longitude = v.lng
FROM (VALUES
    (1, 36.1911, 44.0089),
    (2, 36.5, 44.2),
    (3, 36.6167, 44.5167),
    (4, 36.6167, 44.5167),
    (5, 36.6903, 43.1358),
    (6, 36.9167, 44.2333),
    (7, 36.1911, 44.0089)
) AS v(day_number, lat, lng)
WHERE d.expedition_id = (SELECT id FROM public.expeditions WHERE slug = 'iraqi-kurdistan-peshmerga-lines')
  AND d.day_number = v.day_number;

UPDATE public.expedition_days_itinerary d
SET latitude = v.lat, longitude = v.lng
FROM (VALUES
    (1, 54.7104, 20.4522),
    (2, 54.7104, 20.4522),
    (3, 55.05, 20.85),
    (4, 54.7104, 20.4522)
) AS v(day_number, lat, lng)
WHERE d.expedition_id = (SELECT id FROM public.expeditions WHERE slug = 'kaliningrad-soviet-exclave')
  AND d.day_number = v.day_number;

UPDATE public.expedition_days_itinerary d
SET latitude = v.lat, longitude = v.lng
FROM (VALUES
    (1, 33.8938, 35.5018),
    (2, 33.8938, 35.5018),
    (3, 33.8938, 35.5018),
    (4, 34.0058, 36.2181),
    (5, 33.2704, 35.2038),
    (6, 33.8938, 35.5018)
) AS v(day_number, lat, lng)
WHERE d.expedition_id = (SELECT id FROM public.expeditions WHERE slug = 'lebanon-business-of-war')
  AND d.day_number = v.day_number;

UPDATE public.expedition_days_itinerary d
SET latitude = v.lat, longitude = v.lng
FROM (VALUES
    (1, 32.8872, 13.1913),
    (2, 32.8872, 13.1913),
    (3, 32.6389, 14.29),
    (4, 32.7936, 12.4886),
    (5, 32.1722, 13.0206),
    (6, 32.8872, 13.1913),
    (7, 32.8872, 13.1913),
    (8, 32.8872, 13.1913)
) AS v(day_number, lat, lng)
WHERE d.expedition_id = (SELECT id FROM public.expeditions WHERE slug = 'libya-gaddafi-legacy')
  AND d.day_number = v.day_number;

UPDATE public.expedition_days_itinerary d
SET latitude = v.lat, longitude = v.lng
FROM (VALUES
    (1, 18.0858, -15.9785),
    (2, 21.32, -12.9),
    (3, 20.5169, -13.0499),
    (4, 20.45, -12.35),
    (5, 20.9256, -11.6195),
    (6, 20.6, -12.0),
    (7, 20.13, -13.05),
    (8, 18.0858, -15.9785)
) AS v(day_number, lat, lng)
WHERE d.expedition_id = (SELECT id FROM public.expeditions WHERE slug = 'mauritania-lost-cities-sahara')
  AND d.day_number = v.day_number;

UPDATE public.expedition_days_itinerary d
SET latitude = v.lat, longitude = v.lng
FROM (VALUES
    (1, 39.0392, 125.7625),
    (2, 39.0392, 125.7625),
    (3, 39.0392, 125.7625),
    (4, 37.97, 126.5561),
    (5, 38.7333, 125.4053),
    (6, 39.0392, 125.7625),
    (7, 39.0392, 125.7625)
) AS v(day_number, lat, lng)
WHERE d.expedition_id = (SELECT id FROM public.expeditions WHERE slug = 'north-korea-total-system-immersion')
  AND d.day_number = v.day_number;

UPDATE public.expedition_days_itinerary d
SET latitude = v.lat, longitude = v.lng
FROM (VALUES
    (1, 38.5598, 68.787),
    (2, 38.47, 70.78),
    (3, 37.4913, 71.5514),
    (4, 37.2667, 71.9333),
    (5, 37.1167, 72.6333),
    (6, 37.45, 72.85),
    (7, 37.75, 72.92),
    (8, 38.1689, 73.965),
    (9, 38.5609, 73.5975),
    (10, 39.5, 73.65),
    (11, 40.5283, 72.7985)
) AS v(day_number, lat, lng)
WHERE d.expedition_id = (SELECT id FROM public.expeditions WHERE slug = 'pamir-highway-tajikistan')
  AND d.day_number = v.day_number;

UPDATE public.expedition_days_itinerary d
SET latitude = v.lat, longitude = v.lng
FROM (VALUES
    (1, -9.4438, 147.1803),
    (2, -3.55, 143.6333),
    (3, -4.0, 143.2),
    (4, -4.2, 142.8),
    (5, -4.5, 141.5),
    (6, -4.0917, 138.95),
    (7, -4.0917, 138.95),
    (8, -4.0917, 138.95),
    (9, -4.15, 139.1),
    (10, -6.2, 155.0),
    (11, -6.2167, 155.5667),
    (12, -5.42, 154.67)
) AS v(day_number, lat, lng)
WHERE d.expedition_id = (SELECT id FROM public.expeditions WHERE slug = 'papua-sepik-baliem-bougainville')
  AND d.day_number = v.day_number;

UPDATE public.expedition_days_itinerary d
SET latitude = v.lat, longitude = v.lng
FROM (VALUES
    (1, 12.65, 54.0167),
    (2, 12.467, 54.0011),
    (3, 12.4, 53.9),
    (4, 12.48, 53.3),
    (5, 12.35, 53.25),
    (6, 12.3, 53.5),
    (7, 12.5, 53.95),
    (8, 12.6, 53.95),
    (9, 12.65, 54.0167)
) AS v(day_number, lat, lng)
WHERE d.expedition_id = (SELECT id FROM public.expeditions WHERE slug = 'socotra-extreme-isolation')
  AND d.day_number = v.day_number;

UPDATE public.expedition_days_itinerary d
SET latitude = v.lat, longitude = v.lng
FROM (VALUES
    (1, 9.56, 44.065),
    (2, 9.56, 44.065),
    (3, 9.7809, 44.4436),
    (4, 10.4396, 45.0143),
    (5, 9.95, 45.1),
    (6, 9.9333, 45.2667),
    (7, 9.56, 44.065),
    (8, 9.56, 44.065)
) AS v(day_number, lat, lng)
WHERE d.expedition_id = (SELECT id FROM public.expeditions WHERE slug = 'somaliland-unrecognized-territory')
  AND d.day_number = v.day_number;

UPDATE public.expedition_days_itinerary d
SET latitude = v.lat, longitude = v.lng
FROM (VALUES
    (1, 43.0241, 44.6819),
    (2, 42.2231, 43.9661),
    (3, 42.2231, 43.9661),
    (4, 42.3, 44.05),
    (5, 43.0241, 44.6819)
) AS v(day_number, lat, lng)
WHERE d.expedition_id = (SELECT id FROM public.expeditions WHERE slug = 'south-ossetia-unrecognized-frontier')
  AND d.day_number = v.day_number;

UPDATE public.expedition_days_itinerary d
SET latitude = v.lat, longitude = v.lng
FROM (VALUES
    (1, 78.2232, 15.6267),
    (2, 78.35, 16.5),
    (3, 78.45, 17.5),
    (4, 78.6556, 16.3378),
    (5, 78.5, 16.8),
    (6, 78.3, 15.9),
    (7, 78.2232, 15.6267)
) AS v(day_number, lat, lng)
WHERE d.expedition_id = (SELECT id FROM public.expeditions WHERE slug = 'svalbard-arctic-survival')
  AND d.day_number = v.day_number;

UPDATE public.expedition_days_itinerary d
SET latitude = v.lat, longitude = v.lng
FROM (VALUES
    (1, 33.5138, 36.2765),
    (2, 33.54, 36.28),
    (3, 34.7324, 36.7137),
    (4, 34.757, 36.2947),
    (5, 34.8886, 35.8866),
    (6, 36.2021, 37.1343),
    (7, 36.2021, 37.1343),
    (8, 33.5138, 36.2765)
) AS v(day_number, lat, lng)
WHERE d.expedition_id = (SELECT id FROM public.expeditions WHERE slug = 'syria-after-the-regime')
  AND d.day_number = v.day_number;

UPDATE public.expedition_days_itinerary d
SET latitude = v.lat, longitude = v.lng
FROM (VALUES
    (1, 37.9601, 58.3261),
    (2, 37.9601, 58.3261),
    (3, 40.2528, 58.4396),
    (4, 40.2528, 58.4396),
    (5, 37.6606, 62.1901),
    (6, 37.9601, 58.3261),
    (7, 37.9601, 58.3261)
) AS v(day_number, lat, lng)
WHERE d.expedition_id = (SELECT id FROM public.expeditions WHERE slug = 'turkmenistan-closed-kingdom')
  AND d.day_number = v.day_number;

UPDATE public.expedition_days_itinerary d
SET latitude = v.lat, longitude = v.lng
FROM (VALUES
    (1, -1.6792, 29.2228),
    (2, -1.5196, 29.25),
    (3, -1.4667, 29.4),
    (4, -1.42, 29.45),
    (5, -1.4667, 29.4),
    (6, -1.6792, 29.2228)
) AS v(day_number, lat, lng)
WHERE d.expedition_id = (SELECT id FROM public.expeditions WHERE slug = 'virunga-militarized-gorilla-trek')
  AND d.day_number = v.day_number;

UPDATE public.expedition_days_itinerary d
SET latitude = v.lat, longitude = v.lng
FROM (VALUES
    (1, 39.4704, 75.9877),
    (2, 39.4704, 75.9877),
    (3, 38.4333, 75.05),
    (4, 41.7166, 82.9425),
    (5, 42.9425, 89.1893),
    (6, 43.8256, 87.6168),
    (7, 43.8256, 87.6168),
    (8, 43.8256, 87.6168)
) AS v(day_number, lat, lng)
WHERE d.expedition_id = (SELECT id FROM public.expeditions WHERE slug = 'xinjiang-surveillance-frontier')
  AND d.day_number = v.day_number;
