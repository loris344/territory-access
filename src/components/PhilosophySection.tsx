"use client";

import { motion } from "framer-motion";

const PhilosophySection = () => {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="h-px w-12 bg-accent mb-10" />

          <h2 className="heading-display text-2xl sm:text-3xl md:text-4xl mb-10">
            Beyond the Ordinary
          </h2>

          <div className="space-y-6 body-text text-muted-foreground text-base sm:text-lg max-w-3xl">
            <p>We don't sell vacations. We design real encounters with the world.</p>
            <p>
              Every expedition is built around genuine immersion: remarkable landscapes,
              layered cultures, and places that ask something of you. You don't watch
              from the outside — you take part.
            </p>
            <p>
              Small groups. Trusted local guides and fixers who know these places inside out.
              No scripts, no crowds, no spectators.
            </p>
            <p className="font-heading text-[10px] tracking-[0.15em] uppercase text-accent/80 pt-2">
              Each expedition is limited to a small number of participants, carefully selected.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PhilosophySection;
