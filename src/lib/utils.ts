import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Serve a Supabase-stored image through the transform endpoint so browsers get
 * a much lighter WebP. It only re-encodes (quality) — NO width/height, so the
 * original dimensions are kept (no resize, no crop). Non-Supabase URLs (local
 * assets, etc.) are returned untouched.
 */
export function optimizedImageUrl(url: string, quality = 72): string {
  const marker = "/storage/v1/object/public/";
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  const origin = url.slice(0, idx);
  const [path, query] = url.slice(idx + marker.length).split("?");
  const params = new URLSearchParams(query);
  params.set("quality", String(quality));
  return `${origin}/storage/v1/render/image/public/${path}?${params.toString()}`;
}
