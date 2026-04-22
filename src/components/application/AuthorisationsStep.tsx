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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { authorisationsSchema, AuthorisationsData, FullApplicationData } from "@/lib/validations";
import { COVER_OPTIONS } from "@/lib/coverData";
import { ArrowLeft, Loader2, FileText, Shield, Lock, CircleCheck, Landmark, UserRound } from "lucide-react";

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
  
  const form = useForm<AuthorisationsData>({
    resolver: zodResolver(authorisationsSchema),
    defaultValues: {
      debitOrderConsent: false as unknown as true,
      declarationConsent: false as unknown as true,
      popiaConsent: false as unknown as true,
    },
  });

  const coverOption = COVER_OPTIONS.find(
    (opt) => opt.id === applicationData.coverOption
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const maskIdNumber = (id: string | undefined) => {
    if (!id) return "";
    return id.substring(0, 6) + "*******";
  };

  const maskAccountNumber = (account: string | undefined) => {
    if (!account) return "";
    return "*".repeat(Math.max(0, account.length - 3)) + account.slice(-3);
  };

  const handleSubmit = (data: AuthorisationsData) => {
    onSubmit(data);
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Review & Confirm
        </h2>
        <p className="text-muted-foreground">
          Please review your application details and provide the required authorisations.
        </p>
      </div>

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
          <div className="review-sheet divide-y divide-border rounded-md border border-border bg-background">
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

      {/* Legal Authorisations with Accordions */}
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <h3 className="font-semibold text-lg text-foreground">
            Legal Authorisations
          </h3>

          <div className="space-y-3">
            {/* Debit Order Authorisation */}
            <div className={`border rounded-xl bg-muted/20 px-5 py-4 transition-colors ${form.formState.errors.debitOrderConsent ? 'border-destructive' : 'border-border'}`}>
              <FormField
                control={form.control}
                name="debitOrderConsent"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <label
                        className="text-sm font-medium text-foreground cursor-pointer flex-1"
                        onClick={() => field.onChange(!field.value)}
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary shrink-0" />
                          I agree to the Debit Order Authorisation
                          <span className="text-primary text-xs font-medium">
                            • {coverOption ? formatCurrency(coverOption.premium) : "R0"}/pm
                          </span>
                        </div>
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
            <div className={`border rounded-xl bg-muted/20 px-5 py-4 transition-colors ${form.formState.errors.declarationConsent ? 'border-destructive' : 'border-border'}`}>
              <FormField
                control={form.control}
                name="declarationConsent"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <label
                        className="text-sm font-medium text-foreground cursor-pointer flex-1"
                        onClick={() => field.onChange(!field.value)}
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-primary shrink-0" />
                          I agree to the Policy Declaration
                        </div>
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

            {/* POPIA Consent */}
            <div className={`border rounded-xl bg-muted/20 px-5 py-4 transition-colors ${form.formState.errors.popiaConsent ? 'border-destructive' : 'border-border'}`}>
              <FormField
                control={form.control}
                name="popiaConsent"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <label
                        className="text-sm font-medium text-foreground cursor-pointer flex-1"
                        onClick={() => field.onChange(!field.value)}
                      >
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-primary shrink-0" />
                          I agree to the POPIA Consent & Privacy Notice
                        </div>
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
          </div>

          <div className="flex justify-between pt-6">
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

const getOrdinalSuffix = (num: number): string => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
};
