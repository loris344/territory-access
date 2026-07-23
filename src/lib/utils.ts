import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Was meant to serve Supabase-stored images through the storage transform
 * endpoint (/render/image) for a lighter WebP. That endpoint 404s on this
 * project (Image Transformations isn't enabled on the plan), which was
 * silently breaking every expedition image site-wide (broken <img> falling
 * back to its alt text). Serving the raw object URL until transforms are
 * enabled or images are pre-optimized at upload.
 */
export function optimizedImageUrl(url: string): string {
  return url;
}

/**
 * Force-downloads an image via a fetched blob rather than a plain
 * `<a href download>`, since browsers ignore the `download` attribute for
 * cross-origin URLs (all our images live on Supabase Storage or the static
 * assets domain) and would just navigate to the image instead.
 */
export async function downloadImage(url: string, filename?: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename || url.split("/").pop()?.split("?")[0] || "image";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
}
