import { motion } from "framer-motion";

const PhilosophySection = () => {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="h-px w-12 bg-accent mb-10" />

          <h2 className="heading-display text-2xl sm:text-3xl md:text-4xl mb-10">
            Beyond the Ordinary
          </h2>

          <div className="space-y-6 body-text text-muted-foreground text-base sm:text-lg max-w-3xl">
            <p>We don't sell vacations. We craft confrontations with the real.</p>
            <p>
              Every expedition is designed around tension — the kind that transforms you.
              Politically complex territories, geographically extreme landscapes,
              cultures that challenge everything you think you know.
            </p>
            <p>
              Small groups. Trusted local fixers. No scripts, no safety nets, no spectators.
            </p>
            <p className="font-heading text-[10px] tracking-[0.15em] uppercase text-accent/80 pt-2">
              We don't take everyone. We choose who we travel with.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PhilosophySection;
