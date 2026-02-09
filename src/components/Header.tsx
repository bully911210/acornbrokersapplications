import { Link } from "react-router-dom";
import acornLogo from "@/assets/acorn-logo.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
  { number: 1, label: "Eligibility", short: "Eligibility" },
  { number: 2, label: "Personal", short: "Personal Details" },
  { number: 3, label: "Cover", short: "Cover Selection" },
  { number: 4, label: "Banking", short: "Banking" },
  { number: 5, label: "Review", short: "Review & Confirm" },
];

interface HeaderProps {
  currentStep?: number;
  showStepIndicator?: boolean;
}

export const Header = ({ currentStep = 1, showStepIndicator = true }: HeaderProps) => {
  const currentStepData = STEPS.find((s) => s.number === currentStep);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border">
      <div className="container flex h-14 lg:h-16 items-center justify-between gap-4">
        {/* Logo - Left (25% larger) */}
        <Link to="/" className="flex-shrink-0" onClick={() => window.location.reload()}>
          <img 
            src={acornLogo} 
            alt="Acorn Brokers" 
            className="h-14 lg:h-[70px] w-auto" 
          />
        </Link>

        {/* Step Indicator - Centre */}
        {showStepIndicator && (
          <>
            {/* Desktop: Text-based step indicator */}
            <nav className="hidden lg:flex items-center gap-1.5 text-sm">
              {STEPS.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <span
                    className={cn(
                      "transition-colors",
                      currentStep === step.number && "font-semibold text-foreground",
                      currentStep > step.number && "text-muted-foreground",
                      currentStep < step.number && "text-muted-foreground/50"
                    )}
                  >
                    {step.label}
                  </span>
                  {index < STEPS.length - 1 && (
                    <span className="mx-2 text-muted-foreground/40">→</span>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile: Simple step counter */}
            <div className="lg:hidden flex flex-col items-center">
              <span className="text-sm font-medium text-foreground">
                Step {currentStep} of 5
              </span>
              <span className="text-xs text-muted-foreground">
                {currentStepData?.short}
              </span>
            </div>
          </>
        )}

        {/* CTA Button - Right (Desktop only) */}
        <div className="hidden lg:block flex-shrink-0">
          <Button 
            variant="default" 
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            asChild
          >
            <Link to="/">Apply Now</Link>
          </Button>
        </div>

        {/* Spacer for mobile to balance layout */}
        <div className="lg:hidden w-7" />
      </div>
    </header>
  );
};
