"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useActiveExpeditions } from "@/hooks/use-expeditions";
import { useDragScroll } from "@/hooks/use-drag-scroll";

// Real Ligne Rouge trip photos (from the group's own "tour group" folder,
// uploaded to expedition-images/homepage-tour-photos) — this strip shows
// ONLY these, never a tour's generic hero image. A tour with no entry here
// simply doesn't appear in this section. Object order below IS display
// order (see `tours` construction) — not derived from expedition dates.
const CURATED_PHOTOS: Record<string, string> = {
  "socotra-extreme-isolation": "socotra-extreme-isolation.webp",
  "svalbard-arctic-survival": "svalbard-arctic-survival.webp",
  "chechnya-authority-reconstruction": "chechnya-authority-reconstruction.webp",
  "xinjiang-surveillance-frontier": "xinjiang-surveillance-frontier.webp",
  "transnistria-soviet-ghost-state": "transnistria-soviet-ghost-state.webp",
  "altai-mongolia-eagle-hunters": "altai-mongolia-eagle-hunters.webp",
  "lebanon-business-of-war": "lebanon-business-of-war.webp",
  "pamir-highway-tajikistan": "pamir-highway-tajikistan.webp",
};

const CURATED_BASE_URL =
  "https://hyeqshzcujnupxxeocfy.supabase.co/storage/v1/object/public/expedition-images/homepage-tour-photos/";

// Same auto-scroll + drag mechanic as the other homepage carousels: duplicate
// the list for a seamless loop, advance scrollLeft via rAF, pause on hover,
// grab-to-scroll with a finger or cursor.
const TourPhotosSection = () => {
  const { data: expeditions } = useActiveExpeditions();
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const { isDraggingRef, isDragging, dragHandlers } = useDragScroll(scrollRef, scrollPosRef);

  const tours = Object.keys(CURATED_PHOTOS)
    .map((slug) => (expeditions || []).find((e) => e.slug === slug))
    .filter((e): e is NonNullable<typeof e> => Boolean(e))
    .map((e) => ({
      slug: e.slug,
      name: e.name,
      photo: `${CURATED_BASE_URL}${CURATED_PHOTOS[e.slug]}`,
    }));
  const duplicated = [...tours, ...tours];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || tours.length === 0) return;
    let animationId: number;
    const speed = 0.5;
    const step = () => {
      if (!isPaused && !isDraggingRef.current && container) {
        scrollPosRef.current += speed;
        if (scrollPosRef.current >= container.scrollWidth / 2) scrollPosRef.current = 0;
        container.scrollLeft = scrollPosRef.current;
      }
      animationId = requestAnimationFrame(step);
    };
    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused, isDraggingRef, tours.length]);

  if (tours.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 border-b border-border bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <div className="h-px w-12 bg-accent mb-10" />
        <h2 className="heading-display text-xl sm:text-2xl mb-3">Every Line on the Map</h2>
        <p className="body-text text-sm text-muted-foreground max-w-2xl">
          A glimpse of the places behind the pins, shot on expedition.
        </p>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className={`overflow-hidden select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", touchAction: "pan-y" }}
        {...dragHandlers}
      >
        <div className="flex gap-3 px-4 w-max">
          {duplicated.map(({ slug, name, photo }, i) => (
            <Link
              key={i}
              href={`/expeditions/${slug}`}
              draggable={false}
              className="relative w-[260px] sm:w-[320px] h-[340px] sm:h-[400px] flex-shrink-0 overflow-hidden block group"
            >
              <img
                src={photo}
                alt={name}
                loading="lazy"
                draggable={false}
                className="w-full h-full object-cover brightness-90 contrast-105 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 font-heading text-xs tracking-[0.1em] uppercase text-foreground">
                {name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TourPhotosSection;
