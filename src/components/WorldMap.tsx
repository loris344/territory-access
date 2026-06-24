"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { useActiveExpeditions } from "@/hooks/use-expeditions";
import type { Expedition } from "@/data/expeditions";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WorldMap = () => {
  const { data: expeditions } = useActiveExpeditions();
  const [selected, setSelected] = useState<Expedition | null>(null);
  const [hovered, setHovered] = useState<Expedition | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [fixedTooltipPos, setFixedTooltipPos] = useState({ x: 0, y: 0 });
  // ZoomableGroup scales the whole group (markers included), so close points
  // never separate when zooming. Track the zoom and counter-scale the marker
  // radii by 1/zoom to keep them a constant on-screen size.
  const [zoom, setZoom] = useState(1);

  const handleMarkerClick = useCallback((exp: Expedition) => {
    if (selected?.id === exp.id) {
      return;
    }
    setSelected(exp);
    setHovered(exp);
    setFixedTooltipPos({ ...tooltipPos });
  }, [selected, tooltipPos]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <section id="map" className="py-8 sm:py-12 lg:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="h-px w-12 bg-accent mb-10" />
          <h2 className="heading-display text-2xl sm:text-3xl md:text-4xl">
            Where We Go
          </h2>
          <p className="body-text text-xs text-muted-foreground mt-3 tracking-wider uppercase">
            Drag to explore · Scroll to zoom
          </p>
        </motion.div>

        <div
          className="relative border border-border bg-card overflow-hidden"
          onMouseMove={handleMouseMove}
        >
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 180,
              center: [50, 42],
            }}
            style={{ width: "100%", height: "clamp(280px, 50vw, 450px)" }}
          >
            <ZoomableGroup
              center={[50, 42]}
              minZoom={1}
              maxZoom={8}
              onMoveEnd={({ zoom: k }) => setZoom(k)}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="hsl(0, 0%, 11%)"
                      stroke="hsl(0, 0%, 20%)"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: "hsl(0, 0%, 15%)" },
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
                  onMouseLeave={() => { if (selected?.id !== exp.id) setHovered(null); }}
                  onClick={() => handleMarkerClick(exp)}
                >
                  {/* Outer glow ring */}
                  <circle
                    r={12 / zoom}
                    fill="hsla(0, 0%, 96%, 0.06)"
                    className="cursor-pointer"
                  />
                  {/* Mid ring */}
                  <circle
                    r={7 / zoom}
                    fill="hsla(0, 0%, 96%, 0.12)"
                    className="cursor-pointer"
                  />
                  {/* Core dot */}
                  <circle
                    r={3.5 / zoom}
                    fill="hsl(0, 0%, 96%)"
                    className="cursor-pointer"
                  />
                  {/* Invisible hit area */}
                  <circle
                    r={14 / zoom}
                    fill="transparent"
                    className="cursor-pointer"
                  />
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>

          {/* Tooltip - desktop: follows cursor, mobile: fixed bottom */}
          <AnimatePresence>
            {hovered && (
              <>
                {/* Desktop tooltip (follows mouse) */}
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                  className={`fixed z-50 hidden md:block w-[280px] ${selected?.id === hovered.id ? 'pointer-events-auto' : 'pointer-events-none'}`}
                  style={{
                    left: (selected?.id === hovered.id ? fixedTooltipPos.x : tooltipPos.x) + 16,
                    top: (selected?.id === hovered.id ? fixedTooltipPos.y : tooltipPos.y) - 10,
                    maxWidth: 280,
                  }}
                >
                  <div className="border border-border bg-card w-full overflow-hidden">
                    <div className="aspect-[16/9] bg-secondary flex items-center justify-center">
                      {hovered.hero_image_url ? (
                        <img src={hovered.hero_image_url} alt={hovered.name} loading="lazy" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-heading text-[9px] tracking-[0.2em] uppercase text-muted-foreground">Photo coming soon</span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-heading text-[10px] tracking-[0.15em] uppercase text-accent-red mb-1">{hovered.continent && `${hovered.continent} · `}{hovered.country}</p>
                      <p className="font-heading text-sm tracking-wider uppercase mb-2">{hovered.name}</p>
                      <p className="body-text text-xs text-muted-foreground mb-3 line-clamp-2">{hovered.short_description}</p>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-heading tracking-wider uppercase">
                        <span>{hovered.duration_days} days</span>
                        <span className="text-border">|</span>
                        <span>{hovered.difficulty_level}</span>
                        <span className="text-border">|</span>
                        <span>{hovered.intensity_type}</span>
                      </div>
                      <div className="mt-2 text-[10px] text-muted-foreground font-heading tracking-wider">
                        {new Date(hovered.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – {new Date(hovered.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                      {selected?.id === hovered.id && (
                        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                          <Link
                            href={`/expeditions/${hovered.slug}`}
                            className="font-heading text-[10px] tracking-[0.15em] uppercase text-accent hover:text-accent/80 transition-colors"
                            onClick={() => { setSelected(null); setHovered(null); }}
                          >
                            View details →
                          </Link>
                          <button
                            onClick={() => { setSelected(null); setHovered(null); }}
                            className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Close
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Mobile popup (fixed bottom of map) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-0 left-0 right-0 z-50 md:hidden"
                >
                  <div className="border-t border-border bg-card">
                    <div className="flex gap-3 p-4">
                      {hovered.hero_image_url && (
                        <img src={hovered.hero_image_url} alt={hovered.name} loading="lazy" className="w-20 h-20 object-cover flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-heading text-[10px] tracking-[0.15em] uppercase text-accent-red mb-0.5">{hovered.continent && `${hovered.continent} · `}{hovered.country}</p>
                        <p className="font-heading text-sm tracking-wider uppercase mb-1">{hovered.name}</p>
                        <p className="body-text text-xs text-muted-foreground line-clamp-2 mb-2">{hovered.short_description}</p>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/expeditions/${hovered.slug}`}
                            className="font-heading text-[10px] tracking-[0.15em] uppercase text-accent hover:text-accent/80 transition-colors"
                            onClick={() => { setSelected(null); setHovered(null); }}
                          >
                            View details →
                          </Link>
                          <button
                            onClick={() => { setSelected(null); setHovered(null); }}
                            className="ml-auto font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default WorldMap;
