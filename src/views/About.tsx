"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactBubbles from "@/components/ContactBubbles";
import { teamMembers } from "@/data/team";

const faqItems = [
  {
    q: "Who can apply for an expedition?",
    a: "Anyone over 18 in good physical and mental condition. No prior expedition experience is required, but a genuine willingness to step into discomfort is non-negotiable. Every application is reviewed individually. We look for mindset, not résumés.",
  },
  {
    q: "Are these destinations safe?",
    a: "Every destination is chosen and prepared with real care: experienced local guides, detailed logistics, and protocols built from real experience on the ground. We're always upfront about what to expect before you commit. Nothing is left to chance on our end.",
  },
  {
    q: "What is the selection process?",
    a: "After submitting your application, our team reviews your profile, motivation, and fitness level. Selected candidates receive a confirmation email with a detailed briefing document. We reserve the right to refuse any application without justification.",
  },
  {
    q: "What happens if an expedition is cancelled?",
    a: "If we cancel due to safety, weather, logistical, or force majeure reasons, you receive a full refund of all payments made. We do not offer compensation beyond the refund. If you cancel, our cancellation policy applies based on timing.",
  },
  {
    q: "Can I travel alone or must I join a group?",
    a: "All our scheduled expeditions are group-based with a maximum of 8 to 14 participants. However, private solo expeditions are available upon request and subject to a custom quote. Contact us directly to discuss your project.",
  },
];

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Who We Are */}
      <section className="pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="h-px w-12 bg-accent mb-10" />
            <h1 className="heading-display text-2xl sm:text-3xl md:text-4xl mb-8">Who We Are</h1>
            <p className="body-text text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
              Ligne Rouge Tours is not a travel agency. We're an expedition company built around one question:
              how far are you capable of going?
            </p>
            <p className="body-text text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
              Every expedition takes you into the wildest, most demanding landscapes on Earth: deserts, glaciers,
              jungles, high altitude, deep isolation. And draws a line for you to cross: cold, distance, effort,
              solitude. You don't need to be an expert. You need to be ready to find out what you're made of.
            </p>
            <p className="body-text text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
              We design each expedition as a genuine immersion: thoughtfully planned, intense, and built to challenge
              you in the best way. Our clients aren't tourists collecting destinations. They're people who want to
              feel something real, push past what they thought they could do, and come back changed.
            </p>
            <p className="body-text text-muted-foreground text-base sm:text-lg leading-relaxed">
              Every expedition is built around trusted local guides, careful safety planning, and a belief that
              real experience beats passive observation. We do not sell vacations. We offer a line worth crossing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="h-px w-12 bg-accent mb-10" />
          <h2 className="heading-display text-xl sm:text-2xl mb-12">Team</h2>
          <div className="space-y-12">
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-8 items-start"
              >
                <div className="w-32 h-32 flex-shrink-0 bg-card border border-border overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    className="w-full h-full object-cover brightness-90 contrast-105 grayscale-[15%]"
                  />
                </div>
                <div>
                  <h3 className="font-heading text-sm tracking-[0.1em] uppercase mb-1">{member.name}</h3>
                  <p className="font-heading text-[10px] tracking-[0.15em] uppercase text-accent-red mb-3">
                    {member.role}
                  </p>
                  <a
                    href={`mailto:${member.email}`}
                    className="body-text text-[11px] text-muted-foreground hover:text-accent-red transition-colors block mb-3"
                  >
                    {member.email}
                  </a>
                  <p className="body-text text-sm text-muted-foreground">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="h-px w-12 bg-accent mb-10" />
          <h2 className="heading-display text-xl sm:text-2xl mb-12">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {faqItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="border-l-2 border-border pl-6 hover:border-accent transition-colors"
              >
                <h3 className="font-heading text-sm tracking-[0.05em] uppercase mb-3">{item.q}</h3>
                <p className="body-text text-sm text-muted-foreground">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ContactBubbles />

      <Footer />
    </div>
  );
};

export default About;
