"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Upload, Save, ExternalLink, X } from "lucide-react";

interface TrustSignal { icon: string; title: string; desc: string; }
interface PromiseBullet { title: string; desc: string; }
interface Testimonial { name: string; detail: string; quote: string; image_url: string; }

interface LandingPageRow {
  id: string;
  slug: string;
  expedition_id: string;
  is_published: boolean;
  tagline: string;
  headline: string;
  subheadline: string;
  hero_image_url: string | null;
  trust_signals: TrustSignal[];
  promise_intro: string;
  promise_bullets: PromiseBullet[];
  testimonials: Testimonial[];
  led_by_name: string;
  led_by_bio: string;
  led_by_image_url: string | null;
  gallery_trust_images: string[];
  expeditions?: { name: string; slug: string } | null;
}

const ICON_OPTIONS = ["Shield", "Users", "Mountain", "Clock", "Check", "MapPin", "Quote"];

const inputCls = "w-full px-3 py-2 bg-background border border-border text-foreground text-sm";
const labelCls = "font-heading text-[9px] tracking-wider uppercase text-muted-foreground block mb-1";

async function uploadToStorage(file: File, prefix: string): Promise<string | null> {
  const ext = file.name.split(".").pop();
  const path = `${prefix}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("expedition-images").upload(path, file, { upsert: true });
  if (error) {
    toast.error("Upload failed: " + error.message);
    return null;
  }
  const { data } = supabase.storage.from("expedition-images").getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
}

const ImageUploader = ({ url, prefix, onUploaded, alt }: { url: string | null | undefined; prefix: string; onUploaded: (url: string) => void; alt: string }) => {
  const [uploading, setUploading] = useState(false);
  return (
    <div className="flex items-center gap-3">
      {url ? (
        <img src={url} alt={alt} className="w-16 h-16 object-cover border border-border" />
      ) : (
        <div className="w-16 h-16 border border-dashed border-border flex items-center justify-center text-muted-foreground">
          <Upload className="w-4 h-4" />
        </div>
      )}
      <label className="font-heading text-[9px] tracking-wider uppercase px-3 py-2 border border-border cursor-pointer hover:border-foreground transition-colors">
        {uploading ? "Uploading..." : "Upload"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setUploading(true);
            const url = await uploadToStorage(file, prefix);
            setUploading(false);
            if (url) onUploaded(url);
          }}
        />
      </label>
    </div>
  );
};

const LandingPagesPanel = () => {
  const [pages, setPages] = useState<LandingPageRow[]>([]);
  const [expeditions, setExpeditions] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<LandingPageRow | null>(null);
  const [newSlug, setNewSlug] = useState("");
  const [newExpeditionId, setNewExpeditionId] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchPages = async () => {
    const { data, error } = await supabase
      .from("landing_pages")
      .select("*, expeditions(name, slug)")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to load landing pages");
    } else {
      setPages((data || []) as unknown as LandingPageRow[]);
    }
    setLoading(false);
  };

  const fetchExpeditions = async () => {
    const { data } = await supabase.from("expeditions").select("id, name, slug").order("name");
    setExpeditions(data || []);
  };

  useEffect(() => {
    fetchPages();
    fetchExpeditions();
  }, []);

  const startEdit = (page: LandingPageRow) => {
    setEditing(page.id);
    setForm({ ...page, trust_signals: [...page.trust_signals], promise_bullets: [...page.promise_bullets], testimonials: [...page.testimonials], gallery_trust_images: [...page.gallery_trust_images] });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(null);
  };

  const saveEdit = async () => {
    if (!form) return;
    const { id, expeditions: _joined, ...updateData } = form;
    const { error } = await supabase
      .from("landing_pages")
      .update(updateData as any)
      .eq("id", id);
    if (error) {
      toast.error("Failed to save: " + error.message);
      return;
    }
    toast.success("Landing page updated!");
    setEditing(null);
    setForm(null);
    fetchPages();
  };

  const createPage = async () => {
    if (!newSlug.trim() || !newExpeditionId) {
      toast.error("Pick a slug and a tour");
      return;
    }
    setCreating(true);
    const exp = expeditions.find((e) => e.id === newExpeditionId);
    const { data, error } = await supabase
      .from("landing_pages")
      .insert({
        slug: newSlug.trim().toLowerCase(),
        expedition_id: newExpeditionId,
        headline: exp?.name || "",
        tagline: "Limited access expedition",
      } as any)
      .select()
      .single();
    setCreating(false);
    if (error) {
      toast.error("Failed to create: " + error.message);
      return;
    }
    toast.success("Landing page created! Edit it below.");
    setNewSlug("");
    setNewExpeditionId("");
    await fetchPages();
    if (data) startEdit({ ...(data as any), trust_signals: [], promise_bullets: [], testimonials: [], gallery_trust_images: [] });
  };

  const deletePage = async (id: string) => {
    if (!confirm("Delete this landing page? This cannot be undone.")) return;
    const { error } = await supabase.from("landing_pages").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete: " + error.message);
      return;
    }
    toast.success("Landing page deleted");
    fetchPages();
  };

  if (loading) return null;

  return (
    <div className="mb-8 border border-border bg-card p-4 sm:p-6">
      <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-2 font-heading text-sm tracking-wider uppercase w-full text-left">
        <ExternalLink className="w-4 h-4" />
        Landing Pages ({pages.length})
        <span className="text-muted-foreground text-xs ml-auto">{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          {/* Create new */}
          <div className="flex flex-wrap items-end gap-3 border border-dashed border-border p-3">
            <div>
              <label className={labelCls}>New slug (/lp/...)</label>
              <input value={newSlug} onChange={(e) => setNewSlug(e.target.value)} placeholder="e.g. socotra" className={`${inputCls} w-40`} />
            </div>
            <div>
              <label className={labelCls}>Tour</label>
              <select value={newExpeditionId} onChange={(e) => setNewExpeditionId(e.target.value)} className={`${inputCls} w-56`}>
                <option value="">Select a tour</option>
                {expeditions.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
            <button
              onClick={createPage}
              disabled={creating}
              className="flex items-center gap-2 font-heading text-xs tracking-wider uppercase px-4 py-2 bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          {pages.map((page) => (
            <div key={page.id} className="border border-border p-4">
              {editing === page.id && form ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={form.is_published}
                      onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                      className="h-4 w-4 accent-accent"
                    />
                    <label className="text-xs text-muted-foreground">Published</label>
                    <span className="ml-auto text-xs text-muted-foreground font-heading">/lp/{form.slug}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Linked tour</label>
                      <select
                        value={form.expedition_id}
                        onChange={(e) => setForm({ ...form, expedition_id: e.target.value })}
                        className={inputCls}
                      >
                        {expeditions.map((e) => (
                          <option key={e.id} value={e.id}>{e.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Tagline</label>
                      <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Headline</label>
                      <input value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Subheadline</label>
                      <input value={form.subheadline} onChange={(e) => setForm({ ...form, subheadline: e.target.value })} className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Hero image (blank = use the tour's own hero image)</label>
                    <ImageUploader url={form.hero_image_url} prefix={`lp-${form.slug}-hero`} alt="Hero" onUploaded={(url) => setForm({ ...form, hero_image_url: url })} />
                  </div>

                  {/* Trust signals */}
                  <div className="border border-border p-3">
                    <p className={labelCls}>Trust signals (3 shown under the hero)</p>
                    <div className="space-y-2">
                      {form.trust_signals.map((ts, i) => (
                        <div key={i} className="flex flex-wrap items-center gap-2">
                          <select
                            value={ts.icon}
                            onChange={(e) => {
                              const next = [...form.trust_signals];
                              next[i] = { ...ts, icon: e.target.value };
                              setForm({ ...form, trust_signals: next });
                            }}
                            className={`${inputCls} w-28`}
                          >
                            {ICON_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                          <input
                            value={ts.title}
                            placeholder="Title"
                            onChange={(e) => { const next = [...form.trust_signals]; next[i] = { ...ts, title: e.target.value }; setForm({ ...form, trust_signals: next }); }}
                            className={`${inputCls} flex-1 min-w-[140px]`}
                          />
                          <input
                            value={ts.desc}
                            placeholder="Description"
                            onChange={(e) => { const next = [...form.trust_signals]; next[i] = { ...ts, desc: e.target.value }; setForm({ ...form, trust_signals: next }); }}
                            className={`${inputCls} flex-[2] min-w-[200px]`}
                          />
                          <button onClick={() => setForm({ ...form, trust_signals: form.trust_signals.filter((_, j) => j !== i) })} className="p-2 border border-border hover:border-destructive hover:text-destructive">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setForm({ ...form, trust_signals: [...form.trust_signals, { icon: "Shield", title: "", desc: "" }] })}
                        className="flex items-center gap-1 font-heading text-[9px] tracking-wider uppercase text-muted-foreground hover:text-foreground border border-dashed border-border px-3 py-1.5"
                      >
                        <Plus className="w-3 h-3" /> Add signal
                      </button>
                    </div>
                  </div>

                  {/* Promise section */}
                  <div className="border border-border p-3">
                    <label className={labelCls}>&quot;This is not a trip&quot; intro</label>
                    <textarea
                      value={form.promise_intro}
                      onChange={(e) => setForm({ ...form, promise_intro: e.target.value })}
                      rows={2}
                      className={`${inputCls} mb-3`}
                    />
                    <p className={labelCls}>Promise bullets</p>
                    <div className="space-y-2">
                      {form.promise_bullets.map((b, i) => (
                        <div key={i} className="flex flex-wrap items-center gap-2">
                          <input
                            value={b.title}
                            placeholder="Title"
                            onChange={(e) => { const next = [...form.promise_bullets]; next[i] = { ...b, title: e.target.value }; setForm({ ...form, promise_bullets: next }); }}
                            className={`${inputCls} flex-1 min-w-[140px]`}
                          />
                          <input
                            value={b.desc}
                            placeholder="Description"
                            onChange={(e) => { const next = [...form.promise_bullets]; next[i] = { ...b, desc: e.target.value }; setForm({ ...form, promise_bullets: next }); }}
                            className={`${inputCls} flex-[2] min-w-[200px]`}
                          />
                          <button onClick={() => setForm({ ...form, promise_bullets: form.promise_bullets.filter((_, j) => j !== i) })} className="p-2 border border-border hover:border-destructive hover:text-destructive">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setForm({ ...form, promise_bullets: [...form.promise_bullets, { title: "", desc: "" }] })}
                        className="flex items-center gap-1 font-heading text-[9px] tracking-wider uppercase text-muted-foreground hover:text-foreground border border-dashed border-border px-3 py-1.5"
                      >
                        <Plus className="w-3 h-3" /> Add bullet
                      </button>
                    </div>
                  </div>

                  {/* Testimonials */}
                  <div className="border border-border p-3">
                    <p className={labelCls}>Testimonials</p>
                    <div className="space-y-3">
                      {form.testimonials.map((t, i) => (
                        <div key={i} className="border border-border/60 p-3 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <input value={t.name} placeholder="Name" onChange={(e) => { const next = [...form.testimonials]; next[i] = { ...t, name: e.target.value }; setForm({ ...form, testimonials: next }); }} className={`${inputCls} w-40`} />
                            <input value={t.detail} placeholder="Detail (e.g. UK - 2025)" onChange={(e) => { const next = [...form.testimonials]; next[i] = { ...t, detail: e.target.value }; setForm({ ...form, testimonials: next }); }} className={`${inputCls} flex-1 min-w-[160px]`} />
                            <button onClick={() => setForm({ ...form, testimonials: form.testimonials.filter((_, j) => j !== i) })} className="p-2 border border-border hover:border-destructive hover:text-destructive">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <textarea value={t.quote} placeholder="Quote" onChange={(e) => { const next = [...form.testimonials]; next[i] = { ...t, quote: e.target.value }; setForm({ ...form, testimonials: next }); }} rows={2} className={inputCls} />
                          <ImageUploader url={t.image_url} prefix={`lp-${form.slug}-testimonial-${i}`} alt={t.name} onUploaded={(url) => { const next = [...form.testimonials]; next[i] = { ...t, image_url: url }; setForm({ ...form, testimonials: next }); }} />
                        </div>
                      ))}
                      <button
                        onClick={() => setForm({ ...form, testimonials: [...form.testimonials, { name: "", detail: "", quote: "", image_url: "" }] })}
                        className="flex items-center gap-1 font-heading text-[9px] tracking-wider uppercase text-muted-foreground hover:text-foreground border border-dashed border-border px-3 py-1.5"
                      >
                        <Plus className="w-3 h-3" /> Add testimonial
                      </button>
                    </div>
                  </div>

                  {/* Led by */}
                  <div className="border border-border p-3">
                    <p className={labelCls}>Led by (leave name blank to hide this section)</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <input value={form.led_by_name} placeholder="Name" onChange={(e) => setForm({ ...form, led_by_name: e.target.value })} className={inputCls} />
                      <textarea value={form.led_by_bio} placeholder="Bio" onChange={(e) => setForm({ ...form, led_by_bio: e.target.value })} rows={1} className={inputCls} />
                    </div>
                    <ImageUploader url={form.led_by_image_url} prefix={`lp-${form.slug}-ledby`} alt={form.led_by_name || "Team"} onUploaded={(url) => setForm({ ...form, led_by_image_url: url })} />
                  </div>

                  {/* Gallery trust images */}
                  <div className="border border-border p-3">
                    <p className={labelCls}>Extra trust photos (mixed into the tour&apos;s gallery carousel)</p>
                    <div className="flex flex-wrap gap-3">
                      {form.gallery_trust_images.map((url, i) => (
                        <div key={i} className="relative group">
                          <img src={url} alt="" className="w-16 h-16 object-cover border border-border" />
                          <button
                            onClick={() => setForm({ ...form, gallery_trust_images: form.gallery_trust_images.filter((_, j) => j !== i) })}
                            className="absolute -top-1.5 -right-1.5 bg-background border border-destructive text-destructive rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <ImageUploader url={null} prefix={`lp-${form.slug}-trust-${form.gallery_trust_images.length}`} alt="New trust photo" onUploaded={(url) => setForm({ ...form, gallery_trust_images: [...form.gallery_trust_images, url] })} />
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-xs tracking-wider uppercase">/lp/{page.slug}</span>
                      <span className={`font-heading text-[9px] tracking-wider uppercase px-2 py-0.5 ${page.is_published ? "bg-foreground/10 text-foreground" : "bg-muted text-muted-foreground"}`}>
                        {page.is_published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {page.headline}{page.subheadline ? ` — ${page.subheadline}` : ""} · linked to <span className="text-foreground">{page.expeditions?.name || "unknown tour"}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a href={`/lp/${page.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 border border-border hover:border-foreground transition-colors" title="View">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button onClick={() => startEdit(page)} className="font-heading text-[10px] tracking-wider uppercase px-3 py-2 border border-border hover:border-foreground transition-colors">
                      Edit
                    </button>
                    <button onClick={() => deletePage(page.id)} className="p-2 border border-border hover:border-destructive hover:text-destructive transition-colors" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LandingPagesPanel;
