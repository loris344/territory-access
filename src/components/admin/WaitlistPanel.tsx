import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Mail, MapPin, Users, Trash2, Clock } from "lucide-react";

type WaitlistEntry = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  nationality: string;
  number_of_people: number;
  created_at: string;
  expedition_id: string;
  expedition_name?: string;
};

const WaitlistPanel = () => {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from("waitlist")
      .select("*, expeditions!inner(name)")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch waitlist");
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
    if (!confirm("Remove from waitlist?")) return;
    const { error } = await supabase.from("waitlist").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
      return;
    }
    toast.success("Entry removed");
    fetchEntries();
  };

  return (
    <div className="mb-8 border border-border bg-card p-4 sm:p-6">
      <button
        onClick={() => setVisible(!visible)}
        className="flex items-center gap-2 font-heading text-sm tracking-wider uppercase w-full text-left"
      >
        <Clock className="w-4 h-4" />
        Waitlist ({entries.length})
        <span className="text-muted-foreground text-xs ml-auto">{visible ? "▲" : "▼"}</span>
      </button>

      {visible && (
        <div className="mt-4 space-y-3">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No waitlist entries yet.</p>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="border border-border bg-background p-4 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="font-heading text-sm tracking-wider">
                      {entry.first_name} {entry.last_name}
                    </h4>
                    <span className="font-heading text-[10px] tracking-wider uppercase px-2 py-0.5 bg-foreground/5 text-muted-foreground">
                      {entry.number_of_people} {entry.number_of_people > 1 ? "people" : "person"}
                    </span>
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
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <a href={`mailto:${entry.email}`} className="text-foreground hover:text-accent transition-colors">
                        {entry.email}
                      </a>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {entry.nationality}
                    </span>
                  </div>
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

export default WaitlistPanel;
