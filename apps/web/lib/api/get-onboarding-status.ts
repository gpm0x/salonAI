/**
 * Leitura dedicada de status de onboarding pra uso nos layouts autoritativos
 * ((dashboard) e (onboarding)). `api.onboarding.status()` (server.ts) devolve
 * `null` tanto pra 401 quanto pra rede fora do ar, e os dois casos pedem
 * comportamento diferente aqui: 401 é sessão inválida (redirect pro login);
 * rede/5xx é a API fora do ar (não é onboarding incompleto, não redireciona).
 */

import "server-only";

import { cache } from "react";
import { getSession } from "@/lib/auth/session";
import { endpoints } from "./endpoints";
import type { OnboardingStatus } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export type OnboardingStatusResult =
  | { ok: true; data: OnboardingStatus }
  | { ok: false; status?: number };

/** `cache()` deduplica por request: dois layouts na mesma árvore não disparam duas chamadas. */
export const getOnboardingStatus = cache(async (): Promise<OnboardingStatusResult> => {
  try {
    const session = await getSession();
    const token = session?.session?.token;

    const res = await fetch(`${BASE_URL}${endpoints.onboarding.status}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) return { ok: false, status: res.status };
    return { ok: true, data: (await res.json()) as OnboardingStatus };
  } catch {
    return { ok: false };
  }
});
