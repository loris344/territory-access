import { motion } from "framer-motion";

const PhilosophySection = () => {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="h-px w-12 bg-accent mb-10" />

          <h2 className="heading-display text-2xl sm:text-3xl md:text-4xl mb-10">
            Access. Control. Intensity.
          </h2>

          <div className="space-y-6 body-text text-muted-foreground text-base sm:text-lg max-w-3xl">
            <p>We do not sell tourism.</p>
            <p>
              We provide structured exposure to politically and geographically
              complex territories.
            </p>
            <p>
              Small group. High logistical control. Zero artificial staging.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PhilosophySection;
