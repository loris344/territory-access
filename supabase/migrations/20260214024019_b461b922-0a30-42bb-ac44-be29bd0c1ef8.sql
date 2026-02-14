
-- Create expedition_dates table for multiple departure dates per expedition
CREATE TABLE public.expedition_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expedition_id UUID NOT NULL REFERENCES public.expeditions(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  capacity_max INTEGER NOT NULL DEFAULT 12,
  spots_taken INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.expedition_dates ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Expedition dates are publicly readable"
ON public.expedition_dates
FOR SELECT
USING (true);

-- Admin policies
CREATE POLICY "Admins can insert expedition dates"
ON public.expedition_dates
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update expedition dates"
ON public.expedition_dates
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete expedition dates"
ON public.expedition_dates
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- No public modifications
CREATE POLICY "No public inserts on expedition_dates"
ON public.expedition_dates
FOR INSERT
WITH CHECK (false);

CREATE POLICY "No public updates on expedition_dates"
ON public.expedition_dates
FOR UPDATE
USING (false);

CREATE POLICY "No public deletes on expedition_dates"
ON public.expedition_dates
FOR DELETE
USING (false);

-- Migrate existing expedition dates into the new table
INSERT INTO public.expedition_dates (expedition_id, start_date, end_date, capacity_max, spots_taken, status)
SELECT id, start_date, end_date, capacity_max, spots_taken, status
FROM public.expeditions;
