import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FullApplicationData } from "@/lib/validations";
import { COVER_OPTIONS } from "@/lib/coverData";
import { downloadPDF } from "@/lib/pdfGenerator";
import {
  CheckCircle2,
  Download,
  Phone,
  Mail,
  FileText,
  ArrowRight,
} from "lucide-react";

interface SuccessScreenProps {
  applicationData: FullApplicationData & { id: string; createdAt: string };
}

export const SuccessScreen = ({ applicationData }: SuccessScreenProps) => {
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

  const handleDownloadPDF = () => {
    downloadPDF({
      id: applicationData.id,
      firstName: applicationData.firstName,
      lastName: applicationData.lastName,
      saIdNumber: applicationData.saIdNumber,
      mobile: applicationData.mobile,
      email: applicationData.email,
      streetAddress: applicationData.streetAddress,
      suburb: applicationData.suburb,
      city: applicationData.city,
      province: applicationData.province,
      coverOption: applicationData.coverOption,
      accountHolder: applicationData.accountHolder,
      bankName: applicationData.bankName,
      accountType: applicationData.accountType,
      accountNumber: applicationData.accountNumber,
      preferredDebitDate: applicationData.preferredDebitDate,
      createdAt: applicationData.createdAt,
    });
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto text-center animate-scale-in">
        {/* Success Icon */}
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-success-light">
          <CheckCircle2 className="w-10 h-10 text-success" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Application Submitted Successfully!
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Thank you, {applicationData.firstName}. Your application has been received.
        </p>

        {/* Reference Card */}
        <div className="bg-card rounded-xl border border-border shadow-card p-6 mb-8 text-left">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
            <FileText className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Application Reference</p>
              <p className="text-xl font-bold text-foreground">
                {applicationData.id.substring(0, 8).toUpperCase()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Cover Plan</p>
              <p className="font-semibold text-foreground">{coverOption?.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Monthly Premium</p>
              <p className="font-semibold text-primary">
                {coverOption ? formatCurrency(coverOption.premium) : ""}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Debit Date</p>
              <p className="font-semibold text-foreground">
                {applicationData.preferredDebitDate}
                {getOrdinalSuffix(parseInt(applicationData.preferredDebitDate))} of each month
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Confirmation Sent To</p>
              <p className="font-semibold text-foreground">{applicationData.email}</p>
            </div>
          </div>
        </div>

        {/* Download PDF Button */}
        <Button
          onClick={handleDownloadPDF}
          size="lg"
          className="gap-2 mb-8"
        >
          <Download className="w-5 h-5" />
          Download Confirmation PDF
        </Button>

        {/* Next Steps */}
        <div className="bg-accent/30 rounded-xl p-6 text-left mb-8">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-primary" />
            What Happens Next
          </h3>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="font-semibold text-primary">1.</span>
              A confirmation email with your policy details has been sent to your email address.
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-primary">2.</span>
              Your first debit order will be processed on your selected date.
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-primary">3.</span>
              Legal advice hotline access is available immediately.
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-primary">4.</span>
              Full legal representation becomes available after the 3-month waiting period.
            </li>
          </ol>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
          <a
            href="tel:0800123456"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <Phone className="w-4 h-4" />
            0800 123 456
          </a>
          <a
            href="mailto:info@acornbrokers.co.za"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <Mail className="w-4 h-4" />
            info@acornbrokers.co.za
          </a>
        </div>

        {/* Return Home */}
        <div className="mt-8">
          <Link to="/">
            <Button variant="outline">Return to Homepage</Button>
          </Link>
        </div>
      </div>
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
