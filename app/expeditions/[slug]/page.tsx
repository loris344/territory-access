import type { Metadata } from "next";
import ExpeditionDetail from "@/views/ExpeditionDetail";
import { buildMetadata } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";

// Static export (GitHub Pages): pre-render one page per expedition at build time.
// New expeditions added later need a rebuild to get their own page.
export async function generateStaticParams() {
  const { data } = await supabase.from("expeditions").select("slug");
  return (data || []).map((e) => ({ slug: e.slug as string }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { data } = await supabase
    .from("expeditions")
    .select("name, slug, country, short_description, hero_image_url")
    .eq("slug", params.slug)
    .maybeSingle();

  if (!data) {
    return buildMetadata({ title: "Expedition", noIndex: true });
  }

  return buildMetadata({
    title: `${data.name} | ${data.country || ""}`,
    description: data.short_description,
    path: `/expeditions/${data.slug}`,
    ogImage: data.hero_image_url || undefined,
  });
}

export default async function ExpeditionDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // Unlike the landing pages, ExpeditionDetail already renders instantly
  // from a bundled static fallback (useExpeditions' placeholderData) while
  // the live query resolves in the background — no fetch gates first
  // paint here. The one gap: no head start on the hero image request.
  // Preload it (same query generateMetadata already runs) so the browser
  // starts fetching it immediately instead of waiting for hydration to
  // discover the <img> tag.
  const { data } = await supabase
    .from("expeditions")
    .select("hero_image_url")
    .eq("slug", params.slug)
    .maybeSingle();

  return (
    <>
      {data?.hero_image_url && (
        <link rel="preload" as="image" href={data.hero_image_url} fetchPriority="high" />
      )}
      {/* <ExpeditionDetail> reads the slug via useParams() on the client. */}
      <ExpeditionDetail />
    </>
  );
}
