"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FAQItem } from "@/data/expeditions";

const TourFAQSection = ({ items }: { items: FAQItem[] }) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 border-t border-border">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="h-px w-12 bg-accent mb-10" />
          <h2 className="heading-display text-xl sm:text-2xl mb-10">
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="space-y-2">
            {items.map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border px-6 data-[state=open]:border-accent/30 transition-colors"
              >
                <AccordionTrigger className="font-heading text-xs sm:text-sm tracking-[0.05em] uppercase text-left py-5 hover:no-underline hover:text-accent-red transition-colors">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="body-text text-sm text-muted-foreground pb-5 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default TourFAQSection;
