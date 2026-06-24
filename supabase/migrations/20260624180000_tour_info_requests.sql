-- "Want to know more" form on each tour: a softer lead than an application,
-- for people who want info about a specific expedition. Public insert, admin
-- read/delete, and a Telegram alert on every new request (reuses notify_telegram).

CREATE TABLE public.tour_info_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expedition_id UUID REFERENCES public.expeditions(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tour_info_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can submit (basic sanity check on name + email). No public read.
CREATE POLICY "Public tour info request"
ON public.tour_info_requests
FOR INSERT
WITH CHECK (
  length(first_name) > 0
  AND length(email) > 3
  AND position('@' in email) > 1
);

-- Admins can read
CREATE POLICY "Admins can read tour_info_requests"
ON public.tour_info_requests
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete
CREATE POLICY "Admins can delete tour_info_requests"
ON public.tour_info_requests
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Telegram alert on every new info request.
CREATE OR REPLACE FUNCTION public.tg_notify_tour_info_request()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE exp_name text;
BEGIN
  SELECT name INTO exp_name FROM public.expeditions WHERE id = NEW.expedition_id;
  PERFORM public.notify_telegram(
    '❓ New tour info request' || chr(10) ||
    'Name: '       || coalesce(NEW.first_name, '') || ' ' || coalesce(NEW.last_name, '') || chr(10) ||
    'Email: '      || coalesce(NEW.email, '-') || chr(10) ||
    'Phone: '      || coalesce(NEW.phone, '-') || chr(10) ||
    'Expedition: ' || coalesce(exp_name, '-') || chr(10) ||
    'Message: '    || coalesce(NEW.message, '-')
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'tg_notify_tour_info_request failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tg_notify_tour_info_request ON public.tour_info_requests;
CREATE TRIGGER tg_notify_tour_info_request AFTER INSERT ON public.tour_info_requests
  FOR EACH ROW EXECUTE FUNCTION public.tg_notify_tour_info_request();
