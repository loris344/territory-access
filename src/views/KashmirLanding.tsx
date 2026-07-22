"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Mountain, Users, Clock, Check, MapPin, Quote } from "lucide-react";
import WaitlistModal from "@/components/WaitlistModal";
import { supabase } from "@/integrations/supabase/client";
const logoDark = "/assets/logo-dark.webp";
const gaetanImg = "/assets/gaetan.webp";
const trustGroupe = "/assets/trust-groupe.webp";
const trustGroupe2 = "/assets/trust-groupe2.webp";
const trustTony = "/assets/trust-tony.webp";
const trustMary = "/assets/trust-mary.webp";
const trustBrittany = "/assets/trust-brittany.webp";

const EXPEDITION = {
  name: "Indian Kashmir - Line of Control",
  country: "India",
  location: "Srinagar & mountains",
  slug: "indian-kashmir-line-of-control",
  price: 3700,
  duration: 7,
  intensity: "Hard",
  heroImage:
    "https://hyeqshzcujnupxxeocfy.supabase.co/storage/v1/object/public/expedition-images/a0000001-0000-0000-0000-000000000010.webp?t=1771291609044",
  shortDescription:
    "A 7-day journey through the mountains, valleys, and villages of Indian Kashmir, along one of the world's most storied frontiers.",
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
  gallery: [] as string[], // loaded dynamically from DB
};

const LIMITED_DATE = EXPEDITION.dates.find((d) => d.status === "limited");
const APPLY_URL = `/apply?expedition=${EXPEDITION.slug}${LIMITED_DATE ? `&date=${LIMITED_DATE.id}` : ""}`;

