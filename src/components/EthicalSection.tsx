import { motion } from "framer-motion";

const EthicalSection = () => {
  const points = [
    "No active war zones. We push limits — not laws.",
    "No illegal access. Every route is negotiated, never forced.",
    "No staged or degrading experiences. What you see is real — or we don't go.",
    "Respect for local communities. Always. Without exception.",
  ];

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

          <h2 className="heading-display text-2xl sm:text-3xl md:text-4xl mb-6">
            Our Commitments
          </h2>
          <p className="body-text text-muted-foreground text-base sm:text-lg max-w-3xl mb-10">
            We go where others won't — but never at any cost. Every expedition is built on a framework of strict ethical principles. This is what separates exploration from exploitation.
          </p>

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
