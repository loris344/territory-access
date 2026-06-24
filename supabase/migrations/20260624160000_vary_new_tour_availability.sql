-- Give the 12 new tours realistic, varied availability instead of every date
-- sitting at 0 booked / full capacity. The detail page shows (capacity_max -
-- spots_taken) per departure ("3 spots", red when <= 3, "Full" at 0), and the
-- date status drives the card badge + the expedition status (sync trigger).
-- Rule used: <= 3 spots left => 'limited', otherwise 'open'.
-- Net expedition status: Libya / Papua / Virunga become 'limited' (both their
-- departures are tight); the rest stay 'open' but several near-term departures
-- read "FEW SPOTS LEFT".

UPDATE public.expedition_dates d
SET spots_taken = v.taken, status = v.st
FROM public.expeditions e,
     (VALUES
       -- slug, start_date, spots_taken, status   (capacity in comment)
       ('eritrea-sealed-state',                '2026-11-12',  9, 'limited'),  -- cap 12 -> 3 left
       ('eritrea-sealed-state',                '2027-02-11',  5, 'open'),     -- cap 12 -> 7 left
       ('kaliningrad-soviet-exclave',          '2026-10-22',  5, 'open'),     -- cap 14 -> 9 left
       ('kaliningrad-soviet-exclave',          '2027-06-10',  2, 'open'),     -- cap 14 -> 12 left
       ('lebanon-business-of-war',             '2026-10-22',  6, 'open'),     -- cap 14 -> 8 left
       ('lebanon-business-of-war',             '2027-04-22',  3, 'open'),     -- cap 14 -> 11 left
       ('libya-gaddafi-legacy',                '2026-11-19',  8, 'limited'),  -- cap 10 -> 2 left
       ('libya-gaddafi-legacy',                '2027-03-11',  7, 'limited'),  -- cap 10 -> 3 left
       ('mauritania-lost-cities-sahara',       '2026-12-03',  7, 'open'),     -- cap 12 -> 5 left
       ('mauritania-lost-cities-sahara',       '2027-02-04',  3, 'open'),     -- cap 12 -> 9 left
       ('pamir-highway-tajikistan',            '2027-07-14',  7, 'limited'),  -- cap 10 -> 3 left
       ('pamir-highway-tajikistan',            '2027-08-18',  5, 'open'),     -- cap 10 -> 5 left
       ('papua-sepik-baliem-bougainville',     '2027-08-07',  8, 'limited'),  -- cap 10 -> 2 left
       ('papua-sepik-baliem-bougainville',     '2027-09-04',  7, 'limited'),  -- cap 10 -> 3 left
       ('south-ossetia-unrecognized-frontier', '2027-07-08',  4, 'open'),     -- cap 12 -> 8 left
       ('south-ossetia-unrecognized-frontier', '2027-09-17',  2, 'open'),     -- cap 12 -> 10 left
       ('syria-after-the-regime',              '2026-11-05',  9, 'limited'),  -- cap 12 -> 3 left
       ('syria-after-the-regime',              '2027-04-08',  3, 'open'),     -- cap 12 -> 9 left
       ('turkmenistan-closed-kingdom',         '2027-04-15',  5, 'open'),     -- cap 12 -> 7 left
       ('turkmenistan-closed-kingdom',         '2027-09-23',  9, 'limited'),  -- cap 12 -> 3 left
       ('virunga-militarized-gorilla-trek',    '2026-12-10',  7, 'limited'),  -- cap 8  -> 1 left
       ('virunga-militarized-gorilla-trek',    '2027-07-15',  6, 'limited'),  -- cap 8  -> 2 left
       ('xinjiang-surveillance-frontier',      '2026-10-15', 10, 'limited'),  -- cap 12 -> 2 left
       ('xinjiang-surveillance-frontier',      '2027-05-06',  3, 'open')      -- cap 12 -> 9 left
     ) AS v(slug, sd, taken, st)
WHERE e.slug = v.slug
  AND d.expedition_id = e.id
  AND d.start_date = v.sd::date;
