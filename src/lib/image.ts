// Rewrite a Supabase Storage public object URL to the on-the-fly image
// transformation endpoint (resize + quality). Supabase serves WebP/AVIF to
// browsers that accept it, so the bytes drop a lot for the displayed size.
// Non-Supabase URLs (e.g. local /assets/*.webp) are returned unchanged.
export function supabaseImage(
  url: string | null | undefined,
  width: number,
  quality = 62,
): string {
  if (!url) return url ?? "";
  const marker = "/storage/v1/object/public/";
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  const origin = url.slice(0, idx);
  const [path, query] = url.slice(idx + marker.length).split("?");
  const params = new URLSearchParams({ width: String(width), quality: String(quality) });
  const t = query ? new URLSearchParams(query).get("t") : null;
  if (t) params.set("t", t);
  return `${origin}/storage/v1/render/image/public/${path}?${params.toString()}`;
}
