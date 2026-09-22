import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getOnboardingStatus } from "@/lib/api/get-onboarding-status";
import { ApiErrorFallback } from "@/components/shared/ApiErrorFallback";

// Mesmo padrão do (dashboard)/layout.tsx: checagem autoritativa no servidor.
// O middleware só garante presença de cookie; aqui validamos sessão real e
// redirecionamos quem já completou o onboarding pra fora do wizard.
export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const status = await getOnboardingStatus();

  if (!status.ok) {
    if (status.status === 401) redirect("/login");
    return <ApiErrorFallback />;
  }

  if (status.data.completed) redirect("/dashboard");

  return <>{children}</>;
}
