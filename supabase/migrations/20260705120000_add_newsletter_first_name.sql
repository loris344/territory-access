-- The newsletter signup now also collects a first name (required on the form).
-- Nullable so existing subscribers are unaffected.
alter table public.newsletter_subscribers
  add column if not exists first_name text;
