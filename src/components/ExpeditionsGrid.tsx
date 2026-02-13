import { motion } from "framer-motion";
import { useActiveExpeditions } from "@/hooks/use-expeditions";
import ExpeditionCard from "./ExpeditionCard";

const ExpeditionsGrid = () => {
  const { data: expeditions, isLoading } = useActiveExpeditions();

  if (isLoading) {
    return (
      <section id="expeditions" className="py-16 sm:py-24 lg:py-32 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-heading text-sm tracking-wider uppercase text-muted-foreground text-center">Loading expeditions...</p>
        </div>
      </section>
    );
  }
  return (
    <section id="expeditions" className="py-16 sm:py-24 lg:py-32 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="h-px w-12 bg-accent mb-10" />
          <h2 className="heading-display text-2xl sm:text-3xl md:text-4xl">
            Current Expeditions
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expeditions.map((expedition, i) => (
            <motion.div
              key={expedition.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <ExpeditionCard expedition={expedition} hidePrice />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpeditionsGrid;
