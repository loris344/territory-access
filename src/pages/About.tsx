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

      {/* Contact Bubbles */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-heading text-xs sm:text-sm tracking-[0.15em] uppercase text-muted-foreground mb-10">
              You didn't find your answer?
            </p>

            <div className="flex items-center justify-center gap-[-8px] mb-8">
              {[
                { img: founderImg, name: "Loris", delay: 0 },
                { img: leaImg, name: "Léa", delay: 0.15 },
                { img: rymImg, name: "Rym", delay: 0.3 },
              ].map((person, i) => (
                <motion.div
                  key={person.name}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: person.delay, type: "spring", stiffness: 200 }}
                  animate={{ y: [0, -6, 0] }}
                  className="relative -mx-2"
                  style={{ zIndex: 3 - i }}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-accent/40 overflow-hidden shadow-[0_0_20px_rgba(209,0,0,0.15)]">
                    <img
                      src={person.img}
                      alt={person.name}
                      className="w-full h-full object-cover brightness-90 contrast-105 grayscale-[15%]"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="body-text text-sm sm:text-base text-muted-foreground mb-8 max-w-md mx-auto">
              Reach out to us directly, we'll get back to you within 24 hours.
            </p>

            <motion.a
              href="https://wa.me/33767135458"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#25D366] text-white font-heading text-xs sm:text-sm tracking-[0.1em] uppercase transition-all duration-300 hover:bg-[#20bd5a] shadow-[0_4px_20px_rgba(37,211,102,0.3)]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Contact us on WhatsApp
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
