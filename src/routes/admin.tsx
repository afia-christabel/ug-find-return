import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { items, statusLabels } from "@/data/mock";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — UG Lost & Found" },
      {
        name: "description",
        content:
          "Moderate reports, review ownership claims and schedule handovers for the campus lost and found register.",
      },
      { property: "og:title", content: "Admin Dashboard — UG Lost & Found" },
      {
        property: "og:description",
        content: "Queue of pending reports, claims under verification and scheduled handovers.",
      },
    ],
  }),
  component: Admin,
});

const kpis = [
  { label: "Pending review", value: 12 },
  { label: "Claims to verify", value: 5 },
  { label: "Disputed", value: 1 },
  { label: "Handovers today", value: 3 },
];

function Admin() {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground">Admin dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Moderation queue, claim verification and handover scheduling.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{k.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-mono text-xs">{i.reference}</TableCell>
                  <TableCell className="font-medium">{i.name}</TableCell>
                  <TableCell>
                    <Badge variant={i.type === "found" ? "default" : "secondary"}>{i.type}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{i.location}</TableCell>
                  <TableCell className="text-muted-foreground">{statusLabels[i.status]}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppShell>
  );
}
