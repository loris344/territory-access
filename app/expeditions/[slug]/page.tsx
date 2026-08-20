import type { Metadata } from "next";
import ExpeditionDetail from "@/views/ExpeditionDetail";
import { buildMetadata } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";
import { expeditions as staticExpeditions } from "@/data/expeditions";

// Static export (GitHub Pages): pre-render one page per expedition at build time.
// New expeditions added later need a rebuild to get their own page.
export async function generateStaticParams() {
  const { data } = await supabase.from("expeditions").select("slug");
  if (data && data.length > 0) {
    return data.map((e) => ({ slug: e.slug as string }));
  }
  // `output: "export"` hard-fails the entire build ("Page [...] is missing
  // generateStaticParams()") if this returns an empty array — which happens
  // whenever every expedition is is_hidden (RLS blocks the anon client from
  // seeing any rows), or on any transient Supabase outage during a build.
  // Fall back to the bundled static catalog so there's always at least
  // these routes to pre-render; ExpeditionDetail already handles a slug
  // with no matching live data by rendering "Expedition not found".
  return staticExpeditions.map((e) => ({ slug: e.slug }));
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
