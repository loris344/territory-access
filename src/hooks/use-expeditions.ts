"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { expeditions as staticExpeditions } from "@/data/expeditions";
import type { Expedition, ExpeditionDate } from "@/data/expeditions";

async function fetchExpeditions(): Promise<Expedition[]> {
  // Single round-trip: pull the expeditions and all their children via
  // PostgREST embedding instead of one query + four follow-ups (waterfall).
  const { data, error } = await supabase
    .from("expeditions")
    .select(
      "*, expedition_days_itinerary(day_number, title, description), expedition_inclusions(item_text), expedition_exclusions(item_text), expedition_dates(id, start_date, end_date, capacity_max, spots_taken, status)"
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
      itinerary: (e.expedition_days_itinerary || [])
        .map((d: any) => ({ day_number: d.day_number, title: d.title, description: d.description }))
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
    // in the background (hero images, multiple departures, admin edits).
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

export function useActiveExpeditions() {
  const { data: expeditions, ...rest } = useExpeditions();
  return {
    ...rest,
    data: expeditions || [],
  };
}
