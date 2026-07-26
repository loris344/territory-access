-- Deposit switches from a flat $420 to 30% of each tour's own price, so it
-- scales correctly per tour instead of being the same amount regardless of
-- trip cost. Still stored as a plain dollar amount (same column, same
-- consumers downstream in the checkout function/admin panel) - just
-- recomputed here from price_usd instead of defaulting to 420.
UPDATE public.expeditions
SET deposit_amount_usd = ROUND(price_usd * 0.30)
WHERE price_usd > 0;

ALTER TABLE public.expeditions
  ALTER COLUMN deposit_amount_usd SET DEFAULT 0;
