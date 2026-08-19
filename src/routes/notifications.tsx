import { createFileRoute } from "@tanstack/react-router";
import { Bell, Sparkles, ShieldCheck, Handshake, Megaphone } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { notifications, type NotificationRecord } from "@/data/mock";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — UG Lost & Found" },
      {
        name: "description",
        content:
          "Match alerts, claim decisions and handover reminders for your University of Ghana lost and found activity.",
      },
      { property: "og:title", content: "Notifications — UG Lost & Found" },
      {
        property: "og:description",
        content: "Stay updated on matches, claim reviews and item collection.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Notifications,
});

const icons: Record<NotificationRecord["kind"], typeof Bell> = {
  match: Sparkles,
  claim: ShieldCheck,
  handover: Handshake,
  admin: Megaphone,
};

function Notifications() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-foreground">
          <Bell className="h-5 w-5" /> Notifications
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Match alerts, claim decisions and collection reminders.
        </p>

        <div className="mt-6 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {notifications.map((n) => {
            const Icon = icons[n.kind];
            return (
              <div key={n.id} className={`flex gap-3 p-4 ${n.unread ? "bg-accent/30" : ""}`}>
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{n.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
                </div>
                {n.unread ? (
                  <span className="ml-auto mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
