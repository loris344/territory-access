import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/80" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Red line accent */}
          <div className="flex justify-center mb-10">
            <motion.div
              className="h-px bg-accent"
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ duration: 1.2, delay: 0.5 }}
            />
          </div>

          <h1 className="heading-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-8">
            We organize expeditions<br />
            <span className="text-accent-red">in territories others avoid.</span>
          </h1>

          <p className="body-text text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-12">
            For those who refuse to observe the world from a distance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#expeditions"
              className="font-heading text-xs tracking-[0.15em] uppercase px-8 py-4 border border-foreground text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
            >
              View current expeditions
            </a>
            <Link
              to="/apply"
              className="font-heading text-xs tracking-[0.15em] uppercase px-8 py-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300"
            >
              Apply
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
