import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ItemCard } from "@/components/ItemCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, items, locations } from "@/data/mock";

export const Route = createFileRoute("/browse")({
  head: () => ({
    meta: [
      { title: "Browse Lost & Found Items — University of Ghana" },
      {
        name: "description",
        content:
          "Search and filter lost and found items reported across the University of Ghana campus.",
      },
      { property: "og:title", content: "Browse Lost & Found Items — University of Ghana" },
      {
        property: "og:description",
        content: "Filter campus lost and found reports by type, category and location.",
      },
    ],
  }),
  component: Browse,
});

function Browse() {
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");

  const results = useMemo(
    () =>
      items.filter((i) => {
        if (tab !== "all" && i.type !== tab) return false;
        if (category !== "all" && i.category !== category) return false;
        if (location !== "all" && i.location !== location) return false;
        if (q.trim()) {
          const hay = `${i.name} ${i.brand ?? ""} ${i.colour ?? ""} ${i.description} ${i.reference}`;
          if (!hay.toLowerCase().includes(q.toLowerCase())) return false;
        }
        return true;
      }),
    [tab, q, category, location],
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground">Browse reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Public details only. Identifying marks stay private and are used for verification.
        </p>

        <div className="mt-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search item, brand or reference number"
              className="pl-9"
            />
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                All
              </TabsTrigger>
              <TabsTrigger value="lost" className="flex-1">
                Lost
              </TabsTrigger>
              <TabsTrigger value="found" className="flex-1">
                Found
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-2 gap-3">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All locations</SelectItem>
                {locations.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="mt-6 text-xs font-medium text-muted-foreground">
          {results.length} result{results.length === 1 ? "" : "s"}
        </p>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {results.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
        {results.length === 0 && (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            No items match those filters yet.
          </p>
        )}
      </div>
    </AppShell>
  );
}
