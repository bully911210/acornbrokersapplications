import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { authorisationsSchema, AuthorisationsData, FullApplicationData } from "@/lib/validations";
import { COVER_OPTIONS } from "@/lib/coverData";
import { formatCurrency, getOrdinalSuffix, maskAccountNumber, maskIdNumber } from "@/lib/formatters";
import { ArrowLeft, Loader2, FileText, Shield, Lock, CircleCheck, Landmark, UserRound, ChevronDown, Globe, Users, UserPlus } from "lucide-react";

interface AuthorisationsStepProps {
  applicationData: Partial<FullApplicationData>;
  onSubmit: (data: AuthorisationsData) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export const AuthorisationsStep = ({
  applicationData,
  onSubmit,
  onBack,
  isSubmitting,
}: AuthorisationsStepProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showIndividualDeclarations, setShowIndividualDeclarations] = useState(false);

  const form = useForm<AuthorisationsData>({
    resolver: zodResolver(authorisationsSchema),
    defaultValues: {
      source: undefined,
      debitOrderConsent: false as unknown as true,
      declarationConsent: false as unknown as true,
      popiaConsent: false as unknown as true,
    },
  });

  const debitConsent = form.watch("debitOrderConsent");
  const declConsent = form.watch("declarationConsent");
  const popiaConsent = form.watch("popiaConsent");
  const allAccepted = !!debitConsent && !!declConsent && !!popiaConsent;

  const toggleAll = (next: boolean) => {
    form.setValue("debitOrderConsent", next as unknown as true, { shouldValidate: true });
    form.setValue("declarationConsent", next as unknown as true, { shouldValidate: true });
    form.setValue("popiaConsent", next as unknown as true, { shouldValidate: true });
  };

  const coverOption = COVER_OPTIONS.find(
    (opt) => opt.id === applicationData.coverOption
  );


