import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Mail, Phone, MapPin, User, FileText, Trash2 } from "lucide-react";

type Application = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  nationality: string;
  physical_condition: string;
  motivation_text: string;
  status: string;
  created_at: string;
  expedition_id: string;
  expedition_name?: string;
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600",
  accepted: "bg-green-500/10 text-green-600",
  rejected: "bg-destructive/10 text-destructive",
  waitlist: "bg-blue-500/10 text-blue-600",
};

const ApplicationsPanel = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from("applications")
      .select("*, expeditions!applications_expedition_id_fkey(name)")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch applications");
      setLoading(false);
      return;
    }

    const mapped = (data || []).map((a: any) => ({
      ...a,
      expedition_name: a.expeditions?.name || "Unknown",
    }));
    setApplications(mapped);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("applications")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status: " + error.message);
      return;
    }
    toast.success(`Status updated to ${newStatus}`);
    fetchApplications();
  };

  const deleteApplication = async (id: string) => {
    if (!confirm("Delete this application?")) return;
    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete: " + error.message);
      return;
    }
    toast.success("Application deleted");
    fetchApplications();
  };

  return (
    <div className="mb-8 border border-border bg-card p-4 sm:p-6">
      <button
        onClick={() => setVisible(!visible)}
        className="flex items-center gap-2 font-heading text-sm tracking-wider uppercase w-full text-left"
      >
        <FileText className="w-4 h-4" />
        Applications ({applications.length})
        <span className="text-muted-foreground text-xs ml-auto">{visible ? "▲" : "▼"}</span>
      </button>

      {visible && (
        <div className="mt-4 space-y-3">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : applications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No applications yet.</p>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="border border-border bg-background p-4">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                  >
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="font-heading text-sm tracking-wider">
                        {app.first_name} {app.last_name}
                      </h4>
                      <span className={`font-heading text-[10px] tracking-wider uppercase px-2 py-0.5 ${statusColors[app.status] || "bg-muted text-muted-foreground"}`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-accent">{app.expedition_name}</span>
                      {" · "}
                      {new Date(app.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteApplication(app.id); }}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {expanded === app.id ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {expanded === app.id && (
                  <div className="mt-4 space-y-4 border-t border-border pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-3.5 h-3.5" />
                        <a href={`mailto:${app.email}`} className="text-foreground hover:text-accent transition-colors">
                          {app.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-3.5 h-3.5" />
                        <span className="text-foreground">{app.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-foreground">{app.nationality}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-3.5 h-3.5" />
                        <span className="text-foreground">{app.physical_condition}</span>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-heading text-[10px] tracking-wider uppercase text-muted-foreground mb-2">
                        Motivation
                      </h5>
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                        {app.motivation_text}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      {["pending", "accepted", "rejected", "waitlist"].map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(app.id, s)}
                          className={`font-heading text-[10px] tracking-wider uppercase px-3 py-1.5 border transition-colors ${
                            app.status === s
                              ? "border-accent bg-accent text-accent-foreground"
                              : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPanel;
