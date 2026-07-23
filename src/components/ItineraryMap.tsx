"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker, Line, ZoomableGroup } from "react-simple-maps";
import type { ExpeditionDay } from "@/data/expeditions";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type PlottedDay = ExpeditionDay & { latitude: number; longitude: number };

// An illustrative route line across the region, not a surveyed GPS track.
// Scale is derived from how spread out the day-coordinates are, so a compact
// itinerary (e.g. a single valley) opens zoomed in, and a cross-country one
// opens wide enough to still show every stop.
const ItineraryMap = ({ days }: { days: ExpeditionDay[] }) => {
  const points = days.filter(
    (d): d is PlottedDay => typeof d.latitude === "number" && typeof d.longitude === "number"
  );
  const [zoom, setZoom] = useState(1);
  const [selectedDay, setSelectedDay] = useState<number | null>(points[0]?.day_number ?? null);

  if (points.length === 0) return null;

  const lats = points.map((p) => p.latitude);
  const lngs = points.map((p) => p.longitude);
  const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
  const spread = Math.max(Math.max(...lats) - Math.min(...lats), Math.max(...lngs) - Math.min(...lngs), 0.05);
  const scale = Math.max(300, Math.min(40000, 2000 / spread));
  // However tight the initial framing, always allow zooming out to roughly
  // world-map scale (matches the homepage WorldMap's own scale of 180) so
  // the visitor can see where the region actually sits on the globe.
  const minZoom = Math.max(0.02, 150 / scale);

  const selected = points.find((p) => p.day_number === selectedDay) || points[0];

  return (
    <div className="border border-border bg-card overflow-hidden">
      <div className="relative">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale, center: [centerLng, centerLat] }}
          style={{ width: "100%", height: "clamp(280px, 45vw, 420px)" }}
        >
          <ZoomableGroup center={[centerLng, centerLat]} minZoom={minZoom} maxZoom={10} onMoveEnd={({ zoom: k }) => setZoom(k)}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="hsl(0, 0%, 11%)"
                    stroke="hsl(0, 0%, 20%)"
                    strokeWidth={0.5 / zoom}
                    style={{ default: { outline: "none" }, hover: { outline: "none" }, pressed: { outline: "none" } }}
                  />
                ))
              }
            </Geographies>

            {points.slice(0, -1).map((p, i) => (
              <Line
                key={`line-${p.day_number}`}
                from={[p.longitude, p.latitude]}
                to={[points[i + 1].longitude, points[i + 1].latitude]}
                stroke="hsl(0, 100%, 41%)"
                strokeWidth={1.5 / zoom}
                strokeDasharray={`${4 / zoom} ${3 / zoom}`}
              />
            ))}

            {points.map((p) => {
              const isSelected = p.day_number === selectedDay;
              return (
                <Marker
                  key={`marker-${p.day_number}`}
                  coordinates={[p.longitude, p.latitude]}
                  onClick={() => setSelectedDay(p.day_number)}
                >
                  <circle
                    r={(isSelected ? 8 : 5) / zoom}
                    fill={isSelected ? "hsl(0, 0%, 96%)" : "hsl(0, 100%, 41%)"}
                    stroke="hsl(0, 0%, 100%)"
                    strokeWidth={1 / zoom}
                    className="cursor-pointer"
                  />
                  <text
                    textAnchor="middle"
                    y={-10 / zoom}
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: 9 / zoom,
                      fill: isSelected ? "hsl(0, 100%, 41%)" : "hsl(0, 0%, 96%)",
                      fontWeight: isSelected ? 700 : 400,
                    }}
                  >
                    {p.day_number}
                  </text>
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Selected day's activity: tap a point on the map to switch */}
      {selected && (
        <div className="border-t border-border p-5 sm:p-6">
          <p className="font-heading text-[10px] tracking-[0.2em] uppercase text-accent-red mb-1">
            Day {selected.day_number}
          </p>
          <h3 className="font-heading text-sm tracking-[0.05em] uppercase mb-2">{selected.title}</h3>
          <p className="body-text text-sm text-muted-foreground">{selected.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {points.map((p) => (
              <button
                key={p.day_number}
                onClick={() => setSelectedDay(p.day_number)}
                className={`font-heading text-[10px] tracking-wider uppercase w-7 h-7 flex items-center justify-center border transition-colors ${
                  p.day_number === selectedDay
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {p.day_number}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryMap;
