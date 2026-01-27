import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { insertApplicant, updateApplicantById, updateApplicantByIdReturning } from "@/lib/supabaseClient";
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
import { initSession, updateSession, clearSession, getClientInfo, getSession } from "@/lib/sessionManager";
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

  const createApplicant = useMutation({
    mutationFn: async (data: EligibilityData) => {
      const session = initSession();
      const clientInfo = await getClientInfo();
      
      const { data: applicant, error } = await insertApplicant({
        firearm_licence_status: data.firearmLicenceStatus,
        source: data.source,
        session_id: session.sessionId,
        agent_id: session.agentId,
        user_agent: clientInfo.userAgent,
        current_step: 1,
        status: "partial",
      });

      if (error) throw error;
      return applicant;
    },
    onSuccess: (applicant) => {
      setApplicantId(applicant.id);
      updateSession({ applicantId: applicant.id, currentStep: 2 });
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

  const updateApplicant = useMutation({
    mutationFn: async ({ step, data }: { step: number; data: Record<string, unknown> }) => {
      if (!applicantId) throw new Error("No applicant ID");

      const { error } = await updateApplicantById(applicantId, { ...data, current_step: step });

      if (error) throw error;
    },
  });

  const submitApplication = useMutation({
    mutationFn: async (consents: AuthorisationsData) => {
      if (!applicantId) throw new Error("No applicant ID");

      const { data, error } = await updateApplicantByIdReturning(applicantId, {
        debit_order_consent: consents.debitOrderConsent,
        declaration_consent: consents.declarationConsent,
        popia_consent: consents.popiaConsent,
        consent_timestamp: new Date().toISOString(),
        status: "complete",
        current_step: 5,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Get session BEFORE clearing it (needed for email authentication)
      const session = getSession();
      const sessionId = session?.sessionId || "";
      
      clearSession();
      setCompletedData({
        ...applicationData as FullApplicationData,
        id: data.id,
        createdAt: data.created_at,
      });
      setIsComplete(true);

      // Fire-and-forget: Send application email notification with session validation
      fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-application-email`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-session-id": sessionId,
        },
        body: JSON.stringify({ applicantId: data.id }),
      }).catch((err) => console.error("Failed to send application email:", err));
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
    createApplicant.mutate(data);
  }, [createApplicant]);

  const handleStep2 = useCallback((data: PersonalDetailsData) => {
    const normalizedData = { ...data, mobile: normalizePhone(data.mobile) };
    setApplicationData((prev) => ({ ...prev, ...normalizedData }));
    
    updateApplicant.mutate({
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
  }, [updateApplicant]);

  const handleStep3 = useCallback((data: CoverSelectionData) => {
    setApplicationData((prev) => ({ ...prev, ...data }));
    
    updateApplicant.mutate({
      step: 3,
      data: { cover_option: data.coverOption },
    });
    
    updateSession({ currentStep: 4 });
    setCurrentStep(4);
  }, [updateApplicant]);

  const handleStep4 = useCallback((data: BankingDetailsData) => {
    setApplicationData((prev) => ({ ...prev, ...data }));
    
    updateApplicant.mutate({
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
  }, [updateApplicant]);

  const handleStep5 = useCallback((data: AuthorisationsData) => {
    submitApplication.mutate(data);
  }, [submitApplication]);

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
              isSubmitting={submitApplication.isPending}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
