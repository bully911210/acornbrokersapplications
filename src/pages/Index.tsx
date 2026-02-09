import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { createApplication, updateApplication, sendApplicationEmail } from "@/lib/apiClient";
import { Layout } from "@/components/Layout";
import { EligibilityStep } from "@/components/application/EligibilityStep";
import { PersonalDetailsStep } from "@/components/application/PersonalDetailsStep";
import { CoverSelectionStep } from "@/components/application/CoverSelectionStep";
import { BankingDetailsStep } from "@/components/application/BankingDetailsStep";
import { AuthorisationsStep } from "@/components/application/AuthorisationsStep";
import { SuccessScreen } from "@/components/application/SuccessScreen";
import {
  FullApplicationData,
  EligibilityData,
  PersonalDetailsData,
  CoverSelectionData,
  BankingDetailsData,
  AuthorisationsData,
  normalizePhone,
} from "@/lib/validations";
import { initSession, updateSession, clearSession, getClientInfo, getSession, getToken } from "@/lib/sessionManager";
import { trackViewContent, trackLead, trackContact, trackCustomizeProduct, trackAddPaymentInfo, trackPurchase } from "@/lib/metaPixel";
import { COVER_OPTIONS } from "@/lib/coverData";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [applicantId, setApplicantId] = useState<string | null>(null);
  const [applicationData, setApplicationData] = useState<Partial<FullApplicationData>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [completedData, setCompletedData] = useState<(FullApplicationData & { id: string; createdAt: string }) | null>(null);
  const { toast } = useToast();

  // Initialize session on mount and fire ViewContent pixel event
  useEffect(() => {
    const session = initSession();
    if (session.applicantId) {
      setApplicantId(session.applicantId);
    }
    trackViewContent();
  }, []);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const createApplicantMutation = useMutation({
    mutationFn: async (data: EligibilityData & { eventId?: string }) => {
      const session = initSession();
      const clientInfo = await getClientInfo();

      const result = await createApplication({
        firearmLicenceStatus: data.firearmLicenceStatus,
        source: data.source,
        agentId: session.agentId,
        userAgent: clientInfo.userAgent,
        eventId: data.eventId,
      });

      return result;
    },
    onSuccess: (result) => {
      setApplicantId(result.applicantId);
      updateSession({ 
        applicantId: result.applicantId, 
        token: result.token,
        currentStep: 2 
      });
      setCurrentStep(2);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateApplicantMutation = useMutation({
    mutationFn: async ({ step, data, eventId }: { step: number; data: Record<string, unknown>; eventId?: string }) => {
      const token = getToken();
      if (!token) throw new Error("No session token");

      await updateApplication(token, { ...data, current_step: step }, eventId);
    },
  });

  const submitApplicationMutation = useMutation({
    mutationFn: async (consents: AuthorisationsData) => {
      const token = getToken();
      if (!token || !applicantId) throw new Error("No session token or applicant ID");

      // Fire Purchase pixel event
      const coverOption = COVER_OPTIONS.find((opt) => opt.id === applicationData.coverOption);
      const purchaseEventId = trackPurchase(coverOption?.premium || 0);

      const result = await updateApplication(token, {
        debit_order_consent: consents.debitOrderConsent,
        declaration_consent: consents.declarationConsent,
        popia_consent: consents.popiaConsent,
        consent_timestamp: new Date().toISOString(),
        status: "complete",
        current_step: 5,
      });

      return { applicant: result.applicant, token, purchaseEventId };
    },
    onSuccess: (data) => {
      const token = data.token;
      const applicantData = data.applicant as Record<string, unknown>;

      clearSession();
      setCompletedData({
        ...applicationData as FullApplicationData,
        id: applicantData.id as string,
        createdAt: applicantData.created_at as string,
      });
      setIsComplete(true);

      // Fire-and-forget: Send application email notification + CAPI Purchase event
      sendApplicationEmail(applicantData.id as string, token, data.purchaseEventId).catch((err) =>
        console.error("Failed to send application email:", err)
      );
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStep1 = useCallback((data: EligibilityData) => {
    const eventId = trackLead();
    setApplicationData((prev) => ({ ...prev, ...data }));
    createApplicantMutation.mutate({ ...data, eventId });
  }, [createApplicantMutation]);

  const handleStep2 = useCallback((data: PersonalDetailsData) => {
    const eventId = trackContact(data.email);
    const normalizedData = { ...data, mobile: normalizePhone(data.mobile) };
    setApplicationData((prev) => ({ ...prev, ...normalizedData }));

    updateApplicantMutation.mutate({
      step: 2,
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        sa_id_number: data.saIdNumber,
        mobile: normalizePhone(data.mobile),
        email: data.email,
        street_address: data.streetAddress,
        suburb: data.suburb,
        city: data.city,
        province: data.province,
      },
      eventId,
    });

    updateSession({ currentStep: 3 });
    setCurrentStep(3);
  }, [updateApplicantMutation]);

  const handleStep3 = useCallback((data: CoverSelectionData) => {
    const coverOption = COVER_OPTIONS.find((opt) => opt.id === data.coverOption);
    const eventId = trackCustomizeProduct(
      coverOption?.name || data.coverOption,
      coverOption?.premium || 0
    );
    setApplicationData((prev) => ({ ...prev, ...data }));

    updateApplicantMutation.mutate({
      step: 3,
      data: { cover_option: data.coverOption },
      eventId,
    });

    updateSession({ currentStep: 4 });
    setCurrentStep(4);
  }, [updateApplicantMutation]);

  const handleStep4 = useCallback((data: BankingDetailsData) => {
    const eventId = trackAddPaymentInfo();
    setApplicationData((prev) => ({ ...prev, ...data }));

    updateApplicantMutation.mutate({
      step: 4,
      data: {
        account_holder: data.accountHolder,
        bank_name: data.bankName,
        account_type: data.accountType,
        account_number: data.accountNumber,
        preferred_debit_date: parseInt(data.preferredDebitDate),
      },
      eventId,
    });

    updateSession({ currentStep: 5 });
    setCurrentStep(5);
  }, [updateApplicantMutation]);

  const handleStep5 = useCallback((data: AuthorisationsData) => {
    submitApplicationMutation.mutate(data);
  }, [submitApplicationMutation]);

  if (isComplete && completedData) {
    return (
      <Layout showStepIndicator={false}>
        <SuccessScreen applicationData={completedData} />
      </Layout>
    );
  }

  return (
    <Layout currentStep={currentStep}>
      <div className="container max-w-3xl px-4 py-4 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-4 md:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium mb-2 md:mb-4">
            <Shield className="w-3.5 h-3.5 md:w-4 md:h-4" />
            Firearm Legal Cover
          </div>
          <h1 className="text-xl md:text-4xl font-bold text-foreground mb-2 md:mb-3">
            Protect Your Rights as a Firearm Owner
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
            Get comprehensive legal expense and liability insurance designed specifically for South African firearm owners.
          </p>
        </div>

        {/* Form Container */}
        <div className="form-container">
          {currentStep === 1 && (
            <EligibilityStep
              defaultValues={applicationData}
              onNext={handleStep1}
            />
          )}
          {currentStep === 2 && (
            <PersonalDetailsStep
              defaultValues={applicationData}
              onNext={handleStep2}
              onBack={() => setCurrentStep(1)}
            />
          )}
          {currentStep === 3 && (
            <CoverSelectionStep
              defaultValues={applicationData}
              onNext={handleStep3}
              onBack={() => setCurrentStep(2)}
            />
          )}
          {currentStep === 4 && (
            <BankingDetailsStep
              defaultValues={applicationData}
              onNext={handleStep4}
              onBack={() => setCurrentStep(3)}
            />
          )}
          {currentStep === 5 && (
            <AuthorisationsStep
              applicationData={applicationData}
              onSubmit={handleStep5}
              onBack={() => setCurrentStep(4)}
              isSubmitting={submitApplicationMutation.isPending}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
