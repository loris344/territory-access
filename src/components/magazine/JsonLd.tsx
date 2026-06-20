import { SITE_URL, SITE_NAME } from "@/lib/seo";
import {
  type MagazinePage,
  type Article,
  type Crumb,
  effectiveMeta,
  getHubChildren,
  normalizeUrl,
} from "@/lib/magazine";

const ORG_ID = `${SITE_URL}/#organization`;

/**
 * Structured data for a magazine page. Decisions (see CLAUDE.md):
 *  - Articles -> Article; hubs -> CollectionPage + ItemList of live children.
 *  - Always a BreadcrumbList.
 *  - NO FAQPage markup (Google dropped FAQ rich results) — FAQ stays visible HTML.
 *  - NO fake AggregateRating / per-place LocalBusiness.
 */
export default function JsonLd({
  page,
  article,
  crumbs,
}: {
  page: MagazinePage;
  article: Article | null;
  crumbs: Crumb[];
}) {
  const { metaTitle, metaDescription, h1, canonical } = effectiveMeta(page, article);

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${normalizeUrl(c.url)}`,
    })),
  };

  const graph: Record<string, unknown>[] = [breadcrumb];

  if (page.isHub) {
    const children = getHubChildren(page);
    graph.push({
      "@type": "CollectionPage",
      "@id": canonical,
      name: metaTitle || h1,
      description: metaDescription,
      url: canonical,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: page.semanticEntities?.slice(0, 6),
      mainEntity: {
        "@type": "ItemList",
        itemListElement: children.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}${normalizeUrl(c.url)}`,
          name: c.h1 || c.title,
        })),
      },
    });
  } else {
    graph.push({
      "@type": "Article",
      "@id": canonical,
      headline: h1,
      description: metaDescription,
      url: canonical,
      mainEntityOfPage: canonical,
      inLanguage: "en",
      about: page.semanticEntities?.slice(0, 6),
      author: { "@type": "Organization", name: SITE_NAME, "@id": ORG_ID },
      publisher: { "@type": "Organization", name: SITE_NAME, "@id": ORG_ID },
      isPartOf: { "@id": `${SITE_URL}/#website` },
    });
  }

  const json = { "@context": "https://schema.org", "@graph": graph };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
