-- Server-side audit log of every conversion event the site sends to Meta via the
-- meta-capi edge function. Gives an exact, timestamped, queryable ground-truth
-- record (event name, form_type, Meta's response) independent of Meta's opaque,
-- delayed, modelled Events Manager UI. No raw PII is stored.

CREATE TABLE IF NOT EXISTS public.meta_event_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  event_name text,
  form_type text,
  value numeric,
  currency text,
  content_name text,
  event_id text,
  event_source_url text,
  client_ip text,
  meta_events_received integer,
  meta_status integer,
  meta_error text
);

CREATE INDEX IF NOT EXISTS meta_event_log_created_at_idx
  ON public.meta_event_log (created_at DESC);

ALTER TABLE public.meta_event_log ENABLE ROW LEVEL SECURITY;

-- Admins can read it (the edge function inserts via the service role, bypassing RLS).
DROP POLICY IF EXISTS "Admins can read meta_event_log" ON public.meta_event_log;
CREATE POLICY "Admins can read meta_event_log"
  ON public.meta_event_log
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));
