import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MapPin, CalendarDays, ShieldCheck, Lock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { items, statusLabels } from "@/data/mock";

export const Route = createFileRoute("/items/$itemId")({
  head: () => ({
    meta: [
      { title: "Item Report Details — UG Lost & Found" },
      {
        name: "description",
        content:
          "Review the public details of a reported campus item and start a verified ownership claim.",
      },
      { property: "og:title", content: "Item Report Details — UG Lost & Found" },
      {
        property: "og:description",
        content: "Public item details with private ownership verification before handover.",
      },
    ],
  }),
  component: ItemDetail,
});

function ItemDetail() {
  const { itemId } = Route.useParams();
  const item = items.find((i) => i.id === itemId);

  if (!item) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-xl font-semibold">Report not found</h1>
          <Button asChild className="mt-4">
            <Link to="/browse">Back to browse</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const facts = [
    ["Reference", item.reference],
    ["Category", item.category],
    ["Brand", item.brand ?? "Not stated"],
    ["Colour", item.colour ?? "Not stated"],
    ["Status", statusLabels[item.status]],
    ["Reported by", item.reporter],
  ] as const;

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link
          to="/browse"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <Badge variant={item.type === "found" ? "default" : "secondary"}>
              {item.type === "found" ? "Found item" : "Lost item"}
            </Badge>
            <h1 className="mt-2 text-2xl font-bold text-foreground">{item.name}</h1>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {item.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" /> {item.date}
              </span>
            </div>
          </div>
          {item.matchScore ? (
            <span className="rounded-md bg-accent px-2.5 py-1.5 text-sm font-semibold text-accent-foreground">
              {item.matchScore}% match
            </span>
          ) : null}
        </div>

        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{item.description}</p>

        <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-5">
          {facts.map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-muted-foreground">{k}</dt>
              <dd className="mt-0.5 text-sm font-medium text-foreground">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/40 p-5">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
            <Lock className="h-4 w-4" /> Private details withheld
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Serial numbers, marks, stickers and contents are never shown publicly. If this is yours,
            you&apos;ll answer verification questions built from those details.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="sm:flex-1">
            <Link to="/items/$itemId/claim" params={{ itemId: item.id }}>
              <ShieldCheck className="mr-2 h-4 w-4" /> This is mine — start claim
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="sm:flex-1">
            Report a concern
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
