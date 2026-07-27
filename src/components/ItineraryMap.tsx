"use client";

import { useCallback, useRef, useState } from "react";
import Map, { Marker, Source, Layer, type MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { ExpeditionDay } from "@/data/expeditions";

// Real map tiles (OpenFreeMap's dark style — MIT-licensed, no API key, no
// usage limits, commercial use explicitly permitted) instead of the old
// react-simple-maps + world-atlas 110m borders: accurate at any zoom, and
// city/country names are baked into the tiles instead of needing to be
// faked with a country-centroid label hack.
const MAP_STYLE = "https://tiles.openfreemap.org/styles/dark";

type PlottedDay = ExpeditionDay & { latitude: number; longitude: number };

// An illustrative route line across the region, not a surveyed GPS track.
const ItineraryMap = ({ days }: { days: ExpeditionDay[] }) => {
  const points = days.filter(
    (d): d is PlottedDay => typeof d.latitude === "number" && typeof d.longitude === "number"
  );
  const [selectedDay, setSelectedDay] = useState<number | null>(points[0]?.day_number ?? null);
  const mapRef = useRef<MapRef>(null);

  const handleLoad = useCallback(() => {
    const map = mapRef.current;
    if (!map || points.length === 0) return;
    if (points.length === 1) {
      map.jumpTo({ center: [points[0].longitude, points[0].latitude], zoom: 10 });
      return;
    }
    const lats = points.map((p) => p.latitude);
    const lngs = points.map((p) => p.longitude);
    map.fitBounds(
      [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
      { padding: 48, duration: 0 }
    );
  }, [points]);

  if (points.length === 0) return null;

  const lineGeoJSON = {
    type: "Feature" as const,
    properties: {},
    geometry: {
      type: "LineString" as const,
      coordinates: points.map((p) => [p.longitude, p.latitude]),
    },
  };

  const selected = points.find((p) => p.day_number === selectedDay) || points[0];

  return (
    <div className="border border-border bg-card overflow-hidden">
      <div className="relative">
        <Map
          ref={mapRef}
          mapStyle={MAP_STYLE}
          initialViewState={{ longitude: points[0].longitude, latitude: points[0].latitude, zoom: 4 }}
          minZoom={1}
          maxZoom={15}
          onLoad={handleLoad}
          style={{ width: "100%", height: "clamp(280px, 45vw, 420px)" }}
          attributionControl={{ compact: true }}
        >
          {points.length > 1 && (
            <Source id="route" type="geojson" data={lineGeoJSON}>
              <Layer
                id="route-line"
                type="line"
                paint={{ "line-color": "hsl(0, 100%, 41%)", "line-width": 2, "line-dasharray": [2, 2] }}
              />
            </Source>
          )}

          {/* Render the selected marker last so it sits on top of any day
              it happens to overlap (e.g. an arrival/departure pair sharing
              the same city). */}
          {[...points]
            .sort((a, b) => (a.day_number === selectedDay ? 1 : 0) - (b.day_number === selectedDay ? 1 : 0))
            .map((p) => {
              const isSelected = p.day_number === selectedDay;
              return (
                <Marker
                  key={p.day_number}
                  longitude={p.longitude}
                  latitude={p.latitude}
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    setSelectedDay(p.day_number);
                  }}
                >
                  <div
                    className="relative flex items-center justify-center cursor-pointer"
                    style={{ width: isSelected ? 34 : 28, height: isSelected ? 34 : 28 }}
                  >
                    {/* Outer glow ring, kept modest so stops that are
                        geographically close (common on compact itineraries)
                        don't fully swallow each other. */}
                    <div className="absolute inset-0 rounded-full" style={{ background: "hsla(0, 100%, 41%, 0.18)" }} />
                    <div
                      className="relative rounded-full flex items-center justify-center font-heading font-bold"
                      style={{
                        width: isSelected ? 24 : 19,
                        height: isSelected ? 24 : 19,
                        background: isSelected ? "hsl(0, 0%, 96%)" : "hsl(0, 100%, 41%)",
                        color: isSelected ? "hsl(0, 100%, 41%)" : "hsl(0, 0%, 100%)",
                        border: "1.5px solid hsl(0, 0%, 100%)",
                        fontSize: isSelected ? 11 : 10,
                      }}
                    >
                      {p.day_number}
                    </div>
                  </div>
                </Marker>
              );
            })}
        </Map>
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
