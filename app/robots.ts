import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Generated robots.txt (replaces the static public/robots.txt). Allows everything
 * except the private admin area; private/noindex pages stay crawlable so Google can
 * read their noindex meta. Points at the generated sitemap.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/admin/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
