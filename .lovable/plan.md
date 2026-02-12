

# Security Review -- Ligne Rouge Tours

## Critical Issues (to fix immediately)

### 1. Applications table: personal data exposed (CRITICAL)
The `applications` table stores highly sensitive personal data (email, phone, name, nationality, LinkedIn, physical condition, motivation). Currently:
- **No SELECT policy** exists, meaning with the right query, anyone could read all applicant data.
- The INSERT policy uses `WITH CHECK (true)`, allowing unrestricted inserts (spam/abuse risk).

**Fix:** Add restrictive RLS policies:
- Block all SELECT, UPDATE, DELETE for anonymous users
- Optionally restrict SELECT to authenticated admins only

### 2. Application form has no server-side validation
The `Apply.tsx` form has a `TODO` comment instead of actually inserting into the database. When this is connected, there is:
- No input validation (email format, phone format, text length limits)
- No rate limiting or spam protection
- No sanitization of user inputs before database insertion

**Fix:** Add Zod schema validation on the client side, and consider an edge function for server-side validation with rate limiting.

---

## Warnings (should fix)

### 3. Missing explicit deny policies on content tables
The tables `expeditions`, `expedition_days_itinerary`, `expedition_inclusions`, and `expedition_exclusions` have public SELECT policies (which is fine for a public site), but no explicit INSERT/UPDATE/DELETE deny policies. While these operations are blocked by default when no permissive policy exists, adding explicit restrictive policies is a best practice.

**Fix:** Add explicit deny policies for INSERT, UPDATE, DELETE on all four content tables.

### 4. No authentication system
There is no admin authentication in the project. This means:
- No way to manage applications securely
- No admin panel to review submissions
- If admin features are added later without proper auth, data could be exposed

**Fix:** When ready to add admin features, implement proper authentication with role-based access.

### 5. No foreign key constraint on applications.expedition_id
The `applications.expedition_id` column references no foreign key, meaning someone could submit an application with a fake expedition ID.

**Fix:** Add a foreign key constraint: `applications.expedition_id -> expeditions.id`.

---

## Implementation Plan

### Step 1: Lock down the applications table
```sql
-- Remove the overly permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can submit an application" ON applications;

-- Create a more controlled INSERT policy (still public but with basic checks)
CREATE POLICY "Anyone can submit an application"
  ON applications FOR INSERT
  WITH CHECK (
    length(email) > 0 AND
    length(first_name) > 0 AND
    length(last_name) > 0 AND
    length(phone) > 0 AND
    status = 'pending'
  );

-- Explicitly deny SELECT, UPDATE, DELETE for non-admins
CREATE POLICY "No public reads on applications"
  ON applications FOR SELECT
  USING (false);

CREATE POLICY "No public updates on applications"
  ON applications FOR UPDATE
  USING (false);

CREATE POLICY "No public deletes on applications"
  ON applications FOR DELETE
  USING (false);
```

### Step 2: Add deny policies on content tables
```sql
-- Expeditions
CREATE POLICY "No public inserts on expeditions"
  ON expeditions FOR INSERT WITH CHECK (false);
CREATE POLICY "No public updates on expeditions"
  ON expeditions FOR UPDATE USING (false);
CREATE POLICY "No public deletes on expeditions"
  ON expeditions FOR DELETE USING (false);

-- Same pattern for itinerary, inclusions, exclusions tables
```

### Step 3: Add foreign key constraint
```sql
ALTER TABLE applications
  ADD CONSTRAINT fk_applications_expedition
  FOREIGN KEY (expedition_id) REFERENCES expeditions(id);
```

### Step 4: Add client-side input validation
Update `Apply.tsx` to:
- Add Zod schema validation for email format, phone format, text length limits
- Sanitize inputs before submission
- Actually connect to the database for insertion
- Add error handling and user feedback

### Step 5: Connect the form to the database
Update the `handleSubmit` function to insert into the `applications` table using the database client, with proper error handling.

---

## Summary

| Issue | Severity | Effort |
|-------|----------|--------|
| Applications data publicly readable | Critical | Low |
| No input validation on application form | Critical | Medium |
| Missing deny policies on content tables | Warning | Low |
| No authentication system | Warning | Medium |
| Missing foreign key constraint | Warning | Low |

