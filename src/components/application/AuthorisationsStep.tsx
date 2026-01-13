import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
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
import { authorisationsSchema, AuthorisationsData, FullApplicationData } from "@/lib/validations";
import { COVER_OPTIONS } from "@/lib/coverData";
import { ArrowLeft, Loader2 } from "lucide-react";

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
  const form = useForm({
    resolver: zodResolver(authorisationsSchema),
    defaultValues: {
      debitOrderConsent: false as boolean,
      declarationConsent: false as boolean,
      termsConsent: false as boolean,
      popiaConsent: false as boolean,
      electronicSignatureConsent: false as boolean,
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

  const consentItems = [
    {
      id: "debitOrderConsent" as const,
      title: "Debit Order Authorisation",
      description: `I authorise Acorn Brokers to debit ${
        coverOption ? formatCurrency(coverOption.premium) : "the premium"
      } from my bank account on the ${
        applicationData.preferredDebitDate || "selected"
      }${getOrdinalSuffix(
        parseInt(applicationData.preferredDebitDate || "1")
      )} of each month.`,
    },
    {
      id: "declarationConsent" as const,
      title: "Declaration",
      description:
        "I declare that all information provided in this application is true and accurate to the best of my knowledge. I understand that any false or misleading information may result in the rejection of claims or cancellation of cover.",
    },
    {
      id: "termsConsent" as const,
      title: "Terms and Conditions",
      description: (
        <>
          I have read, understood, and agree to the{" "}
          <Link
            to="/terms"
            target="_blank"
            className="text-primary hover:underline"
          >
            Terms and Conditions
          </Link>{" "}
          of the insurance policy.
        </>
      ),
    },
    {
      id: "popiaConsent" as const,
      title: "POPIA Consent",
      description: (
        <>
          I consent to the processing of my personal information in accordance
          with the Protection of Personal Information Act (POPIA) and the{" "}
          <Link
            to="/privacy"
            target="_blank"
            className="text-primary hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </>
      ),
    },
    {
      id: "electronicSignatureConsent" as const,
      title: "Electronic Signature",
      description:
        "I understand and agree that by submitting this application electronically, my actions constitute a valid electronic signature with the same legal effect as a handwritten signature.",
    },
  ];

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

      {/* Consent Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <h3 className="font-semibold text-lg text-foreground mb-4">
            Authorisations Required
          </h3>

          {consentItems.map((item, index) => (
            <FormField
              key={item.id}
              control={form.control}
              name={item.id}
              render={({ field }) => (
                <FormItem
                  className={`consent-item stagger-${index + 1} animate-fade-in opacity-0`}
                >
                  <div className="flex items-start gap-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-0.5"
                      />
                    </FormControl>
                    <div className="flex-1">
                      <FormLabel className="font-medium text-foreground cursor-pointer">
                        {item.title}
                      </FormLabel>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>
                      <FormMessage className="mt-1" />
                    </div>
                  </div>
                </FormItem>
              )}
            />
          ))}

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
