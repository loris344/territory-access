import { motion } from "framer-motion";

const EthicalSection = () => {
  const points = [
    "No active war zones.",
    "No illegal access.",
    "No staged or degrading experiences.",
    "Respect for local communities at all times.",
  ];

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
            Our Commitments
          </h2>

          <ul className="space-y-4">
            {points.map((point, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="w-1.5 h-1.5 bg-accent mt-2 flex-shrink-0" />
                <span className="body-text text-muted-foreground text-base sm:text-lg">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default EthicalSection;
