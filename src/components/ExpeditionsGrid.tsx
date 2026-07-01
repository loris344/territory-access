"use client";

import { motion } from "framer-motion";
import { useActiveExpeditions } from "@/hooks/use-expeditions";
import { useIsMobile } from "@/hooks/use-mobile";
import ExpeditionCard from "./ExpeditionCard";
import { NewsletterForm } from "./NewsletterForm";
import { useMemo } from "react";

// North Korea stays where it is even though it's cancelled (kept on purpose).
const isNorthKorea = (e: { slug?: string; name?: string }) =>
  (e.slug ?? "").includes("north-korea") || /north korea/i.test(e.name ?? "");

// On mobile, push cancelled tours to the END of each continent's swipe so the
// row leads with bookable expeditions. Stable: same-rank items keep their order.
const mobileRank = (e: { status?: string; slug?: string; name?: string }) =>
  e.status === "cancelled" && !isNorthKorea(e) ? 1 : 0;

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
          <p className="body-text text-xs text-muted-foreground mt-3 tracking-wider uppercase">
            By application only · Limited seats per expedition
          </p>

          <div className="mt-8 max-w-md">
            <p className="font-heading text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
              Join the list for early access to new departures
            </p>
            <NewsletterForm source="expeditions-grid" align="left" />
          </div>
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
                {/* Native horizontal scroll = GPU/compositor-driven momentum,
                    as fluid as a social-media card row (embla runs on the JS
                    main thread and can't match it). scroll-snap keeps cards
                    aligned. */}
                <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 [-webkit-overflow-scrolling:touch] [overscroll-behavior-x:contain] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {[...exps].sort((a, b) => mobileRank(a) - mobileRank(b)).map((expedition) => (
                    <div
                      key={expedition.slug}
                      className="snap-start shrink-0 w-[85%]"
                    >
                      <ExpeditionCard expedition={expedition} hidePrice />
                    </div>
                  ))}
                </div>
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
                transition={{ duration: 0.4, delay: Math.min(i, 5) * 0.06 }}
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
