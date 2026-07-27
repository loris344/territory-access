-- The two nearest bookable departures (Transnistria Aug 14 and Mongolia
-- Sep 20) were only ~2-8 weeks out, too tight for an application-based trip
-- (review + deposit + travel prep) this close to end of July. Pushed both
-- tours' upcoming sessions back 8 weeks, keeping the same gap between each
-- tour's two sessions and the same capacity/spots already booked - only the
-- dates move.

UPDATE public.expedition_dates SET start_date = '2026-10-09', end_date = '2026-10-13'
  WHERE id = 'd32128ff-14f0-4578-b2b6-be590505113b';

UPDATE public.expedition_dates SET start_date = '2026-11-27', end_date = '2026-12-01'
  WHERE id = 'b32ca5ea-648a-4e11-93c0-d88aa188e8a6';

UPDATE public.expedition_dates SET start_date = '2026-11-15', end_date = '2026-11-22'
  WHERE id = '84475f9e-9439-4106-a6f9-7b3261cb564a';

UPDATE public.expedition_dates SET start_date = '2026-12-05', end_date = '2026-12-12'
  WHERE id = '9924f2a1-fced-4f2f-a07e-8b18ef936d23';
