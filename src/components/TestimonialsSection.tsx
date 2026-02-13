import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

import lucasImg from "@/assets/lucas-iran.png";
import isaacImg from "@/assets/isaac-transnistria.png";
import arnaudImg from "@/assets/arnaud-somaliland.png";
import nolanImg from "@/assets/nolan-mongolia.jpg";
import annaImg from "@/assets/anna-afghanistan.jpg";

const testimonials = [
  {
    name: "Lucas",
    destination: "Iran",
    image: lucasImg,
    text: "Une expérience incroyable. L'Iran est un pays d'une richesse culturelle insoupçonnée. L'organisation était parfaite, chaque détail pensé pour qu'on profite pleinement.",
    rating: 5,
  },
  {
    name: "Isaac",
    destination: "Transnistrie",
    image: isaacImg,
    text: "Je n'aurais jamais osé y aller seul. Ligne Rouge a rendu ce voyage possible et surtout inoubliable. Un territoire fascinant, hors du temps.",
    rating: 5,
  },
  {
    name: "Arnaud",
    destination: "Somaliland",
    image: arnaudImg,
    text: "Le Somaliland m'a complètement surpris. Des paysages bruts, des rencontres authentiques. L'équipe sur place était au top, je me suis senti en sécurité à chaque instant.",
    rating: 5,
  },
  {
    name: "Nolan",
    destination: "Mongolie",
    image: nolanImg,
    text: "Les steppes mongoles à perte de vue, des soirées autour du feu avec le groupe… C'est le genre de voyage qui te change. Merci Ligne Rouge.",
    rating: 5,
  },
  {
    name: "Anna",
    destination: "Afghanistan",
    image: annaImg,
    text: "Voyager en Afghanistan en tant que femme semblait impossible. Ligne Rouge a su organiser ça avec un professionnalisme et un respect total. Une expérience transformatrice.",
    rating: 5,
  },
];

// Duplicate for infinite scroll effect
const duplicated = [...testimonials, ...testimonials];

const TestimonialsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId: number;
    let scrollPos = 0;
    const speed = 0.5;

    const step = () => {
      if (!isPaused && container) {
        scrollPos += speed;
        // Reset when we've scrolled through the first set
        if (scrollPos >= container.scrollWidth / 2) {
          scrollPos = 0;
        }
        container.scrollLeft = scrollPos;
      }
      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <section className="py-20 sm:py-28 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <div className="flex justify-center mb-6">
            <div className="h-px w-12 bg-accent" />
          </div>
          <h2 className="heading-display text-2xl sm:text-3xl md:text-4xl mb-4">
            What our travelers say
          </h2>
          <p className="body-text text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Authentic reviews from those who dared to cross the line.
          </p>
        </motion.div>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="overflow-hidden cursor-grab"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex gap-6 px-4 w-max">
          {duplicated.map((t, i) => (
            <div
              key={i}
              className="w-[320px] sm:w-[380px] flex-shrink-0 bg-card border border-border p-6 flex flex-col"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover brightness-95 contrast-105 grayscale-[10%]"
                />
                <div>
                  <p className="font-heading text-sm font-semibold text-foreground">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.destination}
                  </p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-3.5 h-3.5 fill-accent text-accent"
                  />
                ))}
              </div>
              <p className="body-text text-sm text-muted-foreground leading-relaxed flex-1">
                "{t.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
