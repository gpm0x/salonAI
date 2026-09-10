"use client";

import { cn } from "@/lib/utils/cn";

interface ToggleProps {
  checked: boolean;
  onChange: (valor: boolean) => void;
  label?: string;
  disabled?: boolean;
}

/*
  Trilho de 48px com botão de 20px e 2px de folga de cada lado — o curso é
  48 − 20 − 2 − 2 = 24px, que é exatamente o `translate-x-6` do estado ligado.

  O `left-0.5` não é decorativo: sem ele o botão fica sem âncora horizontal e
  cai na posição estática, que o navegador centraliza (a UA stylesheet aplica
  `text-align: center` em <button> e o preflight do Tailwind não desfaz isso).
  Somado ao translate, o círculo branco ia parar fora do trilho, sumindo no
  fundo claro do card.
*/
export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-12 shrink-0 cursor-pointer rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
        checked ? "bg-primary" : "bg-ink/15",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-soft",
          "transition-transform duration-200 ease-out",
          checked ? "translate-x-6" : "translate-x-0",
        )}
      />
    </button>
  );
}
