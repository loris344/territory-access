"use client";

import { ComposableMap, Geographies, Geography, Marker, Line, ZoomableGroup } from "react-simple-maps";
import type { ExpeditionDay } from "@/data/expeditions";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type PlottedDay = ExpeditionDay & { latitude: number; longitude: number };

// An illustrative route line across the region, not a surveyed GPS track.
// Scale is derived from how spread out the day-coordinates are so a compact
// itinerary (e.g. a single valley) zooms in, and a cross-country one zooms out.
const ItineraryMap = ({ days }: { days: ExpeditionDay[] }) => {
  const points = days.filter(
    (d): d is PlottedDay => typeof d.latitude === "number" && typeof d.longitude === "number"
  );
  if (points.length === 0) return null;

  const lats = points.map((p) => p.latitude);
  const lngs = points.map((p) => p.longitude);
  const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
  const spread = Math.max(Math.max(...lats) - Math.min(...lats), Math.max(...lngs) - Math.min(...lngs), 0.05);
  const scale = Math.max(300, Math.min(30000, 900 / spread));

  return (
    <div className="relative border border-border bg-card overflow-hidden">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale, center: [centerLng, centerLat] }}
        style={{ width: "100%", height: "clamp(280px, 45vw, 420px)" }}
      >
        <ZoomableGroup center={[centerLng, centerLat]} minZoom={1} maxZoom={8}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="hsl(0, 0%, 11%)"
                  stroke="hsl(0, 0%, 20%)"
                  strokeWidth={0.5}
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
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
          ))}

          {points.map((p) => (
            <Marker key={`marker-${p.day_number}`} coordinates={[p.longitude, p.latitude]}>
              <circle r={5} fill="hsl(0, 100%, 41%)" stroke="hsl(0, 0%, 100%)" strokeWidth={1} />
              <text
                textAnchor="middle"
                y={-10}
                style={{ fontFamily: "var(--font-heading)", fontSize: 9, fill: "hsl(0, 0%, 96%)" }}
              >
                {p.day_number}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default ItineraryMap;
