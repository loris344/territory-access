import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getExpeditionBySlug } from "@/data/expeditions";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const statusStyles = {
  open: "bg-foreground/10 text-foreground border border-foreground/20",
  limited: "bg-accent/10 text-accent-red border border-accent/30",
  closed: "bg-muted text-muted-foreground border border-border",
};
const statusLabels = {
  open: "OPEN",
  limited: "LIMITED ACCESS",
  closed: "CLOSED",
};

const ExpeditionDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const expedition = slug ? getExpeditionBySlug(slug) : undefined;

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
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 lg:pt-36 lg:pb-24 bg-secondary">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link to="/#expeditions" className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-8 inline-block">
              ← All expeditions
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <span className={`font-heading text-[10px] tracking-[0.15em] uppercase px-3 py-1 ${statusStyles[expedition.status]}`}>
                {statusLabels[expedition.status]}
              </span>
              <span className="font-heading text-xs tracking-wider text-muted-foreground">
                {expedition.intensity_level.toUpperCase()}
              </span>
            </div>

            <h1 className="heading-display text-3xl sm:text-4xl md:text-5xl mb-4">
              {expedition.name}
            </h1>

            <p className="font-heading text-sm tracking-[0.1em] uppercase text-muted-foreground mb-8">
              {expedition.location}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-border pt-8">
              <div>
                <p className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">Dates</p>
                <p className="font-heading text-sm">
                  {new Date(expedition.start_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} –{" "}
                  {new Date(expedition.end_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div>
                <p className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">Duration</p>
                <p className="font-heading text-sm">{expedition.duration_days} days</p>
              </div>
              <div>
                <p className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">Price</p>
                <p className="font-heading text-sm">{expedition.price_eur.toLocaleString("fr-FR")} €</p>
              </div>
              <div>
                <p className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">Intensity</p>
                <p className="font-heading text-sm">{expedition.intensity_level}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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

      {/* Itinerary */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="h-px w-12 bg-accent mb-10" />
          <h2 className="heading-display text-xl sm:text-2xl mb-12">Mission Structure</h2>

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
                <h3 className="font-heading text-sm tracking-[0.05em] uppercase mb-2">
                  {day.title}
                </h3>
                <p className="body-text text-sm text-muted-foreground">
                  {day.description}
                </p>
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
          {expedition.status !== "closed" ? (
            <Link
              to={`/apply?expedition=${expedition.slug}`}
              className="inline-block font-heading text-xs tracking-[0.15em] uppercase px-8 py-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300"
            >
              Apply for this expedition
            </Link>
          ) : (
            <span className="inline-block font-heading text-xs tracking-[0.15em] uppercase px-8 py-4 bg-muted text-muted-foreground cursor-not-allowed">
              Applications closed
            </span>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ExpeditionDetail;
