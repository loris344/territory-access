import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { getActiveExpeditions, type Expedition } from "@/data/expeditions";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WorldMap = () => {
  const expeditions = getActiveExpeditions();
  const [hovered, setHovered] = useState<Expedition | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <section id="map" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="h-px w-12 bg-accent mb-10" />
          <h2 className="heading-display text-2xl sm:text-3xl md:text-4xl">
            Operations Map
          </h2>
        </motion.div>

        <div
          className="relative border border-border bg-card"
          onMouseMove={handleMouseMove}
        >
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 140,
              center: [45, 30],
            }}
            style={{ width: "100%", height: "auto" }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="hsl(0, 0%, 15%)"
                    stroke="hsl(0, 0%, 22%)"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: "hsl(0, 0%, 18%)" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {expeditions.map((exp) => (
              <Marker
                key={exp.id}
                coordinates={exp.coordinates}
                onMouseEnter={() => setHovered(exp)}
                onMouseLeave={() => setHovered(null)}
              >
                <circle
                  r={5}
                  fill="hsl(0, 100%, 41%)"
                  stroke="hsl(0, 0%, 0%)"
                  strokeWidth={1.5}
                  className="cursor-pointer"
                  style={{ transition: "r 0.2s" }}
                />
                <circle
                  r={10}
                  fill="transparent"
                  className="cursor-pointer"
                />
              </Marker>
            ))}
          </ComposableMap>

          {/* Tooltip */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className="fixed z-50 pointer-events-none"
                style={{
                  left: tooltipPos.x + 16,
                  top: tooltipPos.y - 10,
                }}
              >
                <Link
                  to={`/expeditions/${hovered.slug}`}
                  className="pointer-events-none block border border-border bg-card p-4 min-w-[220px]"
                >
                  <p className="font-heading text-[10px] tracking-[0.15em] uppercase text-accent-red mb-1">
                    {hovered.location}
                  </p>
                  <p className="font-heading text-sm tracking-wider uppercase mb-2">
                    {hovered.name}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-heading tracking-wider">
                      {hovered.duration_days} DAYS
                    </span>
                    <span className="font-heading tracking-wider">
                      ${hovered.price_usd.toLocaleString("en-US")}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {new Date(hovered.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default WorldMap;
