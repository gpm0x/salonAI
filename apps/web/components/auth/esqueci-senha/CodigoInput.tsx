"use client";

import {
  Fragment,
  useEffect,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils/cn";
import { IconCheck, IconX } from "@/components/ui/icons";

export type StatusCodigo = "digitando" | "verificando" | "sucesso" | "erro";

interface CodigoInputProps {
  valor: string;
  onChange: (valor: string) => void;
  status: StatusCodigo;
  tamanho?: number;
}

export function CodigoInput({
  valor,
  onChange,
  status,
  tamanho = 6,
}: CodigoInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const travado = status !== "digitando";
  const meio = Math.floor(tamanho / 2);

  function focar(i: number) {
    refs.current[Math.max(0, Math.min(i, tamanho - 1))]?.focus();
  }

  // Ao limpar o código (nova tentativa após erro), o cursor volta ao início.
  useEffect(() => {
    if (!valor && status === "digitando") {
      refs.current[0]?.focus();
    }
  }, [valor, status]);

  function digitar(i: number, bruto: string) {
    const digito = bruto.replace(/\D/g, "").slice(-1);
    if (!digito) return;
    onChange((valor.slice(0, i) + digito + valor.slice(i + 1)).slice(0, tamanho));
    focar(i + 1);
  }

  function teclar(i: number, ev: KeyboardEvent<HTMLInputElement>) {
    if (ev.key === "Backspace") {
      ev.preventDefault();
      // Apaga o dígito atual; se a casa já estiver vazia, recua uma posição.
      const corte = valor[i] ? i : Math.max(0, i - 1);
      onChange(valor.slice(0, corte));
      focar(corte);
    } else if (ev.key === "ArrowLeft") {
      ev.preventDefault();
      focar(i - 1);
    } else if (ev.key === "ArrowRight") {
      ev.preventDefault();
      focar(Math.min(i + 1, valor.length));
    }
  }

  function colar(ev: ClipboardEvent<HTMLInputElement>) {
    ev.preventDefault();
    const digitos = ev.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, tamanho);
    if (!digitos) return;
    onChange(digitos);
    focar(digitos.length);
  }

  return (
    <div>
      <div
        className={cn(
          "flex items-center justify-center gap-2 sm:gap-2.5",
          status === "erro" && "animate-shake",
        )}
      >
        {Array.from({ length: tamanho }).map((_, i) => (
          <Fragment key={i}>
            {i === meio && (
              <span className="h-0.5 w-3 shrink-0 rounded-full bg-line" />
            )}
            <div
              className={cn(
                "relative grid h-14 w-full max-w-[3.25rem] place-items-center rounded-2xl border transition-all duration-300",
                status === "sucesso" &&
                  "border-success bg-success/10 text-success",
                status === "erro" && "border-danger bg-danger/10 text-danger",
                status === "digitando" || status === "verificando"
                  ? cn(
                      "bg-surface focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10",
                      valor[i] ? "border-primary/45" : "border-line",
                    )
                  : undefined,
              )}
            >
              {status === "sucesso" || status === "erro" ? (
                <span
                  className="animate-pop"
                  style={{ animationDelay: `${i * 65}ms` }}
                >
                  {status === "sucesso" ? (
                    <IconCheck width={24} height={24} strokeWidth={2.2} />
                  ) : (
                    <IconX width={24} height={24} strokeWidth={2.2} />
                  )}
                </span>
              ) : (
                <input
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  value={valor[i] ?? ""}
                  onChange={(e) => digitar(i, e.target.value)}
                  onKeyDown={(e) => teclar(i, e)}
                  onPaste={colar}
                  // Evita buracos: clicar numa casa adiante leva à primeira vazia.
                  onFocus={() => {
                    if (i > valor.length) focar(valor.length);
                  }}
                  disabled={travado}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  aria-label={`Dígito ${i + 1} de ${tamanho}`}
                  className="nums h-full w-full rounded-2xl bg-transparent text-center font-display text-2xl text-ink caret-primary outline-none disabled:opacity-60"
                />
              )}
            </div>
          </Fragment>
        ))}
      </div>

      {/* Retorno do status, abaixo dos dígitos */}
      <p
        role="status"
        aria-live="polite"
        className="mt-4 flex h-5 items-center justify-center gap-2 text-sm font-medium"
      >
        {status === "verificando" && (
          <span className="flex items-center gap-2 text-muted animate-fade-in">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
            Verificando…
          </span>
        )}
        {status === "sucesso" && (
          <span className="flex items-center gap-2 text-success animate-fade-in">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Código verificado
          </span>
        )}
        {status === "erro" && (
          <span className="flex items-center gap-2 text-danger animate-fade-in">
            <span className="h-1.5 w-1.5 rounded-full bg-danger" />
            Código incorreto, tente novamente
          </span>
        )}
      </p>
    </div>
  );
}
