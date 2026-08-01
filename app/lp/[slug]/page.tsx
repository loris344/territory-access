import type { Metadata } from "next";
import { Suspense } from "react";
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

export default async function LandingPageRoute({
  params,
}: {
  params: { slug: string };
}) {
  // The client view re-fetches everything itself so admin edits show up
  // live without a rebuild — but that means the hero image URL isn't known
  // until JS hydrates and that fetch resolves, starving the LCP image of
  // any head start. Preloading it here (known at build time, same query
  // generateMetadata already runs) lets the browser start the image
  // request immediately from the static HTML instead of waiting on JS.
  const { data } = await supabase
    .from("landing_pages")
    .select("hero_image_url, expeditions(hero_image_url)")
    .eq("slug", params.slug)
    .maybeSingle();
  const heroUrl = data?.hero_image_url || (data as any)?.expeditions?.hero_image_url;

  return (
    <>
      {heroUrl && <link rel="preload" as="image" href={heroUrl} fetchPriority="high" />}
      {/* <TourLandingPage> embeds <ApplicationForm>, which uses useSearchParams()
          for the Stripe deposit redirect flow — must sit under a Suspense boundary. */}
      <Suspense>
        <TourLandingPage />
      </Suspense>
    </>
  );
}
