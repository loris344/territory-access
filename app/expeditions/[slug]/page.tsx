import type { Metadata } from "next";
import ExpeditionDetail from "@/views/ExpeditionDetail";
import { buildMetadata } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { data } = await supabase
    .from("expeditions")
    .select("name, slug, country, short_description, hero_image_url")
    .eq("slug", params.slug)
    .maybeSingle();

  if (!data) {
    return buildMetadata({ title: "Expedition", noIndex: true });
  }

  return buildMetadata({
    title: `${data.name} — ${data.country || ""}`,
    description: data.short_description,
    path: `/expeditions/${data.slug}`,
    ogImage: data.hero_image_url || undefined,
  });
}

export default function ExpeditionDetailPage() {
  // <ExpeditionDetail> reads the slug via useParams() on the client.
  return <ExpeditionDetail />;
}
