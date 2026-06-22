-- Newsletter subscribers: public email capture for the marketing newsletter.
CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe (basic email sanity check). No public read access.
CREATE POLICY "Public newsletter signup"
ON public.newsletter_subscribers
FOR INSERT
WITH CHECK (length(email) > 3 AND position('@' in email) > 1);

-- Admins can read
CREATE POLICY "Admins can read newsletter_subscribers"
ON public.newsletter_subscribers
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete
CREATE POLICY "Admins can delete newsletter_subscribers"
ON public.newsletter_subscribers
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));
