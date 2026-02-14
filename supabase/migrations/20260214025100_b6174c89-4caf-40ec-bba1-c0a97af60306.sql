
-- Add expedition_date_id to applications (nullable for backward compat)
ALTER TABLE public.applications ADD COLUMN expedition_date_id UUID REFERENCES public.expedition_dates(id) ON DELETE SET NULL;

-- Add expedition_date_id to waitlist (nullable for backward compat)
ALTER TABLE public.waitlist ADD COLUMN expedition_date_id UUID REFERENCES public.expedition_dates(id) ON DELETE SET NULL;
