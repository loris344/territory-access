#!/usr/bin/env node
/**
 * magazine-status.mjs — production cockpit. `npm run mag:status`.
 * Shows progress, the next pages to write, LATE pages (due but unwritten -> would
 * silently never ship), and meta collisions among written articles.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = path.join(ROOT, "content/magazine");
const PAGES = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/magazine-pages.json"), "utf8"));

const today = (process.env.SEO_BUILD_DATE && /^\d{4}-\d{2}-\d{2}$/.test(process.env.SEO_BUILD_DATE))
  ? process.env.SEO_BUILD_DATE
  : new Date().toISOString().slice(0, 10);

function readDoc(slug) {
  const file = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  return matter(fs.readFileSync(file, "utf8")).data || {};
}

let written = 0;
const counts = { planifie: 0, redaction: 0, relecture: 0, publie: 0 };
const late = [];
const titles = new Map();
const descs = new Map();
const dupTitle = [];
const dupDesc = [];

for (const p of PAGES.pages) {
  const fm = readDoc(p.slug);
  let state;
  if (!fm) state = "planifie";
  else {
    written++;
    if (fm.metaTitle) { if (titles.has(fm.metaTitle)) dupTitle.push([p.slug, titles.get(fm.metaTitle)]); else titles.set(fm.metaTitle, p.slug); }
    if (fm.metaDescription) { if (descs.has(fm.metaDescription)) dupDesc.push([p.slug, descs.get(fm.metaDescription)]); else descs.set(fm.metaDescription, p.slug); }
    if (fm.draft === true) state = "redaction";
    else if (p.publishAt > today) state = "relecture";
    else state = "publie";
  }
  counts[state]++;
  if (!fm && p.publishAt <= today) late.push(p);
}

const total = PAGES.pages.length;
const pct = Math.round((written / total) * 100);
const bar = "█".repeat(Math.round(pct / 2.5)).padEnd(40, "░");

console.log(`\n  Ligne Rouge — dark-tourism magazine    (build date ${today})`);
console.log(`  ${bar} ${pct}%   ${written}/${total} written\n`);
console.log(`  published ${counts.publie}   ready (awaiting date) ${counts.relecture}   draft ${counts.redaction}   not written ${counts.planifie}`);
console.log(`  schedule: ${PAGES.meta.schedule.rampPerDay}/day for ${PAGES.meta.schedule.rampDays}d then ${PAGES.meta.schedule.cruisePerDay}/day · last slot ${PAGES.meta.schedule.lastPublishAt}`);

if (late.length) {
  console.log(`\n  ⚠ ${late.length} LATE page(s) — due but not written (they will NOT ship until written):`);
  for (const p of late.slice(0, 12)) console.log(`     ${p.publishAt}  ${p.type.padEnd(16)} ${p.url}`);
  if (late.length > 12) console.log(`     ... and ${late.length - 12} more`);
}

const upcoming = PAGES.pages
  .filter((p) => !readDoc(p.slug))
  .sort((a, b) => a.publishAt.localeCompare(b.publishAt))
  .slice(0, 10);
console.log(`\n  Next ${upcoming.length} to write (by publish date):`);
for (const p of upcoming) {
  console.log(`     ${p.publishAt}  ${String(p.priority).padEnd(2)} ${p.type.padEnd(16)} ${p.url}`);
}

if (dupTitle.length || dupDesc.length) {
  console.log(`\n  ⚠ meta collisions among written articles:`);
  for (const [a, b] of dupTitle) console.log(`     title:  ${a}  ==  ${b}`);
  for (const [a, b] of dupDesc) console.log(`     desc:   ${a}  ==  ${b}`);
}
console.log("");