const GalleryCarousel = ({ images }: { images: string[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    let animationId: number;
    let scrollPos = 0;
    const speed = 0.6;
    const step = () => {
      if (!isPaused && container) {
        scrollPos += speed;
        if (scrollPos >= container.scrollWidth / 2) scrollPos = 0;
        container.scrollLeft = scrollPos;
      }
      animationId = requestAnimationFrame(step);
    };
    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  const doubled = [...images, ...images];

  return (
    <section
      className="py-0 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div ref={scrollRef} className="overflow-hidden" style={{ scrollbarWidth: "none" }}>
        <div className="flex gap-2 w-max">
          {doubled.map((src, i) => (
            <div key={i} className="h-[250px] sm:h-[320px] md:h-[380px] flex-shrink-0 overflow-hidden">
              <img
                src={src}
                alt={`Expedition ${i + 1}`}
                className="h-full w-auto object-cover brightness-90 contrast-105 grayscale-[10%]"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const KashmirLanding = () => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistDateId, setWaitlistDateId] = useState<string | undefined>();
  const [waitlistDateLabel, setWaitlistDateLabel] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Fetch gallery images from DB
    supabase
      .from("expedition_gallery")
      .select("image_url")
      .eq("expedition_id", EXPEDITION.expeditionId)
      .order("display_order")
      .then(({ data }) => {
        const dbImages = (data || []).map((r) => r.image_url);
        // Interleave: db image, then a trust photo every 2 db images
        const trustPhotos = [trustGroupe, trustTony, trustBrittany, trustMary, trustGroupe2];
        const mixed: string[] = [];
        let trustIdx = 0;
        for (let i = 0; i < dbImages.length; i++) {
          mixed.push(dbImages[i]);
          if ((i + 1) % 2 === 0 && trustIdx < trustPhotos.length) {
            mixed.push(trustPhotos[trustIdx++]);
          }
        }
        // Append remaining trust photos
        while (trustIdx < trustPhotos.length) {
          mixed.push(trustPhotos[trustIdx++]);
        }
        setGalleryImages(mixed);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-17 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src={logoDark} alt="Ligne Rouge Tours" className="h-14 sm:h-16 w-auto" />
          </Link>
          <Link
            href={APPLY_URL}
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
                href={APPLY_URL}
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
              { icon: Shield, title: "Safe, civilian areas", desc: "Real immersion, thoughtfully planned, never reckless." },
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

      {/* Gallery auto-scroll carousel */}
      {galleryImages.length > 0 && <GalleryCarousel images={galleryImages} />}

      {/* Transformational promise */}
      <section className="py-16 sm:py-24 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="h-px w-12 bg-accent mb-10" />
          <h2 className="heading-display text-xl sm:text-2xl mb-4">This is not a trip.</h2>
          <p className="body-text text-sm text-muted-foreground max-w-2xl mb-10">
            You will walk trails few travelers ever see. You will meet people building a life in one of the most contested valleys on Earth. You will push your limits at altitude, far from your comfort zone. And you will come home with a story that's entirely your own.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: "Push your limits", desc: "High-altitude treks, real terrain, real effort. You will discover what you're capable of." },
              { title: "A story no one else has", desc: "The Line of Control, Kashmiri villages, mountain passes: experiences that can't be bought on a booking platform." },
              { title: "See the world differently", desc: "You won't observe from a distance. You will sit with locals, understand their reality, and feel the tension firsthand." },
              { title: "Come back transformed", desc: "Every participant leaves Kashmir with a sharper perspective, a deeper confidence, and a sense of having truly lived." },
            ].map(({ title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="border-l-2 border-accent/30 pl-5"
              >
                <h3 className="font-heading text-xs tracking-[0.1em] uppercase mb-1.5">{title}</h3>
                <p className="body-text text-sm text-muted-foreground">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof - They crossed the line */}
      <section className="py-16 sm:py-24 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="h-px w-12 bg-accent mb-10" />
          <h2 className="heading-display text-xl sm:text-2xl mb-3">They crossed the line.</h2>
          <p className="body-text text-sm text-muted-foreground max-w-2xl mb-12">
            Real participants. Real expeditions. No actors, no staging, just people who chose to see the world differently.
          </p>

          {/* Testimonial quotes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
            {[
              { name: "Tony M.", detail: "UK · Expedition 2025", quote: "Walking along the Line of Control, meeting Kashmiris who live there every day, that changes you. You come back with a story no one else can tell.", img: trustTony },
              { name: "Mary D.", detail: "Journalist · Canada", quote: "The security briefings, the local contacts, the mountain treks: everything was planned to the detail. I felt safe in places I never imagined visiting.", img: trustMary },
              { name: "Brittany L.", detail: "USA · Expedition 2024", quote: "I came for the adventure, I left with a completely different perspective. The team knows this region inside out.", img: trustBrittany },
            ].map(({ name, detail, quote, img }, i) => (
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
                    <p className="font-heading text-[9px] tracking-[0.1em] uppercase text-muted-foreground/60">{detail}</p>
                  </div>
                </div>
              </motion.div>
            ))}
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

      {/* Led by */}
      <section className="py-16 sm:py-20 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-6"
          >
            <img
              src={gaetanImg}
              alt="Gaëtan"
              className="w-20 h-20 sm:w-24 sm:h-24 object-cover brightness-90 contrast-105 grayscale-[15%]"
            />
            <div>
              <p className="font-heading text-[10px] tracking-[0.2em] uppercase text-accent-red mb-1">Led by</p>
              <p className="font-heading text-sm sm:text-base tracking-[0.05em] uppercase mb-1">Gaëtan</p>
              <p className="body-text text-sm text-muted-foreground">
                Field operations lead. 10+ expeditions in conflict-adjacent regions. Fluent in crisis logistics.
              </p>
            </div>
          </motion.div>
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
              <p className="body-text text-xs text-muted-foreground/50 mt-6 italic">
                Limited permits · Local security logistics · Restricted access coordination
              </p>
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
                        href={APPLY_URL}
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
              href={APPLY_URL}
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
              href="/legal"
              className="font-heading text-[9px] tracking-[0.15em] uppercase text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              Legal
            </Link>
            <Link
              href={`/expeditions/${EXPEDITION.slug}`}
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
