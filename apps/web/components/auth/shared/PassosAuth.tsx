import { Fragment } from "react";
import { IconCheck } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";

/*
  Trilho de etapas.

  Antes eram dois traços numerados sem nome: mostravam "você está em 1 de 2",
  mas não o que vem depois — e é justamente o que vem depois que decide se a
  pessoa continua. Aqui cada etapa é nomeada, a atual acende em vermelhão e o
  conector se preenche da esquerda para a direita quando a etapa fecha, dando
  o único movimento de progresso da tela.
*/
export function PassosAuth({
  passos,
  atual,
  className,
}: {
  passos: string[];
  /** 1-indexado. */
  atual: number;
  className?: string;
}) {
  return (
    <ol className={cn("flex items-center", className)}>
      {passos.map((label, i) => {
        const n = i + 1;
        const concluido = atual > n;
        const ativo = atual === n;

        return (
          <Fragment key={label}>
            <li
              className="flex shrink-0 items-center gap-2"
              aria-current={ativo ? "step" : undefined}
            >
              <span
                className={cn(
                  "grid h-6 w-6 place-items-center rounded-full text-[0.7rem] font-bold transition-all duration-300",
                  concluido && "bg-primary text-primary-fg",
                  ativo && "bg-accent text-accent-fg shadow-ember",
                  !concluido && !ativo && "border border-line text-muted/70",
                )}
              >
                {concluido ? <IconCheck width={12} height={12} /> : n}
              </span>
              <span
                className={cn(
                  "text-xs font-medium transition-colors duration-300",
                  ativo && "text-ink",
                  concluido && "text-muted",
                  !concluido && !ativo && "text-muted/60",
                )}
              >
                {label}
              </span>
            </li>

            {i < passos.length - 1 && (
              <span
                aria-hidden
                className="relative mx-3 h-px flex-1 overflow-hidden rounded-full bg-line"
              >
                <span
                  className={cn(
                    "absolute inset-0 origin-left bg-primary transition-transform duration-500 ease-out",
                    concluido ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </span>
            )}
          </Fragment>
        );
      })}
    </ol>
  );
}
