import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { useMutation } from "@tanstack/react-query";
import { createApplication, updateApplication, sendApplicationEmail } from "@/lib/apiClient";
import { Layout } from "@/components/Layout";
import { EligibilityStep } from "@/components/application/EligibilityStep";
import { StepIndicator } from "@/components/application/StepIndicator";

const PersonalDetailsStep = lazy(() =>
  import("@/components/application/PersonalDetailsStep").then((m) => ({ default: m.PersonalDetailsStep }))
);
const CoverSelectionStep = lazy(() =>
  import("@/components/application/CoverSelectionStep").then((m) => ({ default: m.CoverSelectionStep }))
);
const BankingDetailsStep = lazy(() =>
  import("@/components/application/BankingDetailsStep").then((m) => ({ default: m.BankingDetailsStep }))
);
const AuthorisationsStep = lazy(() =>
  import("@/components/application/AuthorisationsStep").then((m) => ({ default: m.AuthorisationsStep }))
);
const SuccessScreen = lazy(() =>
  import("@/components/application/SuccessScreen").then((m) => ({ default: m.SuccessScreen }))
);

const StepFallback = () => (
  <div className="py-16 text-center text-sm text-muted-foreground">Loading…</div>
);
import {
  FullApplicationData,
  EligibilityData,
  PersonalDetailsData,
  CoverSelectionData,
  BankingDetailsData,
  AuthorisationsData,
  normalizePhone,
} from "@/lib/validations";
import { initSession, updateSession, clearSession, getClientInfo, getToken } from "@/lib/sessionManager";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ComplianceStrip } from "@/components/ComplianceStrip";

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

  // Prefetch the next step's chunk to avoid loading delay on click
  useEffect(() => {
    const prefetchers: Record<number, () => Promise<unknown>> = {
      1: () => import("@/components/application/PersonalDetailsStep"),
      2: () => import("@/components/application/CoverSelectionStep"),
      3: () => import("@/components/application/BankingDetailsStep"),
      4: () => import("@/components/application/AuthorisationsStep"),
      5: () => import("@/components/application/SuccessScreen"),
    };
    prefetchers[currentStep]?.().catch(() => {});
  }, [currentStep]);

  const createApplicantMutation = useMutation({
    mutationFn: async (data: EligibilityData) => {
      const session = initSession();
      const clientInfo = getClientInfo();
      
      const result = await createApplication({
        firearmLicenceStatus: data.firearmLicenceStatus,
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
        source: consents.source,
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
        <Suspense fallback={<StepFallback />}>
          <SuccessScreen applicationData={completedData} />
        </Suspense>
      </Layout>
    );
  }

  return (
    <Layout currentStep={currentStep}>
      <div className="application-page-frame">
        <div className="application-page-inner">
          <div className="mb-4 flex justify-end">
            <Link
              to="/upgrade"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary md:text-sm"
            >
              Already have a policy and want to upgrade?
              <span className="text-primary" aria-hidden="true">→</span>
            </Link>
          </div>
          <section className="application-dossier">
            <div className="application-dossier-header">
              {currentStep === 1 && (
                <div className="application-dossier-meta">
                  <div className="application-dossier-title-block">
                    <h1 className="text-xl font-semibold text-foreground md:text-[1.5rem] leading-tight">
                      Application for firearm legal expense and liability cover
                    </h1>
                    <p className="max-w-3xl text-sm leading-snug text-muted-foreground">
                      Complete the regulated application below to submit your details for review, premium confirmation, and policy processing.
                    </p>
                  </div>
                </div>
              )}

              <StepIndicator currentStep={currentStep} />
            </div>

            <div className="application-shell application-shell-dossier">
              <div className="application-shell-inner application-shell-inner-dossier">
                {currentStep === 1 && (
                  <EligibilityStep
                    defaultValues={applicationData}
                    onNext={handleStep1}
                  />
                )}
                {currentStep > 1 && (
                  <Suspense fallback={<StepFallback />}>
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
                  </Suspense>
                )}
              </div>
            </div>
          </section>
        </div>

        <ComplianceStrip />
      </div>
    </Layout>
  );
};

export default Index;
