"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
const heroBg = "/assets/hero-bg.webp";

const HeroSection = () => {
  const [heroImages, setHeroImages] = useState<string[]>([heroBg]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchHeroImages = async () => {
      const { data } = await supabase
        .from("hero_images")
        .select("image_url")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (data && data.length > 0) {
        setHeroImages(data.map((d) => d.image_url));
      }
    };
    fetchHeroImages();
  }, []);

  const pickRandom = useCallback(() => {
    setCurrentIndex((prev) => {
      let next: number;
      do {
        next = Math.floor(Math.random() * heroImages.length);
      } while (next === prev && heroImages.length > 1);
      return next;
    });
  }, [heroImages.length]);

  useEffect(() => {
    const interval = setInterval(pickRandom, 10000);
    return () => clearInterval(interval);
  }, [pickRandom]);

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.img
            key={currentIndex}
            src={heroImages[currentIndex]}
            alt=""
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover object-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-background/65" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* initial={false}: render the headline at rest immediately (no JS-gated
            fade-in) so it is the LCP and paints without waiting for hydration. */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Red line accent */}
          <div className="flex justify-center mb-6 sm:mb-10">
            <motion.div
              className="h-px bg-accent"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 1.2, delay: 0.5 }}
            />
          </div>

          <h1 className="heading-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-5 sm:mb-8">
            We organize expeditions
            <br />
            <span className="text-accent-red">in territories others avoid.</span>
          </h1>

          <p className="body-text text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto mb-3 sm:mb-5">
            For those who refuse to observe the world from a distance.
          </p>
          <p className="font-heading text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-8 sm:mb-12">
            By application only · Limited seats per expedition
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href="#expeditions"
              className="font-heading text-[10px] sm:text-xs tracking-[0.15em] uppercase px-6 sm:px-8 py-3 sm:py-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 w-full sm:w-auto text-center"
            >
              View current expeditions
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
