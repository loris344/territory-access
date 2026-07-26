"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { teamMembers } from "@/data/team";
import { useDragScroll } from "@/hooks/use-drag-scroll";

// Same auto-scroll + drag mechanic as TestimonialsCarousel: duplicate the
// list for a seamless loop, advance scrollLeft via rAF, pause on hover,
// grab-to-scroll with a finger or cursor.
const TeamCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const { isDraggingRef, isDragging, dragHandlers } = useDragScroll(scrollRef, scrollPosRef);
  const duplicated = [...teamMembers, ...teamMembers];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
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
  }, [isPaused, isDraggingRef]);

  return (
    <section className="py-16 sm:py-24 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <div className="h-px w-12 bg-accent mb-10" />
        <h2 className="heading-display text-xl sm:text-2xl mb-3">The Team Behind Every Expedition</h2>
        <p className="body-text text-sm text-muted-foreground max-w-2xl">
          Real people, on the ground and behind the scenes, who plan and lead every departure.
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
        <div className="flex gap-6 px-4 w-max">
          {duplicated.map(({ name, role, bio, image }, i) => (
            <div key={i} className="w-[240px] sm:w-[280px] flex-shrink-0 bg-card border border-border p-6 flex flex-col items-center text-center">
              <img
                src={image}
                alt={name}
                loading="lazy"
                draggable={false}
                className="w-20 h-20 rounded-full object-cover brightness-95 contrast-105 grayscale-[15%] mb-4"
              />
              <p className="font-heading text-sm font-semibold text-foreground">{name}</p>
              <p className="font-heading text-[10px] tracking-[0.1em] uppercase text-accent-red mt-1 mb-3">{role}</p>
              <p className="body-text text-xs text-muted-foreground leading-relaxed line-clamp-3">{bio}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        <Link
          href="/about"
          className="font-heading text-[10px] tracking-[0.15em] uppercase text-accent-red hover:underline"
        >
          Meet the full team →
        </Link>
      </div>
    </section>
  );
};

export default TeamCarousel;
