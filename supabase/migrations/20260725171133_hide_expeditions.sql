-- Lets the admin temporarily pull a tour off the public site (homepage
-- listing, tour page, its landing page, and the application dropdown)
-- without deleting anything. Enforced via RLS, not just app-level
-- filtering, so a hidden tour truly isn't readable through the public
-- anon key.
ALTER TABLE public.expeditions
  ADD COLUMN is_hidden boolean NOT NULL DEFAULT false;

DROP POLICY IF EXISTS "Expeditions are publicly readable" ON public.expeditions;

CREATE POLICY "Non-hidden expeditions are publicly readable"
  ON public.expeditions FOR SELECT
  USING (is_hidden = false);

CREATE POLICY "Admins can read all expeditions"
  ON public.expeditions FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));
