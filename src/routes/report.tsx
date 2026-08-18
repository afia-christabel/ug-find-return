import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Check } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, locations } from "@/data/mock";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report a Lost or Found Item — UG Lost & Found" },
      {
        name: "description",
        content:
          "Submit a lost or found item report for the University of Ghana campus in a few guided steps.",
      },
      { property: "og:title", content: "Report a Lost or Found Item — UG Lost & Found" },
      {
        property: "og:description",
        content: "A guided report flow that keeps identifying details private for verification.",
      },
    ],
  }),
  component: Report,
});

const stepTitles = ["Type", "Item details", "Where & when", "Private details", "Review"];

function Report() {
  const [step, setStep] = useState(0);
  const [type, setType] = useState<"lost" | "found">("lost");

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground">Report an item</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Step {step + 1} of {stepTitles.length} — {stepTitles[step]}
        </p>

        <div className="mt-4 flex gap-1.5">
          {stepTitles.map((t, i) => (
            <div
              key={t}
              className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        <div className="mt-8 space-y-5">
          {step === 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {(["lost", "found"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`rounded-xl border p-5 text-left transition ${
                    type === t ? "border-primary bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <span className="text-base font-semibold capitalize text-foreground">
                    I {t} an item
                  </span>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t === "lost"
                      ? "Something of yours is missing on campus."
                      : "You are holding an item that belongs to someone else."}
                  </p>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <>
              <Field label="Item name">
                <Input placeholder="e.g. Black student ID card" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Category">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Colour">
                  <Input placeholder="e.g. Navy blue" />
                </Field>
              </div>
              <Field label="Brand or model (optional)">
                <Input placeholder="e.g. Samsung Galaxy A34" />
              </Field>
              <Field label="Public description">
                <Textarea
                  rows={4}
                  placeholder="Describe the item generally. Do NOT include unique marks or serial numbers here."
                />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <Field label={type === "lost" ? "Where did you lose it?" : "Where did you find it?"}>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a campus location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Specific area (kept private)">
                <Input placeholder="e.g. Second floor reading room" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Date">
                  <Input type="date" />
                </Field>
                <Field label="Approximate time">
                  <Input placeholder="e.g. between 14:00 and 16:00" />
                </Field>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Lock className="h-4 w-4" /> Only admins see this
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  These details become the ownership verification questions. They are never shown
                  publicly or to a claimant.
                </p>
              </div>
              <Field label="Unique identifying details">
                <Textarea
                  rows={5}
                  placeholder="Scratches, cracks, stickers, serial number / IMEI, contents, engravings…"
                />
              </Field>
              <Field label="Photos (optional)">
                <Input type="file" multiple accept="image/*" />
              </Field>
            </>
          )}

          {step === 4 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                <Check className="h-4 w-4 text-primary" /> Ready to submit
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Your {type} report will be reviewed, then matched automatically against the other
                side of the register. You&apos;ll be notified about matches and claims.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-3">
          {step > 0 && (
            <Button variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          <Button
            className="flex-1"
            onClick={() => {
              if (step < stepTitles.length - 1) setStep(step + 1);
              else toast.success("Report submitted for review");
            }}
          >
            {step < stepTitles.length - 1 ? "Continue" : "Submit report"}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
