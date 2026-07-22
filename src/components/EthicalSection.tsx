"use client";

import { motion } from "framer-motion";

const EthicalSection = () => {
  const points = [
    "We stay within safe, stable areas. Real immersion, never recklessness.",
    "Every access point is negotiated openly with local partners, never forced.",
    "What you experience is authentic. No staged shows, no performances for tourists.",
    "Local communities come first. Always, without exception.",
  ];

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

          <h2 className="heading-display text-2xl sm:text-3xl md:text-4xl mb-6">
            How We Operate
          </h2>
          <p className="body-text text-muted-foreground text-base sm:text-lg max-w-3xl mb-10">
            Access to remarkable places comes with real responsibility. Every expedition follows a strict set of principles — this is what makes it exploration, not exploitation.
          </p>

          <ul className="space-y-4">
            {points.map((point, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="w-1.5 h-1.5 bg-accent mt-2 flex-shrink-0" />
                <span className="body-text text-muted-foreground text-base sm:text-lg">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default EthicalSection;
