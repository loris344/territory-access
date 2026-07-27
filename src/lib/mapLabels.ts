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
