import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useExpeditionBySlug } from "@/hooks/use-expeditions";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WaitlistModal from "@/components/WaitlistModal";
import SEO from "@/components/SEO";

const statusStyles: Record<string, string> = {
  open: "bg-foreground/10 text-foreground border border-foreground/20",
  limited: "bg-accent/10 text-accent-red border border-accent/30",
  closed: "bg-muted text-muted-foreground border border-border",
  cancelled: "bg-destructive/10 text-destructive border border-destructive/30",
  postponed: "bg-muted text-muted-foreground border border-border",
};
const statusLabels: Record<string, string> = {
  open: "OPEN",
  limited: "LIMITED ACCESS",
  closed: "CLOSED",
  cancelled: "CANCELLED",
  postponed: "POSTPONED",
};

const ExpeditionDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: expedition, isLoading } = useExpeditionBySlug(slug);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentImg, setCurrentImg] = useState(0);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistDateId, setWaitlistDateId] = useState<string | undefined>();
  const [waitlistDateLabel, setWaitlistDateLabel] = useState<string>("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!expedition) return;
    const fetchGallery = async () => {
      const { data } = await supabase
        .from("expedition_gallery")
        .select("image_url")
        .eq("expedition_id", expedition.id)
        .order("display_order", { ascending: true });
      if (data && data.length > 0) {
        setGalleryImages(data.map((d) => d.image_url));
      }
    };
    fetchGallery();
  }, [expedition]);

  // Combine hero_image_url + gallery, deduplicating hero from gallery
  const allImages = expedition
    ? [
        ...(expedition.hero_image_url ? [expedition.hero_image_url] : []),
        ...galleryImages.filter((url) => {
          if (!expedition.hero_image_url) return true;
          // Compare URLs ignoring cache-busting query params
          const heroBase = expedition.hero_image_url.split("?")[0];
          const galleryBase = url.split("?")[0];
          return galleryBase !== heroBase;
        }),
      ]
    : [];

  const nextImg = useCallback(() => {
    if (allImages.length <= 1) return;
    setCurrentImg((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prevImg = useCallback(() => {
    if (allImages.length <= 1) return;
    setCurrentImg((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  // Auto-advance every 8 seconds
  useEffect(() => {
    if (allImages.length <= 1) return;
    const interval = setInterval(nextImg, 8000);
    return () => clearInterval(interval);
  }, [nextImg, allImages.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <p className="font-heading text-sm tracking-wider uppercase text-muted-foreground pt-20">Loading...</p>
      </div>
    );
  }

  if (!expedition) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center pt-20">
          <h1 className="heading-display text-2xl mb-4">Expedition not found</h1>
          <Link to="/" className="text-accent-red font-heading text-xs tracking-[0.15em] uppercase">
            ← Return to base
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${expedition.name} — ${expedition.country}`}
        description={expedition.short_description}
        path={`/expeditions/${expedition.slug}`}
        ogImage={expedition.hero_image_url || undefined}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "TravelAction",
          name: expedition.name,
          description: expedition.short_description,
          location: {
            "@type": "Place",
            name: expedition.location,
            address: { "@type": "PostalAddress", addressCountry: expedition.country },
          },
          offers: {
            "@type": "Offer",
            price: expedition.price_usd,
            priceCurrency: "USD",
            availability:
              expedition.status === "open" || expedition.status === "limited"
                ? "https://schema.org/InStock"
                : "https://schema.org/SoldOut",
          },
        }}
      />
      <Navbar />

      {/* Hero with background carousel */}
      <section className="relative pt-20 pb-12 sm:pt-28 sm:pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
        {/* Background images */}
        {allImages.length > 0 && (
          <div className="absolute inset-0">
            <AnimatePresence mode="popLayout">
              <motion.img
                key={currentImg}
                src={allImages[currentImg]}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-background/55" />
          </div>
        )}
        {!allImages.length && <div className="absolute inset-0 bg-secondary" />}

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Link
              to="/#expeditions"
              className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-8 inline-block"
            >
              ← All expeditions
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <span
                className={`font-heading text-[10px] tracking-[0.15em] uppercase px-3 py-1 ${statusStyles[expedition.status]}`}
              >
                {statusLabels[expedition.status]}
              </span>
              <span className="font-heading text-xs tracking-wider text-muted-foreground">
                {expedition.intensity_level.toUpperCase()}
              </span>
            </div>

            <h1 className="heading-display text-3xl sm:text-4xl md:text-5xl mb-4">{expedition.name}</h1>

            <p className="font-heading text-sm tracking-[0.1em] uppercase text-muted-foreground mb-2">
              {expedition.country} · {expedition.location}
            </p>
            {expedition.continent && (
              <p className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground/60 mb-8">
                {expedition.continent}
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-border pt-8">
              <div>
                <p className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">
                  Duration
                </p>
                <p className="font-heading text-sm">{expedition.duration_days} days</p>
              </div>
              <div>
                <p className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">
                  Price per person
                </p>
                <p className="font-heading text-sm">
                  ${expedition.price_usd.toLocaleString("en-US")}{" "}
                  <span className="text-xs text-muted-foreground">/ pers.</span>
                </p>
              </div>
              <div>
                <p className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">
                  Intensity
                </p>
                <p className="font-heading text-sm">{expedition.intensity_level}</p>
              </div>
              <div>
                <p className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">
                  Sessions
                </p>
                <p className="font-heading text-sm">{(expedition.dates || []).length || 1} date{(expedition.dates || []).length > 1 ? "s" : ""}</p>
              </div>
            </div>

            {/* Departure dates */}
            {(expedition.dates || []).length > 0 && (
              <div className="mt-8 border-t border-border pt-8">
                <p className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-4">Departure Dates</p>
                <div className="space-y-3">
              {(expedition.dates || []).map((d) => {
                    const remaining = d.capacity_max - d.spots_taken;
                    const dateLabel = `${new Date(d.start_date).toLocaleDateString("en-US", { day: "numeric", month: "short" })} – ${new Date(d.end_date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}`;
                    const isActionable = d.status === "open" || d.status === "limited";
                    const isClosed = d.status === "closed";
                    const isCancelledOrPostponed = d.status === "cancelled" || d.status === "postponed";
                    return (
                      <div key={d.id} className="flex items-center justify-between gap-4 py-3 border-b border-border/50 last:border-0">
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="font-heading text-sm">{dateLabel}</span>
                          <span className={`font-heading text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 ${statusStyles[d.status]}`}>
                            {statusLabels[d.status]}
                          </span>
                          {!isCancelledOrPostponed && (
                            <span className={`font-heading text-xs ${remaining <= 3 && remaining > 0 ? "text-accent-red" : "text-muted-foreground"}`}>
                              {remaining <= 0 ? "Full" : `${remaining} spot${remaining > 1 ? "s" : ""}`}
                            </span>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          {isActionable ? (
                            <Link
                              to={`/apply?expedition=${expedition.slug}&date=${d.id}`}
                              className="font-heading text-[10px] tracking-[0.15em] uppercase px-4 py-2 bg-accent text-accent-foreground hover:bg-accent/90 transition-all"
                            >
                              Apply
                            </Link>
                          ) : isClosed ? (
                            <button
                              onClick={() => { setWaitlistDateId(d.id); setWaitlistDateLabel(dateLabel); setWaitlistOpen(true); }}
                              className="font-heading text-[10px] tracking-[0.15em] uppercase px-4 py-2 bg-foreground text-background hover:bg-foreground/90 transition-all"
                            >
                              Waitlist
                            </button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Top CTA - only if no dates (legacy) */}
            {(expedition.dates || []).length === 0 && (
              <div className="mt-8">
                {expedition.status !== "closed" && expedition.status !== "cancelled" && expedition.status !== "postponed" ? (
                  <Link
                    to={`/apply?expedition=${expedition.slug}`}
                    className="inline-block font-heading text-xs tracking-[0.15em] uppercase px-8 py-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300"
                  >
                    Apply for this expedition
                  </Link>
                ) : expedition.status === "closed" ? (
                  <button
                    onClick={() => setWaitlistOpen(true)}
                    className="inline-block font-heading text-xs tracking-[0.15em] uppercase px-8 py-4 bg-foreground text-background hover:bg-foreground/90 transition-all duration-300"
                  >
                    Join the Waitlist
                  </button>
                ) : null}
              </div>
            )}
          </motion.div>
        </div>

        {/* Carousel navigation */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {allImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImg(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === currentImg ? "bg-foreground scale-125" : "bg-foreground/40"}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Cancellation / Postponed notice */}
      {(expedition.status === "cancelled" || expedition.status === "postponed") && (
        <div className="border-b border-border">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 py-5 flex items-start gap-4">
            <span className={`inline-block w-1.5 h-1.5 mt-1.5 flex-shrink-0 ${expedition.status === "cancelled" ? "bg-destructive" : "bg-muted-foreground"}`} />
            <div>
              <span className={`font-heading text-[10px] tracking-[0.15em] uppercase ${expedition.status === "cancelled" ? "text-destructive" : "text-muted-foreground"}`}>
                {expedition.status === "cancelled" ? "Expedition Cancelled" : "Expedition Postponed"}
              </span>
              {expedition.cancellation_reason && (
                <p className="body-text text-sm text-muted-foreground mt-1">
                  {expedition.cancellation_reason}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Overview */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="h-px w-12 bg-accent mb-10" />
          <h2 className="heading-display text-xl sm:text-2xl mb-8">Overview</h2>
          <p className="body-text text-muted-foreground text-base sm:text-lg leading-relaxed">
            {expedition.long_description}
          </p>
        </div>
      </section>

      {/* Storytelling */}
      {expedition.storytelling && (
        <section className="py-16 lg:py-24 border-t border-border">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="h-px w-12 bg-accent mb-10" />
            <h2 className="heading-display text-xl sm:text-2xl mb-8">The Territory</h2>
            <div className="body-text text-muted-foreground text-base sm:text-lg leading-relaxed space-y-6">
              {expedition.storytelling.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Itinerary */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="h-px w-12 bg-accent mb-10" />
          <h2 className="heading-display text-xl sm:text-2xl mb-12">Day by Day</h2>

          <div className="space-y-8">
            {expedition.itinerary.map((day, i) => (
              <motion.div
                key={day.day_number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="border-l-2 border-border pl-6 hover:border-accent transition-colors"
              >
                <p className="font-heading text-[10px] tracking-[0.2em] uppercase text-accent-red mb-2">
                  Day {day.day_number}
                </p>
                <h3 className="font-heading text-sm tracking-[0.05em] uppercase mb-2">{day.title}</h3>
                <p className="body-text text-sm text-muted-foreground">{day.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Included / Not Included */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="h-px w-12 bg-accent mb-8" />
              <h3 className="heading-display text-lg mb-6">Included</h3>
              <ul className="space-y-3">
                {expedition.inclusions.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-accent mt-2 flex-shrink-0" />
                    <span className="body-text text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="h-px w-12 bg-border mb-8" />
              <h3 className="heading-display text-lg mb-6">Not Included</h3>
              <ul className="space-y-3">
                {expedition.exclusions.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-muted-foreground/50 mt-2 flex-shrink-0" />
                    <span className="body-text text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Application CTA */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <div className="h-px w-12 bg-accent" />
          </div>
          <h2 className="heading-display text-xl sm:text-2xl mb-6">Application Required</h2>
          <p className="body-text text-muted-foreground mb-8 max-w-lg mx-auto">
            Participation is subject to review. Selection is confirmed after internal validation.
          </p>
          {(expedition.dates || []).length > 0 ? (
            <p className="body-text text-sm text-muted-foreground">
              Select a departure date above to apply or join the waitlist.
            </p>
          ) : expedition.status !== "closed" && expedition.status !== "cancelled" && expedition.status !== "postponed" ? (
            <Link
              to={`/apply?expedition=${expedition.slug}`}
              className="inline-block font-heading text-xs tracking-[0.15em] uppercase px-8 py-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300"
            >
              Apply for this expedition
            </Link>
          ) : expedition.status === "closed" ? (
            <button
              onClick={() => setWaitlistOpen(true)}
              className="inline-block font-heading text-xs tracking-[0.15em] uppercase px-8 py-4 bg-foreground text-background hover:bg-foreground/90 transition-all duration-300"
            >
              Join the Waitlist
            </button>
          ) : (
            <span className="inline-block font-heading text-xs tracking-[0.15em] uppercase px-8 py-4 bg-muted text-muted-foreground cursor-not-allowed">
              Applications closed
            </span>
          )}
        </div>
      </section>

      <Footer />

      <WaitlistModal
        open={waitlistOpen}
        onClose={() => { setWaitlistOpen(false); setWaitlistDateId(undefined); setWaitlistDateLabel(""); }}
        expeditionId={expedition.id}
        expeditionName={expedition.name}
        expeditionDateId={waitlistDateId}
        dateLabel={waitlistDateLabel}
      />
    </div>
  );
};

export default ExpeditionDetail;
