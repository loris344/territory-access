
-- Drop the restrictive insert policy and recreate as permissive
DROP POLICY IF EXISTS "Controlled application insert" ON public.applications;

CREATE POLICY "Controlled application insert"
ON public.applications
FOR INSERT
TO anon, authenticated
WITH CHECK (
  (length(email) > 0) AND 
  (length(first_name) > 0) AND 
  (length(last_name) > 0) AND 
  (length(phone) > 0) AND 
  (status = 'pending'::text)
);
