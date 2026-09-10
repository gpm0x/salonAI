"use client";

import { useTema } from "@/components/shared/TemaProvider";
import { IconSun, IconMoon, IconMonitor } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";
import type { Tema } from "@/lib/utils/tema";

/**
 * Botão compacto (topbar): alterna claro ↔ escuro em um clique.
 */
export function BotaoTema({ className }: { className?: string }) {
  const { resolvido, alternarTema, montado } = useTema();
  const escuro = resolvido === "escuro";

  return (
    <button
      type="button"
      onClick={alternarTema}
      aria-label={escuro ? "Ativar tema claro" : "Ativar tema escuro"}
      title={escuro ? "Tema claro" : "Tema escuro"}
      className={cn(
        "grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-muted",
        "transition-colors hover:border-primary/40 hover:text-primary",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
        className,
      )}
    >
      {/* Enquanto não montou, o ícone fica neutro para não divergir na hidratação */}
      <span
        className={cn(
          "relative grid h-[18px] w-[18px] place-items-center transition-opacity",
          !montado && "opacity-0",
        )}
      >
        <IconSun
          width={18}
          height={18}
          className={cn(
            "absolute transition-all duration-300",
            escuro ? "scale-50 opacity-0 -rotate-90" : "scale-100 opacity-100",
          )}
        />
        <IconMoon
          width={18}
          height={18}
          className={cn(
            "absolute transition-all duration-300",
            escuro ? "scale-100 opacity-100" : "scale-50 opacity-0 rotate-90",
          )}
        />
      </span>
    </button>
  );
}

const opcoes: { valor: Tema; label: string; Icon: typeof IconSun }[] = [
  { valor: "claro", label: "Claro", Icon: IconSun },
  { valor: "escuro", label: "Escuro", Icon: IconMoon },
  { valor: "sistema", label: "Sistema", Icon: IconMonitor },
];

/**
 * Seletor de três estados (configurações): claro / escuro / sistema.
 */
export function SeletorTema({ className }: { className?: string }) {
  const { tema, definirTema, montado } = useTema();

  return (
    <div
      role="radiogroup"
      aria-label="Tema da interface"
      className={cn(
        "inline-flex gap-1 rounded-full border border-line bg-bg/60 p-1",
        className,
      )}
    >
      {opcoes.map(({ valor, label, Icon }) => {
        const ativo = montado && tema === valor;
        return (
          <button
            key={valor}
            type="button"
            role="radio"
            aria-checked={ativo}
            onClick={() => definirTema(valor)}
            className={cn(
              "flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
              ativo
                ? "bg-primary text-primary-fg shadow-soft"
                : "text-ink/70 hover:bg-primary-soft/60 hover:text-ink",
            )}
          >
            <Icon width={16} height={16} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
