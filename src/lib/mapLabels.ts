import type { MapLibreMap } from "maplibre-gl";

// OpenFreeMap's styles label every place/road with "English \n Local script"
// (text-field falls back to name:latin + name:nonlatin) whenever a feature
// has a non-Latin name — Cyrillic, Mongolian, Arabic, etc. Per request, show
// English only: prefer the real English name (name_en), then the Latin
// transliteration (name:latin) if no translation exists, then whatever name
// the feature has at all as a last resort. Scans the whole style instead of
// hardcoding layer ids so it keeps working if OpenFreeMap adds/renames layers.
export function preferEnglishLabels(map: MapLibreMap): void {
  const layers = map.getStyle()?.layers;
  if (!layers) return;
  for (const layer of layers) {
    if (layer.type !== "symbol") continue;
    const textField = (layer.layout as Record<string, unknown> | undefined)?.["text-field"];
    if (!textField || !JSON.stringify(textField).includes("name:nonlatin")) continue;
    map.setLayoutProperty(layer.id, "text-field", [
      "coalesce",
      ["get", "name_en"],
      ["get", "name:latin"],
      ["get", "name"],
    ]);
  }
}

// OpenFreeMap's "place" labels (province/state names like "Sverdlovsk Oblast"
// or "Bashkortostan") render from zoom 0 by default, and city/town/village
// names have no minimum zoom either, so a whole-world or country-level view
// gets cluttered with administrative and settlement names nobody asked for.
// Per request: country names only at a distance, city names only once
// genuinely zoomed in close. Layer ids are OpenMapTiles-schema standard
// (same convention already relied on for "boundary_state"), not scanned,
// since there's no reliable structural marker to detect "is this a
// province/city layer" the way there is for the non-Latin text-field case.
const HIDDEN_PLACE_LAYERS = ["place_state"];
// [layerId, minzoom, maxzoom] — maxzoom preserved from the style's own
// values so only the lower bound (when a label starts appearing) changes.
const CITY_LABEL_ZOOM: Array<[string, number, number]> = [
  ["place_city_large", 8, 12],
  ["place_city", 10, 14],
  ["place_town", 10, 15],
  ["place_village", 11, 14],
  ["place_suburb", 11, 15],
  ["place_other", 11, 14],
];

export function limitPlaceLabels(map: MapLibreMap): void {
  for (const id of HIDDEN_PLACE_LAYERS) {
    if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", "none");
  }
  for (const [id, minzoom, maxzoom] of CITY_LABEL_ZOOM) {
    if (map.getLayer(id)) map.setLayerZoomRange(id, minzoom, maxzoom);
  }
}
