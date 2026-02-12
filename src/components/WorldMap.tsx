import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { getActiveExpeditions, type Expedition } from "@/data/expeditions";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WorldMap = () => {
  const expeditions = getActiveExpeditions();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<Expedition | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(z * 1.5, 8));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(z / 1.5, 1));
  }, []);

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
          {/* Zoom controls */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-1">
            <button
              onClick={handleZoomIn}
              className="w-8 h-8 bg-background/80 backdrop-blur-sm border border-border text-foreground flex items-center justify-center text-sm hover:bg-secondary transition-colors"
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              className="w-8 h-8 bg-background/80 backdrop-blur-sm border border-border text-foreground flex items-center justify-center text-sm hover:bg-secondary transition-colors"
              aria-label="Zoom out"
            >
              −
            </button>
          </div>

          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 120,
              center: [45, 30],
            }}
            style={{ width: "100%", height: "400px" }}
          >
            <ZoomableGroup
              zoom={zoom}
              onMoveEnd={({ zoom: newZoom }) => setZoom(newZoom)}
              minZoom={1}
              maxZoom={8}
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
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => navigate(`/expeditions/${exp.slug}`)}
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
                    style={{ transition: "r 0.2s" }}
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
                <div className="border border-border bg-card min-w-[280px] overflow-hidden">
                  {/* Image */}
                  <div className="aspect-[16/9] bg-secondary flex items-center justify-center">
                    {hovered.hero_image_url ? (
                      <img
                        src={hovered.hero_image_url}
                        alt={hovered.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-heading text-[9px] tracking-[0.2em] uppercase text-muted-foreground">
                        Photo coming soon
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="font-heading text-[10px] tracking-[0.15em] uppercase text-accent-red mb-1">
                      {hovered.country}
                    </p>
                    <p className="font-heading text-sm tracking-wider uppercase mb-2">
                      {hovered.name}
                    </p>
                    <p className="body-text text-xs text-muted-foreground mb-3 line-clamp-2">
                      {hovered.short_description}
                    </p>
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
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default WorldMap;
