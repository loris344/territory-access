-- Lets the admin pick a focal point for hero background images (stored as a
-- ready-to-use CSS object-position value, e.g. "50% 30%"), so the important
-- part of the photo stays in frame when object-cover crops differently on
-- mobile's narrower/taller viewport.

ALTER TABLE public.expeditions
  ADD COLUMN hero_image_position text NOT NULL DEFAULT '50% 50%';

ALTER TABLE public.landing_pages
  ADD COLUMN hero_image_position text NOT NULL DEFAULT '50% 50%';
