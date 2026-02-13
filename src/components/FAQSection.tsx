import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    q: "Who can apply for an expedition?",
    a: "Anyone over 18 in good physical and mental condition. No prior expedition experience is required, but a genuine willingness to step outside your comfort zone is mandatory. Each application is reviewed individually.",
  },
  {
    q: "Are these destinations safe?",
    a: "We operate in territories that carry inherent risks. We mitigate those risks through meticulous planning, trusted local fixers, and strict operational protocols. However, we cannot eliminate all dangers — and we do not pretend to. You travel at your own risk with full awareness.",
  },
  {
    q: "What is the selection process?",
    a: "After submitting your application, our team reviews your profile, motivation, and fitness level. Selected candidates receive a confirmation email with a detailed briefing document. We reserve the right to refuse any application without justification.",
  },
  {
    q: "What happens if an expedition is cancelled?",
    a: "If we cancel due to security, political, or force majeure reasons, you receive a full refund of all payments made. We do not offer compensation beyond the refund. If you cancel, our cancellation policy applies based on timing.",
  },
  {
    q: "Can I travel alone or must I join a group?",
    a: "All our scheduled expeditions are group-based with a maximum of 8 to 14 participants. However, private solo expeditions are available upon request and subject to a custom quote. Contact us directly to discuss your project.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-16 lg:py-24">
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
            {faqItems.map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border px-6 data-[state=open]:border-accent/30 transition-colors"
              >
                <AccordionTrigger className="font-heading text-xs sm:text-sm tracking-[0.05em] uppercase text-left py-5 hover:no-underline hover:text-accent-red transition-colors">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="body-text text-sm text-muted-foreground pb-5 leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
