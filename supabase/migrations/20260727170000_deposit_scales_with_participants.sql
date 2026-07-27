-- deposit_amount_usd on expeditions is a flat, single-person figure (30% of
-- the per-person price_usd) — but nothing multiplied it by the number of
-- participants an applicant actually selects. Worse, participants was never
-- stored as data at all: ApplicationForm.tsx only stuffed it as a
-- "[N participant(s)] " text prefix into physical_condition. Add a real
-- column so create-deposit-checkout can compute the correct total deposit.
ALTER TABLE public.applications
  ADD COLUMN participants integer NOT NULL DEFAULT 1;

-- Backfill from the old text-prefix hack so existing applications keep an
-- accurate participant count in the admin view.
UPDATE public.applications
SET participants = substring(physical_condition FROM '^\[(\d+) participant')::integer
WHERE physical_condition ~ '^\[\d+ participant';

-- Strip the prefix now that it's captured properly in its own column.
UPDATE public.applications
SET physical_condition = regexp_replace(physical_condition, '^\[\d+ participant\(s\)\]\s*', '')
WHERE physical_condition ~ '^\[\d+ participant\(s\)\]';
