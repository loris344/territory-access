-- Allow admins to read applications
CREATE POLICY "Admins can read applications"
ON public.applications
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update applications (for status changes)
CREATE POLICY "Admins can update applications"
ON public.applications
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));
