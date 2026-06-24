"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Phone, Trash2, MessageCircle } from "lucide-react";

type InfoRequest = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  created_at: string;
  expedition_id: string | null;
  expedition_name?: string;
};

const InfoRequestsPanel = () => {
  const [entries, setEntries] = useState<InfoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from("tour_info_requests")
      .select("*, expeditions(name)")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch info requests");
      setLoading(false);
      return;
    }

    const mapped = (data || []).map((w: any) => ({
      ...w,
      expedition_name: w.expeditions?.name || "Unknown",
    }));
    setEntries(mapped);
    setLoading(false);
  };

  const deleteEntry = async (id: string) => {
    if (!confirm("Delete this info request?")) return;
    const { error } = await supabase.from("tour_info_requests").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
      return;
    }
    toast.success("Deleted");
    fetchEntries();
  };

  return (
    <div className="mb-8 border border-border bg-card p-4 sm:p-6">
      <button
        onClick={() => setVisible(!visible)}
        className="flex items-center gap-2 font-heading text-sm tracking-wider uppercase w-full text-left"
      >
        <MessageCircle className="w-4 h-4" />
        Info Requests ({entries.length})
        <span className="text-muted-foreground text-xs ml-auto">{visible ? "▲" : "▼"}</span>
      </button>

      {visible && (
        <div className="mt-4 space-y-3">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No info requests yet.</p>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="border border-border bg-background p-4 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="font-heading text-sm tracking-wider">
                      {entry.first_name} {entry.last_name}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-accent">{entry.expedition_name}</span>
                    {" · "}
                    {new Date(entry.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <a href={`mailto:${entry.email}`} className="text-foreground hover:text-accent transition-colors">
                        {entry.email}
                      </a>
                    </span>
                    {entry.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <a href={`tel:${entry.phone}`} className="text-foreground hover:text-accent transition-colors">
                          {entry.phone}
                        </a>
                      </span>
                    )}
                  </div>
                  {entry.message && (
                    <p className="body-text text-sm text-foreground/90 mt-3 whitespace-pre-wrap border-l-2 border-border pl-3">
                      {entry.message}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="p-1 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default InfoRequestsPanel;
