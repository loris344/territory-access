
-- Add missing columns to expeditions table
ALTER TABLE public.expeditions 
  ADD COLUMN IF NOT EXISTS country text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS coordinates jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS capacity_max integer NOT NULL DEFAULT 12,
  ADD COLUMN IF NOT EXISTS spots_taken integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS price_usd integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS intensity_type text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS difficulty_level text NOT NULL DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS expedition_status text NOT NULL DEFAULT 'upcoming';

-- Create storage bucket for expedition images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('expedition-images', 'expedition-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for expedition images
CREATE POLICY "Expedition images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'expedition-images');

-- Create app_role enum and user_roles table for admin access
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- User roles policies
CREATE POLICY "Users can read their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Admins can manage all roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to upload expedition images
CREATE POLICY "Admins can upload expedition images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'expedition-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update expedition images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'expedition-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete expedition images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'expedition-images' AND public.has_role(auth.uid(), 'admin'));

-- Allow admins to modify expeditions
CREATE POLICY "Admins can insert expeditions"
ON public.expeditions FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update expeditions"
ON public.expeditions FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete expeditions"
ON public.expeditions FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to manage itinerary, inclusions, exclusions
CREATE POLICY "Admins can insert itinerary"
ON public.expedition_days_itinerary FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update itinerary"
ON public.expedition_days_itinerary FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete itinerary"
ON public.expedition_days_itinerary FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert inclusions"
ON public.expedition_inclusions FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update inclusions"
ON public.expedition_inclusions FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete inclusions"
ON public.expedition_inclusions FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert exclusions"
ON public.expedition_exclusions FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update exclusions"
ON public.expedition_exclusions FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete exclusions"
ON public.expedition_exclusions FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
