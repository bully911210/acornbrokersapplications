import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { coverSelectionSchema, CoverSelectionData } from "@/lib/validations";
import { COVER_OPTIONS, WAITING_PERIOD_INFO } from "@/lib/coverData";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Clock,
} from "lucide-react";

interface CoverSelectionStepProps {
  defaultValues?: Partial<CoverSelectionData>;
  onNext: (data: CoverSelectionData) => void;
  onBack: () => void;
}

export const CoverSelectionStep = ({
  defaultValues,
  onNext,
  onBack,
}: CoverSelectionStepProps) => {
  const [expandedBenefits, setExpandedBenefits] = useState<string | null>(null);
  const [expandedExclusions, setExpandedExclusions] = useState<string | null>(null);

  const form = useForm<CoverSelectionData>({
    resolver: zodResolver(coverSelectionSchema),
    defaultValues: {
      coverOption: undefined,
      ...defaultValues,
    },
  });

  const onSubmit = (data: CoverSelectionData) => {
    onNext(data);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Choose Your Cover
        </h2>
        <p className="text-muted-foreground">
          Select the insurance plan that best suits your needs.
        </p>
      </div>

      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="coverOption"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value || ""}
                    className="grid grid-cols-1 gap-6 lg:gap-4"
                  >
                    {COVER_OPTIONS.map((option, index) => (
                      <label
                        key={option.id}
                        className={`cover-card flex flex-col lg:flex-row lg:items-stretch lg:gap-6 stagger-${index + 1} animate-fade-in opacity-0 ${
                          field.value === option.id
                            ? "cover-card-selected"
                            : "cover-card-unselected"
                        }`}
                      >
                        <RadioGroupItem value={option.id} className="sr-only" />

                        {/* Header (mobile) / Name+Price column (desktop) */}
                        <div className="flex items-start justify-between gap-2 mb-4 lg:mb-0 lg:flex-col lg:justify-center lg:w-56 lg:shrink-0 lg:border-r lg:border-border lg:pr-6">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-foreground leading-tight lg:min-h-0 min-h-[3.5rem] flex items-start lg:items-center">
                              {option.name}
                            </h3>
                            <p className="text-3xl font-bold text-primary mt-2 whitespace-nowrap">
                              {formatCurrency(option.premium)}
                              <span className="text-sm font-normal text-muted-foreground">
                                /month
                              </span>
                            </p>
                          </div>
                          {field.value === option.id && (
                            <div className="p-1 rounded-full bg-primary text-primary-foreground shrink-0 lg:self-start">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>

                        {/* Limits */}
                        <div className="space-y-2 mb-4 pb-4 border-b border-border lg:mb-0 lg:pb-0 lg:border-b-0 lg:border-r lg:pr-6 lg:flex lg:flex-col lg:justify-center lg:w-64 lg:shrink-0">
                          <div className="flex justify-between gap-2 text-sm items-baseline">
                            <span className="text-muted-foreground whitespace-nowrap">
                              Legal Expense Limit
                            </span>
                            <span className="font-semibold text-foreground whitespace-nowrap">
                              {formatCurrency(option.legalExpenseLimit)}
                            </span>
                          </div>
                          <div className="flex justify-between gap-2 text-sm items-baseline">
                            <span className="text-muted-foreground whitespace-nowrap">
                              Liability Limit
                            </span>
                            <span className="font-semibold text-foreground whitespace-nowrap">
                              {formatCurrency(option.liabilityLimit)}
                            </span>
                          </div>
                        </div>

                        {/* Benefits + Exclusions wrapper for desktop */}
                        <div className="lg:flex-1 lg:flex lg:flex-col lg:justify-center lg:min-w-0">
                        {/* Benefits */}
                        <Collapsible
                          open={expandedBenefits === option.id}
                          onOpenChange={() =>
                            setExpandedBenefits(
                              expandedBenefits === option.id ? null : option.id
                            )
                          }
                        >
                          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-primary hover:text-primary-dark">
                            <span>View Benefits</span>
                            {expandedBenefits === option.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-2 space-y-2">
                            {option.benefits.map((benefit, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 text-sm"
                              >
                                <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                                <span className="text-muted-foreground">
                                  {benefit}
                                </span>
                              </div>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>

                        {/* Exclusions */}
                        <Collapsible
                          open={expandedExclusions === option.id}
                          onOpenChange={() =>
                            setExpandedExclusions(
                              expandedExclusions === option.id ? null : option.id
                            )
                          }
                        >
                          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                            <span>View Exclusions</span>
                            {expandedExclusions === option.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-2 space-y-2">
                            {option.exclusions.map((exclusion, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 text-sm"
                              >
                                <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                                <span className="text-muted-foreground">
                                  {exclusion}
                                </span>
                              </div>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Waiting Period Disclosure */}
          <div className="bg-warning-light border border-warning/30 rounded-lg p-4 animate-fade-in opacity-0" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-warning mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">
                  Waiting Period Information
                </h4>
                <p className="text-sm text-muted-foreground">
                  {WAITING_PERIOD_INFO.immediate}
                </p>
                <p className="text-sm text-muted-foreground">
                  {WAITING_PERIOD_INFO.representation}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button type="submit" size="lg" className="min-w-[200px]">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
