"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Expedition, ExpeditionDate } from "@/data/expeditions";

export interface TrustSignal {
  icon: string;
  title: string;
  desc: string;
}

export interface PromiseBullet {
  title: string;
  desc: string;
}

export interface LandingTestimonial {
  name: string;
  detail: string;
  quote: string;
  image_url: string;
}

export interface LandingPageData {
  id: string;
  slug: string;
  is_published: boolean;
  tagline: string;
  headline: string;
  subheadline: string;
  hero_image_url: string | null;
  trust_signals: TrustSignal[];
  promise_intro: string;
  promise_bullets: PromiseBullet[];
  testimonials: LandingTestimonial[];
  led_by_name: string;
  led_by_bio: string;
  led_by_image_url: string | null;
  gallery_trust_images: string[];
  expedition: Expedition;
  galleryImages: string[];
}

// A landing page only owns its marketing wrapper (headline, trust signals,
// testimonials, "led by", extra trust photos). Everything else — price,
// dates, itinerary, inclusions, gallery — is read live from the linked
// expedition via `expedition_id`, the same way the normal tour detail page
// does, so editing a tour in /admin stays in sync everywhere it's shown.
async function fetchLandingPage(slug: string): Promise<LandingPageData | null> {
  const { data, error } = await supabase
    .from("landing_pages")
    .select(
      "*, expeditions(*, expedition_dates(id, start_date, end_date, capacity_max, spots_taken, status), expedition_days_itinerary(day_number, title, description), expedition_inclusions(item_text), expedition_exclusions(item_text), expedition_gallery(image_url, display_order))"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const exp = (data as any).expeditions;
  if (!exp) return null;

  const dates: ExpeditionDate[] = (exp.expedition_dates || [])
    .map((d: any) => ({
      id: d.id,
      start_date: d.start_date,
      end_date: d.end_date,
      capacity_max: d.capacity_max,
      spots_taken: d.spots_taken,
      status: d.status as ExpeditionDate["status"],
    }))
    .sort((a: ExpeditionDate, b: ExpeditionDate) => a.start_date.localeCompare(b.start_date));

  const expedition: Expedition = {
    id: exp.id,
    name: exp.name,
    slug: exp.slug,
    location: exp.location,
    country: exp.country || "",
    continent: exp.continent || "",
    coordinates:
      Array.isArray(exp.coordinates) && exp.coordinates.length === 2
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
    status: exp.status as Expedition["status"],
    expedition_status: exp.expedition_status,
    hero_image_url: exp.hero_image_url || undefined,
    itinerary: (exp.expedition_days_itinerary || [])
      .map((d: any) => ({ day_number: d.day_number, title: d.title, description: d.description }))
      .sort((a: { day_number: number }, b: { day_number: number }) => a.day_number - b.day_number),
    inclusions: (exp.expedition_inclusions || []).map((i: any) => i.item_text),
    exclusions: (exp.expedition_exclusions || []).map((x: any) => x.item_text),
    dates,
  };

  const galleryImages: string[] = (exp.expedition_gallery || [])
    .slice()
    .sort((a: any, b: any) => a.display_order - b.display_order)
    .map((g: any) => g.image_url);

  return {
    id: data.id,
    slug: data.slug,
    is_published: data.is_published,
    tagline: data.tagline,
    headline: data.headline,
    subheadline: data.subheadline,
    hero_image_url: data.hero_image_url,
    trust_signals: ((data.trust_signals as unknown) as TrustSignal[]) || [],
    promise_intro: data.promise_intro,
    promise_bullets: ((data.promise_bullets as unknown) as PromiseBullet[]) || [],
    testimonials: ((data.testimonials as unknown) as LandingTestimonial[]) || [],
    led_by_name: data.led_by_name,
    led_by_bio: data.led_by_bio,
    led_by_image_url: data.led_by_image_url,
    gallery_trust_images: ((data.gallery_trust_images as unknown) as string[]) || [],
    expedition,
    galleryImages,
  };
}

export function useLandingPage(slug: string | undefined) {
  return useQuery({
    queryKey: ["landing-page", slug],
    queryFn: () => fetchLandingPage(slug as string),
    enabled: !!slug,
  });
}
