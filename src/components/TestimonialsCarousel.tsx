"use client";

import { useEffect, useRef, useState } from "react";
import type { Testimonial } from "@/data/expeditions";

// Same auto-scroll mechanic as the homepage's TestimonialsSection: duplicate
// the list for a seamless loop, advance scrollLeft via rAF, pause on hover.
// scrollPos lives in a ref (not a plain local var) so it survives the
// pause/resume effect re-run instead of snapping back to the start.
const TestimonialsCarousel = ({ testimonials }: { testimonials: Testimonial[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const duplicated = [...testimonials, ...testimonials];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    let animationId: number;
    const speed = 0.5;
    const step = () => {
      if (!isPaused && container) {
        scrollPosRef.current += speed;
        if (scrollPosRef.current >= container.scrollWidth / 2) scrollPosRef.current = 0;
        container.scrollLeft = scrollPosRef.current;
      }
      animationId = requestAnimationFrame(step);
    };
    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <div className="h-px w-12 bg-accent mb-10" />
        <h2 className="heading-display text-xl sm:text-2xl mb-3">They crossed the line.</h2>
        <p className="body-text text-sm text-muted-foreground max-w-2xl">
          Real stories from an expedition like this one.
        </p>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="overflow-hidden cursor-grab"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex gap-6 px-4 w-max">
          {duplicated.map(({ name, detail, quote, image_url }, i) => (
            <div key={i} className="w-[320px] sm:w-[380px] flex-shrink-0 bg-card border border-border p-6 flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                {image_url ? (
                  <img
                    src={image_url}
                    alt={name}
                    loading="lazy"
                    className="w-14 h-14 rounded-full object-cover brightness-95 contrast-105 grayscale-[10%]"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-secondary border border-border" />
                )}
                <div>
                  <p className="font-heading text-sm font-semibold text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground">{detail}</p>
                </div>
              </div>
              <p className="body-text text-sm text-muted-foreground leading-relaxed flex-1">&quot;{quote}&quot;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
