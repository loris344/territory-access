"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Plus, Edit2, Trash2, Upload, Save, Image, X, Images, ChevronLeft, ChevronRight, Calendar, Download } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { downloadImage } from "@/lib/utils";
import ApplicationsPanel from "@/components/admin/ApplicationsPanel";
import WaitlistPanel from "@/components/admin/WaitlistPanel";
import InfoRequestsPanel from "@/components/admin/InfoRequestsPanel";
import MetaEventLogPanel from "@/components/admin/MetaEventLogPanel";
import LandingPagesPanel from "@/components/admin/LandingPagesPanel";


const DateRow = ({ dateRow, expId, onUpdate, onDelete, statusOptions }: {
  dateRow: any;
  expId: string;
  onUpdate: (id: string, field: string, value: any, expId: string) => void;
  onDelete: (id: string, expId: string) => void;
  statusOptions: string[];
}) => {
  const [local, setLocal] = useState({
    start_date: dateRow.start_date,
    end_date: dateRow.end_date,
    capacity_max: dateRow.capacity_max,
    spots_taken: dateRow.spots_taken,
  });

  useEffect(() => {
    setLocal({
      start_date: dateRow.start_date,
      end_date: dateRow.end_date,
      capacity_max: dateRow.capacity_max,
      spots_taken: dateRow.spots_taken,
    });
  }, [dateRow]);

  const handleBlur = (field: string, value: any) => {
    if (value !== dateRow[field]) {
      onUpdate(dateRow.id, field, field === "capacity_max" || field === "spots_taken" ? parseInt(value) : value, expId);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 border border-border p-3 bg-background">
      <div className="flex items-center gap-2">
        <label className="font-heading text-[9px] tracking-wider uppercase text-muted-foreground">From</label>
        <input type="date" value={local.start_date} onChange={(e) => setLocal({ ...local, start_date: e.target.value })} onBlur={() => handleBlur("start_date", local.start_date)} className="px-2 py-1 bg-background border border-border text-foreground text-xs" />
      </div>
      <div className="flex items-center gap-2">
        <label className="font-heading text-[9px] tracking-wider uppercase text-muted-foreground">To</label>
        <input type="date" value={local.end_date} onChange={(e) => setLocal({ ...local, end_date: e.target.value })} onBlur={() => handleBlur("end_date", local.end_date)} className="px-2 py-1 bg-background border border-border text-foreground text-xs" />
      </div>
      <div className="flex items-center gap-2">
        <label className="font-heading text-[9px] tracking-wider uppercase text-muted-foreground">Spots</label>
        <input type="number" value={local.capacity_max} onChange={(e) => setLocal({ ...local, capacity_max: e.target.value })} onBlur={() => handleBlur("capacity_max", local.capacity_max)} className="w-16 px-2 py-1 bg-background border border-border text-foreground text-xs" />
      </div>
      <div className="flex items-center gap-2">
        <label className="font-heading text-[9px] tracking-wider uppercase text-muted-foreground">Booked</label>
        <input type="number" value={local.spots_taken} onChange={(e) => setLocal({ ...local, spots_taken: e.target.value })} onBlur={() => handleBlur("spots_taken", local.spots_taken)} className="w-16 px-2 py-1 bg-background border border-border text-foreground text-xs" />
      </div>
      <select value={dateRow.status} onChange={(e) => onUpdate(dateRow.id, "status", e.target.value, expId)} className="px-2 py-1 bg-background border border-border text-foreground text-xs">
        {statusOptions.map((s: string) => (<option key={s} value={s}>{s.toUpperCase()}</option>))}
      </select>
      <button onClick={() => onDelete(dateRow.id, expId)} className="p-1 border border-border hover:border-destructive hover:text-destructive transition-colors ml-auto">
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

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
  const router = useRouter();
  const [expeditions, setExpeditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [uploading, setUploading] = useState(false);
  const [heroImages, setHeroImages] = useState<any[]>([]);
  const [heroUploading, setHeroUploading] = useState(false);
  const [showHeroManager, setShowHeroManager] = useState(false);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [expeditionDates, setExpeditionDates] = useState<any[]>([]);

  useEffect(() => {
    checkAuth();
    fetchExpeditions();
    fetchHeroImages();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/admin/login");
      return;
    }
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");
    if (!roles || roles.length === 0) {
      router.push("/admin/login");
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
    router.push("/admin/login");
  };

  const startEdit = (exp: any) => {
    setEditing(exp.id);
    setEditData({ ...exp });
    fetchGalleryImages(exp.id);
    fetchExpeditionDates(exp.id);
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

  const fetchHeroImages = async () => {
    const { data } = await supabase
      .from("hero_images")
      .select("*")
      .order("display_order", { ascending: true });
    setHeroImages(data || []);
  };

  const handleHeroImageUpload = async (file: File) => {
    setHeroUploading(true);
    const ext = file.name.split(".").pop();
    const path = `hero-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("expedition-images")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast.error("Upload failed: " + uploadError.message);
      setHeroUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("expedition-images")
      .getPublicUrl(path);

    const maxOrder = heroImages.reduce((max, h) => Math.max(max, h.display_order), -1);

    const { error } = await supabase
      .from("hero_images")
      .insert({ image_url: `${urlData.publicUrl}?t=${Date.now()}`, display_order: maxOrder + 1 });

    if (error) {
      toast.error("Failed to save: " + error.message);
    } else {
      toast.success("Hero image added!");
      fetchHeroImages();
    }
    setHeroUploading(false);
  };

  const deleteHeroImage = async (id: string) => {
    const { error } = await supabase.from("hero_images").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Image removed");
      fetchHeroImages();
    }
  };

  const toggleHeroImageActive = async (id: string, current: boolean) => {
    await supabase.from("hero_images").update({ is_active: !current }).eq("id", id);
    fetchHeroImages();
  };

  const fetchGalleryImages = async (expId: string) => {
    const { data } = await supabase
      .from("expedition_gallery")
      .select("*")
      .eq("expedition_id", expId)
      .order("display_order", { ascending: true });
    setGalleryImages(data || []);
  };

  const handleGalleryUpload = async (expId: string, files: FileList | File[]) => {
    setGalleryUploading(true);
    const fileArray = Array.from(files);
    let currentMax = galleryImages.reduce((max, g) => Math.max(max, g.display_order), -1);

    for (const file of fileArray) {
      const ext = file.name.split(".").pop();
      const path = `gallery-${expId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("expedition-images")
        .upload(path, file, { upsert: true });

      if (uploadError) {
        toast.error(`Upload failed for ${file.name}: ${uploadError.message}`);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("expedition-images")
        .getPublicUrl(path);

      currentMax += 1;

      const { error } = await supabase
        .from("expedition_gallery")
        .insert({ expedition_id: expId, image_url: `${urlData.publicUrl}?t=${Date.now()}`, display_order: currentMax });

      if (error) {
        toast.error(`Failed to save ${file.name}: ${error.message}`);
      }
    }

    toast.success(`${fileArray.length} image(s) uploaded!`);
    fetchGalleryImages(expId);
    setGalleryUploading(false);
  };

  const moveGalleryImage = async (index: number, direction: "left" | "right", expId: string) => {
    const swapIndex = direction === "left" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= galleryImages.length) return;

    const a = galleryImages[index];
    const b = galleryImages[swapIndex];

    await Promise.all([
      supabase.from("expedition_gallery").update({ display_order: b.display_order }).eq("id", a.id),
      supabase.from("expedition_gallery").update({ display_order: a.display_order }).eq("id", b.id),
    ]);

    fetchGalleryImages(expId);
  };

  const deleteGalleryImage = async (id: string, expId: string) => {
    const { error } = await supabase.from("expedition_gallery").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Image removed");
      fetchGalleryImages(expId);
    }
  };

  const fetchExpeditionDates = async (expId: string) => {
    const { data } = await supabase
      .from("expedition_dates")
      .select("*")
      .eq("expedition_id", expId)
      .order("start_date", { ascending: true });
    setExpeditionDates(data || []);
  };

  const addExpeditionDate = async (expId: string) => {
    const today = new Date().toISOString().split("T")[0];
    const { error } = await supabase.from("expedition_dates").insert({
      expedition_id: expId,
      start_date: today,
      end_date: today,
      capacity_max: 12,
      spots_taken: 0,
      status: "open",
    });
    if (error) {
      toast.error("Failed to add date: " + error.message);
      return;
    }
    toast.success("Date added");
    fetchExpeditionDates(expId);
  };

  const updateExpeditionDate = async (dateId: string, field: string, value: any, expId: string) => {
    const { error } = await supabase.from("expedition_dates").update({ [field]: value }).eq("id", dateId);
    if (error) {
      toast.error("Failed to update: " + error.message);
      return;
    }
    fetchExpeditionDates(expId);
  };

  const deleteExpeditionDate = async (dateId: string, expId: string) => {
    if (!confirm("Delete this date?")) return;
    const { error } = await supabase.from("expedition_dates").delete().eq("id", dateId);
    if (error) {
      toast.error("Failed to delete: " + error.message);
      return;
    }
    toast.success("Date removed");
    fetchExpeditionDates(expId);
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
        {/* Landing Pages */}
        <LandingPagesPanel />

        {/* Applications */}
        <ApplicationsPanel />

        {/* Waitlist */}
        <WaitlistPanel />

        {/* Tour info requests */}
        <InfoRequestsPanel />

        {/* Meta events (server-side ground truth of what was sent to Meta) */}
        <MetaEventLogPanel />

        {/* Hero Images Manager */}
        <div className="mb-8 border border-border bg-card p-4 sm:p-6">
          <button
            onClick={() => setShowHeroManager(!showHeroManager)}
            className="flex items-center gap-2 font-heading text-sm tracking-wider uppercase w-full text-left"
          >
            <Image className="w-4 h-4" />
            Hero Background Images ({heroImages.length})
            <span className="text-muted-foreground text-xs ml-auto">{showHeroManager ? "▲" : "▼"}</span>
          </button>

          {showHeroManager && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {heroImages.map((img) => (
                  <div key={img.id} className="relative group border border-border overflow-hidden">
                    <img src={img.image_url} alt="" className={`w-full h-24 object-cover ${!img.is_active ? "opacity-40" : ""}`} />
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => toggleHeroImageActive(img.id, img.is_active)}
                        className="p-1.5 bg-background border border-border text-[9px] font-heading tracking-wider uppercase"
                      >
                        {img.is_active ? "Disable" : "Enable"}
                      </button>
                      <button
                        onClick={() => downloadImage(img.image_url, `hero-${img.id}.jpg`).catch(() => toast.error("Download failed"))}
                        className="p-1.5 bg-background border border-border"
                        title="Download"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteHeroImage(img.id)}
                        className="p-1.5 bg-background border border-destructive text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Upload button */}
                <label className="border border-dashed border-border h-24 flex flex-col items-center justify-center cursor-pointer hover:border-foreground transition-colors">
                  <Upload className="w-4 h-4 text-muted-foreground mb-1" />
                  <span className="font-heading text-[9px] tracking-wider uppercase text-muted-foreground">
                    {heroUploading ? "Uploading..." : "Add image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={heroUploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleHeroImageUpload(file);
                    }}
                  />
                </label>
              </div>
            </div>
          )}
        </div>

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
                   {(editData.status === "cancelled" || editData.status === "postponed") && (
                     <div>
                       <label className="font-heading text-[10px] tracking-wider uppercase text-muted-foreground block mb-1">
                         {editData.status === "cancelled" ? "Cancellation Reason" : "Postponement Reason"}
                       </label>
                       <textarea
                         value={editData.cancellation_reason || ""}
                         onChange={(e) => setEditData({ ...editData, cancellation_reason: e.target.value })}
                         rows={2}
                         placeholder={`Why is this expedition ${editData.status}?`}
                         className="w-full px-3 py-2 bg-background border border-border text-foreground text-sm"
                       />
                     </div>
                   )}
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
                  {/* Gallery Images */}
                  <div className="border border-border p-4">
                    <h4 className="font-heading text-[10px] tracking-wider uppercase text-muted-foreground mb-3 flex items-center gap-2">
                      <Images className="w-3.5 h-3.5" /> Gallery Images ({galleryImages.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {galleryImages.map((img, idx) => (
                        <div key={img.id} className="relative group border border-border overflow-hidden">
                          <img src={img.image_url} alt="" className="w-full h-20 object-cover" />
                          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                            {idx > 0 && (
                              <button
                                onClick={() => moveGalleryImage(idx, "left", editData.id)}
                                className="p-1 bg-background/80 border border-border"
                              >
                                <ChevronLeft className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => downloadImage(img.image_url, `gallery-${img.id}.jpg`).catch(() => toast.error("Download failed"))}
                              className="p-1 bg-background/80 border border-border"
                              title="Download"
                            >
                              <Download className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => deleteGalleryImage(img.id, editData.id)}
                              className="p-1 bg-background/80 border border-destructive text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            {idx < galleryImages.length - 1 && (
                              <button
                                onClick={() => moveGalleryImage(idx, "right", editData.id)}
                                className="p-1 bg-background/80 border border-border"
                              >
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      <label className="border border-dashed border-border h-20 flex flex-col items-center justify-center cursor-pointer hover:border-foreground transition-colors">
                        <Upload className="w-4 h-4 text-muted-foreground mb-1" />
                        <span className="font-heading text-[9px] tracking-wider uppercase text-muted-foreground">
                          {galleryUploading ? "Uploading..." : "Add"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          disabled={galleryUploading}
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) handleGalleryUpload(editData.id, files);
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Departure Dates */}
                  <div className="border border-border p-4">
                    <h4 className="font-heading text-[10px] tracking-wider uppercase text-muted-foreground mb-3 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" /> Departure Dates ({expeditionDates.length})
                    </h4>
                    <div className="space-y-3">
                      {expeditionDates.map((d) => (
                        <DateRow key={d.id} dateRow={d} expId={editData.id} onUpdate={updateExpeditionDate} onDelete={deleteExpeditionDate} statusOptions={statusOptions} />
                      ))}
                      <button
                        onClick={() => addExpeditionDate(editData.id)}
                        className="flex items-center gap-2 font-heading text-[10px] tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors border border-dashed border-border px-4 py-2"
                      >
                        <Plus className="w-3 h-3" /> Add date
                      </button>
                    </div>
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
                    {exp.hero_image_url && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          downloadImage(exp.hero_image_url!, `${exp.slug}-hero.jpg`).catch(() => toast.error("Download failed"));
                        }}
                        className="absolute top-1 right-1 p-1 bg-background/80 border border-border opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Download"
                      >
                        <Download className="w-3 h-3 text-foreground" />
                      </button>
                    )}
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
