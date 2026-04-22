import { BadgeCheck, FileCheck, Landmark, LockKeyhole, Phone, ShieldCheck } from "lucide-react";

interface ApplicationTrustPanelProps {
  currentStep: number;
}

const NEXT_STEP_LABELS: Record<number, string> = {
  1: "Personal details",
  2: "Cover selection",
  3: "Banking details",
  4: "Review and authorisations",
  5: "Secure submission",
};

export const ApplicationTrustPanel = ({ currentStep }: ApplicationTrustPanelProps) => {
  return (
    <aside className="hidden xl:block xl:w-[320px] shrink-0">
      <div className="sticky top-28 space-y-4">
        <section className="rounded-lg border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Application status
            </p>
            <h3 className="mt-2 text-lg font-semibold text-foreground">
              Current stage: Step {currentStep}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Next up: {NEXT_STEP_LABELS[currentStep]}
            </p>
          </div>

          <div className="px-5 py-4 space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="font-medium text-foreground">Regulated intermediary</p>
                <p className="text-muted-foreground">Acorn Brokers (Pty) Ltd · FSP 47433</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BadgeCheck className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="font-medium text-foreground">Product administrator</p>
                <p className="text-muted-foreground">Firearms Guardian (Pty) Ltd · FSP 47115</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Landmark className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="font-medium text-foreground">Underwritten by GENRIC</p>
                <p className="text-muted-foreground">GENRIC Insurance Company Ltd · FSP 43638</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-base font-semibold text-foreground">What happens next</h3>
          </div>
          <div className="px-5 py-4 space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <FileCheck className="mt-0.5 h-4 w-4 text-primary" />
              <p className="text-muted-foreground">Your application is captured in a structured compliance workflow.</p>
            </div>
            <div className="flex items-start gap-3">
              <LockKeyhole className="mt-0.5 h-4 w-4 text-primary" />
              <p className="text-muted-foreground">Sensitive identity and banking details are masked in confirmations and stored securely.</p>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-primary" />
              <p className="text-muted-foreground">Questions? Contact info@acornbrokers.co.za or +27 (0)69 007 6320.</p>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
};