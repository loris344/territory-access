-- applications.deposit_required/deposit_amount_usd were only ever set by
-- create-deposit-checkout (the real Stripe path), which nothing calls today
-- (CardEntryFormPlaceholder stands in for it) — so every application so far
-- was stored with deposit_required=false regardless of the tour's actual
-- requirement, even though the applicant correctly saw the "Pay $X Deposit"
-- screen client-side. Backfill from each application's own expedition,
-- scaling the per-person deposit_amount_usd by participants (same logic as
-- create-deposit-checkout / ApplicationForm.tsx's insert going forward).
UPDATE public.applications a
SET deposit_required = true,
    deposit_amount_usd = e.deposit_amount_usd * a.participants
FROM public.expeditions e
WHERE a.expedition_id = e.id
  AND a.deposit_required = false
  AND e.deposit_required = true;
