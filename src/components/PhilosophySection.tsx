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
            <p>We don't do conventional travel.</p>
            <p>
              We design immersive expeditions to politically and geographically
              complex territories — places most travel agencies won't take you.
            </p>
            <p>
              Small groups. Expert local guides. Authentic, unfiltered experiences.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PhilosophySection;
