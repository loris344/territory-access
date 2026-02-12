
-- Step 1: Lock down applications table
DROP POLICY IF EXISTS "Anyone can submit an application" ON applications;

CREATE POLICY "Controlled application insert"
  ON applications FOR INSERT
  WITH CHECK (
    length(email) > 0 AND
    length(first_name) > 0 AND
    length(last_name) > 0 AND
    length(phone) > 0 AND
    status = 'pending'
  );

CREATE POLICY "No public reads on applications"
  ON applications FOR SELECT
  USING (false);

CREATE POLICY "No public updates on applications"
  ON applications FOR UPDATE
  USING (false);

CREATE POLICY "No public deletes on applications"
  ON applications FOR DELETE
  USING (false);

-- Step 2: Deny write policies on content tables
CREATE POLICY "No public inserts on expeditions"
  ON expeditions FOR INSERT WITH CHECK (false);
CREATE POLICY "No public updates on expeditions"
  ON expeditions FOR UPDATE USING (false);
CREATE POLICY "No public deletes on expeditions"
  ON expeditions FOR DELETE USING (false);

CREATE POLICY "No public inserts on expedition_days_itinerary"
  ON expedition_days_itinerary FOR INSERT WITH CHECK (false);
CREATE POLICY "No public updates on expedition_days_itinerary"
  ON expedition_days_itinerary FOR UPDATE USING (false);
CREATE POLICY "No public deletes on expedition_days_itinerary"
  ON expedition_days_itinerary FOR DELETE USING (false);

CREATE POLICY "No public inserts on expedition_inclusions"
  ON expedition_inclusions FOR INSERT WITH CHECK (false);
CREATE POLICY "No public updates on expedition_inclusions"
  ON expedition_inclusions FOR UPDATE USING (false);
CREATE POLICY "No public deletes on expedition_inclusions"
  ON expedition_inclusions FOR DELETE USING (false);

CREATE POLICY "No public inserts on expedition_exclusions"
  ON expedition_exclusions FOR INSERT WITH CHECK (false);
CREATE POLICY "No public updates on expedition_exclusions"
  ON expedition_exclusions FOR UPDATE USING (false);
CREATE POLICY "No public deletes on expedition_exclusions"
  ON expedition_exclusions FOR DELETE USING (false);

-- Step 3: Foreign key constraint
ALTER TABLE applications
  ADD CONSTRAINT fk_applications_expedition
  FOREIGN KEY (expedition_id) REFERENCES expeditions(id);
