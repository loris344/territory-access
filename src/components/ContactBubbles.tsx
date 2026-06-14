"use client";

import { motion } from "framer-motion";
const founderImg = "/assets/founder.png";
const leaImg = "/assets/lea.jpg";
const rymImg = "/assets/rym.jpg";

const people = [
  { img: founderImg, name: "Loris", floatDelay: 0 },
  { img: leaImg, name: "Léa", floatDelay: 1.5 },
  { img: rymImg, name: "Rym", floatDelay: 3 },
];

const ContactBubbles = () => {
  return (
    <section className="py-16 lg:py-24 bg-secondary">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-heading text-xs sm:text-sm tracking-[0.15em] uppercase text-muted-foreground mb-10">
            You didn't find your answer?
          </p>

          <div className="flex items-center justify-center mb-8">
            {people.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.15,
                  type: "spring",
                  stiffness: 200,
                }}
                className="relative -mx-2"
                style={{ zIndex: 3 - i }}
              >
                <motion.div
                  animate={{
                    y: [0, -5, 0, -3, 0],
                    rotate: [0, 1, -1, 0.5, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: person.floatDelay,
                  }}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-accent/40 overflow-hidden shadow-[0_0_25px_rgba(209,0,0,0.2)] hover:shadow-[0_0_35px_rgba(209,0,0,0.35)] transition-shadow duration-500">
                    <img
                      src={person.img}
                      alt={person.name}
                      className="w-full h-full object-cover brightness-90 contrast-105 grayscale-[15%]"
                    />
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <p className="body-text text-sm sm:text-base text-muted-foreground mb-8 max-w-md mx-auto">
            Talk to us directly, we're here to help.
          </p>

          <motion.a
            href="https://wa.me/33767135458"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#25D366] text-white font-heading text-xs sm:text-sm tracking-[0.1em] uppercase transition-all duration-300 hover:bg-[#20bd5a] shadow-[0_4px_20px_rgba(37,211,102,0.3)]"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Contact us on WhatsApp
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactBubbles;
