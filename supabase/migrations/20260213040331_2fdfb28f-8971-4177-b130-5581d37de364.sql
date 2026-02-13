ALTER TABLE public.expeditions
ADD COLUMN continent TEXT NOT NULL DEFAULT '';

COMMENT ON COLUMN public.expeditions.continent IS 'Continent classification: Africa, Asia, Europe, Americas, Oceania, Middle East';