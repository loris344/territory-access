"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchLandingPage } from "@/lib/fetch-landing-page";

export type { TrustSignal, PromiseBullet, LandingPageData } from "@/lib/fetch-landing-page";

export function useLandingPage(slug: string | undefined) {
  return useQuery({
    queryKey: ["landing-page", slug],
    queryFn: () => fetchLandingPage(slug as string),
    enabled: !!slug,
  });
}
