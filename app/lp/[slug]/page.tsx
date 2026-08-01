import type { Metadata } from "next";
import { Suspense } from "react";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import TourLandingPage from "@/views/TourLandingPage";
import { buildMetadata } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";
import { fetchLandingPage, type LandingPageData } from "@/lib/fetch-landing-page";

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
  // The client view (<TourLandingPage>, via useLandingPage) used to be the
  // ONLY place this data was ever fetched — meaning nothing on the page,
  // not even the headline text, could render until JS hydrated AND that
  // client-side fetch resolved. Under real-world throttling that pushed
  // LCP past 20s even after the image itself was preloaded, because the
  // fetch (not the image) was what the actual LCP element (the H1) was
  // waiting on.
  //
  // Prefetching here, at build time, into a QueryClient under the exact
  // same query key useLandingPage uses, means the client hook picks up
  // this data as its initial cache entry via HydrationBoundary below —
  // the real headline/hero/etc. are in the static HTML from the start,
  // no network round-trip needed for first paint. useLandingPage still
  // refetches once mounted (default staleTime: 0), so a visitor who loads
  // the page after an admin edit still sees the update — it just arrives
  // a beat after the initial (build-time) render instead of gating it.
  const queryClient = new QueryClient();
  await queryClient.fetchQuery({
    queryKey: ["landing-page", params.slug],
    queryFn: () => fetchLandingPage(params.slug),
  });
  const lp = queryClient.getQueryData<LandingPageData | null>(["landing-page", params.slug]);
  const heroUrl = lp?.hero_image_url || lp?.expedition?.hero_image_url;

  return (
    <>
      {heroUrl && <link rel="preload" as="image" href={heroUrl} fetchPriority="high" />}
      <HydrationBoundary state={dehydrate(queryClient)}>
        {/* <TourLandingPage> embeds <ApplicationForm>, which uses useSearchParams()
            for the Stripe deposit redirect flow — must sit under a Suspense boundary. */}
        <Suspense>
          <TourLandingPage />
        </Suspense>
      </HydrationBoundary>
    </>
  );
}
