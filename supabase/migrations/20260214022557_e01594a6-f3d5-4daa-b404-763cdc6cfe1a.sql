
-- Create waitlist table
CREATE TABLE public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expedition_id UUID NOT NULL REFERENCES public.expeditions(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  nationality TEXT NOT NULL,
  number_of_people INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Public can insert (with validation)
CREATE POLICY "Controlled waitlist insert"
ON public.waitlist
FOR INSERT
WITH CHECK (
  length(email) > 0 AND length(first_name) > 0 AND length(last_name) > 0 AND number_of_people > 0
);

-- Admins can read
CREATE POLICY "Admins can read waitlist"
ON public.waitlist
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete
CREATE POLICY "Admins can delete waitlist"
ON public.waitlist
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));
