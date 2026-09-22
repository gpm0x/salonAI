"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { OrganizationStepForm } from "@/components/onboarding/OrganizationStepForm";
import { SalonStepForm } from "@/components/onboarding/SalonStepForm";
import { ProfessionalStepForm } from "@/components/onboarding/ProfessionalStepForm";
import { useOnboardingStatus } from "@/lib/api/hooks";

const STEPS = ["organization", "salon", "professional"] as const;
type Step = (typeof STEPS)[number];

const STEP_TITLES: Record<Step, string> = {
  organization: "Seu negócio",
  salon: "Primeira unidade",
  professional: "Primeiro profissional",
};

export default function OnboardingPage() {
  const router = useRouter();
  const { data: status, isLoading } = useOnboardingStatus();
  const [step, setStep] = useState<Step | null>(null);
  const [salonId, setSalonId] = useState<string | undefined>(undefined);

  if (isLoading || !status) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <p role="status" aria-live="polite" className="text-sm text-muted">
          Carregando...
        </p>
      </main>
    );
  }

  const currentStep = step ?? status.nextStep ?? "organization";
  const currentSalonId = salonId ?? status.salonId;
  const stepIndex = STEPS.indexOf(currentStep);

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-ink">
            Vamos configurar seu painel
          </h1>
          <p className="mt-1 text-sm text-muted">
            Só faltam {STEPS.length - stepIndex} passos pra começar a usar.
          </p>
        </div>

        <OnboardingProgress
          currentIndex={stepIndex}
          total={STEPS.length}
          label={STEP_TITLES[currentStep]}
        />

        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-ink">
              {STEP_TITLES[currentStep]}
            </h2>
          </CardHeader>
          <CardBody>
            {currentStep === "organization" && (
              <OrganizationStepForm onCompleted={() => setStep("salon")} />
            )}

            {currentStep === "salon" && (
              <SalonStepForm
                onCompleted={(newSalonId) => {
                  setSalonId(newSalonId);
                  setStep("professional");
                }}
              />
            )}

            {currentStep === "professional" && (
              <ProfessionalStepForm
                salonId={currentSalonId}
                onCompleted={() => {
                  router.push("/dashboard");
                  router.refresh();
                }}
              />
            )}
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
