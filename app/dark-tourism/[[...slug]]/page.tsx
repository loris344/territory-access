import type { Metadata } from "next";
import { notFound } from "next/navigation";

import MagazinePageView from "@/views/MagazinePageView";
import { buildMetadata } from "@/lib/seo";
import {
  getPublishedPages,
  getPageByUrl,
  getArticle,
  isPublished,
  effectiveMeta,
  normalizeUrl,
} from "@/lib/magazine";

const MAGAZINE_ROOT = "/dark-tourism/";

// Static export: build ONLY the pages that are live (file exists, not draft, date reached).
// Everything else is a genuine 404 (out/404.html served with HTTP 404 by GitHub Pages).
export const dynamicParams = false;

function urlToSlugParam(url: string): string[] {
  const inner = url.startsWith(MAGAZINE_ROOT) ? url.slice(MAGAZINE_ROOT.length) : url;
  const trimmed = inner.replace(/\/$/, "");
  return trimmed ? trimmed.split("/") : [];
}

function slugParamToUrl(slug?: string[]): string {
  const segs = slug ?? [];
  return segs.length ? `${MAGAZINE_ROOT}${segs.join("/")}/` : MAGAZINE_ROOT;
}

export function generateStaticParams(): { slug: string[] }[] {
  return getPublishedPages().map((p) => ({ slug: urlToSlugParam(p.url) }));
}

export function generateMetadata({ params }: { params: { slug?: string[] } }): Metadata {
  const page = getPageByUrl(slugParamToUrl(params.slug));
  if (!page) return buildMetadata({ title: "Not found", noIndex: true });

  const article = getArticle(page.slug);
  const { metaTitle, metaDescription, h1 } = effectiveMeta(page, article);
  return buildMetadata({
    title: (metaTitle || h1).replace(/\s*[—-]\s*Ligne Rouge.*$/i, "").trim(),
    description: metaDescription,
    path: normalizeUrl(page.url),
    ogImage: article?.frontmatter.heroImage,
  });
}

export default function MagazinePage({ params }: { params: { slug?: string[] } }) {
  const page = getPageByUrl(slugParamToUrl(params.slug));
  if (!page || !isPublished(page)) notFound();
  return <MagazinePageView page={page!} />;
}
