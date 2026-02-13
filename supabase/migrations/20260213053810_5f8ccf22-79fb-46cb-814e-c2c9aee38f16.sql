
-- Allow admins to delete applications
DROP POLICY IF EXISTS "No public deletes on applications" ON public.applications;

CREATE POLICY "Admins can delete applications"
ON public.applications
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
