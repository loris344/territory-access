-- Re-date the 12 newly-added expeditions: push the single departure to a better
-- future window (spread into 2027) and add a SECOND departure to each.
-- The original 14 tours are hand-managed in /admin (cancellations, multiple
-- departures, some already in 2027) and are deliberately left untouched here.
-- expeditions.status is auto-derived from the dates by the sync trigger.

-- 1) Headline date = the first (nearest) departure -------------------------
UPDATE public.expeditions e
SET start_date = v.sd::date, end_date = v.ed::date
FROM (VALUES
  ('pamir-highway-tajikistan',            '2027-07-14', '2027-07-24'),
  ('papua-sepik-baliem-bougainville',     '2027-08-07', '2027-08-18'),
  ('south-ossetia-unrecognized-frontier', '2027-07-08', '2027-07-12'),
  ('turkmenistan-closed-kingdom',         '2027-04-15', '2027-04-21'),
  ('kaliningrad-soviet-exclave',          '2026-10-22', '2026-10-25'),
  ('xinjiang-surveillance-frontier',      '2026-10-15', '2026-10-22'),
  ('lebanon-business-of-war',             '2026-10-22', '2026-10-27'),
  ('syria-after-the-regime',              '2026-11-05', '2026-11-12'),
  ('eritrea-sealed-state',                '2026-11-12', '2026-11-19'),
  ('libya-gaddafi-legacy',                '2026-11-19', '2026-11-26'),
  ('mauritania-lost-cities-sahara',       '2026-12-03', '2026-12-10'),
  ('virunga-militarized-gorilla-trek',    '2026-12-10', '2026-12-15')
) AS v(slug, sd, ed)
WHERE e.slug = v.slug;

-- 2) Move each tour's existing (single) date row to the new first departure -
--    Matched on the known current start_date so only that row is touched.
UPDATE public.expedition_dates d
SET start_date = v.sd::date, end_date = v.ed::date, status = v.st
FROM public.expeditions e,
     (VALUES
       ('pamir-highway-tajikistan',            '2026-07-15', '2027-07-14', '2027-07-24', 'limited'),
       ('papua-sepik-baliem-bougainville',     '2026-08-08', '2027-08-07', '2027-08-18', 'limited'),
       ('south-ossetia-unrecognized-frontier', '2026-09-18', '2027-07-08', '2027-07-12', 'open'),
       ('turkmenistan-closed-kingdom',         '2026-09-24', '2027-04-15', '2027-04-21', 'open'),
       ('kaliningrad-soviet-exclave',          '2026-08-28', '2026-10-22', '2026-10-25', 'open'),
       ('xinjiang-surveillance-frontier',      '2026-10-05', '2026-10-15', '2026-10-22', 'open'),
       ('lebanon-business-of-war',             '2026-10-10', '2026-10-22', '2026-10-27', 'open'),
       ('syria-after-the-regime',              '2026-10-17', '2026-11-05', '2026-11-12', 'open'),
       ('eritrea-sealed-state',                '2026-11-02', '2026-11-12', '2026-11-19', 'limited'),
       ('libya-gaddafi-legacy',                '2026-11-14', '2026-11-19', '2026-11-26', 'limited'),
       ('mauritania-lost-cities-sahara',       '2026-11-28', '2026-12-03', '2026-12-10', 'open'),
       ('virunga-militarized-gorilla-trek',    '2026-12-05', '2026-12-10', '2026-12-15', 'limited')
     ) AS v(slug, olds, sd, ed, st)
WHERE e.slug = v.slug
  AND d.expedition_id = e.id
  AND d.start_date = v.olds::date;

-- 3) Add the second departure (mostly in 2027) ------------------------------
INSERT INTO public.expedition_dates (expedition_id, start_date, end_date, capacity_max, spots_taken, status)
SELECT e.id, v.sd::date, v.ed::date, v.cap, 0, v.st
FROM public.expeditions e
JOIN (VALUES
  ('pamir-highway-tajikistan',            '2027-08-18', '2027-08-28', 10, 'open'),
  ('papua-sepik-baliem-bougainville',     '2027-09-04', '2027-09-15', 10, 'open'),
  ('south-ossetia-unrecognized-frontier', '2027-09-17', '2027-09-21', 12, 'open'),
  ('turkmenistan-closed-kingdom',         '2027-09-23', '2027-09-29', 12, 'open'),
  ('kaliningrad-soviet-exclave',          '2027-06-10', '2027-06-13', 14, 'open'),
  ('xinjiang-surveillance-frontier',      '2027-05-06', '2027-05-13', 12, 'open'),
  ('lebanon-business-of-war',             '2027-04-22', '2027-04-27', 14, 'open'),
  ('syria-after-the-regime',              '2027-04-08', '2027-04-15', 12, 'open'),
  ('eritrea-sealed-state',                '2027-02-11', '2027-02-18', 12, 'open'),
  ('libya-gaddafi-legacy',                '2027-03-11', '2027-03-18', 10, 'open'),
  ('mauritania-lost-cities-sahara',       '2027-02-04', '2027-02-11', 12, 'open'),
  ('virunga-militarized-gorilla-trek',    '2027-07-15', '2027-07-20', 8,  'open')
) AS v(slug, sd, ed, cap, st) ON v.slug = e.slug;
