-- Landing pages as a real, admin-editable resource (mirrors how normal tours
-- work: a table + admin CRUD + a dynamic route), instead of one-off
-- hand-coded React views per campaign. Shared tour facts (price, dates,
-- itinerary, inclusions, gallery) stay on `expeditions` and are read live via
-- expedition_id — a landing page only owns its own marketing wrapper
-- (headline, trust signals, testimonials, "led by", extra trust photos).

CREATE TABLE public.landing_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  expedition_id uuid NOT NULL REFERENCES public.expeditions(id) ON DELETE CASCADE,
  is_published boolean NOT NULL DEFAULT true,
  tagline text NOT NULL DEFAULT '',
  headline text NOT NULL DEFAULT '',
  subheadline text NOT NULL DEFAULT '',
  hero_image_url text,
  trust_signals jsonb NOT NULL DEFAULT '[]'::jsonb,
  promise_intro text NOT NULL DEFAULT '',
  promise_bullets jsonb NOT NULL DEFAULT '[]'::jsonb,
  testimonials jsonb NOT NULL DEFAULT '[]'::jsonb,
  led_by_name text NOT NULL DEFAULT '',
  led_by_bio text NOT NULL DEFAULT '',
  led_by_image_url text,
  gallery_trust_images jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published landing pages are publicly readable"
  ON public.landing_pages FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can read all landing pages"
  ON public.landing_pages FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert landing pages"
  ON public.landing_pages FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update landing pages"
  ON public.landing_pages FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete landing pages"
  ON public.landing_pages FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed: migrate the existing hand-coded Kashmir landing page content as-is,
-- and add starter pages for Transnistria + Mongolia (headline/trust copy
-- filled in; testimonials/led-by left empty for the admin to fill in with
-- real content rather than fabricating new placeholder people).
INSERT INTO public.landing_pages
  (slug, expedition_id, tagline, headline, subheadline, hero_image_url,
   trust_signals, promise_intro, promise_bullets, testimonials,
   led_by_name, led_by_bio, led_by_image_url, gallery_trust_images)
VALUES
  ('kashmir',
   (SELECT id FROM public.expeditions WHERE slug = 'indian-kashmir-line-of-control'),
   'Limited access expedition', 'Indian Kashmir', 'Line of Control',
   'https://hyeqshzcujnupxxeocfy.supabase.co/storage/v1/object/public/expedition-images/a0000001-0000-0000-0000-000000000010.webp?t=1771291609044',
   $$[
     {"icon": "Shield", "title": "Safe, civilian areas", "desc": "Real immersion, thoughtfully planned, never reckless."},
     {"icon": "Users", "title": "Small groups", "desc": "Max 10-12 participants, carefully selected by application."},
     {"icon": "Mountain", "title": "Physical commitment", "desc": "High-altitude trekking, 5-6h walks. Real terrain, real effort."}
   ]$$::jsonb,
   $$You will walk trails few travelers ever see. You will meet people building a life in one of the most contested valleys on Earth. You will push your limits at altitude, far from your comfort zone. And you will come home with a story that's entirely your own.$$,
   $$[
     {"title": "Push your limits", "desc": "High-altitude treks, real terrain, real effort. You will discover what you're capable of."},
     {"title": "A story no one else has", "desc": "The Line of Control, Kashmiri villages, mountain passes: experiences that can't be bought on a booking platform."},
     {"title": "See the world differently", "desc": "You won't observe from a distance. You will sit with locals, understand their reality, and feel the tension firsthand."},
     {"title": "Come back transformed", "desc": "Every participant leaves Kashmir with a sharper perspective, a deeper confidence, and a sense of having truly lived."}
   ]$$::jsonb,
   $$[
     {"name": "Tony M.", "detail": "UK - Expedition 2025", "quote": "Walking along the Line of Control, meeting Kashmiris who live there every day, that changes you. You come back with a story no one else can tell.", "image_url": "/assets/trust-tony.webp"},
     {"name": "Mary D.", "detail": "Journalist - Canada", "quote": "The security briefings, the local contacts, the mountain treks: everything was planned to the detail. I felt safe in places I never imagined visiting.", "image_url": "/assets/trust-mary.webp"},
     {"name": "Brittany L.", "detail": "USA - Expedition 2024", "quote": "I came for the adventure, I left with a completely different perspective. The team knows this region inside out.", "image_url": "/assets/trust-brittany.webp"}
   ]$$::jsonb,
   'Gaëtan', 'Field operations lead. 10+ expeditions in conflict-adjacent regions. Fluent in crisis logistics.', '/assets/gaetan.webp',
   $$["/assets/trust-groupe.webp", "/assets/trust-tony.webp", "/assets/trust-brittany.webp", "/assets/trust-mary.webp", "/assets/trust-groupe2.webp"]$$::jsonb
  ),

  ('transnistria',
   (SELECT id FROM public.expeditions WHERE slug = 'transnistria-soviet-ghost-state'),
   'Limited access expedition', 'Transnistria', 'A Soviet Time Capsule',
   NULL,
   $$[
     {"icon": "Shield", "title": "Legally straightforward", "desc": "Border registration handled by our local fixer, every time."},
     {"icon": "Users", "title": "Small groups", "desc": "Max 14 participants, carefully selected by application."},
     {"icon": "MapPin", "title": "Two countries, one trip", "desc": "Moldova's capital and wine country, then a Soviet-era state frozen in time."}
   ]$$::jsonb,
   $$You will walk through a country that, officially, doesn't exist. You will taste wine from cellars carved decades ago, and streets where the Soviet Union never quite ended. And you will come home with a story only a handful of travelers can tell.$$,
   $$[
     {"title": "An unrecognized state", "desc": "Tiraspol and Bender: Soviet monuments, a real economy, a real government, recognized by almost no one."},
     {"title": "Moldova's wine country", "desc": "Some of the largest underground wine cellars on Earth, carved kilometers into the rock."},
     {"title": "A story no one else has", "desc": "Very few travelers can say they've set foot in Transnistria."},
     {"title": "Handled, start to finish", "desc": "Border registration, local guides, and logistics arranged by our team on the ground."}
   ]$$::jsonb,
   '[]'::jsonb,
   '', '', NULL,
   '[]'::jsonb
  ),

  ('mongolia',
   (SELECT id FROM public.expeditions WHERE slug = 'altai-mongolia-eagle-hunters'),
   'Limited access expedition', 'Altai Mongolia', 'Among the Eagle Hunters',
   NULL,
   $$[
     {"icon": "Shield", "title": "Real, not staged", "desc": "A genuine nomadic family, not a tourist performance."},
     {"icon": "Users", "title": "Small groups", "desc": "Max 10 participants, carefully selected by application."},
     {"icon": "Mountain", "title": "Real physical effort", "desc": "Long days on horseback, real terrain, real fatigue."}
   ]$$::jsonb,
   $$You will ride for hours across open steppe. You will sleep in a family's ger, not a hotel. You will watch an eagle and its hunter work together in a tradition centuries old. And you will come home with a story that's entirely your own.$$,
   $$[
     {"title": "A living tradition", "desc": "Kazakh eagle hunting, passed down through generations, not performed for tourists."},
     {"title": "Real nomadic life", "desc": "Gathering wood and water, traditional cooking, nights without modern comfort."},
     {"title": "Push your limits", "desc": "Long days on horseback across open terrain. Real physical effort, real fatigue."},
     {"title": "Come back transformed", "desc": "Every participant leaves the Altai with a sharper perspective and a deeper confidence."}
   ]$$::jsonb,
   '[]'::jsonb,
   '', '', NULL,
   '[]'::jsonb
  );
