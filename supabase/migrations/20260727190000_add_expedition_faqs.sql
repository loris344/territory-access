-- Per-tour FAQ, same storage pattern as `testimonials` (jsonb array directly
-- on expeditions, edited as a whole via the admin panel) rather than a child
-- table — simplest fit for a short, variable-length list of {question,answer}
-- pairs, and picked up for free by every existing `select("*")` /
-- `select("*, ...")` query on expeditions (landing pages included).
ALTER TABLE public.expeditions
  ADD COLUMN faqs jsonb NOT NULL DEFAULT '[]'::jsonb;
