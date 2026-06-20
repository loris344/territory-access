import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MdLink from "@/components/magazine/MdLink";
import JsonLd from "@/components/magazine/JsonLd";
import {
  type MagazinePage,
  getArticle,
  buildBreadcrumb,
  getMaillage,
  getHubChildren,
  effectiveMeta,
} from "@/lib/magazine";

/**
 * Server-rendered magazine page (hub or article). All content is emitted into the
 * static HTML at build time — no client fetch — so crawlers see the full page.
 */
export default function MagazinePageView({ page }: { page: MagazinePage }) {
  const article = getArticle(page.slug);
  const { h1 } = effectiveMeta(page, article);
  const crumbs = buildBreadcrumb(page);
  const children = page.isHub ? getHubChildren(page) : [];
  const blocks = getMaillage(page);
  const faq = article?.frontmatter.faq ?? [];
  const heroImage = article?.frontmatter.heroImage;
  const heroAlt = article?.frontmatter.heroAlt || h1;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground">
        <article className="mx-auto max-w-3xl px-5 pb-24 pt-28 md:pt-32">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {crumbs.map((c, i) => (
                <li key={c.url} className="flex items-center gap-2">
                  {i > 0 && <span className="opacity-40">/</span>}
                  {i < crumbs.length - 1 ? (
                    <Link href={c.url} className="hover:text-foreground">
                      {c.name}
                    </Link>
                  ) : (
                    <span className="text-foreground/80" aria-current="page">
                      {c.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <header className="mb-10">
            {page.cluster && page.cluster !== "Global" && (
              <p className="mb-3 text-xs uppercase tracking-widest text-accent-red">{page.cluster}</p>
            )}
            <h1 className="text-3xl leading-tight md:text-4xl">{h1}</h1>
          </header>

          {heroImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImage}
              alt={heroAlt}
              width={1600}
              height={900}
              className="mb-10 aspect-video w-full object-cover"
            />
          )}

          {/* Body */}
          {article ? (
            <div className="prose prose-invert max-w-none prose-headings:normal-case prose-a:text-accent-red">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: MdLink }}>
                {article.body}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-muted-foreground">This guide is being written.</p>
          )}

          {/* Hub children as cards */}
          {children.length > 0 && (
            <section className="mt-14">
              <h2 className="mb-6 text-xl">Explore this guide</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {children.map((c) => (
                  <Link
                    key={c.url}
                    href={c.url}
                    className="group border border-border bg-card p-5 transition-colors hover:border-accent-red"
                  >
                    {c.cluster && c.cluster !== "Global" && (
                      <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
                        {c.type}
                      </span>
                    )}
                    <span className="mt-1 block text-base text-foreground group-hover:text-accent-red">
                      {c.h1 || c.title}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* FAQ — visible HTML, no FAQPage markup (see CLAUDE.md) */}
          {faq.length > 0 && (
            <section className="mt-14">
              <h2 className="mb-6 text-xl">Frequently asked questions</h2>
              <div className="divide-y divide-border border-y border-border">
                {faq.map((item, i) => (
                  <details key={i} className="group py-4">
                    <summary className="cursor-pointer list-none text-base font-medium marker:hidden">
                      {item.q}
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Brand CTA — natural, not a brochure */}
          <section className="mt-14 border border-border bg-card p-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Ligne Rouge Tours runs application-only expeditions into territories most travellers
              avoid — guided, serious and never sensational.
            </p>
            <Link
              href="/expeditions/"
              className="mt-4 inline-block border border-accent-red px-5 py-2 text-sm uppercase tracking-widest text-accent-red transition-colors hover:bg-accent-red hover:text-white"
            >
              See the expeditions
            </Link>
          </section>

          {/* Dynamic internal-link blocks */}
          {blocks.map((block) => (
            <section key={block.heading} className="mt-12">
              <h2 className="mb-4 text-sm uppercase tracking-widest text-muted-foreground">
                {block.heading}
              </h2>
              <ul className="space-y-2">
                {block.links.map((l) => (
                  <li key={l.url}>
                    <Link href={l.url} className="text-accent-red underline-offset-4 hover:underline">
                      {l.anchor}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {/* Sources — E-E-A-T traceability */}
          {article?.frontmatter.sources && article.frontmatter.sources.length > 0 && (
            <section className="mt-12 border-t border-border pt-6">
              <h2 className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Sources</h2>
              <ul className="space-y-1 text-xs text-muted-foreground">
                {article.frontmatter.sources.map((s) => (
                  <li key={s}>
                    <a href={s} target="_blank" rel="noopener noreferrer" className="break-all hover:text-foreground">
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </main>
      <Footer />
      <JsonLd page={page} article={article} crumbs={crumbs} />
    </>
  );
}
