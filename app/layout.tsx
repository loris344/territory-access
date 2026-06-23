import type { Metadata } from "next";
import "@/index.css";
import Providers from "./providers";
import ScrollToTop from "@/components/ScrollToTop";
import {
  SITE_NAME,
  SITE_URL,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
} from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  authors: [{ name: SITE_NAME }],
  icons: { icon: "/favicon.png" },
  alternates: { canonical: "/" },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    type: "website",
    url: SITE_URL,
    images: [{ url: DEFAULT_OG_IMAGE }],
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.png`,
  description: "We organize expeditions in territories others avoid.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "7 rue des Archives",
    addressLocality: "Paris",
    postalCode: "75004",
    addressCountry: "FR",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+33767135458",
    contactType: "customer service",
    email: "contact@lignerougetours.com",
  },
};

// WebSite node so magazine pages can reference it via isPartOf { @id: #website }.
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: "en",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload the LCP hero image so it paints as early as possible. */}
        <link rel="preload" as="image" href="/assets/hero-bg.webp" fetchPriority="high" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* X (Twitter) conversion tracking base code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
twq('config','rd4r6');`,
          }}
        />
        {/* Deep-link anchors (e.g. /#expeditions): scroll BEFORE React hydrates,
            so the page lands on the section instead of flashing the top first.
            Re-pins for a short window while above-fold content settles, and
            bails the instant the user scrolls. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){function run(){var h=location.hash;if(!h||h.length<2)return;var id=h.slice(1);var done=false;function stop(){done=true;removeEventListener('wheel',stop);removeEventListener('touchstart',stop);removeEventListener('keydown',stop);}addEventListener('wheel',stop,{passive:true});addEventListener('touchstart',stop,{passive:true});addEventListener('keydown',stop);var extra=id==='expeditions'?120:0;var start=Date.now();function tick(){if(done)return;var el=document.getElementById(id);if(el){el.scrollIntoView({block:'start'});if(extra)scrollBy(0,extra);}if(Date.now()-start<1500)requestAnimationFrame(tick);else stop();}requestAnimationFrame(tick);}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();})();`,
          }}
        />
      </head>
      <body>
        <Providers>
          <ScrollToTop />
          {children}
        </Providers>
      </body>
    </html>
  );
}
