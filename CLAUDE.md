# CLAUDE.md — Ligne Rouge dark-tourism magazine

Source of truth for the editorial **magazine machine** that publishes SEO articles under
`/dark-tourism/` on `lignerougetours.com`. In any conflict: **this file wins, then the code,
then the Excel.** Read it fully before writing or changing anything.

The site is a Next.js 14 App Router project, `output: "export"` → static HTML → GitHub Pages.
Marketing/expedition pages live in `app/*` mounting `src/views/*`. The magazine is a separate,
fully server-rendered subsystem (no client fetch — Google sees full content in the static HTML).

> Page components live in `src/views`, never `src/pages` (Pages Router clash).

---

## How the machine works (one paragraph)

The Excel plan is imported once into JSON briefs + an internal-link graph. You write articles **one
at a time** as markdown files in `content/magazine/`. Each file has a scheduled `publishAt` date
(assigned at import). A blocking validator runs before every build. A GitHub Actions cron rebuilds
the whole site daily; an article goes **live** only when its file exists, isn't a draft, and its
`publishAt` date has arrived. Internal links auto-activate (a link to a not-yet-published page
renders as plain text and becomes a real link automatically the night its target goes live → zero
404s, zero manual maintenance).

```
Excel ──(scripts/excel-to-magazine.py, LOCAL only)──▶ src/data/magazine-pages.json + magazine-links.json
content/magazine/<slug>.md  (you write these, one at a time)
   └─ next build (validator → static export) ─▶ out/ ─▶ GitHub Pages (daily cron + on push)
```

---

## Locked decisions (do not relitigate)

- **Publish everything, slow ramp.** All 643 pages are planned; they drip out 1/day for 14 days then
  3/day (last slot ~2027-01-27). Nothing ships until it is written **and** passes the validator.
- **URL structure kept as `/dark-tourism/{cluster}/{entity}/{article}/`** (topic-cluster silo — strong
  semantic grouping, better than by-country). `/safety-ethics/` was a dangling target → created at
  `/dark-tourism/safety-ethics/`; `/magazine/` references were remapped to `/dark-tourism/`.
- **Plan metas are fallback briefs only.** The Excel's meta titles are truncated (522 end in `…`) and
  its descriptions are templated. **You hand-write `metaTitle` + `metaDescription` in frontmatter;
  the validator requires them and enforces site-wide uniqueness.**
- **Leaf slugs were cleaned** at import (the raw plan had broken slugs like
  `what-happened-at-history-to-know-before-you-visit`). Use the slugs in `magazine-pages.json`.
- **No FAQPage / no fake AggregateRating / no per-place LocalBusiness** in structured data. FAQ stays
  visible HTML. Articles emit `Article` + `BreadcrumbList`; hubs emit `CollectionPage` + `ItemList`.
- **English content, `lang="en"`.** Keyword target is the natural head term, not the plan's templated
  `primaryKeyword` string.
- **Anti-cannibalization is real, not theoretical.** 6-9 articles can exist per entity. Each must take
  a genuinely different angle (see per-type angles below). The validator blocks ≥70% body similarity
  and warns at ≥55%. If two pages would say the same thing, **don't write the second one yet** — tell
  Loris; coverage is not worth a thin-content penalty on a low-authority domain.

---

## Writing ONE article (the loop — repeat ~640×, never in parallel)

