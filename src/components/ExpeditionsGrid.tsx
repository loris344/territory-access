"use client";

import { motion } from "framer-motion";
import { useActiveExpeditions } from "@/hooks/use-expeditions";
import { useIsMobile } from "@/hooks/use-mobile";
import ExpeditionCard from "./ExpeditionCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useMemo } from "react";

const ExpeditionsGrid = () => {
  const { data: expeditions, isLoading } = useActiveExpeditions();
  const isMobile = useIsMobile();

  const groupedByContinent = useMemo(() => {
    if (!expeditions) return {};
    return expeditions.reduce<Record<string, typeof expeditions>>((acc, exp) => {
      const continent = exp.continent || "Other";
      if (!acc[continent]) acc[continent] = [];
      acc[continent].push(exp);
      return acc;
    }, {});
  }, [expeditions]);

  if (isLoading) {
    return (
      <section id="expeditions" className="scroll-mt-20 py-16 sm:py-24 lg:py-32 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-heading text-sm tracking-wider uppercase text-muted-foreground text-center">Loading expeditions...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="expeditions" className="scroll-mt-20 py-16 sm:py-24 lg:py-32 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="h-px w-12 bg-accent mb-10" />
          <h2 className="heading-display text-2xl sm:text-3xl md:text-4xl">
            Current Expeditions
          </h2>
        </motion.div>

        {isMobile ? (
          <div className="space-y-12">
            {Object.entries(groupedByContinent).map(([continent, exps]) => (
              <motion.div
                key={continent}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="font-heading text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
                  {continent}
                </h3>
                <div className="h-px w-8 bg-accent/40 mb-5" />
                <Carousel
                  opts={{ align: "start", loop: false, dragFree: true, containScroll: "trimSnaps" }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-3">
                    {exps.map((expedition) => (
                      <CarouselItem
                        key={expedition.slug}
                        className="pl-3 basis-[85%]"
                      >
                        <ExpeditionCard expedition={expedition} hidePrice />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expeditions.map((expedition, i) => (
              <motion.div
                key={expedition.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <ExpeditionCard expedition={expedition} hidePrice />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ExpeditionsGrid;
