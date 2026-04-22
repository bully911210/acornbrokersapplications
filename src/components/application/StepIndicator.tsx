import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  title: string;
}

const STEPS: Step[] = [
  { number: 1, title: "Eligibility" },
  { number: 2, title: "Personal Details" },
  { number: 3, title: "Cover Selection" },
  { number: 4, title: "Banking" },
  { number: 5, title: "Review & Confirm" },
];

interface StepIndicatorProps {
  currentStep: number;
}

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="application-stepper">
      <div className="mb-4 flex items-center justify-between gap-4 border-b border-border pb-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Application progress
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1]?.title}
          </p>
        </div>
        <p className="hidden md:block text-sm text-muted-foreground">
          Complete each section in sequence to proceed.
        </p>
      </div>

      <div className="flex items-center justify-between gap-2">
        {STEPS.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "step-indicator",
                  currentStep > step.number && "step-indicator-complete",
                  currentStep === step.number && "step-indicator-active",
                  currentStep < step.number && "step-indicator-pending"
                )}
              >
                {currentStep > step.number ? (
                  <Check className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-[11px] font-medium hidden whitespace-nowrap md:block",
                  currentStep >= step.number
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-1 md:mx-2",
                  currentStep > step.number ? "bg-success" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground mt-2 md:hidden">
        {STEPS[currentStep - 1]?.title}
      </p>
    </div>
  );
};
