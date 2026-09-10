"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { IconLock, IconEye, IconEyeOff } from "@/components/ui/icons";
import {
  CLASSES_CAMPO,
  classesEstado,
  MensagemErro,
  RotuloCampo,
} from "@/components/auth/shared/CampoAuth";

interface CampoSenhaProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  erro?: string;
}

export function CampoSenha({
  label,
  erro,
  className,
  id,
  ...props
}: CampoSenhaProps) {
  const [visivel, setVisivel] = useState(false);
  const auto = useId();
  const inputId = id ?? props.name ?? auto;

  return (
    <div className="group flex min-w-0 flex-col gap-1.5">
      {label && <RotuloCampo htmlFor={inputId}>{label}</RotuloCampo>}

      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted transition-colors duration-200 group-focus-within:text-accent">
          <IconLock width={17} height={17} />
        </span>

        <input
          id={inputId}
          type={visivel ? "text" : "password"}
          aria-invalid={erro ? true : undefined}
          className={cn(
            CLASSES_CAMPO,
            classesEstado(erro),
            "pl-10 pr-11",
            className,
          )}
          {...props}
        />

        <button
          type="button"
          onClick={() => setVisivel((v) => !v)}
          aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
          className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted transition-colors hover:bg-primary-soft/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          {visivel ? (
            <IconEyeOff width={17} height={17} />
          ) : (
            <IconEye width={17} height={17} />
          )}
        </button>
      </div>

      {erro && <MensagemErro>{erro}</MensagemErro>}
    </div>
  );
}
