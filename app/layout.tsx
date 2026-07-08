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
  // Versioned URL so Google's favicon crawler treats it as a new resource and
  // re-fetches it, instead of re-serving the stale (Lovable-era) cached icon.
  icons: {
    icon: [{ url: "/favicon-v2.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/favicon-v2.png",
  },
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

// Public Meta Pixel id (safe to expose). Read at build time so the base code
// only renders once it is configured in .env.
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

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
        {/* Meta (Facebook) domain verification — enables Aggregated Event
            Measurement / event prioritisation for the Pixel + CAPI dataset. */}
        <meta name="facebook-domain-verification" content="1a50ia1p7oskzkjdc4eg9agnh8479g" />
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
        {/* Meta (Facebook) Pixel base code — fires the initial PageView. Lead
            conversions are sent from trackLead() (browser Pixel + server CAPI,
            deduplicated by event_id). Subsequent SPA route changes mirror a
            PageView via MetaPixelView in providers. */}
        {META_PIXEL_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
var _eid;try{_eid=localStorage.getItem('lr_eid');if(!_eid){_eid=(self.crypto&&crypto.randomUUID?crypto.randomUUID():'e'+Date.now()+Math.random().toString(36).slice(2));localStorage.setItem('lr_eid',_eid);}}catch(e){}
fbq('init','${META_PIXEL_ID}',_eid?{external_id:_eid}:{});fbq('track','PageView');`,
            }}
          />
        )}
        {/* Deep-link anchors (e.g. /#expeditions): scroll BEFORE React hydrates,
            so the page lands on the section instead of flashing the top first.
            Re-pins for a short window while above-fold content settles, and
            bails the instant the user scrolls. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){function run(){var h=location.hash;if(!h||h.length<2)return;var id=h.slice(1);var done=false;function stop(){done=true;removeEventListener('wheel',stop);removeEventListener('touchstart',stop);removeEventListener('keydown',stop);}addEventListener('wheel',stop,{passive:true});addEventListener('touchstart',stop,{passive:true});addEventListener('keydown',stop);var extra=0;var start=Date.now();function tick(){if(done)return;var el=document.getElementById(id);if(el){el.scrollIntoView({block:'start'});if(extra)scrollBy(0,extra);}if(Date.now()-start<1500)requestAnimationFrame(tick);else stop();}requestAnimationFrame(tick);}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();})();`,
          }}
        />
      </head>
      <body>
        {META_PIXEL_ID && (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              alt=""
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            />
          </noscript>
        )}
        <Providers>
          <ScrollToTop />
          {children}
        </Providers>
      </body>
    </html>
  );
}
