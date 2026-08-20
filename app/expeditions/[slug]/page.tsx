import type { Metadata } from "next";
import ExpeditionDetail from "@/views/ExpeditionDetail";
import RetiredPageRedirect from "@/components/RetiredPageRedirect";
import { buildMetadata } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";
import { expeditions as staticExpeditions } from "@/data/expeditions";
import { RETIRED_EXPEDITION_SLUGS } from "@/lib/retired-expeditions";

// Static export (GitHub Pages): pre-render one page per expedition at build time.
// New expeditions added later need a rebuild to get their own page.
export async function generateStaticParams() {
  const { data } = await supabase.from("expeditions").select("slug");
  const liveSlugs =
    data && data.length > 0 ? data.map((e) => e.slug as string) : staticExpeditions.map((e) => e.slug);
  // `output: "export"` hard-fails the entire build ("Page [...] is missing
  // generateStaticParams()") if this returns an empty array — which happens
  // whenever every expedition is is_hidden (RLS blocks the anon client from
  // seeing any rows), or on any transient Supabase outage during a build.
  // The static-catalog fallback above guards against that; ExpeditionDetail
  // also handles a live slug with no matching data by rendering "Expedition
  // not found". Retired slugs are pre-rendered too, as soft-redirect pages
  // (see RETIRED_EXPEDITION_SLUGS) rather than left as bare 404s.
  return [...liveSlugs, ...RETIRED_EXPEDITION_SLUGS].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  if ((RETIRED_EXPEDITION_SLUGS as readonly string[]).includes(params.slug)) {
    return buildMetadata({ title: "Expedition No Longer Available", noIndex: true });
  }

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
  if ((RETIRED_EXPEDITION_SLUGS as readonly string[]).includes(params.slug)) {
    return <RetiredPageRedirect to="/" />;
  }

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