1. `npm run mag:status` → take the **next page by publish date** (don't cherry-pick). Note LATE pages
   (due but unwritten — they silently won't ship until written).
2. Read its brief:
   ```
   node -e "const P=require('./src/data/magazine-pages.json').pages; console.log(JSON.stringify(P.find(p=>p.slug==='<slug>'),null,2))"
   ```
   It carries: type, cluster, h1/title, h2Outline, faqQuestions, semanticEntities, searchIntent,
   requiredInternalLinks, sourceUrl, guardrail, claudePrompt.
3. **Verify facts by web search** for any place/access/ticket/safety claim. Use the `sourceUrl` plus
   ≥1 more **official** source (museum/UNESCO/NPS/government advisory). Keep the URLs → frontmatter
   `sources`. **Never invent** opening hours, prices, "best time", quotes, or safety claims.
4. Write `content/magazine/<slug>.md` to the schema below. Follow the `h2Outline` headings (use `##`),
   answer every `faqQuestions` entry in `faq`, weave in `semanticEntities` naturally, add the required
   internal links + 2-4 contextual sibling links with **varied descriptive anchors** (trailing slash).
5. `npm run mag:validate` → fix until zero errors (dormant-link warnings are normal).
6. Preview: `npm run dev` → open `/dark-tourism/<...>/` (dev shows everything written, ignoring dates).
7. Commit. **Batches of 10-15 max** between checkpoints. Never write two articles in one pass.

**Recommended order:** main hub → cluster hubs → safety hub → then, per entity, the Site Hub before
its spokes (so breadcrumbs/maillage have live targets). This matches the publish-date order already.

---

## Frontmatter schema (`content/magazine/<slug>.md`)

```yaml
---
draft: false                 # true = visible in dev, hidden in prod. Omit/false when ready.
metaTitle: "..."             # REQUIRED, unique site-wide, ≤ ~60 chars, natural head term first
metaDescription: "..."       # REQUIRED, unique, 120-160 chars, compelling not templated
h1: "..."                    # optional override (else plan h1/title)
heroImage: /images/...webp   # optional (becomes OG image); heroAlt for the alt text
heroAlt: "..."
minWords: 600                # optional floor override — justify (e.g. concise comparison page)
faq:                         # required when the brief lists faqQuestions
  - q: "Question?"
    a: "Complete written answer, 2-4 sentences."
sources:                     # ≥2, official where relevant
  - "https://..."
---
Body in markdown. Headings start at `##`. Internal links: [descriptive anchor](/dark-tourism/.../).
```

---

## Rules (✓ = validator-enforced, blocking)

- ✓ Body length: **≥ 800 words** for hubs (Main/Cluster/Site/Safety Hub), **≥ 600** for articles
  (`minWords` can lower with justification).
- ✓ `metaTitle` & `metaDescription` present **and unique** across the whole magazine.
- ✓ **No em-dash `—`** anywhere in the body (use a comma, colon, or rewrite). Check before commit.
- ✓ FAQ written (`faq`) whenever the brief specifies questions.
- ✓ Every internal link (required + in-body) resolves to a real plan/site URL (dormant = OK).
- ✓ Body Jaccard 5-gram similarity **< 0.70** vs every other article (warn ≥ 0.55).
- H2s come from the brief's `h2Outline` (don't invent a different structure).
- Intro answers the search intent immediately; short paragraphs; scannable.
- ≥ 1 verified local/historical fact per H2 section on place pages; cite in `sources`.
- Tone: serious, precise, cinematic only when it serves the subject. **Forbidden:** danger porn,
  poverty porn, trophy/"conquered" language, selfie-at-memorial tone, sensationalised suffering.
- Active-conflict destinations (Afghanistan, Ukraine, etc.): write a **reality explainer**, never an
  encouragement to go — current advisory status, risks, who should not go, safer alternatives.
- Brand: tie back to Ligne Rouge only when natural (the CTA block is already rendered for every page).
- Dates shown to readers: `dd/mm/yyyy`. Data stays ISO.

### Per-type angle (keep entity pages distinct)
Site Hub = overview + what/why/how-to-visit · Top List = scannable ranked "things to know" ·
Essential Guide = full how-to-visit · Tickets/Access = transactional, official booking reality ·
Safety/Access = risk & advisory reality · Ethics = behaviour/photography/respect · History Explainer =
what happened + misconceptions · Mistakes = what visitors get wrong · Nearby/Pairing = routes & combos ·
Photography/Etiquette = rules on site · Itinerary = day-by-day · Cross-Cluster Feature = comparison/trend.

---

## Commands

```
npm run mag:status     # progress, next-to-write, LATE pages, meta collisions
npm run mag:validate   # blocking guardrail (also runs automatically in prebuild)
npm run dev            # localhost:3000 — shows everything written, ignores publish dates
npm run build          # prebuild(validate) → static export to out/  (date gate applies)
npm run mag:import     # re-import the Excel — ONLY if the .xlsx changes (local, needs python3+openpyxl)
SEO_BUILD_DATE=2026-09-01 npm run build   # simulate a future day to test the date gate
```

---

## File map

```
content/magazine/<slug>.md            articles you write (presence = written)
src/data/magazine-pages.json          briefs + publishAt           (generated — do not hand-edit)
src/data/magazine-links.json          internal-link graph          (generated — do not hand-edit)
src/lib/magazine.ts                   publication + maillage + breadcrumb + url resolution
app/dark-tourism/[[...slug]]/page.tsx route: static params (published only) + metadata + render
src/views/MagazinePageView.tsx        server-rendered hub/article view
src/components/magazine/MdLink.tsx     auto-activating internal links
src/components/magazine/JsonLd.tsx     per-page structured data
app/sitemap.ts / app/robots.ts        generated (replaced the stale static files)
scripts/excel-to-magazine.py          Excel → JSON import (local only)
scripts/validate-magazine.mjs         guardrail        scripts/magazine-status.mjs   cockpit
.github/workflows/deploy.yml          daily cron 05:00 UTC + on push → GitHub Pages
```

---

## Known gaps / TODO (not blocking the writing loop)

1. **Home/nav link to `/dark-tourism/`** is NOT wired yet (would be a dead link before the hub
   publishes). Add a "Magazine"/"Dark Tourism" link to `src/components/Navbar.tsx` (+ Footer) once the
   main hub is live, so the magazine is reachable in 1 click and passes authority.
2. **Hero images**: none yet. `heroImage` is optional; add a per-article or per-cluster image pipeline
   later (decision pending). Pages render fine without one.
3. **Existing `/expeditions/[slug]` pages are client-fetched** (empty shell to crawlers). Out of scope
   here; fix separately if expedition SEO matters.
4. **Schedule** lives in `scripts/excel-to-magazine.py` (`START_DATE`, ramp constants). Change there
   then `npm run mag:import` to re-pace. Re-import preserves nothing you hand-edited in the JSON.