  return (
    <div className="animate-fade-in">
      <section className="document-section mb-8">
        <div className="document-section-header flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Pre-submission review
            </p>
            <h3 className="mt-1 text-lg font-semibold text-foreground">
              Review your application summary
            </h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CircleCheck className="h-4 w-4 text-success" />
            Confirm your details before final submission
          </div>
        </div>

        <div className="document-section-body">
          <div className="review-sheet divide-y divide-border bg-background">
            <div className="review-sheet-section">
              <div className="review-sheet-title">
                <UserRound className="h-4 w-4 text-primary" />
                <h4 className="font-medium text-foreground">Applicant details</h4>
              </div>
              <dl className="review-sheet-grid">
                <dt>Name</dt>
                <dd>{applicationData.firstName} {applicationData.lastName}</dd>
                <dt>ID number</dt>
                <dd>{maskIdNumber(applicationData.saIdNumber)}</dd>
                <dt>Email</dt>
                <dd className="break-words">{applicationData.email}</dd>
                <dt>Mobile</dt>
                <dd>{applicationData.mobile}</dd>
              </dl>
            </div>

            <div className="review-sheet-section">
              <div className="review-sheet-title">
                <Shield className="h-4 w-4 text-primary" />
                <h4 className="font-medium text-foreground">Selected cover</h4>
              </div>
              <dl className="review-sheet-grid">
                <dt>Plan</dt>
                <dd>{coverOption?.name}</dd>
                <dt>Monthly premium</dt>
                <dd className="font-semibold text-primary">{coverOption ? formatCurrency(coverOption.premium) : ""}</dd>
                <dt>Legal expense</dt>
                <dd>{coverOption ? formatCurrency(coverOption.legalExpenseLimit) : ""}</dd>
                <dt>Liability cover</dt>
                <dd>{coverOption ? formatCurrency(coverOption.liabilityLimit) : ""}</dd>
              </dl>
            </div>

            <div className="review-sheet-section">
              <div className="review-sheet-title">
                <Landmark className="h-4 w-4 text-primary" />
                <h4 className="font-medium text-foreground">Debit order details</h4>
              </div>
              <dl className="review-sheet-grid">
                <dt>Account holder</dt>
                <dd>{applicationData.accountHolder}</dd>
                <dt>Bank</dt>
                <dd>{applicationData.bankName}</dd>
                <dt>Account number</dt>
                <dd>{maskAccountNumber(applicationData.accountNumber)}</dd>
                <dt>Debit date</dt>
                <dd>
                  {applicationData.preferredDebitDate}
                  {getOrdinalSuffix(parseInt(applicationData.preferredDebitDate || "1"))} of each month
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Source + Legal Authorisations */}
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <section className="fieldset-section">
            <div className="fieldset-title">
              <h3>How did you hear about us?</h3>
              <p>This helps us improve how we reach firearm owners.</p>
            </div>

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      className="grid grid-cols-2 gap-2 md:grid-cols-4"
                    >
                      {[
                        { value: "online", label: "Online", icon: Globe },
                        { value: "agent", label: "Agent", icon: UserRound },
                        { value: "referral", label: "Referral", icon: Users },
                        { value: "other", label: "Other", icon: UserPlus },
                      ].map(({ value, label, icon: Icon }) => (
                        <label
                          key={value}
                          className={`option-tile-compact text-center ${
                            field.value === value
                              ? "option-tile-compact-selected"
                              : "option-tile-compact-muted"
                          }`}
                        >
                          <RadioGroupItem value={value} className="sr-only" />
                          <Icon className="mx-auto mb-1.5 h-5 w-5 text-primary" />
                          <p className="text-sm font-medium text-foreground">{label}</p>
                        </label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <section className="fieldset-section">
            <div className="fieldset-title">
              <h3>Legal authorisations</h3>
              <p>Confirm all required declarations to submit your application.</p>
            </div>

            {/* Select-all */}
            <div className="rounded-md border border-border bg-muted/20 px-5 py-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={allAccepted}
                  onCheckedChange={(c) => toggleAll(!!c)}
                  id="accept-all-declarations"
                />
                <label
                  htmlFor="accept-all-declarations"
                  className="flex-1 cursor-pointer text-sm font-medium text-foreground"
                >
                  I accept all required declarations (Debit Order, Policy Declaration, POPIA Consent)
                </label>
              </div>

              <Collapsible open={showIndividualDeclarations} onOpenChange={setShowIndividualDeclarations}>
                <CollapsibleTrigger className="mt-3 flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showIndividualDeclarations ? "rotate-180" : ""}`} />
                  {showIndividualDeclarations ? "Hide individual declarations" : "View individual declarations"}
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-3">
                  {/* Debit Order */}
                  <div className={`bg-background border border-border rounded-md px-4 py-3 ${form.formState.errors.debitOrderConsent ? 'border-destructive' : ''}`}>
                    <FormField
                      control={form.control}
                      name="debitOrderConsent"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-3">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <label className="flex-1 cursor-pointer text-sm font-medium text-foreground" onClick={() => field.onChange(!field.value)}>
                              <span className="inline-flex items-center gap-2">
                                <FileText className="h-4 w-4 shrink-0 text-primary" />
                                I agree to the Debit Order Authorisation
                                <span className="text-xs font-medium text-primary">
                                  • {coverOption ? formatCurrency(coverOption.premium) : "R0"}/pm
                                </span>
                              </span>
                            </label>
                          </div>
                          <FormMessage className="mt-1 ml-7" />
                        </FormItem>
                      )}
                    />
                    <Accordion type="multiple" value={expandedItems} onValueChange={setExpandedItems}>
                      <AccordionItem value="debitOrder" className="border-0">
                        <AccordionTrigger className="hover:no-underline py-2 text-xs text-muted-foreground">
                          Read full terms
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                          <div className="space-y-3 text-sm text-muted-foreground">
                            <p>I hereby request and authorise Firearms Guardian (Pty) Ltd, Acorn Brokers (Pty) Ltd, and/or their authorised agent/s or collection service providers, to draw against my bank account as indicated herein each month and to debit my account with the amount equivalent to the premium due by me in respect of the Firearms Guardian policy, until cancelled by me in writing.</p>
                            <p>In the event of an increase of the premium, Firearms Guardian, Acorn Brokers, or their agent/s have my authority to deduct from my account the increased premium.</p>
                            <p>All such debits against my account shall be treated as though I have signed and done them personally.</p>
                            <p>If the payment day falls on a Sunday or public holiday, the payment day will automatically be the following ordinary business day.</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  {/* Declaration */}
                  <div className={`bg-background border border-border rounded-md px-4 py-3 ${form.formState.errors.declarationConsent ? 'border-destructive' : ''}`}>
                    <FormField
                      control={form.control}
                      name="declarationConsent"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-3">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <label className="flex-1 cursor-pointer text-sm font-medium text-foreground" onClick={() => field.onChange(!field.value)}>
                              <span className="inline-flex items-center gap-2">
                                <Shield className="h-4 w-4 shrink-0 text-primary" />
                                I agree to the Policy Declaration
                              </span>
                            </label>
                          </div>
                          <FormMessage className="mt-1 ml-7" />
                        </FormItem>
                      )}
                    />
                    <Accordion type="multiple" value={expandedItems} onValueChange={setExpandedItems}>
                      <AccordionItem value="declaration" className="border-0">
                        <AccordionTrigger className="hover:no-underline py-2 text-xs text-muted-foreground">
                          Read full terms
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                          <div className="space-y-3 text-sm text-muted-foreground">
                            <p>I hereby apply for a Firearms Guardian policy in accordance with all applicable terms and conditions.</p>
                            <p>I personally completed this application and acknowledge that payment of premiums on the due dates is my responsibility.</p>
                            <p>I warrant that all information given in this application form is true, correct, and complete.</p>
                            <p>I understand and accept that this application, together with the applicable terms and conditions, represents the agreement between myself and the underwriter of the Firearms Guardian policy, GENRIC Insurance Company Limited (GENRIC).</p>
                            <p>I further understand that Firearms Guardian (Pty) Ltd and Acorn Brokers (Pty) Ltd act as authorised administrators and/or intermediaries, and that acceptance of my application is in the sole discretion of Firearms Guardian and GENRIC.</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  {/* POPIA */}
                  <div className={`bg-background border border-border rounded-md px-4 py-3 ${form.formState.errors.popiaConsent ? 'border-destructive' : ''}`}>
                    <FormField
                      control={form.control}
                      name="popiaConsent"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-3">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <label className="flex-1 cursor-pointer text-sm font-medium text-foreground" onClick={() => field.onChange(!field.value)}>
                              <span className="inline-flex items-center gap-2">
                                <Lock className="h-4 w-4 shrink-0 text-primary" />
                                I agree to the POPIA Consent & Privacy Notice
                              </span>
                            </label>
                          </div>
                          <FormMessage className="mt-1 ml-7" />
                        </FormItem>
                      )}
                    />
                    <Accordion type="multiple" value={expandedItems} onValueChange={setExpandedItems}>
                      <AccordionItem value="popia" className="border-0">
                        <AccordionTrigger className="hover:no-underline py-2 text-xs text-muted-foreground">
                          Read full terms
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                          <div className="space-y-3 text-sm text-muted-foreground">
                            <p>We at GENRIC Insurance Company Limited (GENRIC), Firearms Guardian (Pty) Ltd, and Acorn Brokers (Pty) Ltd respect your right to privacy.</p>
                            <p>Personal information is collected and processed in accordance with the Protection of Personal Information Act, 4 of 2013 (POPIA), for the primary purpose of providing insurance cover and for all activities incidental and relevant to this purpose.</p>
                            <p>Personal information may be shared with authorised third parties, service providers, reinsurers, legal service providers, payment processors, and regulatory bodies as required by law, including for fraud prevention and compliance purposes.</p>
                            <p>Information will be retained for legally permitted retention periods and handled securely and confidentially.</p>
                            <p>I understand that I may request access to, correction, or deletion of my personal information.</p>
                            <p>I voluntarily consent to GENRIC, Firearms Guardian, and Acorn Brokers processing my personal information for the purposes described above.</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </section>

          <div className="form-actions pb-12">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="gap-2"
              disabled={isSubmitting}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              type="submit"
              size="lg"
              className="min-w-[200px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

