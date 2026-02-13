
ALTER TABLE public.expeditions
ADD COLUMN storytelling TEXT;

COMMENT ON COLUMN public.expeditions.storytelling IS 'Rich narrative storytelling text for the expedition detail page';
