"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { IconX } from "@/components/ui/icons";

/**
 * Estado exibido pelos layouts autoritativos ((dashboard) e (onboarding))
 * quando a API responde erro de rede ou 5xx. Nunca redireciona pro onboarding
 * nem pro login nesse caso: a sessão pode estar perfeitamente válida, só a
 * API é que está fora do ar.
 */
export function ApiErrorFallback() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg p-4 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-danger/10 text-danger">
        <IconX width={20} height={20} />
      </span>
      <div>
        <h1 className="text-lg font-semibold text-ink">Não foi possível carregar seus dados</h1>
        <p className="mt-1 max-w-sm text-sm text-muted">
          A API não respondeu. Verifique sua conexão e tente novamente em alguns instantes.
        </p>
      </div>
      <Button variant="outline" onClick={() => router.refresh()}>
        Tentar novamente
      </Button>
    </main>
  );
}
