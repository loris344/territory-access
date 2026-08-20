import { SITE_URL } from "@/lib/seo";

// Soft redirect for a URL that used to be a real, indexable page and no
// longer is. Static export (GitHub Pages) can't do a server-side 301, so
// this is the best-effort equivalent: an immediate meta-refresh (crawlers
// generally treat content="0;url=..." the same as a redirect) plus a
// canonical pointing at the replacement, and a real link for anyone who
// lands here before the refresh fires.
const RetiredPageRedirect = ({ to = "/" }: { to?: string }) => {
  const target = `${SITE_URL}${to}`;
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <link rel="canonical" href={target} />
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center pt-20">
          <h1 className="heading-display text-2xl mb-4">This expedition is no longer available</h1>
          <p className="body-text text-muted-foreground mb-6">Redirecting you to our current expeditions.</p>
          <a href={target} className="text-accent-red font-heading text-xs tracking-[0.15em] uppercase">
            ← View current expeditions
          </a>
        </div>
      </div>
    </>
  );
};

export default RetiredPageRedirect;
