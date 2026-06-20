#!/usr/bin/env node
/**
 * validate-magazine.mjs — blocking SEO guardrail. Runs as `prebuild`, so a violation
 * fails `next build` and NOTHING ships broken. Also runnable via `npm run mag:validate`.
 *
 * Validates every written, non-draft article in content/magazine/*.md against the plan.
 * Passes cleanly when no articles exist yet (empty content dir).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = path.join(ROOT, "content/magazine");
const PAGES = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/magazine-pages.json"), "utf8"));
const LINKS = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/magazine-links.json"), "utf8"));

const EXISTING_PUBLIC = new Set(["/", "/about/", "/apply/", "/legal/", "/expeditions/"]);
const HUB_TYPES = new Set(["Main Hub", "Cluster Hub", "Site Hub", "Safety Hub"]);
const SIMILARITY_MAX = 0.7;

const bySlug = new Map(PAGES.pages.map((p) => [p.slug, p]));
const knownUrls = new Set(PAGES.pages.map((p) => normUrl(p.url)));
for (const u of EXISTING_PUBLIC) knownUrls.add(u);

const errors = [];
const warnings = [];
function err(slug, msg) { errors.push(`  ✗ ${slug}: ${msg}`); }
function warn(slug, msg) { warnings.push(`  • ${slug}: ${msg}`); }

function normUrl(href) {
  let u = String(href).split("#")[0].split("?")[0];
  if (!u.startsWith("/")) return u;
  if (!u.endsWith("/")) u += "/";
  return u;
}
function isKnownUrl(href) {
  const u = normUrl(href);
  if (u.startsWith("/expeditions/")) return true;
  return knownUrls.has(u);
}
function wordCount(body) {
  return body.replace(/```[\s\S]*?```/g, " ").replace(/[#>*_\-\[\]()!`|]/g, " ").split(/\s+/).filter(Boolean).length;
}
function normalizeText(body) {
  return body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // link text only
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/).filter(Boolean);
}
function shingles(tokens, n = 5) {
  const s = new Set();
  for (let i = 0; i + n <= tokens.length; i++) s.add(tokens.slice(i, i + n).join(" "));
  return s;
}
function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

// ---- load written, non-draft articles --------------------------------------
const docs = [];
if (fs.existsSync(CONTENT_DIR)) {
  for (const f of fs.readdirSync(CONTENT_DIR)) {
    if (!f.endsWith(".md")) continue;
    const slug = f.replace(/\.md$/, "");
    const parsed = matter(fs.readFileSync(path.join(CONTENT_DIR, f), "utf8"));
    docs.push({ slug, fm: parsed.data || {}, body: (parsed.content || "").trim() });
  }
}
const live = docs.filter((d) => d.fm.draft !== true);

// ---- per-document checks ----------------------------------------------------
const titles = new Map();
const descs = new Map();
for (const d of live) {
  const page = bySlug.get(d.slug);
  if (!page) { err(d.slug, "slug not found in the content plan (magazine-pages.json)"); continue; }

  // metas (hand-written, required — plan metas are truncated/templated fallbacks only)
  if (!d.fm.metaTitle) err(d.slug, "missing frontmatter metaTitle (required, unique)");
  else {
    if (d.fm.metaTitle.length > 62) warn(d.slug, `metaTitle ${d.fm.metaTitle.length} chars (>62, may truncate)`);
    if (titles.has(d.fm.metaTitle)) err(d.slug, `duplicate metaTitle (also in ${titles.get(d.fm.metaTitle)})`);
    else titles.set(d.fm.metaTitle, d.slug);
  }
  if (!d.fm.metaDescription) err(d.slug, "missing frontmatter metaDescription (required, unique)");
  else {
    const n = d.fm.metaDescription.length;
    if (n < 110 || n > 165) warn(d.slug, `metaDescription ${n} chars (aim 120-160)`);
    if (descs.has(d.fm.metaDescription)) err(d.slug, `duplicate metaDescription (also in ${descs.get(d.fm.metaDescription)})`);
    else descs.set(d.fm.metaDescription, d.slug);
  }

  // H1
  if (!d.fm.h1 && !page.h1 && !page.title) err(d.slug, "no H1 (frontmatter h1 or plan h1/title)");

  // word count
  const floor = d.fm.minWords ?? (HUB_TYPES.has(page.type) ? 800 : 600);
  const wc = wordCount(d.body);
  if (wc < floor) err(d.slug, `body ${wc} words (< ${floor} floor${d.fm.minWords ? ", overridden" : ""})`);

  // em-dash ban in body
  if (d.body.includes("—")) err(d.slug, "em-dash '—' in body (banned — use a comma or rewrite)");

  // FAQ required when the brief specifies questions
  if ((page.faqQuestions?.length ?? 0) > 0) {
    const faq = d.fm.faq;
    if (!Array.isArray(faq) || faq.length === 0 || !faq.every((x) => x && x.q && x.a)) {
      err(d.slug, "brief requires a FAQ — add frontmatter faq: [{q, a}, ...]");
    }
  }

  // required internal links (from the plan) must resolve to a real URL
  for (const t of page.requiredInternalLinks || []) {
    if (!isKnownUrl(t)) err(d.slug, `required internal link points nowhere: ${t}`);
  }

  // body internal links must resolve (dormant = OK, unknown = typo = error)
  const bodyLinks = [...d.body.matchAll(/\]\((\/[^)\s]*)\)/g)].map((m) => m[1]);
  for (const href of bodyLinks) {
    if (!isKnownUrl(href)) err(d.slug, `body link to unknown URL: ${href}`);
  }
  // self-link
  if (bodyLinks.some((h) => normUrl(h) === normUrl(page.url))) warn(d.slug, "body links to itself");
}

// ---- cross-document similarity ---------------------------------------------
const shingled = live
  .filter((d) => bySlug.get(d.slug))
  .map((d) => ({ slug: d.slug, sh: shingles(normalizeText(d.body)) }));
for (let i = 0; i < shingled.length; i++) {
  for (let j = i + 1; j < shingled.length; j++) {
    const sim = jaccard(shingled[i].sh, shingled[j].sh);
    if (sim >= SIMILARITY_MAX) {
      err(shingled[i].slug, `body ${(sim * 100).toFixed(0)}% similar to ${shingled[j].slug} (max ${SIMILARITY_MAX * 100}%)`);
    } else if (sim >= 0.55) {
      warn(shingled[i].slug, `body ${(sim * 100).toFixed(0)}% similar to ${shingled[j].slug} (differentiate further)`);
    }
  }
}

// ---- report -----------------------------------------------------------------
console.log(`\nMagazine validation — ${live.length} live article(s), ${docs.length - live.length} draft(s).`);
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  console.log(warnings.join("\n"));
}
if (errors.length) {
  console.log(`\n${errors.length} ERROR(S):`);
  console.log(errors.join("\n"));
  console.log("\nBuild blocked. Fix the errors above.\n");
  process.exit(1);
}
console.log("\n✓ All checks passed.\n");
