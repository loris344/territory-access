import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Expedition, ExpeditionDate } from "@/data/expeditions";

async function fetchExpeditions(): Promise<Expedition[]> {
  const { data: expeditions, error } = await supabase
    .from("expeditions")
    .select("*")
    .order("start_date", { ascending: true });

  if (error) throw error;

  const ids = (expeditions || []).map((e) => e.id);

  const [itineraryRes, inclusionsRes, exclusionsRes, datesRes] = await Promise.all([
    supabase.from("expedition_days_itinerary").select("*").in("expedition_id", ids).order("day_number"),
    supabase.from("expedition_inclusions").select("*").in("expedition_id", ids),
    supabase.from("expedition_exclusions").select("*").in("expedition_id", ids),
    supabase.from("expedition_dates").select("*").in("expedition_id", ids).order("start_date"),
  ]);

  return (expeditions || []).map((exp) => {
    const dates: ExpeditionDate[] = (datesRes.data || [])
      .filter((d) => d.expedition_id === exp.id)
      .map((d) => ({
        id: d.id,
        start_date: d.start_date,
        end_date: d.end_date,
        capacity_max: d.capacity_max,
        spots_taken: d.spots_taken,
        status: d.status as ExpeditionDate["status"],
      }));

    return {
      id: exp.id,
      name: exp.name,
      slug: exp.slug,
      location: exp.location,
      country: exp.country || "",
      continent: (exp as any).continent || "",
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
      cancellation_reason: (exp as any).cancellation_reason || undefined,
      status: exp.status as Expedition["status"],
      expedition_status: exp.expedition_status,
      hero_image_url: exp.hero_image_url || undefined,
      itinerary: (itineraryRes.data || [])
        .filter((d) => d.expedition_id === exp.id)
        .map((d) => ({ day_number: d.day_number, title: d.title, description: d.description })),
      inclusions: (inclusionsRes.data || [])
        .filter((i) => i.expedition_id === exp.id)
        .map((i) => i.item_text),
      exclusions: (exclusionsRes.data || [])
        .filter((e) => e.expedition_id === exp.id)
        .map((e) => e.item_text),
      dates,
    };
  });
}

export function useExpeditions() {
  return useQuery({
    queryKey: ["expeditions"],
    queryFn: fetchExpeditions,
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
