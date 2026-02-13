
CREATE TABLE public.expedition_gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expedition_id UUID NOT NULL REFERENCES public.expeditions(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.expedition_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gallery images are publicly readable" ON public.expedition_gallery FOR SELECT USING (true);
CREATE POLICY "Admins can insert gallery images" ON public.expedition_gallery FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update gallery images" ON public.expedition_gallery FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete gallery images" ON public.expedition_gallery FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
