"use client";

import { motion } from "framer-motion";

// ID de la vidéo Vimeo (les chiffres à la fin de l'URL, ex: vimeo.com/123456789 -> "123456789").
const VIMEO_VIDEO_ID = "1201697933";

// Ratio d'aspect réel de la vidéo (hauteur / largeur), repris de l'embed Vimeo
// pour éviter les bandes noires. 53.92% ≈ format cinéma 1.85:1.
const ASPECT_PADDING = "53.92%";

const TrailerSection = () => {
  return (
    <section id="trailer" className="py-16 sm:py-24 lg:py-32 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="h-px w-12 bg-accent mb-10" />

          <h2 className="heading-display text-2xl sm:text-3xl md:text-4xl mb-10">
            See It For Yourself
          </h2>

          <div
            className="relative w-full overflow-hidden border border-border bg-black"
            style={{ paddingTop: ASPECT_PADDING }}
          >
            <iframe
              src={`https://player.vimeo.com/video/${VIMEO_VIDEO_ID}?badge=0&title=0&byline=0&portrait=0&dnt=1`}
              className="absolute inset-0 h-full w-full"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              allowFullScreen
              title="Ligne Rouge: Trailer"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrailerSection;
