import { Link } from "react-router-dom";
import type { Expedition } from "@/data/expeditions";


const statusStyles = {
  open: "bg-foreground/10 text-foreground border border-foreground/20",
  limited: "bg-accent/10 text-accent-red border border-accent/30",
  closed: "bg-muted text-muted-foreground border border-border",
};

const statusLabels = {
  open: "OPEN",
  limited: "LIMITED ACCESS",
  closed: "CLOSED",
};

const ExpeditionCard = ({ expedition, hidePrice = false }: { expedition: Expedition; hidePrice?: boolean }) => {
  return (
    <Link
      to={`/expeditions/${expedition.slug}`}
      className="group block border border-border bg-card hover:border-accent/50 transition-all duration-300"
    >
      {/* Hero image placeholder */}
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
        {/* Status badge */}
        <div className="flex items-center justify-between mb-6">
          <span className={`font-heading text-[10px] tracking-[0.15em] uppercase px-3 py-1 ${statusStyles[expedition.status]}`}>
            {statusLabels[expedition.status]}
          </span>
          <span className="font-heading text-xs tracking-wider text-muted-foreground">
            {expedition.duration_days} DAYS
          </span>
        </div>

        {/* Name */}
        <h3 className="heading-display text-lg sm:text-xl mb-2 group-hover:text-accent-red transition-colors">
          {expedition.name}
        </h3>

        {/* Location */}
        <p className="font-heading text-xs tracking-[0.1em] uppercase text-muted-foreground mb-4">
          {expedition.location}
        </p>

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
