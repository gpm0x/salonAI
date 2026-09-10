/**
 * Tema da interface — claro, escuro ou seguindo o sistema operacional.
 *
 * A preferência vive no localStorage e é aplicada como classe `dark` no <html>,
 * o que casa com `darkMode: "class"` do Tailwind.
 */

export type Tema = "claro" | "escuro" | "sistema";
export type TemaResolvido = "claro" | "escuro";

export const CHAVE_TEMA = "salonai:tema";

export function ehTema(valor: unknown): valor is Tema {
  return valor === "claro" || valor === "escuro" || valor === "sistema";
}

export function lerTemaSalvo(): Tema {
  if (typeof window === "undefined") return "sistema";
  try {
    const salvo = window.localStorage.getItem(CHAVE_TEMA);
    return ehTema(salvo) ? salvo : "sistema";
  } catch {
    // localStorage pode estar bloqueado (modo privado / cookies desativados)
    return "sistema";
  }
}

export function temaDoSistema(): TemaResolvido {
  if (typeof window === "undefined") return "claro";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "escuro"
    : "claro";
}

export function resolverTema(tema: Tema): TemaResolvido {
  return tema === "sistema" ? temaDoSistema() : tema;
}

export function aplicarTema(resolvido: TemaResolvido) {
  const raiz = document.documentElement;
  raiz.classList.toggle("dark", resolvido === "escuro");
  raiz.style.colorScheme = resolvido === "escuro" ? "dark" : "light";
}

/**
 * Script inline executado antes da primeira pintura, evitando o flash branco
 * de quem usa tema escuro. Precisa ser autossuficiente (roda fora do bundle).
 */
export const SCRIPT_ANTI_FLASH = `
(function () {
  try {
    var salvo = localStorage.getItem("${CHAVE_TEMA}");
    var escuro =
      salvo === "escuro" ||
      ((!salvo || salvo === "sistema") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    var raiz = document.documentElement;
    raiz.classList.toggle("dark", escuro);
    raiz.style.colorScheme = escuro ? "dark" : "light";
  } catch (e) {}
})();
`.trim();
