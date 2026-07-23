-- Deposit payments (Stripe Checkout) for landing pages that require a
-- pre-booking deposit before the application is considered committed.
-- Deposit eligibility/amount is admin-configurable per landing page rather
-- than hardcoded, mirroring every other landing-page attribute.

ALTER TABLE public.landing_pages
  ADD COLUMN deposit_required boolean NOT NULL DEFAULT false,
  ADD COLUMN deposit_amount_usd integer NOT NULL DEFAULT 420;

ALTER TABLE public.applications
  ADD COLUMN deposit_required boolean NOT NULL DEFAULT false,
  ADD COLUMN deposit_amount_usd integer,
  ADD COLUMN deposit_paid boolean NOT NULL DEFAULT false,
  ADD COLUMN deposit_paid_at timestamptz,
  ADD COLUMN stripe_checkout_session_id text;

UPDATE public.landing_pages SET deposit_required = true WHERE slug IN ('mongolia', 'transnistria');
