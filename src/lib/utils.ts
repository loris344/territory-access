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
