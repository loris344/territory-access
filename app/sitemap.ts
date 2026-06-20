import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getPublishedPages, normalizeUrl } from "@/lib/magazine";
import { supabase } from "@/integrations/supabase/client";
import { expeditions as staticExpeditions } from "@/data/expeditions";

/**
 * Generated sitemap (replaces the old hand-maintained public/sitemap.xml, which
 * went stale and used non-trailing-slash URLs). Lists only LIVE content; it grows
 * on its own each nightly build as scheduled magazine pages publish.
 */
export const dynamic = "force-static";

async function expeditionSlugs(): Promise<string[]> {
  try {
    const { data } = await supabase.from("expeditions").select("slug");
    if (data && data.length) return data.map((e) => e.slug as string);
  } catch {
    /* fall through to static list */
  }
  return staticExpeditions.map((e) => e.slug);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const today = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1.0, lastModified: today },
    { url: `${SITE_URL}/about/`, changeFrequency: "monthly", priority: 0.7, lastModified: today },
    { url: `${SITE_URL}/apply/`, changeFrequency: "monthly", priority: 0.9, lastModified: today },
    { url: `${SITE_URL}/expeditions/`, changeFrequency: "weekly", priority: 0.8, lastModified: today },
    { url: `${SITE_URL}/legal/`, changeFrequency: "yearly", priority: 0.3, lastModified: today },
  ];

  const expeditionRoutes: MetadataRoute.Sitemap = (await expeditionSlugs()).map((slug) => ({
    url: `${SITE_URL}/expeditions/${slug}/`,
    changeFrequency: "weekly",
    priority: 0.7,
    lastModified: today,
  }));

  const magazineRoutes: MetadataRoute.Sitemap = getPublishedPages().map((p) => ({
    url: `${SITE_URL}${normalizeUrl(p.url)}`,
    changeFrequency: "monthly",
    priority: p.priority === "P0" ? 0.8 : p.priority === "P1" ? 0.7 : 0.6,
    lastModified: new Date(p.publishAt),
  }));

  return [...staticRoutes, ...expeditionRoutes, ...magazineRoutes];
}
