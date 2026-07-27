"use client";

import { useEffect, useRef, useState } from "react";
import { useDragScroll } from "@/hooks/use-drag-scroll";

const GalleryCarousel = ({ images }: { images: string[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const { isDraggingRef, isDragging, dragHandlers } = useDragScroll(scrollRef, scrollPosRef);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    let animationId: number;
    const speed = 0.6;
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

  const doubled = [...images, ...images];

  return (
    <section
      className="py-0 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={scrollRef}
        className={`overflow-hidden select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{ scrollbarWidth: "none", touchAction: "pan-y" }}
        {...dragHandlers}
      >
        <div className="flex gap-2 w-max">
          {doubled.map((src, i) => (
            <div key={i} className="h-[250px] sm:h-[320px] md:h-[380px] flex-shrink-0 overflow-hidden">
              <img
                src={src}
                alt={`Expedition ${i + 1}`}
                className="h-full w-auto object-cover brightness-90 contrast-105 grayscale-[10%]"
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryCarousel;
