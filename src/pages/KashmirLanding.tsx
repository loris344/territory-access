import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Mountain, Users, Clock, Check, MapPin, Quote } from "lucide-react";
import SEO from "@/components/SEO";
import WaitlistModal from "@/components/WaitlistModal";
import logoDark from "@/assets/logo-dark.png";
import trustGroupe from "@/assets/trust-groupe.jpg";
import trustGroupe2 from "@/assets/trust-groupe2.jpg";
import trustTony from "@/assets/trust-tony.jpg";
import trustMary from "@/assets/trust-mary.jpg";
import trustBrittany from "@/assets/trust-brittany.jpg";

const EXPEDITION = {
  name: "Indian Kashmir - Line of Control",
  country: "India",
  location: "Srinagar & mountains",
  slug: "indian-kashmir-line-of-control",
  price: 3700,
  duration: 7,
  intensity: "Hard",
  heroImage:
    "https://udqjkewpugdmjyrzqmbk.supabase.co/storage/v1/object/public/expedition-images/a0000001-0000-0000-0000-000000000010.webp?t=1771291609044",
  shortDescription:
    "7-day militarized mountain region expedition along one of the most heavily guarded borders in the world.",
  expeditionId: "a0000001-0000-0000-0000-000000000010",
  dates: [
    { id: "5aee8b06-2e1c-45d8-bbdb-975133b33a88", label: "Sep 9 - Sep 15, 2026", status: "closed", spots: 0 },
    { id: "3e22d985-b472-4f8a-a4a0-3ece3663d471", label: "Oct 10 - Oct 16, 2026", status: "limited", spots: 3 },
  ],
  itinerary: [
    { day: 1, title: "Srinagar arrival", desc: "Local fixer welcome. Security brief. Dal Lake houseboat setup." },
    { day: 2, title: "City under military presence", desc: "Guided historic center walk. Checkpoint observation. Local analyst meeting." },
    { day: 3, title: "Route to Line of Control zones", desc: "Road checkpoints. Mountain village setup. Distant defensive infrastructure observation." },
    { day: 4, title: "Altitude trek", desc: "5-6h mountain terrain walk. Natural valley observation points." },
    { day: 5, title: "Daily life under tension", desc: "Farmer/resident meetings. Conflict impact on local economy discussion." },
    { day: 6, title: "Return to Srinagar", desc: "Mountain road. Guided free time. Regional situation debrief." },
    { day: 7, title: "Departure", desc: "Airport transfer." },
  ],
  inclusions: [
    "Accommodation (hotel or homestay depending on location)",
    "All meals & drinks",
    "All ground transport",
    "English-speaking local guide",
    "Ligne Rouge Tours leader",
    "Visa support documents",
    "All entry fees",
    "Airport transfers",
  ],
  gallery: [
    "https://udqjkewpugdmjyrzqmbk.supabase.co/storage/v1/object/public/expedition-images/gallery-a0000001-0000-0000-0000-000000000010-1770970908765-349l.jpg?t=1770970909636",
    "https://udqjkewpugdmjyrzqmbk.supabase.co/storage/v1/object/public/expedition-images/gallery-a0000001-0000-0000-0000-000000000010-1771291864993-pu2n.webp?t=1771291866544",
    "https://udqjkewpugdmjyrzqmbk.supabase.co/storage/v1/object/public/expedition-images/gallery-a0000001-0000-0000-0000-000000000010-1771291473830-9huw.jpg?t=1771291483991",
  ],
};

const LIMITED_DATE = EXPEDITION.dates.find((d) => d.status === "limited");
const APPLY_URL = `/apply?expedition=${EXPEDITION.slug}${LIMITED_DATE ? `&date=${LIMITED_DATE.id}` : ""}`;

