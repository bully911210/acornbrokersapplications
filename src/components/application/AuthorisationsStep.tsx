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
import { ArrowLeft, Loader2, FileText, Shield, Lock } from "lucide-react";

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
  
  const form = useForm({
    resolver: zodResolver(authorisationsSchema),
    defaultValues: {
      debitOrderConsent: false as boolean,
      declarationConsent: false as boolean,
      popiaConsent: false as boolean,
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

  const handleSubmit = (data: Record<string, boolean>) => {
    onSubmit(data as unknown as AuthorisationsData);
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

      {/* Application Summary */}
      <div className="bg-muted/30 rounded-xl p-6 mb-8 space-y-6">
        <h3 className="font-semibold text-lg text-foreground">
          Application Summary
        </h3>

        {/* Personal Details */}
        <div className="summary-section">
          <h4 className="font-medium text-foreground mb-3">Personal Details</h4>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-muted-foreground">Name:</span>
            <span className="font-medium">
              {applicationData.firstName} {applicationData.lastName}
            </span>
            <span className="text-muted-foreground">ID Number:</span>
            <span className="font-medium">
              {maskIdNumber(applicationData.saIdNumber)}
            </span>
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium">{applicationData.email}</span>
            <span className="text-muted-foreground">Mobile:</span>
            <span className="font-medium">{applicationData.mobile}</span>
          </div>
        </div>

        {/* Cover Details */}
        <div className="summary-section">
          <h4 className="font-medium text-foreground mb-3">Cover Details</h4>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-muted-foreground">Plan:</span>
            <span className="font-medium">{coverOption?.name}</span>
            <span className="text-muted-foreground">Monthly Premium:</span>
            <span className="font-medium text-primary">
              {coverOption ? formatCurrency(coverOption.premium) : ""}
            </span>
            <span className="text-muted-foreground">Legal Expense Limit:</span>
            <span className="font-medium">
              {coverOption ? formatCurrency(coverOption.legalExpenseLimit) : ""}
            </span>
            <span className="text-muted-foreground">Liability Limit:</span>
            <span className="font-medium">
              {coverOption ? formatCurrency(coverOption.liabilityLimit) : ""}
            </span>
          </div>
        </div>

        {/* Banking Details */}
        <div className="summary-section">
          <h4 className="font-medium text-foreground mb-3">Banking Details</h4>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-muted-foreground">Account Holder:</span>
            <span className="font-medium">{applicationData.accountHolder}</span>
            <span className="text-muted-foreground">Bank:</span>
            <span className="font-medium">{applicationData.bankName}</span>
            <span className="text-muted-foreground">Account Number:</span>
            <span className="font-medium">
              {maskAccountNumber(applicationData.accountNumber)}
            </span>
            <span className="text-muted-foreground">Debit Date:</span>
            <span className="font-medium">
              {applicationData.preferredDebitDate}
              {getOrdinalSuffix(
                parseInt(applicationData.preferredDebitDate || "1")
              )}{" "}
              of each month
            </span>
          </div>
        </div>
      </div>

      {/* Legal Authorisations with Accordions */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <h3 className="font-semibold text-lg text-foreground">
            Legal Authorisations
          </h3>

          <Accordion
            type="multiple"
            value={expandedItems}
            onValueChange={setExpandedItems}
            className="space-y-3"
          >
            {/* Debit Order Authorisation */}
            <AccordionItem value="debitOrder" className="border border-border rounded-xl bg-muted/20 px-5">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <FileText className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">
                      Debit Order Authorisation
                    </span>
                    <span className="text-primary ml-2 text-sm font-medium">
                      • {coverOption ? formatCurrency(coverOption.premium) : "R0"}/pm
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <div className="space-y-3 text-sm text-muted-foreground mb-4">
                  <p>
                    I hereby request and authorise Firearms Guardian (Pty) Ltd, Acorn Brokers (Pty) Ltd, and/or their authorised agent/s or collection service providers, to draw against my bank account as indicated herein each month and to debit my account with the amount equivalent to the premium due by me in respect of the Firearms Guardian policy, until cancelled by me in writing.
                  </p>
                  <p>
                    In the event of an increase of the premium, Firearms Guardian, Acorn Brokers, or their agent/s have my authority to deduct from my account the increased premium.
                  </p>
                  <p>
                    All such debits against my account shall be treated as though I have signed and done them personally.
                  </p>
                  <p>
                    If the payment day falls on a Sunday or public holiday, the payment day will automatically be the following ordinary business day.
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="debitOrderConsent"
                  render={({ field }) => (
                    <FormItem className="pt-4 border-t border-border">
                      <div className="flex items-center gap-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <label
                          className="text-sm font-medium text-foreground cursor-pointer"
                          onClick={() => field.onChange(!field.value)}
                        >
                          I agree to the Debit Order Authorisation
                        </label>
                      </div>
                      <FormMessage className="mt-1" />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Declaration */}
            <AccordionItem value="declaration" className="border border-border rounded-xl bg-muted/20 px-5">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <Shield className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-semibold text-foreground">
                    Policy Declaration
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <div className="space-y-3 text-sm text-muted-foreground mb-4">
                  <p>
                    I hereby apply for a Firearms Guardian policy in accordance with all applicable terms and conditions.
                  </p>
                  <p>
                    I personally completed this application and acknowledge that payment of premiums on the due dates is my responsibility.
                  </p>
                  <p>
                    I warrant that all information given in this application form is true, correct, and complete.
                  </p>
                  <p>
                    I understand and accept that this application, together with the applicable terms and conditions, represents the agreement between myself and the underwriter of the Firearms Guardian policy, GENRIC Insurance Company Limited (GENRIC).
                  </p>
                  <p>
                    I further understand that Firearms Guardian (Pty) Ltd and Acorn Brokers (Pty) Ltd act as authorised administrators and/or intermediaries, and that acceptance of my application is in the sole discretion of Firearms Guardian and GENRIC.
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="declarationConsent"
                  render={({ field }) => (
                    <FormItem className="pt-4 border-t border-border">
                      <div className="flex items-center gap-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <label
                          className="text-sm font-medium text-foreground cursor-pointer"
                          onClick={() => field.onChange(!field.value)}
                        >
                          I agree to the Policy Declaration
                        </label>
                      </div>
                      <FormMessage className="mt-1" />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            {/* POPIA Consent */}
            <AccordionItem value="popia" className="border border-border rounded-xl bg-muted/20 px-5">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <Lock className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-semibold text-foreground">
                    POPIA Consent & Privacy Notice
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <div className="space-y-3 text-sm text-muted-foreground mb-4">
                  <p>
                    We at GENRIC Insurance Company Limited (GENRIC), Firearms Guardian (Pty) Ltd, and Acorn Brokers (Pty) Ltd respect your right to privacy.
                  </p>
                  <p>
                    Personal information is collected and processed in accordance with the Protection of Personal Information Act, 4 of 2013 (POPIA), for the primary purpose of providing insurance cover and for all activities incidental and relevant to this purpose.
                  </p>
                  <p>
                    Personal information may be shared with authorised third parties, service providers, reinsurers, legal service providers, payment processors, and regulatory bodies as required by law, including for fraud prevention and compliance purposes.
                  </p>
                  <p>
                    Information will be retained for legally permitted retention periods and handled securely and confidentially.
                  </p>
                  <p>
                    I understand that I may request access to, correction, or deletion of my personal information.
                  </p>
                  <p>
                    I voluntarily consent to GENRIC, Firearms Guardian, and Acorn Brokers processing my personal information for the purposes described above.
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="popiaConsent"
                  render={({ field }) => (
                    <FormItem className="pt-4 border-t border-border">
                      <div className="flex items-center gap-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <label
                          className="text-sm font-medium text-foreground cursor-pointer"
                          onClick={() => field.onChange(!field.value)}
                        >
                          I agree to the POPIA Consent & Privacy Notice
                        </label>
                      </div>
                      <FormMessage className="mt-1" />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

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
