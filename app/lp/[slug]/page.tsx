import type { Metadata } from "next";
import TourLandingPage from "@/views/TourLandingPage";
import { buildMetadata } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";

// Static export (GitHub Pages): pre-render one page per landing page at
// build time. A new landing page created in /admin needs a rebuild to get
// its own page — same tradeoff as app/expeditions/[slug].
export async function generateStaticParams() {
  const { data } = await supabase.from("landing_pages").select("slug");
  return (data || []).map((lp) => ({ slug: lp.slug as string }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { data } = await supabase
    .from("landing_pages")
    .select("headline, subheadline, slug, expeditions(short_description, hero_image_url)")
    .eq("slug", params.slug)
    .maybeSingle();

  if (!data) {
    return buildMetadata({ title: "Expedition", noIndex: true });
  }

  const exp = (data as any).expeditions;
  return buildMetadata({
    title: data.subheadline ? `${data.headline} - ${data.subheadline}` : data.headline,
    description: exp?.short_description,
    path: `/lp/${data.slug}`,
    ogImage: exp?.hero_image_url || undefined,
    // Campaign landing pages mirror the full expedition page's content —
    // kept out of search to avoid duplicate-content competition with it.
    noIndex: true,
  });
}

export default function LandingPageRoute() {
  return <TourLandingPage />;
}
