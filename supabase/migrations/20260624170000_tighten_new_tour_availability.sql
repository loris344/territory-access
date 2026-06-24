-- Tighten availability on the 12 new tours to build urgency: most departures
-- now sit at 1-3 spots left ("FEW SPOTS LEFT"), three near-term departures are
-- sold out ("FULL" -> status 'closed'), a few keep healthy availability so it
-- stays believable. Each tour still keeps at least one open/limited departure.
-- The card badge follows the next open/limited departure; the expedition status
-- is derived by the sync trigger.

UPDATE public.expedition_dates d
SET spots_taken = v.taken, status = v.st
FROM public.expeditions e,
     (VALUES
       -- slug, start_date, spots_taken, status   (capacity -> spots left)
       ('syria-after-the-regime',              '2026-11-05', 12, 'closed'),   -- 12 -> FULL
       ('syria-after-the-regime',              '2027-04-08',  9, 'limited'),  -- 12 -> 3
       ('eritrea-sealed-state',                '2026-11-12', 10, 'limited'),  -- 12 -> 2
       ('eritrea-sealed-state',                '2027-02-11',  6, 'open'),     -- 12 -> 6
       ('kaliningrad-soviet-exclave',          '2026-10-22',  8, 'open'),     -- 14 -> 6
       ('kaliningrad-soviet-exclave',          '2027-06-10',  5, 'open'),     -- 14 -> 9
       ('lebanon-business-of-war',             '2026-10-22', 11, 'limited'),  -- 14 -> 3
       ('lebanon-business-of-war',             '2027-04-22',  6, 'open'),     -- 14 -> 8
       ('libya-gaddafi-legacy',                '2026-11-19',  9, 'limited'),  -- 10 -> 1
       ('libya-gaddafi-legacy',                '2027-03-11',  8, 'limited'),  -- 10 -> 2
       ('mauritania-lost-cities-sahara',       '2026-12-03',  7, 'open'),     -- 12 -> 5
       ('mauritania-lost-cities-sahara',       '2027-02-04',  4, 'open'),     -- 12 -> 8
       ('pamir-highway-tajikistan',            '2027-07-14',  8, 'limited'),  -- 10 -> 2
       ('pamir-highway-tajikistan',            '2027-08-18',  5, 'open'),     -- 10 -> 5
       ('papua-sepik-baliem-bougainville',     '2027-08-07',  9, 'limited'),  -- 10 -> 1
       ('papua-sepik-baliem-bougainville',     '2027-09-04',  7, 'limited'),  -- 10 -> 3
       ('south-ossetia-unrecognized-frontier', '2027-07-08',  6, 'open'),     -- 12 -> 6
       ('south-ossetia-unrecognized-frontier', '2027-09-17',  3, 'open'),     -- 12 -> 9
       ('turkmenistan-closed-kingdom',         '2027-04-15',  6, 'open'),     -- 12 -> 6
       ('turkmenistan-closed-kingdom',         '2027-09-23',  9, 'limited'),  -- 12 -> 3
       ('virunga-militarized-gorilla-trek',    '2026-12-10',  8, 'closed'),   -- 8  -> FULL
       ('virunga-militarized-gorilla-trek',    '2027-07-15',  7, 'limited'),  -- 8  -> 1
       ('xinjiang-surveillance-frontier',      '2026-10-15', 12, 'closed'),   -- 12 -> FULL
       ('xinjiang-surveillance-frontier',      '2027-05-06', 10, 'limited')   -- 12 -> 2
     ) AS v(slug, sd, taken, st)
WHERE e.slug = v.slug
  AND d.expedition_id = e.id
  AND d.start_date = v.sd::date;
