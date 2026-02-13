import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Plus, Edit2, Trash2, Upload, Save } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Expedition = Tables<"expeditions"> & {
  country?: string;
  coordinates?: number[];
  capacity_max?: number;
  spots_taken?: number;
  price_usd?: number;
  intensity_type?: string;
  difficulty_level?: string;
  expedition_status?: string;
};

const Admin = () => {
  const navigate = useNavigate();
  const [expeditions, setExpeditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchExpeditions();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/admin/login");
      return;
    }
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");
    if (!roles || roles.length === 0) {
      navigate("/admin/login");
    }
  };

  const fetchExpeditions = async () => {
    const { data, error } = await supabase
      .from("expeditions")
      .select("*")
      .order("start_date", { ascending: true });
    if (error) {
      toast.error("Failed to fetch expeditions");
      return;
    }
    setExpeditions(data || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const startEdit = (exp: any) => {
    setEditing(exp.id);
    setEditData({ ...exp });
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditData({});
  };

  const saveEdit = async () => {
    const { id, created_at, ...updateData } = editData;
    const { error } = await supabase
      .from("expeditions")
      .update(updateData)
      .eq("id", editing!);
    if (error) {
      toast.error("Failed to save: " + error.message);
      return;
    }
    toast.success("Expedition updated!");
    setEditing(null);
    fetchExpeditions();
  };

  const handleImageUpload = async (expId: string, file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${expId}.${ext}`;

    // Delete old image if exists
    await supabase.storage.from("expedition-images").remove([path]);

    const { error: uploadError } = await supabase.storage
      .from("expedition-images")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast.error("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("expedition-images")
      .getPublicUrl(path);

    // Add cache-busting param to force browsers to reload the new image
    const imageUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from("expeditions")
      .update({ hero_image_url: imageUrl })
      .eq("id", expId);

    if (updateError) {
      toast.error("Failed to update image URL");
    } else {
      toast.success("Image uploaded!");
      fetchExpeditions();
    }
    setUploading(false);
  };

  const deleteExpedition = async (id: string) => {
    if (!confirm("Delete this expedition? This cannot be undone.")) return;
    const { error } = await supabase.from("expeditions").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete: " + error.message);
      return;
    }
    toast.success("Expedition deleted");
    fetchExpeditions();
  };

  const createExpedition = async () => {
    const slug = `new-expedition-${Date.now()}`;
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("expeditions")
      .insert({
        name: "New Expedition",
        slug,
        location: "Location",
        country: "",
        intensity_level: "Medium",
        intensity_type: "mountain",
        difficulty_level: "medium",
        short_description: "Short description",
        long_description: "Full description",
        duration_days: 7,
        start_date: today,
        end_date: today,
        price_eur: 0,
        price_usd: 0,
        status: "closed",
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to create: " + error.message);
      return;
    }
    toast.success("Expedition created! Edit it below.");
    fetchExpeditions();
    if (data) {
      startEdit(data);
    }
  };

  const statusOptions = ["open", "limited", "closed", "cancelled", "postponed"];
  const intensityLevelOptions = ["Easy", "Medium", "Hard", "Extreme"];
  const intensityTypeOptions = ["mountain", "desert", "psychological", "isolation", "polar", "jungle", "nomadic", "political", "historical", "post-conflict", "altitude"];
  const continentOptions = ["Europe", "Asia", "Africa", "Americas", "Oceania", "Middle East", "Central Asia", "Caucasus"];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-heading text-sm tracking-wider uppercase text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="font-heading text-lg tracking-wider uppercase">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 font-heading text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-sm tracking-wider uppercase text-muted-foreground">
            {expeditions.length} Expeditions
          </h2>
          <button
            onClick={createExpedition}
            className="flex items-center gap-2 font-heading text-xs tracking-wider uppercase px-5 py-2.5 bg-accent text-accent-foreground hover:bg-accent/90 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Expedition
          </button>
        </div>

        <div className="space-y-4">
          {expeditions.map((exp) => (
            <div key={exp.id} className="border border-border bg-card p-4 sm:p-6">
              {editing === exp.id ? (
                /* Edit mode */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-heading text-[10px] tracking-wider uppercase text-muted-foreground block mb-1">Name</label>
                      <input
                        value={editData.name || ""}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border text-foreground text-sm"
                      />
                    </div>
                    <div>
                      <label className="font-heading text-[10px] tracking-wider uppercase text-muted-foreground block mb-1">Status</label>
                      <select
                        value={editData.status || "open"}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border text-foreground text-sm"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-heading text-[10px] tracking-wider uppercase text-muted-foreground block mb-1">Location</label>
                      <input
                        value={editData.location || ""}
                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border text-foreground text-sm"
                      />
                    </div>
                    <div>
                      <label className="font-heading text-[10px] tracking-wider uppercase text-muted-foreground block mb-1">Country</label>
                      <input
                        value={editData.country || ""}
                        onChange={(e) => setEditData({ ...editData, country: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border text-foreground text-sm"
                      />
                    </div>
                    <div>
                      <label className="font-heading text-[10px] tracking-wider uppercase text-muted-foreground block mb-1">Continent</label>
                      <select
                        value={editData.continent || ""}
                        onChange={(e) => setEditData({ ...editData, continent: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border text-foreground text-sm"
                      >
                        <option value="">Select continent</option>
                        {continentOptions.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-heading text-[10px] tracking-wider uppercase text-muted-foreground block mb-1">Price (USD)</label>
                      <input
                        type="number"
                        value={editData.price_usd || 0}
                        onChange={(e) => setEditData({ ...editData, price_usd: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-background border border-border text-foreground text-sm"
                      />
                    </div>
                    <div>
                      <label className="font-heading text-[10px] tracking-wider uppercase text-muted-foreground block mb-1">Price (EUR)</label>
                      <input
                        type="number"
                        value={editData.price_eur || 0}
                        onChange={(e) => setEditData({ ...editData, price_eur: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-background border border-border text-foreground text-sm"
                      />
                    </div>
                    <div>
                      <label className="font-heading text-[10px] tracking-wider uppercase text-muted-foreground block mb-1">Start Date</label>
                      <input
                        type="date"
                        value={editData.start_date || ""}
                        onChange={(e) => setEditData({ ...editData, start_date: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border text-foreground text-sm"
                      />
                    </div>
                    <div>
                      <label className="font-heading text-[10px] tracking-wider uppercase text-muted-foreground block mb-1">End Date</label>
                      <input
                        type="date"
                        value={editData.end_date || ""}
                        onChange={(e) => setEditData({ ...editData, end_date: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border text-foreground text-sm"
                      />
                    </div>
                    <div>
                      <label className="font-heading text-[10px] tracking-wider uppercase text-muted-foreground block mb-1">Duration (days)</label>
                      <input
                        type="number"
                        value={editData.duration_days || 0}
                        onChange={(e) => setEditData({ ...editData, duration_days: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-background border border-border text-foreground text-sm"
                      />
                    </div>
                    <div>
                      <label className="font-heading text-[10px] tracking-wider uppercase text-muted-foreground block mb-1">Intensity Level</label>
                      <select
                        value={editData.intensity_level || "Medium"}
                        onChange={(e) => setEditData({ ...editData, intensity_level: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border text-foreground text-sm"
                      >
                        {intensityLevelOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-heading text-[10px] tracking-wider uppercase text-muted-foreground block mb-1">Theme</label>
                      <select
                        value={editData.intensity_type || ""}
                        onChange={(e) => setEditData({ ...editData, intensity_type: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border text-foreground text-sm"
                      >
                        {intensityTypeOptions.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-heading text-[10px] tracking-wider uppercase text-muted-foreground block mb-1">Max Capacity</label>
                      <input
                        type="number"
                        value={editData.capacity_max || 12}
                        onChange={(e) => setEditData({ ...editData, capacity_max: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-background border border-border text-foreground text-sm"
                      />
                    </div>
                    <div>
                      <label className="font-heading text-[10px] tracking-wider uppercase text-muted-foreground block mb-1">Spots Taken</label>
                      <input
                        type="number"
                        value={editData.spots_taken || 0}
                        onChange={(e) => setEditData({ ...editData, spots_taken: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-background border border-border text-foreground text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-heading text-[10px] tracking-wider uppercase text-muted-foreground block mb-1">Short Description</label>
                    <textarea
                      value={editData.short_description || ""}
                      onChange={(e) => setEditData({ ...editData, short_description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 bg-background border border-border text-foreground text-sm"
                    />
                  </div>
                  <div>
                    <label className="font-heading text-[10px] tracking-wider uppercase text-muted-foreground block mb-1">Long Description</label>
                    <textarea
                      value={editData.long_description || ""}
                      onChange={(e) => setEditData({ ...editData, long_description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 bg-background border border-border text-foreground text-sm"
                    />
                  </div>
                  <div>
                    <label className="font-heading text-[10px] tracking-wider uppercase text-muted-foreground block mb-1">Storytelling</label>
                    <p className="text-[10px] text-muted-foreground mb-1">Narrative text shown on the detail page. Use double line breaks to separate paragraphs.</p>
                    <textarea
                      value={editData.storytelling || ""}
                      onChange={(e) => setEditData({ ...editData, storytelling: e.target.value })}
                      rows={8}
                      placeholder="Tell the story of this expedition... Why this place? What makes it unique? What will participants experience?"
                      className="w-full px-3 py-2 bg-background border border-border text-foreground text-sm"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={saveEdit} className="flex items-center gap-2 font-heading text-xs tracking-wider uppercase px-6 py-3 bg-accent text-accent-foreground hover:bg-accent/90 transition-all">
                      <Save className="w-3.5 h-3.5" /> Save
                    </button>
                    <button onClick={cancelEdit} className="font-heading text-xs tracking-wider uppercase px-6 py-3 border border-border text-muted-foreground hover:text-foreground transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View mode */
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Thumbnail */}
                  <div className="w-full sm:w-32 h-20 bg-secondary flex-shrink-0 overflow-hidden relative group">
                    {exp.hero_image_url ? (
                      <img src={exp.hero_image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <span className="font-heading text-[9px] tracking-wider uppercase">No image</span>
                      </div>
                    )}
                    <label className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <Upload className="w-4 h-4 text-foreground" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(exp.id, file);
                        }}
                      />
                    </label>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-heading text-sm tracking-wider">{exp.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {exp.continent && <span className="text-accent">{exp.continent}</span>}{exp.continent && " · "}{exp.country} · {exp.location} · {exp.duration_days} days
                        </p>
                      </div>
                      <span className={`font-heading text-[10px] tracking-wider uppercase px-2 py-0.5 flex-shrink-0 ${
                        exp.status === "open" ? "bg-foreground/10 text-foreground" :
                        exp.status === "limited" ? "bg-accent/10 text-accent" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {exp.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-1">{exp.short_description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => startEdit(exp)}
                      className="p-2 border border-border hover:border-foreground transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteExpedition(exp.id)}
                      className="p-2 border border-border hover:border-destructive hover:text-destructive transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
