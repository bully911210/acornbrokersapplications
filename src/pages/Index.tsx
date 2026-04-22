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
import { StepIndicator } from "@/components/application/StepIndicator";
import { ApplicationTrustPanel } from "@/components/application/ApplicationTrustPanel";
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
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [applicantId, setApplicantId] = useState<string | null>(null);
  const [applicationData, setApplicationData] = useState<Partial<FullApplicationData>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [completedData, setCompletedData] = useState<(FullApplicationData & { id: string; createdAt: string }) | null>(null);
  const { toast } = useToast();

  // Initialize session on mount
  useEffect(() => {
    const session = initSession();
    if (session.applicantId) {
      setApplicantId(session.applicantId);
    }
  }, []);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const createApplicantMutation = useMutation({
    mutationFn: async (data: EligibilityData) => {
      const session = initSession();
      const clientInfo = await getClientInfo();
      
      const result = await createApplication({
        firearmLicenceStatus: data.firearmLicenceStatus,
        source: data.source,
        agentId: session.agentId,
        userAgent: clientInfo.userAgent,
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
    mutationFn: async ({ step, data }: { step: number; data: Record<string, unknown> }) => {
      const token = getToken();
      if (!token) throw new Error("No session token");

      await updateApplication(token, { ...data, current_step: step });
    },
  });

  const submitApplicationMutation = useMutation({
    mutationFn: async (consents: AuthorisationsData) => {
      const token = getToken();
      if (!token || !applicantId) throw new Error("No session token or applicant ID");

      await updateApplication(token, {
        debit_order_consent: consents.debitOrderConsent,
        declaration_consent: consents.declarationConsent,
        popia_consent: consents.popiaConsent,
        consent_timestamp: new Date().toISOString(),
        status: "complete",
        current_step: 5,
      });

      return { token };
    },
    onSuccess: ({ token: sessionToken }) => {
      if (!applicantId) return;

      
      clearSession();
      setCompletedData({
        ...applicationData as FullApplicationData,
        id: applicantId,
        createdAt: new Date().toISOString(),
      });
      setIsComplete(true);

      // Fire-and-forget: Send application email notification
      sendApplicationEmail(applicantId, sessionToken).catch((err) => 
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
    setApplicationData((prev) => ({ ...prev, ...data }));
    createApplicantMutation.mutate(data);
  }, [createApplicantMutation]);

  const handleStep2 = useCallback((data: PersonalDetailsData) => {
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
    });
    
    updateSession({ currentStep: 3 });
    setCurrentStep(3);
  }, [updateApplicantMutation]);

  const handleStep3 = useCallback((data: CoverSelectionData) => {
    setApplicationData((prev) => ({ ...prev, ...data }));
    
    updateApplicantMutation.mutate({
      step: 3,
      data: { cover_option: data.coverOption },
    });
    
    updateSession({ currentStep: 4 });
    setCurrentStep(4);
  }, [updateApplicantMutation]);

  const handleStep4 = useCallback((data: BankingDetailsData) => {
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
      <div className="container max-w-[1380px] px-4 py-6 md:py-10">
        <div className="mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground md:text-[13px]">
            <Shield className="h-3.5 w-3.5 text-primary" />
            Firearm Legal Cover Application
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-foreground md:text-[2rem]">
            Application for firearm legal expense and liability cover
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
            Complete the regulated application below to submit your details for review, premium confirmation, and policy processing.
          </p>
        </div>

        <div className="flex items-start gap-8">
          <div className="min-w-0 flex-1">
            <StepIndicator currentStep={currentStep} />

            <div className="application-shell">
              <div className="application-shell-inner">
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
          </div>

          <ApplicationTrustPanel currentStep={currentStep} />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
