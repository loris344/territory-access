import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import founderImg from "@/assets/founder.png";
import gaetanImg from "@/assets/gaetan.png";
import aymericImg from "@/assets/aymeric.jpg";
import rayaneImg from "@/assets/rayane.jpg";
import rymImg from "@/assets/rym.jpg";
import leaImg from "@/assets/lea.jpg";
import vitalyImg from "@/assets/vitaly.jpg";

const faqItems = [
  {
    q: "Who can apply for an expedition?",
    a: "Anyone over 18 in good physical and mental condition. No prior expedition experience is required, but a genuine willingness to step outside your comfort zone is mandatory. Each application is reviewed individually.",
  },
  {
    q: "Are these destinations safe?",
    a: "We operate in territories that carry inherent risks. We mitigate those risks through meticulous planning, trusted local fixers, and strict operational protocols. However, we cannot eliminate all dangers, and we do not pretend to. You travel at your own risk with full awareness.",
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

const teamMembers = [
  {
    name: "Loris",
    role: "Founder & Expedition Leader",
    bio: "Passionate about extreme travel and geopolitics. Has explored over 38 countries including conflict zones, disputed territories, and restricted-access regions before founding Ligne Rouge Tours.",
    image: founderImg,
    email: "loris@lignerougetours.com",
  },
  {
    name: "Gaëtan",
    role: "Operations & Logistics Coordinator",
    bio: "Handles the operational backbone of every expedition, from route planning to on-ground logistics across complex territories.",
    image: gaetanImg,
    email: "gaetan@lignerougetours.com",
  },
  {
    name: "Aymeric",
    role: "Field Operations Analyst",
    bio: "Specializes in risk assessment and field intelligence. Ensures every expedition meets strict security standards before departure.",
    image: aymericImg,
    email: "aymeric@lignerougetours.com",
  },
  {
    name: "Rayane",
    role: "Expedition Guide & Fixer Liaison",
    bio: "Coordinates with local fixers and guides across North Africa and the Middle East. Expert in navigating culturally sensitive environments.",
    image: rayaneImg,
    email: "rayane@lignerougetours.com",
  },
  {
    name: "Vitaly",
    role: "Strategic Partnerships & Development",
    bio: "Builds relationships with local operators and institutional partners to open access to restricted and emerging destinations.",
    image: vitalyImg,
    email: "vitaly@lignerougetours.com",
  },
  {
    name: "Rym",
    role: "Marketing & Brand Strategy",
    bio: "Shapes the brand's visual identity and narrative. Drives awareness through content strategy and digital campaigns.",
    image: rymImg,
    email: "rym@lignerougetours.com",
  },
  {
    name: "Léa",
    role: "Communications & Community Manager",
    bio: "Manages client relations, social media presence, and community engagement. The first point of contact for aspiring expedition members.",
    image: leaImg,
    email: "lea@lignerougetours.com",
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
              Ligne Rouge Tours is not a travel agency. We are an expedition company that operates in territories most
              operators refuse to approach: conflict zones, politically sensitive regions, extreme environments, and
              unrecognized states.
            </p>
            <p className="body-text text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
              We design each expedition as a structured immersion: controlled, intense, and deliberately uncomfortable.
              Our clients are not tourists. They are professionals, entrepreneurs, and individuals who refuse to observe
              the world from a distance.
            </p>
            <p className="body-text text-muted-foreground text-base sm:text-lg leading-relaxed">
              Every expedition is built around local fixers, strict security protocols, and a philosophy that values
              direct exposure over passive observation. We do not sell vacations. We offer access.
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

      <Footer />
    </div>
  );
};

export default About;
