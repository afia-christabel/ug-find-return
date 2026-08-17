import { Link } from "@tanstack/react-router";
import { MapPin, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { statusLabels, type MockItem } from "@/data/mock";

export function ItemCard({ item }: { item: MockItem }) {
  return (
    <Link
      to="/items/$itemId"
      params={{ itemId: item.id }}
      className="block rounded-xl border border-border bg-card p-4 transition hover:border-primary/40 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge variant={item.type === "found" ? "default" : "secondary"} className="mb-2">
            {item.type === "found" ? "Found" : "Lost"}
          </Badge>
          <h3 className="text-base font-semibold text-foreground">{item.name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {item.category}
            {item.brand ? ` · ${item.brand}` : ""} · {item.reference}
          </p>
        </div>
        {item.matchScore ? (
          <span className="shrink-0 rounded-md bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground">
            {item.matchScore}% match
          </span>
        ) : null}
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" /> {item.location}
        </span>
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" /> {item.date}
        </span>
        <span className="ml-auto font-medium text-foreground/70">{statusLabels[item.status]}</span>
      </div>
    </Link>
  );
}
