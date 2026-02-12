
-- Expeditions table
CREATE TABLE public.expeditions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration_days INTEGER NOT NULL,
  price_eur INTEGER NOT NULL,
  intensity_level TEXT NOT NULL,
  short_description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'limited', 'closed')),
  hero_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.expeditions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Expeditions are publicly readable"
  ON public.expeditions FOR SELECT
  USING (true);

-- Itinerary days
CREATE TABLE public.expedition_days_itinerary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expedition_id UUID NOT NULL REFERENCES public.expeditions(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL
);

ALTER TABLE public.expedition_days_itinerary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Itinerary is publicly readable"
  ON public.expedition_days_itinerary FOR SELECT
  USING (true);

-- Inclusions
CREATE TABLE public.expedition_inclusions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expedition_id UUID NOT NULL REFERENCES public.expeditions(id) ON DELETE CASCADE,
  item_text TEXT NOT NULL
);

ALTER TABLE public.expedition_inclusions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inclusions are publicly readable"
  ON public.expedition_inclusions FOR SELECT
  USING (true);

-- Exclusions
CREATE TABLE public.expedition_exclusions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expedition_id UUID NOT NULL REFERENCES public.expeditions(id) ON DELETE CASCADE,
  item_text TEXT NOT NULL
);

ALTER TABLE public.expedition_exclusions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Exclusions are publicly readable"
  ON public.expedition_exclusions FOR SELECT
  USING (true);

-- Applications table (PII - restricted access)
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expedition_id UUID NOT NULL REFERENCES public.expeditions(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  nationality TEXT NOT NULL,
  motivation_text TEXT NOT NULL,
  physical_condition TEXT NOT NULL,
  linkedin_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Applications: anyone can insert (public form), but nobody can read (admin only via service role)
CREATE POLICY "Anyone can submit an application"
  ON public.applications FOR INSERT
  WITH CHECK (true);
