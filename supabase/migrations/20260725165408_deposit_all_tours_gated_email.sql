-- Deposit is no longer a landing-page-only thing: it now applies to every
-- expedition (default on, $420), admin-editable per tour to turn off if
-- ever needed. Supersedes the landing_pages-scoped columns.
ALTER TABLE public.expeditions
  ADD COLUMN deposit_required boolean NOT NULL DEFAULT true,
  ADD COLUMN deposit_amount_usd integer NOT NULL DEFAULT 420;

ALTER TABLE public.landing_pages
  DROP COLUMN deposit_required,
  DROP COLUMN deposit_amount_usd;

-- The applicant "Application Received" email (and the admin notification)
-- should only go out once the deposit step is actually completed, not the
-- instant the initial form is inserted — otherwise the confirmation lies
-- about the application being processed. Email sending moves to explicit
-- calls from the deposit flow instead of firing on every INSERT.
DROP TRIGGER IF EXISTS on_new_application_notify ON public.applications;
DROP FUNCTION IF EXISTS public.notify_new_application();
