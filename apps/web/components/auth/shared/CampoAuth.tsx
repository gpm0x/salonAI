"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/*
  Campo das telas de auth.

  Difere do `ui/Input` genérico em três pontos que só fazem sentido aqui, e
  por isso não foram empurrados para o primitivo usado pelo painel inteiro:

  1. O poço é mais escuro que o cartão (`bg-bg/60`) e clareia para `surface`
     no foco — o campo acende enquanto se digita, em vez de só ganhar anel.
  2. O ícone acompanha o foco via `group-focus-within`, indo de neutro a
     vermelhão. É o que dá vida a um formulário de quatro campos parados.
  3. O erro é parte do campo, não um `<p>` solto que cada tela repete.
*/

export const CLASSES_CAMPO = [
  "h-11 w-full rounded-xl border bg-bg/60 px-3.5 text-sm text-ink",
  "placeholder:text-muted/60",
  "transition-[border-color,box-shadow,background-color] duration-200",
  "focus:bg-surface focus:outline-none focus:ring-4",
].join(" ");

export function classesEstado(erro?: string) {
  return erro
    ? "border-danger/60 focus:border-danger focus:ring-danger/10"
    : "border-line focus:border-primary/60 focus:ring-primary/10";
}

export function RotuloCampo({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="eyebrow text-[0.625rem] text-muted transition-colors group-focus-within:text-primary"
    >
      {children}
    </label>
  );
}

export function MensagemErro({ children }: { children: ReactNode }) {
  return (
    <p className="animate-fade-in text-xs font-medium text-danger">{children}</p>
  );
}

interface CampoAuthProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  erro?: string;
}

export function CampoAuth({
  label,
  icon,
  erro,
  className,
  id,
  ...props
}: CampoAuthProps) {
  const auto = useId();
  const inputId = id ?? props.name ?? auto;

  return (
    // `min-w-0`: sem isso a largura mínima é a largura intrínseca do <input>
    // (~20 caracteres) e o campo estoura as grades estreitas do celular.
    <div className="group flex min-w-0 flex-col gap-1.5">
      <RotuloCampo htmlFor={inputId}>{label}</RotuloCampo>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted transition-colors duration-200 group-focus-within:text-accent">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={erro ? true : undefined}
          className={cn(
            CLASSES_CAMPO,
            classesEstado(erro),
            icon ? "pl-10" : undefined,
            className,
          )}
          {...props}
        />
      </div>

      {erro && <MensagemErro>{erro}</MensagemErro>}
    </div>
  );
}
