import { Link } from "react-router-dom";
import acornLogo from "@/assets/acorn-logo.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BadgeCheck, Landmark, LockKeyhole } from "lucide-react";

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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90">
      <div className="border-b border-border bg-secondary/40">
        <div className="container flex min-h-10 flex-wrap items-center justify-center gap-x-6 gap-y-1 py-2 text-[11px] font-medium text-muted-foreground lg:justify-between">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-3.5 w-3.5 text-primary" />
            <span>Acorn Brokers (Pty) Ltd · FSP 47433</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Landmark className="h-3.5 w-3.5 text-primary" />
            <span>Underwritten by GENRIC Insurance Company Ltd · FSP 43638</span>
          </div>
          <div className="flex items-center gap-2">
            <LockKeyhole className="h-3.5 w-3.5 text-primary" />
            <span>POPIA-conscious application workflow</span>
          </div>
        </div>
      </div>

      <div className="container flex h-16 lg:h-[4.5rem] items-center justify-between gap-4">
        {/* Logo - Left (25% larger) */}
        <Link to="/" className="flex-shrink-0" onClick={() => window.location.reload()}>
          <img 
            src={acornLogo} 
            alt="Acorn Brokers" 
            className="h-12 lg:h-16 w-auto" 
          />
        </Link>

        {/* Step Indicator - Centre */}
        {showStepIndicator && (
          <>
            {/* Desktop: Text-based step indicator */}
            <nav className="hidden lg:flex items-center gap-3 text-sm">
              {STEPS.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <span
                    className={cn(
                      "transition-colors",
                      currentStep === step.number && "font-semibold text-foreground",
                      currentStep > step.number && "text-foreground/70",
                      currentStep < step.number && "text-muted-foreground/50"
                    )}
                  >
                    {step.label}
                  </span>
                  {index < STEPS.length - 1 && (
                    <span className="mx-1 text-muted-foreground/40">/</span>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile: Simple step counter */}
            <div className="lg:hidden flex flex-col items-center">
              <span className="text-sm font-semibold text-foreground">
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
            variant="outline" 
            size="sm"
            className="font-medium"
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
