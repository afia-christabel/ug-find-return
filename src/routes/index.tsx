import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ShieldCheck, Sparkles, HandHeart, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ItemCard } from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { items, stats } from "@/data/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UG Lost & Found — Report and Recover Campus Items" },
      {
        name: "description",
        content:
          "Report lost or found items at the University of Ghana, get smart matches, and recover belongings through verified handovers.",
      },
      { property: "og:title", content: "UG Lost & Found — Report and Recover Campus Items" },
      {
        property: "og:description",
        content:
          "Verified campus lost and found: smart matching, private ownership verification, and safe handovers.",
      },
    ],
  }),
  component: Home,
});

const steps = [
  {
    icon: Search,
    title: "Report it",
    body: "Describe what you lost or found. Keep unique marks private — they verify ownership later.",
  },
  {
    icon: Sparkles,
    title: "Smart matching",
    body: "Our matching engine scores lost and found reports on category, brand, colour, place and date.",
  },
  {
    icon: ShieldCheck,
    title: "Verify ownership",
    body: "Claimants answer private questions only the true owner can answer. No details leak.",
  },
  {
    icon: HandHeart,
    title: "Safe handover",
    body: "A one-time handover code closes the loop at an official campus collection point.",
  },
];

function Home() {
  const recent = items.slice(0, 4);

  return (
    <AppShell>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified students &amp; staff only
          </span>
          <h1 className="mt-4 max-w-2xl text-3xl font-bold leading-tight md:text-5xl">
            Lost something on campus? Let&apos;s get it back to you.
          </h1>
          <p className="mt-4 max-w-xl text-sm opacity-80 md:text-base">
            The official University of Ghana Lost &amp; Found platform — report items, get matched
            automatically, and recover them through a verified handover.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="secondary">
              <Link to="/report">Report an item</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/browse">Browse listings</Link>
            </Button>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-lg bg-primary-foreground/10 p-4">
                <dt className="text-xs opacity-70">{s.label}</dt>
                <dd className="mt-1 text-2xl font-bold">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-semibold text-foreground md:text-2xl">How it works</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-xl border border-border bg-card p-5">
              <s.icon className="h-5 w-5 text-primary" />
              <p className="mt-3 text-xs font-semibold text-muted-foreground">Step {i + 1}</p>
              <h3 className="text-base font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold text-foreground md:text-2xl">Recent reports</h2>
          <Link
            to="/browse"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {recent.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
