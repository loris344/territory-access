-- Site-wide copy pass: tone down wording that reads like a security/crisis
-- operation rather than a travel expedition (user feedback: "risk assessment",
-- "field intelligence", "crisis logistics" makes the trips sound
-- life-threatening, not adventurous). This migration handles the
-- database-driven copy; the equivalent hardcoded team bios and FAQ answer
-- were fixed directly in the codebase in the same commit.
--
-- Kashmir's guide bio was the most extreme example: "Field operations lead.
-- 10+ expeditions in conflict-adjacent regions. Fluent in crisis logistics."
-- reads like a war correspondent's résumé. Reworded to the same real
-- credential (10+ trips, deep local knowledge) without the crisis framing.
-- Also softened one promise bullet ("feel the tension firsthand" ->
-- "understand their daily reality firsthand").

UPDATE public.landing_pages
SET led_by_bio = 'Expedition guide with 10+ trips through Kashmir''s mountains and valleys. Deep local knowledge, from mountain passes to permits and border logistics.'
WHERE slug = 'kashmir';

UPDATE public.landing_pages
SET promise_bullets = '[{"title": "Push your limits", "desc": "High-altitude treks, real terrain, real effort. You will discover what you''re capable of."}, {"title": "A story no one else has", "desc": "The Line of Control, Kashmiri villages, mountain passes: experiences that can''t be bought on a booking platform."}, {"title": "See the world differently", "desc": "You won''t observe from a distance. You will sit with locals and understand their daily reality firsthand."}, {"title": "Come back transformed", "desc": "Every participant leaves Kashmir with a sharper perspective, a deeper confidence, and a sense of having truly lived."}]'::jsonb
WHERE slug = 'kashmir';
