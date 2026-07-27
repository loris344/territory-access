"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker, Line, ZoomableGroup } from "react-simple-maps";
import { geoCentroid, geoContains } from "d3-geo";
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
  // Calibrated for the 400x300 canvas below (half the library's 800x600
  // default — see the comment on ComposableMap for why).
  const scale = Math.max(150, Math.min(20000, 1000 / spread));
  // However tight the initial framing, always allow zooming out to roughly
  // world-map scale (matches the homepage WorldMap's own scale of 180 on its
  // 800-wide canvas, halved here for our 400-wide one) so the visitor can
  // see where the region actually sits on the globe.
  const minZoom = Math.max(0.02, 90 / scale);

  const selected = points.find((p) => p.day_number === selectedDay) || points[0];

  return (
    <div className="border border-border bg-card overflow-hidden">
      <div className="relative">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale, center: [centerLng, centerLat] }}
          // Half the library's default 800x600 viewBox: on a narrow phone
          // screen the rendered width is much closer to this canvas size, so
          // marker/line sizes (defined in SVG units below) map to roughly
          // 2x more CSS pixels than they would at the default viewBox.
          width={400}
          height={300}
          style={{ width: "100%", height: "clamp(280px, 45vw, 420px)" }}
        >
          <ZoomableGroup center={[centerLng, centerLat]} minZoom={minZoom} maxZoom={10} onMoveEnd={({ zoom: k }) => setZoom(k)}>
            <Geographies geography={geoUrl}>
              {({ geographies }) => {
                // Label the countries actually around the itinerary so
                // visitors can orient themselves — the base TopoJSON has no
                // place names baked in, only country borders. Centroid-based
                // and static (computed once from the itinerary's own spread,
                // not re-filtered on pan/zoom), same simplification as the
                // rest of this map's framing logic.
                const dayMaxLat = Math.max(...lats);
                const margin = Math.max(spread * 2, 5);
                const minLat = Math.min(...lats) - margin;
                const maxLat = dayMaxLat + margin;
                const minLng = Math.min(...lngs) - margin;
                const maxLng = Math.max(...lngs) + margin;

                // A tightly-zoomed itinerary (a single valley/city) sits deep
                // inside one country's polygon — that country's TRUE centroid
                // (e.g. central India for a Kashmir-only itinerary) is often
                // far outside the visible frame, so its label never renders.
                // Pin the containing country's label just above the point
                // cluster itself instead, guaranteed to stay on screen.
                const homeGeo = geographies.find((geo) =>
                  geoContains(geo as unknown as Parameters<typeof geoContains>[0], [centerLng, centerLat])
                );
                const otherLabels = geographies
                  .filter((geo) => geo !== homeGeo)
                  .map((geo) => {
                    const [lng, lat] = geoCentroid(geo as unknown as Parameters<typeof geoCentroid>[0]);
                    return { geo, lng, lat };
                  })
                  .filter(({ lat, lng }) => lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng)
                  .sort((a, b) => Math.hypot(a.lat - centerLat, a.lng - centerLng) - Math.hypot(b.lat - centerLat, b.lng - centerLng))
                  .slice(0, 7);
                const countryLabels = homeGeo
                  ? [{ geo: homeGeo, lng: centerLng, lat: dayMaxLat + Math.max(spread, 0.05) * 0.4 }, ...otherLabels]
                  : otherLabels;

                return (
                  <>
                    {geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="hsl(0, 0%, 11%)"
                        stroke="hsl(0, 0%, 20%)"
                        strokeWidth={0.5 / zoom}
                        style={{ default: { outline: "none" }, hover: { outline: "none" }, pressed: { outline: "none" } }}
                      />
                    ))}
                    {countryLabels.map(({ geo, lng, lat }) => (
                      <Marker key={`country-${geo.rsmKey}`} coordinates={[lng, lat]}>
                        <text
                          textAnchor="middle"
                          style={{
                            fontFamily: "var(--font-heading)",
                            fontSize: 7 / zoom,
                            letterSpacing: "0.05em",
                            fill: "hsl(0, 0%, 45%)",
                            pointerEvents: "none",
                          }}
                        >
                          {String(geo.properties?.name ?? "").toUpperCase()}
                        </text>
                      </Marker>
                    ))}
                  </>
                );
              }}
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

            {/* Render the selected marker last so it sits on top of any
                day it happens to overlap (e.g. an arrival/departure pair
                sharing the same city). */}
            {[...points]
              .sort((a, b) => (a.day_number === selectedDay ? 1 : 0) - (b.day_number === selectedDay ? 1 : 0))
              .map((p) => {
              const isSelected = p.day_number === selectedDay;
              return (
                <Marker
                  key={`marker-${p.day_number}`}
                  coordinates={[p.longitude, p.latitude]}
                  onClick={() => setSelectedDay(p.day_number)}
                >
                  {/* Outer glow ring, same layering as the homepage WorldMap.
                      Kept modest so stops that are geographically close
                      (common on compact itineraries) don't fully swallow
                      each other. */}
                  <circle r={(isSelected ? 14 : 11) / zoom} fill="hsla(0, 100%, 41%, 0.15)" className="cursor-pointer" />
                  <circle r={(isSelected ? 10 : 8) / zoom} fill="hsla(0, 100%, 41%, 0.25)" className="cursor-pointer" />
                  <circle
                    r={(isSelected ? 9 : 7) / zoom}
                    fill={isSelected ? "hsl(0, 0%, 96%)" : "hsl(0, 100%, 41%)"}
                    stroke="hsl(0, 0%, 100%)"
                    strokeWidth={1.5 / zoom}
                    className="cursor-pointer"
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: (isSelected ? 10 : 9) / zoom,
                      fill: isSelected ? "hsl(0, 100%, 41%)" : "hsl(0, 0%, 100%)",
                      fontWeight: 700,
                      pointerEvents: "none",
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
          <div className="flex flex-col sm:flex-row gap-4">
            {selected.image_url && (
              <img
                src={selected.image_url}
                alt={selected.title}
                className="w-full sm:w-32 h-32 object-cover flex-shrink-0 border border-border"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-heading text-[10px] tracking-[0.2em] uppercase text-accent-red mb-1">
                Day {selected.day_number}
              </p>
              <h3 className="font-heading text-sm tracking-[0.05em] uppercase mb-2">{selected.title}</h3>
              <p className="body-text text-sm text-muted-foreground">{selected.description}</p>
            </div>
          </div>
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
