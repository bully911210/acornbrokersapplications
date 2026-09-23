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
import { Loader2 } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DesktopCoverComparison } from "@/components/application/DesktopCoverComparison";
import { coverSelectionSchema, CoverSelectionData } from "@/lib/validations";
import { COVER_OPTIONS, WAITING_PERIOD_INFO } from "@/lib/coverData";
import { formatCurrency } from "@/lib/formatters";
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
  isSaving?: boolean;
}

export const CoverSelectionStep = ({
  defaultValues,
  onNext,
  onBack,
  isSaving = false,
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

  return (
    <div className="animate-fade-in">
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onNext)} className="space-y-6">
          <FormField
            control={form.control}
            name="coverOption"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <>
                    <DesktopCoverComparison
                      selectedId={field.value}
                      onSelect={field.onChange}
                    />

                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      className="grid grid-cols-1 gap-6 lg:hidden"
                    >
                      {COVER_OPTIONS.map((option, index) => (
                        <label
                          key={option.id}
                          className={`cover-card relative flex flex-col stagger-${index + 1} animate-fade-in opacity-0 ${
                            field.value === option.id
                              ? "cover-card-selected"
                              : "cover-card-unselected"
                          }`}
                        >
                          <RadioGroupItem value={option.id} className="sr-only" />

                          <div className="mb-4 flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              {option.id === "option_b" && (
                                <span className="mb-2 inline-flex rounded-md bg-primary px-2.5 py-1 text-xs font-semibold uppercase text-primary-foreground">
                                  Most Popular
                                </span>
                              )}
                              <h3 className="text-lg font-bold leading-6 text-foreground">
                                {option.name}
                              </h3>
                              <p className="mt-2 whitespace-nowrap text-3xl font-bold text-primary">
                                {formatCurrency(option.premium)}
                                <span className="text-sm font-normal text-muted-foreground">
                                  /month
                                </span>
                              </p>
                            </div>
                            {field.value === option.id && (
                              <div className="shrink-0 rounded-full bg-primary p-1 text-primary-foreground">
                                <Check className="h-4 w-4" />
                              </div>
                            )}
                          </div>

                          <div className="mb-3 space-y-2 border-b border-border pb-3">
                            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3 text-sm leading-5">
                              <span className="text-muted-foreground">
                                Legal Expense Limit
                              </span>
                              <span className="whitespace-nowrap font-semibold text-foreground">
                                {formatCurrency(option.legalExpenseLimit)}
                              </span>
                            </div>
                            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3 text-sm leading-5">
                              <span className="text-muted-foreground">
                                Liability Limit
                              </span>
                              <span className="whitespace-nowrap font-semibold text-foreground">
                                {formatCurrency(option.liabilityLimit)}
                              </span>
                            </div>
                          </div>

                          <div>
                            <Collapsible
                              open={expandedBenefits === option.id}
                              onOpenChange={() =>
                                setExpandedBenefits(
                                  expandedBenefits === option.id ? null : option.id
                                )
                              }
                            >
                              <CollapsibleTrigger className="flex min-h-11 w-full items-center justify-between py-2 text-sm font-medium text-primary hover:text-primary-dark">
                                <span>View Benefits</span>
                                {expandedBenefits === option.id ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </CollapsibleTrigger>
                              <CollapsibleContent className="mt-2 space-y-2">
                                {option.benefits.map((benefit, i) => (
                                  <div key={i} className="flex items-start gap-2 text-sm leading-6">
                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                                    <span className="text-muted-foreground">{benefit}</span>
                                  </div>
                                ))}
                              </CollapsibleContent>
                            </Collapsible>

                            <Collapsible
                              open={expandedExclusions === option.id}
                              onOpenChange={() =>
                                setExpandedExclusions(
                                  expandedExclusions === option.id ? null : option.id
                                )
                              }
                            >
                              <CollapsibleTrigger className="flex min-h-11 w-full items-center justify-between py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                                <span>View Exclusions</span>
                                {expandedExclusions === option.id ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </CollapsibleTrigger>
                              <CollapsibleContent className="mt-2 space-y-2">
                                {option.exclusions.map((exclusion, i) => (
                                  <div key={i} className="flex items-start gap-2 text-sm leading-6">
                                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                                    <span className="text-muted-foreground">{exclusion}</span>
                                  </div>
                                ))}
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        </label>
                      ))}
                    </RadioGroup>
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Waiting Period Disclosure */}
          <div className="fieldset-section">
            <div className="rounded-md bg-warning-light p-4 animate-fade-in opacity-0" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-warning mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">
                  Waiting Period Information
                </h4>
                <p className="text-sm leading-6 text-muted-foreground">
                  {WAITING_PERIOD_INFO.immediate}
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {WAITING_PERIOD_INFO.representation}
                </p>
              </div>
            </div>
          </div>
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="gap-2"
              disabled={isSaving}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button type="submit" size="lg" className="min-w-[200px]" disabled={isSaving}>
              {isSaving ? "Saving…" : "Continue"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
