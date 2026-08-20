"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { expeditions as staticExpeditions } from "@/data/expeditions";
import type { Expedition, ExpeditionDate, Testimonial, FAQItem } from "@/data/expeditions";

async function fetchExpeditions(): Promise<Expedition[]> {
  // Single round-trip: pull the expeditions and all their children via
  // PostgREST embedding instead of one query + four follow-ups (waterfall).
  const { data, error } = await supabase
    .from("expeditions")
    .select(
      "*, expedition_days_itinerary(day_number, title, description, latitude, longitude, image_url), expedition_inclusions(item_text), expedition_exclusions(item_text), expedition_dates(id, start_date, end_date, capacity_max, spots_taken, status)"
    )
    .order("start_date", { ascending: true });

  if (error) throw error;

  return (data || []).map((exp) => {
    const e = exp as any;

    const dates: ExpeditionDate[] = (e.expedition_dates || [])
      .map((d: any) => ({
        id: d.id,
        start_date: d.start_date,
        end_date: d.end_date,
        capacity_max: d.capacity_max,
        spots_taken: d.spots_taken,
        status: d.status as ExpeditionDate["status"],
      }))
      .sort((a: ExpeditionDate, b: ExpeditionDate) => a.start_date.localeCompare(b.start_date));

    return {
      id: exp.id,
      name: exp.name,
      slug: exp.slug,
      location: exp.location,
      country: exp.country || "",
      continent: e.continent || "",
      coordinates: Array.isArray(exp.coordinates) && exp.coordinates.length === 2
        ? (exp.coordinates as [number, number])
        : [0, 0],
      start_date: exp.start_date,
      end_date: exp.end_date,
      duration_days: exp.duration_days,
      capacity_max: exp.capacity_max,
      spots_taken: exp.spots_taken,
      price_usd: exp.price_usd,
      intensity_level: exp.intensity_level,
      intensity_type: exp.intensity_type,
      difficulty_level: exp.difficulty_level,
      short_description: exp.short_description,
      long_description: exp.long_description,
      storytelling: exp.storytelling || undefined,
      cancellation_reason: e.cancellation_reason || undefined,
      status: exp.status as Expedition["status"],
      expedition_status: exp.expedition_status,
      hero_image_url: exp.hero_image_url || undefined,
      hero_image_position: exp.hero_image_position || "50% 50%",
      travelers_count: exp.travelers_count || 0,
      deposit_required: exp.deposit_required ?? true,
      deposit_amount_usd: exp.deposit_amount_usd ?? 420,
      testimonials: ((exp.testimonials as unknown) as Testimonial[]) || [],
      faqs: ((e.faqs as unknown) as FAQItem[]) || [],
      itinerary: (e.expedition_days_itinerary || [])
        .map((d: any) => ({
          day_number: d.day_number,
          title: d.title,
          description: d.description,
          latitude: d.latitude ?? undefined,
          longitude: d.longitude ?? undefined,
          image_url: d.image_url || undefined,
        }))
        .sort((a: { day_number: number }, b: { day_number: number }) => a.day_number - b.day_number),
      inclusions: (e.expedition_inclusions || []).map((i: any) => i.item_text),
      exclusions: (e.expedition_exclusions || []).map((x: any) => x.item_text),
      dates,
    };
  });
}

export function useExpeditions() {
  return useQuery({
    queryKey: ["expeditions"],
    queryFn: fetchExpeditions,
    // Render instantly from the bundled static catalog, then swap to live data
    // in the background (hero images, multiple departures, admin edits). Kept
    // in sync with the live catalog by hand — see src/data/expeditions.ts.
    placeholderData: staticExpeditions,
    // Avoid refetching on every navigation within a session.
    staleTime: 5 * 60 * 1000,
  });
}

export function useExpeditionBySlug(slug: string | undefined) {
  const { data: expeditions, ...rest } = useExpeditions();
  return {
    ...rest,
    data: expeditions?.find((e) => e.slug === slug),
  };
}

// Kept out of the main catalog surfaces (homepage grid, map, photo strip)
// while still is_hidden=false in Supabase, since is_hidden also gates its
// landing page (see 20260725171133_hide_expeditions.sql) — no is_hidden=true
// state exists that keeps the landing page working but hides the tour
// elsewhere, so it's filtered out here instead. Its own tour page
// (/expeditions/transnistria-soviet-ghost-state) and landing page
// (/lp/transnistria) are unaffected — they don't go through this hook.
const CATALOG_HIDDEN_SLUGS = ["transnistria-soviet-ghost-state"];

export function useActiveExpeditions() {
  const { data: expeditions, ...rest } = useExpeditions();
  return {
    ...rest,
    data: (expeditions || []).filter((e) => !CATALOG_HIDDEN_SLUGS.includes(e.slug)),
  };
}
