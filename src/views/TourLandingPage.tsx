"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Shield,
  Mountain,
  Users,
  Clock,
  Check,
  MapPin,
  Quote,
  Compass,
  type LucideIcon,
} from "lucide-react";
import WaitlistModal from "@/components/WaitlistModal";
import ItineraryMap from "@/components/ItineraryMap";
import ApplicationForm from "@/components/ApplicationForm";
import { useLandingPage, type LandingTestimonial } from "@/hooks/use-landing-page";
import { optimizedImageUrl } from "@/lib/utils";
const logoDark = "/assets/logo-dark.webp";

const ICONS: Record<string, LucideIcon> = { Shield, Mountain, Users, Clock, Check, MapPin, Quote };

const GalleryCarousel = ({ images }: { images: string[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    let animationId: number;
    const speed = 0.6;
    const step = () => {
      if (!isPaused && container) {
        scrollPosRef.current += speed;
        if (scrollPosRef.current >= container.scrollWidth / 2) scrollPosRef.current = 0;
        container.scrollLeft = scrollPosRef.current;
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

// Same auto-scroll mechanic as the homepage's TestimonialsSection: duplicate
// the list for a seamless loop, advance scrollLeft via rAF, pause on hover.
const TestimonialsCarousel = ({ testimonials }: { testimonials: LandingTestimonial[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const duplicated = [...testimonials, ...testimonials];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    let animationId: number;
    const speed = 0.5;
    const step = () => {
      if (!isPaused && container) {
        scrollPosRef.current += speed;
        if (scrollPosRef.current >= container.scrollWidth / 2) scrollPosRef.current = 0;
        container.scrollLeft = scrollPosRef.current;
      }
      animationId = requestAnimationFrame(step);
    };
    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <section className="py-16 sm:py-24 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <div className="h-px w-12 bg-accent mb-10" />
        <h2 className="heading-display text-xl sm:text-2xl mb-3">They crossed the line.</h2>
        <p className="body-text text-sm text-muted-foreground max-w-2xl">
          Real participants. Real expeditions. No actors, no staging, just people who chose to see the world differently.
        </p>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="overflow-hidden cursor-grab"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex gap-6 px-4 w-max">
          {duplicated.map(({ name, detail, quote, image_url }, i) => (
            <div key={i} className="w-[320px] sm:w-[380px] flex-shrink-0 bg-card border border-border p-6 flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                {image_url ? (
                  <img
                    src={image_url}
                    alt={name}
                    loading="lazy"
                    className="w-14 h-14 rounded-full object-cover brightness-95 contrast-105 grayscale-[10%]"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-secondary border border-border" />
                )}
                <div>
                  <p className="font-heading text-sm font-semibold text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground">{detail}</p>
                </div>
              </div>
              <p className="body-text text-sm text-muted-foreground leading-relaxed flex-1">&quot;{quote}&quot;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TourLandingPage = () => {
  const { slug } = useParams() as { slug: string };
  const { data: lp, isLoading } = useLandingPage(slug);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistDateId, setWaitlistDateId] = useState<string | undefined>();
  const [waitlistDateLabel, setWaitlistDateLabel] = useState("");
  const [selectedDateId, setSelectedDateId] = useState<string | undefined>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!lp) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="heading-display text-2xl mb-4">Page not found</h1>
          <Link href="/" className="text-accent-red font-heading text-xs tracking-[0.15em] uppercase">
            ← Return to base
          </Link>
        </div>
      </div>
    );
  }

  const { expedition } = lp;
  const today = new Date().toISOString().split("T")[0];
  const upcomingDates = (expedition.dates || []).filter((d) => d.end_date >= today && d.status !== "cancelled" && d.status !== "postponed");
  const featuredDate = upcomingDates.find((d) => d.status === "open" || d.status === "limited") || upcomingDates[0];
  const remaining = featuredDate ? featuredDate.capacity_max - featuredDate.spots_taken : null;
  const heroImage = optimizedImageUrl(lp.hero_image_url || expedition.hero_image_url || "");

  // Gallery: expedition photos with the landing page's own trust photos
  // interleaved every 2 images (a request-time mix, not stored pre-merged).
  const galleryImages = (() => {
    if (lp.gallery_trust_images.length === 0) return lp.galleryImages;
    const mixed: string[] = [];
    let trustIdx = 0;
    lp.galleryImages.forEach((img, i) => {
      mixed.push(img);
      if ((i + 1) % 2 === 0 && trustIdx < lp.gallery_trust_images.length) {
        mixed.push(lp.gallery_trust_images[trustIdx++]);
      }
    });
    while (trustIdx < lp.gallery_trust_images.length) mixed.push(lp.gallery_trust_images[trustIdx++]);
    return mixed;
  })();

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-17 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src={logoDark} alt="Ligne Rouge Tours" className="h-14 sm:h-16 w-auto" />
          </Link>
          <a
            href="#apply"
            className="font-heading text-[10px] tracking-[0.15em] uppercase px-5 py-2 bg-accent text-accent-foreground hover:bg-accent/90 transition-all"
          >
            Apply now
          </a>
        </div>
      </div>

      {/* Hero */}
      <section className="relative min-h-[90svh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {heroImage && <img src={heroImage} alt={expedition.name} className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-background/60" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-14">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {lp.tagline && (
              <p className="font-heading text-[10px] sm:text-xs tracking-[0.2em] uppercase text-accent-red mb-4">
                {lp.tagline}
              </p>
            )}

            <h1 className="heading-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
              {lp.headline}
              {lp.subheadline && (
                <>
                  <br />
                  <span className="text-accent-red">{lp.subheadline}</span>
                </>
              )}
            </h1>

            <p className="body-text text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto mb-4">
              {expedition.short_description}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8 font-heading text-xs sm:text-sm tracking-wider text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {expedition.duration_days} days
              </span>
              <span className="flex items-center gap-1.5">
                <Mountain className="w-3.5 h-3.5" /> {expedition.intensity_level}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> {expedition.location}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4">
              <a
                href="#apply"
                className="font-heading text-xs tracking-[0.15em] uppercase px-8 py-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-all w-full sm:w-auto text-center"
              >
                Apply - ${expedition.price_usd.toLocaleString("en-US")} / pers.
              </a>
            </div>

            <p className="font-heading text-[9px] tracking-[0.15em] uppercase text-muted-foreground/50 mb-6">
              By application only
              {remaining !== null && remaining > 0 && ` · ${remaining} spots remaining on next session`}
            </p>

            <div className="flex items-center justify-center gap-5">
              <img src="/assets/google-reviews-logo.png" alt="Google Reviews" className="h-5 w-auto" />
              <img src="/assets/tripadvisor-logo.png" alt="Tripadvisor" className="h-5 w-auto" />
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Trust signals */}
      {lp.trust_signals.length > 0 && (
        <section className="py-14 sm:py-20 border-b border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
              {lp.trust_signals.map(({ icon, title, desc }, i) => {
                const Icon = ICONS[icon] || Compass;
                return (
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
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Gallery auto-scroll carousel */}
      {galleryImages.length > 0 && <GalleryCarousel images={galleryImages} />}

      {/* Transformational promise */}
      {(lp.promise_intro || lp.promise_bullets.length > 0) && (
        <section className="py-16 sm:py-24 border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="h-px w-12 bg-accent mb-10" />
            <h2 className="heading-display text-xl sm:text-2xl mb-4">This is not a trip.</h2>
            {lp.promise_intro && (
              <p className="body-text text-sm text-muted-foreground max-w-2xl mb-10">{lp.promise_intro}</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {lp.promise_bullets.map(({ title, desc }, i) => (
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
      )}

      {/* Social proof — auto-scrolling carousel, same mechanic as the homepage TestimonialsSection */}
      {lp.testimonials.length > 0 && <TestimonialsCarousel testimonials={lp.testimonials} />}

      {/* Itinerary */}
      {expedition.itinerary.length > 0 && (
        <section className="py-16 sm:py-24 bg-secondary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="h-px w-12 bg-accent mb-10" />
            <h2 className="heading-display text-xl sm:text-2xl mb-12">
              {expedition.duration_days} Days in {expedition.country}
            </h2>

            <div className="space-y-6">
              {expedition.itinerary.map((day, i) => (
                <motion.div
                  key={day.day_number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="border-l-2 border-border pl-6 hover:border-accent transition-colors"
                >
                  <p className="font-heading text-[10px] tracking-[0.2em] uppercase text-accent-red mb-1">
                    Day {day.day_number}
                  </p>
                  <h3 className="font-heading text-sm tracking-[0.05em] uppercase mb-1">{day.title}</h3>
                  <p className="body-text text-sm text-muted-foreground">{day.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10">
              <ItineraryMap days={expedition.itinerary} />
            </div>
          </div>
        </section>
      )}

      {/* Led by */}
      {lp.led_by_name && (
        <section className="py-16 sm:py-20 border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-6"
            >
              {lp.led_by_image_url && (
                <img
                  src={lp.led_by_image_url}
                  alt={lp.led_by_name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover brightness-90 contrast-105 grayscale-[15%]"
                />
              )}
              <div>
                <p className="font-heading text-[10px] tracking-[0.2em] uppercase text-accent-red mb-1">Led by</p>
                <p className="font-heading text-sm sm:text-base tracking-[0.05em] uppercase mb-1">{lp.led_by_name}</p>
                <p className="body-text text-sm text-muted-foreground">{lp.led_by_bio}</p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* What's included + dates */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="h-px w-12 bg-accent mb-8" />
              <h2 className="heading-display text-xl mb-8">What&apos;s Included</h2>
              <ul className="space-y-3">
                {expedition.inclusions.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-accent-red flex-shrink-0" />
                    <span className="body-text text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="h-px w-12 bg-border mb-8" />
              <h2 className="heading-display text-xl mb-8">Dates &amp; Availability</h2>
              <div className="space-y-4">
                {upcomingDates.map((d) => {
                  const remainingSpots = d.capacity_max - d.spots_taken;
                  const label = `${new Date(d.start_date).toLocaleDateString("en-US", { day: "numeric", month: "short" })} - ${new Date(d.end_date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}`;
                  return (
                    <div key={d.id} className="border border-border p-4 flex items-center justify-between">
                      <div>
                        <p className="font-heading text-sm">{label}</p>
                        <p className={`font-heading text-[10px] tracking-[0.15em] uppercase mt-1 ${d.status === "limited" ? "text-accent-red" : "text-muted-foreground"}`}>
                          {d.status === "closed" ? "Full - Waitlist open" : `${remainingSpots} spots left`}
                        </p>
                      </div>
                      {d.status === "open" || d.status === "limited" ? (
                        <a
                          href="#apply"
                          onClick={() => setSelectedDateId(d.id)}
                          className="font-heading text-[10px] tracking-[0.15em] uppercase px-4 py-2 bg-accent text-accent-foreground hover:bg-accent/90 transition-all flex-shrink-0"
                        >
                          Apply
                        </a>
                      ) : d.status === "closed" ? (
                        <button
                          onClick={() => { setWaitlistDateId(d.id); setWaitlistDateLabel(label); setWaitlistOpen(true); }}
                          className="font-heading text-[10px] tracking-[0.15em] uppercase px-4 py-2 bg-foreground text-background hover:bg-foreground/90 transition-all flex-shrink-0"
                        >
                          Waitlist
                        </button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apply directly on this page — tour is fixed, can't be changed */}
      <section id="apply" className="py-20 sm:py-28 border-t border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="flex justify-center mb-8">
              <div className="h-px w-16 bg-accent" />
            </div>

            <h2 className="heading-display text-2xl sm:text-3xl mb-4 text-center">Ready to cross the line?</h2>
            <p className="body-text text-muted-foreground text-sm sm:text-base max-w-xl mx-auto mb-10 text-center">
              Each application is reviewed to make sure this expedition is a good fit for you, particularly your physical readiness for the terrain.
            </p>

            <ApplicationForm
              lockedExpedition={{
                id: expedition.id,
                name: lp.headline,
                price: expedition.price_usd,
                depositRequired: lp.deposit_required,
                depositAmountUsd: lp.deposit_amount_usd,
              }}
              slug={lp.slug}
              preselectedDateId={selectedDateId ?? featuredDate?.id}
            />
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
              href={`/expeditions/${expedition.slug}`}
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
        expeditionId={expedition.id}
        expeditionName={expedition.name}
        expeditionDateId={waitlistDateId}
        dateLabel={waitlistDateLabel}
      />
    </div>
  );
};

export default TourLandingPage;
