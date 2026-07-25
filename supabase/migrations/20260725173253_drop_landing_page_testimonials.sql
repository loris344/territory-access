-- Data already migrated to expeditions.testimonials in the previous
-- migration; this column is now dead.
ALTER TABLE public.landing_pages
  DROP COLUMN testimonials;
