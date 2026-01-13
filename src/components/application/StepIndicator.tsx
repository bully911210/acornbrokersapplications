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
  { number: 5, title: "Confirm" },
];

interface StepIndicatorProps {
  currentStep: number;
}

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="w-full mb-4 md:mb-8">
      <div className="flex items-center justify-between">
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
                  "mt-1 md:mt-2 text-xs font-medium hidden md:block",
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
        Step {currentStep}: {STEPS[currentStep - 1]?.title}
      </p>
    </div>
  );
};
