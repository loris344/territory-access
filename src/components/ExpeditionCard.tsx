import { Link } from "react-router-dom";
import { Mountain, Thermometer, Brain, Tent, Snowflake, TreePine, Compass, Sword, Users } from "lucide-react";
import type { Expedition } from "@/data/expeditions";

const statusStyles: Record<string, string> = {
  open: "bg-foreground/10 text-foreground border border-foreground/20",
  limited: "bg-accent/10 text-accent-red border border-accent/30",
  closed: "bg-muted text-muted-foreground border border-border",
  cancelled: "bg-destructive/10 text-destructive border border-destructive/30",
  postponed: "bg-muted text-muted-foreground border border-border",
};

const statusLabels: Record<string, string> = {
  open: "OPEN",
  limited: "FEW SPOTS LEFT",
  closed: "FULL",
  cancelled: "CANCELLED",
  postponed: "POSTPONED",
};

const intensityIcons: Record<string, React.ReactNode> = {
  mountain: <Mountain className="w-3.5 h-3.5" />,
  desert: <Thermometer className="w-3.5 h-3.5" />,
  psychological: <Brain className="w-3.5 h-3.5" />,
  isolation: <Tent className="w-3.5 h-3.5" />,
  polar: <Snowflake className="w-3.5 h-3.5" />,
  jungle: <TreePine className="w-3.5 h-3.5" />,
  nomadic: <Compass className="w-3.5 h-3.5" />,
  political: <Users className="w-3.5 h-3.5" />,
  historical: <Sword className="w-3.5 h-3.5" />,
  "post-conflict": <Sword className="w-3.5 h-3.5" />,
  altitude: <Mountain className="w-3.5 h-3.5" />,
};

const intensityLabels: Record<string, string> = {
  mountain: "Mountain",
  desert: "Desert",
  psychological: "Psychological",
  isolation: "Isolation",
  polar: "Polar",
  jungle: "Jungle",
  nomadic: "Nomadic",
  political: "Political",
  historical: "Historical",
  "post-conflict": "Post-Conflict",
  altitude: "Altitude",
};

const ExpeditionCard = ({ expedition, hidePrice = false }: { expedition: Expedition; hidePrice?: boolean }) => {
  const spotsLeft = expedition.capacity_max - expedition.spots_taken;

  return (
    <Link
      to={`/expeditions/${expedition.slug}`}
      className="group block border border-border bg-card hover:border-accent/50 transition-all duration-300"
    >
      {/* Hero image */}
      <div className="aspect-[16/9] bg-secondary border-b border-border overflow-hidden">
        {expedition.hero_image_url ? (
          <img
            src={expedition.hero_image_url}
            alt={expedition.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-heading text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              Image coming soon
            </span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6 md:p-8">
        {/* Status + duration */}
        <div className="flex items-center justify-between mb-4">
          <span className={`font-heading text-[10px] tracking-[0.15em] uppercase px-3 py-1 ${statusStyles[expedition.status] || statusStyles.closed}`}>
            {statusLabels[expedition.status] || expedition.status.toUpperCase()}
          </span>
          <span className="font-heading text-xs tracking-wider text-muted-foreground">
            {expedition.duration_days} DAYS
          </span>
        </div>

        {/* Theme + spots */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            {intensityIcons[expedition.intensity_type] || <Compass className="w-3.5 h-3.5" />}
            <span className="font-heading text-[10px] tracking-[0.1em] uppercase">
              {intensityLabels[expedition.intensity_type] || expedition.intensity_type}
            </span>
          </div>
          {expedition.status === "open" || expedition.status === "limited" ? (
            <span className={`font-heading text-[10px] tracking-wider ${spotsLeft <= 3 ? "text-accent-red" : "text-muted-foreground"}`}>
              {spotsLeft} SPOT{spotsLeft !== 1 ? "S" : ""} LEFT
            </span>
          ) : null}
        </div>

        {/* Name */}
        <h3 className="heading-display text-lg sm:text-xl mb-2 group-hover:text-accent-red transition-colors">
          {expedition.name}
        </h3>

        {/* Country + Location */}
        <p className="font-heading text-xs tracking-[0.1em] uppercase text-muted-foreground mb-1">
          {expedition.country} · {expedition.location}
        </p>
        {expedition.continent && (
          <p className="font-heading text-[10px] tracking-[0.1em] uppercase text-muted-foreground/60 mb-4">
            {expedition.continent}
          </p>
        )}

        {/* Dates */}
        <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground body-text">
          <span>
            {new Date(expedition.start_date).toLocaleDateString("en-US", { day: "numeric", month: "short" })} –{" "}
            {new Date(expedition.end_date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>

        <p className="body-text text-sm text-muted-foreground mb-6 line-clamp-2">
          {expedition.short_description}
        </p>

        {/* Price & CTA */}
        <div className={`flex items-center ${hidePrice ? "justify-end" : "justify-between"} pt-6 border-t border-border`}>
          {!hidePrice && (
            <span className="font-heading text-xl tracking-wider">
              ${expedition.price_usd.toLocaleString("en-US")}
              <span className="text-xs text-muted-foreground ml-1">/ pers.</span>
            </span>
          )}
          <span className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground group-hover:text-foreground transition-colors">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ExpeditionCard;
