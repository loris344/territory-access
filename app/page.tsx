import Index from "@/views/Index";
import { supabase } from "@/integrations/supabase/client";

// Fetch the live hero images at build time so the static export's first
// paint already matches the admin's current selection - otherwise the
// client-side fetch in HeroSection briefly shows the old bundled fallback
// image before swapping to the real one on every page load.
async function getInitialHeroImages(): Promise<string[]> {
  const { data } = await supabase
    .from("hero_images")
    .select("image_url")
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  return (data || []).map((d) => d.image_url);
}

export default async function HomePage() {
  const initialHeroImages = await getInitialHeroImages();
  return <Index initialHeroImages={initialHeroImages} />;
}
