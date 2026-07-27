-- Lower Transnistria to $1,450 (was $2,100). deposit_amount_usd recomputed
-- to stay at 30% of price_usd (see 20260726090000_deposit_as_percentage.sql);
-- price_eur kept at the same ~0.92x ratio used elsewhere (legacy column).
UPDATE public.expeditions
SET price_usd = 1450,
    price_eur = 1334,
    deposit_amount_usd = ROUND(1450 * 0.30)
WHERE slug = 'transnistria-soviet-ghost-state';
