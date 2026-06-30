"use client";

import { motion } from "framer-motion";
import { NewsletterForm } from "./NewsletterForm";

const CommunitySection = () => {
  return (
    <section className="py-16 sm:py-24 bg-background border-t border-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="h-px w-12 bg-accent mx-auto mb-8" />
          <h2 className="heading-display text-2xl sm:text-3xl md:text-4xl mb-4">
            Stay on the line
          </h2>
          <p className="body-text text-muted-foreground text-sm sm:text-base max-w-xl mx-auto mb-8">
            Expedition openings and field dispatches from the territories others avoid — straight to your inbox.
          </p>

          <NewsletterForm source="home-community" />
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySection;
