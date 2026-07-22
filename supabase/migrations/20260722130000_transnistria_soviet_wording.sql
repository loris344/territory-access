-- Bring back an explicit "Soviet" mention in the Transnistria card copy
-- (name + short_description, the two fields shown on the card/grid) — it had
-- been softened out of the visible copy during the tone rewrite, leaving it
-- only in long_description.
UPDATE public.expeditions
SET name = $$Transnistria – A Soviet Time Capsule$$,
    short_description = $$4 days in a Soviet-era time capsule most people don't know exists.$$
WHERE slug = 'transnistria-soviet-ghost-state';
