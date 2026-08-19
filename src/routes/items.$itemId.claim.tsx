import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Lock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { items, verificationQuestions } from "@/data/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/items/$itemId/claim")({
  head: () => ({
    meta: [
      { title: "Start an Ownership Claim — UG Lost & Found" },
      {
        name: "description",
        content:
          "Answer private verification questions and submit proof of ownership for a reported campus item.",
      },
      { property: "og:title", content: "Start an Ownership Claim — UG Lost & Found" },
      {
        property: "og:description",
        content: "Ownership is confirmed through private verification questions, never public details.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ClaimWizard,
});

const steps = ["Verification questions", "Supporting evidence", "Declaration", "Submitted"];

function ClaimWizard() {
  const { itemId } = Route.useParams();
  const navigate = useNavigate();
  const item = items.find((i) => i.id === itemId);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [evidence, setEvidence] = useState({ proofType: "", details: "" });
  const [agreed, setAgreed] = useState(false);

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

  const answered = verificationQuestions.filter((q) => (answers[q.id] ?? "").trim()).length;

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link
          to="/items/$itemId"
          params={{ itemId }}
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to item
        </Link>

        <div className="mt-4">
          <Badge variant="secondary">{item.reference}</Badge>
          <h1 className="mt-2 text-2xl font-bold text-foreground">Claim: {item.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Step {Math.min(step + 1, steps.length)} of {steps.length} · {steps[step]}
          </p>
          <Progress value={((step + 1) / steps.length) * 100} className="mt-3" />
        </div>

        {step === 0 && (
          <section className="mt-6 space-y-5">
            <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground">
              <p className="inline-flex items-center gap-2 font-semibold text-foreground">
                <Lock className="h-4 w-4" /> Answers are private
              </p>
              <p className="mt-1.5">
                These questions come from details the finder recorded privately. Answer from memory —
                partial answers still count towards your verification score.
              </p>
            </div>

            {verificationQuestions.map((q) => (
              <div key={q.id} className="space-y-2">
                <Label htmlFor={q.id}>{q.question}</Label>
                <Input
                  id={q.id}
                  value={answers[q.id] ?? ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                  placeholder="Your answer"
                />
              </div>
            ))}

            <div className="flex justify-end">
              <Button disabled={answered === 0} onClick={() => setStep(1)}>
                Continue
              </Button>
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="proofType">Type of proof</Label>
              <Input
                id="proofType"
                value={evidence.proofType}
                onChange={(e) => setEvidence((v) => ({ ...v, proofType: e.target.value }))}
                placeholder="Receipt, purchase record, photo of the item in use…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="details">Describe your evidence</Label>
              <Textarea
                id="details"
                rows={5}
                value={evidence.details}
                onChange={(e) => setEvidence((v) => ({ ...v, details: e.target.value }))}
                placeholder="Serial number, IMEI, unique marks, or anything else only the owner would know."
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Evidence is visible only to you and the moderation team.
            </p>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button onClick={() => setStep(2)}>Continue</Button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="mt-6 space-y-5">
            <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Declaration</p>
              <p className="mt-2">
                I confirm that I am the rightful owner of this item and that the information I have
                provided is true. I understand that fraudulent claims are logged, reviewed by
                university staff and may lead to disciplinary action.
              </p>
              <label className="mt-4 flex items-start gap-3 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[var(--color-primary)]"
                />
                I agree to the declaration above.
              </label>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                disabled={!agreed}
                onClick={() => {
                  setStep(3);
                  toast.success("Claim submitted for verification");
                }}
              >
                <ShieldCheck className="mr-2 h-4 w-4" /> Submit claim
              </Button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="mt-8 rounded-xl border border-border bg-card p-8 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-3 text-lg font-semibold text-foreground">Claim submitted</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Your answers are being scored against the private details on record. You&apos;ll be
              notified once a moderator reviews your claim and, if approved, given a handover code.
            </p>
            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={() => navigate({ to: "/dashboard" })}>Track my claim</Button>
              <Button variant="outline" asChild>
                <Link to="/browse">Back to browse</Link>
              </Button>
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
