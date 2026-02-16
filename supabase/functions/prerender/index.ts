import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://lignerouge.lovable.app";
const SITE_NAME = "Ligne Rouge Tours";
const DEFAULT_TITLE =
  "Ligne Rouge Tours — Expeditions in Territories Others Avoid";
const DEFAULT_DESCRIPTION =
  "We organize expeditions in territories others avoid. For those who refuse to observe the world from a distance.";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

function buildHtml({
  title,
  description,
  url,
  image,
  jsonLd,
}: {
  title: string;
  description: string;
  url: string;
  image: string;
  jsonLd?: Record<string, unknown>;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}"/>
<link rel="canonical" href="${escapeHtml(url)}"/>
<meta property="og:title" content="${escapeHtml(title)}"/>
<meta property="og:description" content="${escapeHtml(description)}"/>
<meta property="og:type" content="website"/>
<meta property="og:url" content="${escapeHtml(url)}"/>
<meta property="og:image" content="${escapeHtml(image)}"/>
<meta property="og:site_name" content="${SITE_NAME}"/>
<meta property="og:locale" content="en_US"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${escapeHtml(title)}"/>
<meta name="twitter:description" content="${escapeHtml(description)}"/>
<meta name="twitter:image" content="${escapeHtml(image)}"/>
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ""}
</head>
<body>
<h1>${escapeHtml(title)}</h1>
<p>${escapeHtml(description)}</p>
<a href="${escapeHtml(url)}">Visit page</a>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path") || "/";

    // Static pages
    const staticPages: Record<string, { title: string; description: string }> =
      {
        "/": { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
        "/about": {
          title: `Who We Are — ${SITE_NAME}`,
          description:
            "Meet the Ligne Rouge Tours team. We design structured immersions in conflict zones, disputed territories, and extreme environments.",
        },
        "/apply": {
          title: `Apply — ${SITE_NAME}`,
          description:
            "Apply for a Ligne Rouge Tours expedition. Participation is by application only, reviewed individually.",
        },
        "/legal": {
          title: `Legal Notice & Terms — ${SITE_NAME}`,
          description:
            "Legal notice, terms and conditions, and cancellation policy for Ligne Rouge Tours expeditions.",
        },
      };

    // Check static pages first
    if (staticPages[path]) {
      const page = staticPages[path];
      const html = buildHtml({
        title: page.title,
        description: page.description,
        url: `${SITE_URL}${path}`,
        image: DEFAULT_OG_IMAGE,
      });
      return new Response(html, {
        headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // Dynamic expedition pages: /expeditions/:slug
    const expeditionMatch = path.match(/^\/expeditions\/([a-z0-9-]+)$/);
    if (expeditionMatch) {
      const slug = expeditionMatch[1];

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!
      );

      const { data: expedition } = await supabase
        .from("expeditions")
        .select(
          "name, country, location, short_description, price_usd, status, hero_image_url, slug"
        )
        .eq("slug", slug)
        .single();

      if (expedition) {
        const title = `${expedition.name} — ${expedition.country} — ${SITE_NAME}`;
        const ogImage = expedition.hero_image_url || DEFAULT_OG_IMAGE;
        const pageUrl = `${SITE_URL}/expeditions/${expedition.slug}`;

        const jsonLd = {
          "@context": "https://schema.org",
          "@type": "TravelAction",
          name: expedition.name,
          description: expedition.short_description,
          location: {
            "@type": "Place",
            name: expedition.location,
            address: {
              "@type": "PostalAddress",
              addressCountry: expedition.country,
            },
          },
          offers: {
            "@type": "Offer",
            price: expedition.price_usd,
            priceCurrency: "USD",
            availability:
              expedition.status === "open" || expedition.status === "limited"
                ? "https://schema.org/InStock"
                : "https://schema.org/SoldOut",
          },
        };

        const html = buildHtml({
          title,
          description: expedition.short_description,
          url: pageUrl,
          image: ogImage,
          jsonLd,
        });
        return new Response(html, {
          headers: {
            ...corsHeaders,
            "Content-Type": "text/html; charset=utf-8",
          },
        });
      }
    }

    // Fallback
    const html = buildHtml({
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      url: `${SITE_URL}${path}`,
      image: DEFAULT_OG_IMAGE,
    });
    return new Response(html, {
      headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