const KashmirLanding = () => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistDateId, setWaitlistDateId] = useState<string | undefined>();
  const [waitlistDateLabel, setWaitlistDateLabel] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Kashmir Expedition - Line of Control"
        description="7-day expedition in Indian Kashmir. Trek the militarized mountains, meet locals under tension, observe the Line of Control. Limited spots."
        path="/lp/kashmir"
        noIndex
      />

      {/* Minimal top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-17 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={logoDark} alt="Ligne Rouge Tours" className="h-14 sm:h-16 w-auto" />
          </Link>
          <Link
            to={APPLY_URL}
            className="font-heading text-[10px] tracking-[0.15em] uppercase px-5 py-2 bg-accent text-accent-foreground hover:bg-accent/90 transition-all"
          >
            Apply now
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="relative min-h-[90svh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={EXPEDITION.heroImage}
            alt="Kashmir mountains"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/60" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-heading text-[10px] sm:text-xs tracking-[0.2em] uppercase text-accent-red mb-4">
              Limited access expedition
            </p>

            <h1 className="heading-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
              Indian Kashmir
              <br />
              <span className="text-accent-red">Line of Control</span>
            </h1>

            <p className="body-text text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto mb-4">
              {EXPEDITION.shortDescription}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8 font-heading text-xs sm:text-sm tracking-wider text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {EXPEDITION.duration} days
              </span>
              <span className="flex items-center gap-1.5">
                <Mountain className="w-3.5 h-3.5" /> {EXPEDITION.intensity}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> {EXPEDITION.location}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4">
              <Link
                to={APPLY_URL}
                className="font-heading text-xs tracking-[0.15em] uppercase px-8 py-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-all w-full sm:w-auto text-center"
              >
                Apply - ${EXPEDITION.price.toLocaleString("en-US")} / pers.
              </Link>
            </div>

            <p className="font-heading text-[9px] tracking-[0.15em] uppercase text-muted-foreground/50">
              By application only · {EXPEDITION.dates[1].spots} spots remaining on next session
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Trust signals */}
      <section className="py-14 sm:py-20 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            {[
              { icon: Shield, title: "No active combat zones", desc: "Civil areas only. Real immersion, zero recklessness." },
              { icon: Users, title: "Small groups", desc: "Max 10-12 participants, carefully selected by application." },
              { icon: Mountain, title: "Physical commitment", desc: "High-altitude trekking, 5-6h walks. Real terrain, real effort." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <Icon className="w-6 h-6 text-accent-red mx-auto mb-4" />
                <h3 className="font-heading text-xs tracking-[0.1em] uppercase mb-2">{title}</h3>
                <p className="body-text text-sm text-muted-foreground">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery strip */}
      <section className="py-0">
        <div className="grid grid-cols-3 gap-0">
          {EXPEDITION.gallery.map((url, i) => (
            <div key={i} className="aspect-[16/9] overflow-hidden">
              <img
                src={url}
                alt={`Kashmir expedition ${i + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Social proof - They crossed the line */}
      <section className="py-16 sm:py-24 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="h-px w-12 bg-accent mb-10" />
          <h2 className="heading-display text-xl sm:text-2xl mb-3">They crossed the line.</h2>
          <p className="body-text text-sm text-muted-foreground max-w-2xl mb-12">
            Real participants. Real expeditions. No actors, no staging — just people who chose to see the world differently.
          </p>

          {/* Testimonial quotes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
            {[
              { name: "Tony", location: "Kashmir expedition", quote: "I've travelled to 40+ countries. Nothing came close to this level of immersion and preparation.", img: trustTony },
              { name: "Mary", location: "Previous expedition", quote: "The team's knowledge of the terrain and local context made me feel safe in places I never thought I'd visit.", img: trustMary },
              { name: "Brittany", location: "Previous expedition", quote: "You don't just observe — you live it. The briefings, the local contacts, everything is meticulously planned.", img: trustBrittany },
            ].map(({ name, location, quote, img }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border border-border p-6"
              >
                <Quote className="w-4 h-4 text-accent-red mb-4 opacity-60" />
                <p className="body-text text-sm text-muted-foreground italic mb-6">"{quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={img} alt={name} className="w-10 h-10 object-cover brightness-90 contrast-105 grayscale-[15%]" />
                  <div>
                    <p className="font-heading text-xs tracking-[0.1em] uppercase">{name}</p>
                    <p className="font-heading text-[9px] tracking-[0.1em] uppercase text-muted-foreground/60">{location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Photo grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[trustGroupe, trustTony, trustBrittany, trustGroupe2].map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="aspect-square overflow-hidden"
              >
                <img
                  src={src}
                  alt={`Expedition participant ${i + 1}`}
                  className="w-full h-full object-cover brightness-90 contrast-105 grayscale-[15%] hover:grayscale-0 hover:brightness-100 transition-all duration-500"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50">
            <span>50+ expeditions completed</span>
            <span className="hidden sm:inline">·</span>
            <span>15+ destinations</span>
            <span className="hidden sm:inline">·</span>
            <span>0 incidents</span>
          </div>
        </div>
      </section>

      {/* Itinerary */}
      <section className="py-16 sm:py-24 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="h-px w-12 bg-accent mb-10" />
          <h2 className="heading-display text-xl sm:text-2xl mb-12">7 Days on the Line</h2>

          <div className="space-y-6">
            {EXPEDITION.itinerary.map((day, i) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="border-l-2 border-border pl-6 hover:border-accent transition-colors"
              >
                <p className="font-heading text-[10px] tracking-[0.2em] uppercase text-accent-red mb-1">
                  Day {day.day}
                </p>
                <h3 className="font-heading text-sm tracking-[0.05em] uppercase mb-1">{day.title}</h3>
                <p className="body-text text-sm text-muted-foreground">{day.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="h-px w-12 bg-accent mb-8" />
              <h2 className="heading-display text-xl mb-8">What's Included</h2>
              <ul className="space-y-3">
                {EXPEDITION.inclusions.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-accent-red flex-shrink-0" />
                    <span className="body-text text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="h-px w-12 bg-border mb-8" />
              <h2 className="heading-display text-xl mb-8">Dates & Availability</h2>
              <div className="space-y-4">
                {EXPEDITION.dates.map((d, i) => (
                  <div
                    key={i}
                    className="border border-border p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-heading text-sm">{d.label}</p>
                      <p className={`font-heading text-[10px] tracking-[0.15em] uppercase mt-1 ${d.status === "limited" ? "text-accent-red" : "text-muted-foreground"}`}>
                        {d.status === "closed" ? "Full - Waitlist open" : `${d.spots} spots left`}
                      </p>
                    </div>
                    {d.status === "limited" ? (
                      <Link
                        to={APPLY_URL}
                        className="font-heading text-[10px] tracking-[0.15em] uppercase px-4 py-2 bg-accent text-accent-foreground hover:bg-accent/90 transition-all flex-shrink-0"
                      >
                        Apply
                      </Link>
                    ) : d.status === "closed" ? (
                      <button
                        onClick={() => { setWaitlistDateId(d.id); setWaitlistDateLabel(d.label); setWaitlistOpen(true); }}
                        className="font-heading text-[10px] tracking-[0.15em] uppercase px-4 py-2 bg-foreground text-background hover:bg-foreground/90 transition-all flex-shrink-0"
                      >
                        Waitlist
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-8">
              <div className="h-px w-16 bg-accent" />
            </div>

            <h2 className="heading-display text-2xl sm:text-3xl mb-4">
              Ready to cross the line?
            </h2>
            <p className="body-text text-muted-foreground text-sm sm:text-base max-w-xl mx-auto mb-8">
              Each application is reviewed individually. We select participants based on motivation, physical readiness and attitude - not first come, first served.
            </p>

            <Link
              to={APPLY_URL}
              className="inline-block font-heading text-xs tracking-[0.15em] uppercase px-10 py-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-all"
            >
              Apply for Kashmir - ${EXPEDITION.price.toLocaleString("en-US")} / pers.
            </Link>

            <p className="font-heading text-[9px] tracking-[0.15em] uppercase text-muted-foreground/40 mt-6">
              Selection only
            </p>
          </motion.div>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src={logoDark} alt="Ligne Rouge Tours" className="h-10 opacity-50" />
          <div className="flex items-center gap-6">
            <Link
              to="/legal"
              className="font-heading text-[9px] tracking-[0.15em] uppercase text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              Legal
            </Link>
            <Link
              to={`/expeditions/${EXPEDITION.slug}`}
              className="inline-flex items-center gap-2 font-heading text-[11px] tracking-[0.15em] uppercase px-5 py-2.5 border border-accent/40 text-accent hover:bg-accent hover:text-white transition-all duration-300"
            >
              Discover the full expedition →
            </Link>
          </div>
        </div>
      </footer>

      <WaitlistModal
        open={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
        expeditionId={EXPEDITION.expeditionId}
        expeditionName={EXPEDITION.name}
        expeditionDateId={waitlistDateId}
        dateLabel={waitlistDateLabel}
      />
    </div>
  );
};

export default KashmirLanding;
