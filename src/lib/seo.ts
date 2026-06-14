import type { Metadata } from "next";

export const SITE_NAME = "Ligne Rouge Tours";
export const DEFAULT_TITLE =
  "Ligne Rouge Tours — Expeditions in Territories Others Avoid";
export const DEFAULT_DESCRIPTION =
  "We organize expeditions in territories others avoid. For those who refuse to observe the world from a distance.";
export const SITE_URL = "https://lignerouge.lovable.app";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

interface BuildMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}

/**
 * Builds a Next.js Metadata object mirroring the former <SEO> component so the
 * rendered tags stay identical (now emitted server-side instead of via Helmet).
 */
export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "",
  ogImage = DEFAULT_OG_IMAGE,
  noIndex = false,
}: BuildMetadataOptions = {}): Metadata {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE;
  const canonicalUrl = `${SITE_URL}${path}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: canonicalUrl },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      url: canonicalUrl,
      images: [{ url: ogImage }],
      siteName: SITE_NAME,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}
