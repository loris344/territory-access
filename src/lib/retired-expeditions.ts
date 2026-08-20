// Slugs of tours removed from the catalog on 2026-08-20 when the site moved
// off the old geopolitical/conflict-zone positioning. Their pages are gone
// (deleted from Supabase, storage, and the static fallback), but the URLs
// were live and indexable before that, so they get a soft redirect instead
// of a bare 404 — see app/expeditions/[slug]/page.tsx.
export const RETIRED_EXPEDITION_SLUGS = [
  "socotra-extreme-isolation",
  "svalbard-arctic-survival",
  "north-korea-total-system-immersion",
  "chechnya-authority-reconstruction",
  "abkhazia-suspended-republic",
  "afghanistan-wakhan-corridor",
  "indian-kashmir-line-of-control",
  "iraqi-kurdistan-peshmerga-lines",
  "somaliland-unrecognized-territory",
  "syria-after-the-regime",
  "south-ossetia-unrecognized-frontier",
  "turkmenistan-closed-kingdom",
  "xinjiang-surveillance-frontier",
  "libya-gaddafi-legacy",
  "eritrea-sealed-state",
  "pamir-highway-tajikistan",
  "lebanon-business-of-war",
  "papua-sepik-baliem-bougainville",
  "kaliningrad-soviet-exclave",
  "virunga-militarized-gorilla-trek",
  "mauritania-lost-cities-sahara",
] as const;
