"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Activity, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

// One row per event sent to Meta by the meta-capi edge function (browser Pixel +
// server CAPI each go through it). Server-side ground truth, independent of Meta's
// delayed / modelled Events Manager UI.
type MetaEvent = {
  id: string;
  created_at: string;
  event_name: string | null;
  form_type: string | null;
  value: number | null;
  currency: string | null;
  content_name: string | null;
  meta_events_received: number | null;
  meta_status: number | null;
  meta_error: string | null;
};

// French labels for each trigger (the form behind the event).
const TRIGGER_FR: Record<string, string> = {
  application: "Candidature",
  info_request: "Demande de renseignement",
  waitlist: "Liste d'attente",
  notify_destination: "Notification retour",
  newsletter: "Newsletter",
};

// "29 juin 2026, 14:08:55" — uses the browser's timezone (Paris for us).
const formatFr = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const MetaEventLogPanel = () => {
  const [events, setEvents] = useState<MetaEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("meta_event_log" as any)
      .select(
        "id, created_at, event_name, form_type, value, currency, content_name, meta_events_received, meta_status, meta_error",
      )
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      toast.error("Échec du chargement des events Meta");
      setLoading(false);
      return;
    }
    setEvents((data as unknown as MetaEvent[]) || []);
    setLoading(false);
  };

  const isOk = (e: MetaEvent) =>
    e.meta_status === 200 && (e.meta_events_received ?? 0) >= 1;

  return (
    <div className="mb-8 border border-border bg-card p-4 sm:p-6">
      <button
        onClick={() => setVisible(!visible)}
        className="flex items-center gap-2 font-heading text-sm tracking-wider uppercase w-full text-left"
      >
        <Activity className="w-4 h-4" />
        Events Meta ({events.length})
        <span className="text-muted-foreground text-xs ml-auto">{visible ? "▲" : "▼"}</span>
      </button>

      {visible && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] text-muted-foreground">
              Ce qui est réellement parti à Meta (Conversions API). 1 ligne = 1 event envoyé.
            </p>
            <button
              onClick={fetchEvents}
              className="flex items-center gap-1.5 font-heading text-[10px] tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors border border-border px-3 py-1.5 flex-shrink-0"
            >
              <RefreshCw className="w-3 h-3" /> Rafraîchir
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          ) : events.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucun event pour le moment. Ils apparaîtront ici dès la première soumission de formulaire.
            </p>
          ) : (
            events.map((e) => (
              <div
                key={e.id}
                className="border border-border bg-background p-3 flex items-start justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading text-xs tracking-wider uppercase text-foreground">
                      {e.event_name || "—"}
                    </span>
                    {e.form_type && (
                      <span className="font-heading text-[9px] tracking-wider uppercase bg-accent/10 text-accent px-2 py-0.5">
                        {TRIGGER_FR[e.form_type] || e.form_type}
                      </span>
                    )}
                    {e.value != null && (
                      <span className="text-[11px] text-muted-foreground">
                        valeur {e.value} {e.currency || "USD"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{formatFr(e.created_at)}</p>
                  {e.content_name && (
                    <p className="text-[11px] text-muted-foreground/80 mt-0.5 truncate">
                      {e.content_name}
                    </p>
                  )}
                  {!isOk(e) && e.meta_error && (
                    <p className="text-[11px] text-destructive mt-1 truncate" title={e.meta_error}>
                      {e.meta_error}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {isOk(e) ? (
                    <span
                      className="flex items-center gap-1 text-[10px] font-heading tracking-wider uppercase text-foreground/70"
                      title="Reçu par Meta"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Reçu
                    </span>
                  ) : (
                    <span
                      className="flex items-center gap-1 text-[10px] font-heading tracking-wider uppercase text-destructive"
                      title={`Statut ${e.meta_status ?? "?"}`}
                    >
                      <AlertCircle className="w-3.5 h-3.5" /> Échec
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MetaEventLogPanel;
