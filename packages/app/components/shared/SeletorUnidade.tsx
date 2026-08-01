"use client";

import { useState } from "react";
import { Dropdown } from "@/components/ui/Dropdown";
import { Badge } from "@/components/ui/Badge";
import { IconStore, IconCheck } from "@/components/ui/icons";
import { unidades, formatBRL } from "@/lib/mock-data";
import { cn } from "@/lib/utils/cn";

export function SeletorUnidade() {
  const [ativaId, setAtivaId] = useState(
    unidades.find((u) => u.principal)?.id ?? unidades[0].id,
  );
  const ativa = unidades.find((u) => u.id === ativaId)!;

  const totalDia = unidades
    .filter((u) => u.ativa)
    .reduce((s, u) => s + u.faturamentoDia, 0);

  return (
    <Dropdown
      ariaLabel="Selecionar unidade"
      align="left"
      panelClassName="w-[320px] p-2"
      trigger={(aberto) => (
        <span className="flex items-center gap-2.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-medium text-ink transition-colors hover:border-primary/40">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-primary-soft text-primary">
            <IconStore width={14} height={14} />
          </span>
          {ativa.nome}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className={cn(
              "text-muted transition-transform",
              aberto && "rotate-180",
            )}
          >
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    >
      {(fechar) => (
        <>
          <p className="px-3 pb-2 pt-2 text-[0.68rem] font-semibold uppercase tracking-widest text-muted">
            Faturamento de hoje
          </p>

          <ul className="space-y-1">
            {unidades.map((u) => {
              const selecionada = u.id === ativaId;
              return (
                <li key={u.id}>
                  <button
                    onClick={() => {
                      setAtivaId(u.id);
                      fechar();
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                      selecionada
                        ? "bg-primary-soft/70"
                        : "hover:bg-primary-soft/40",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                        u.ativa
                          ? "bg-primary-soft text-primary"
                          : "bg-ink/5 text-muted",
                      )}
                    >
                      <IconStore width={17} height={17} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-medium text-ink">
                          {u.nome}
                        </p>
                        {selecionada && (
                          <IconCheck
                            width={13}
                            height={13}
                            className="shrink-0 text-primary"
                          />
                        )}
                      </div>
                      <p className="truncate text-xs text-muted">
                        {u.ativa
                          ? `${u.atendimentosDia} atendimentos hoje`
                          : "Unidade inativa"}
                      </p>
                    </div>

                    <span className="shrink-0 text-right">
                      <span className="block text-sm font-semibold text-ink nums">
                        {formatBRL(u.faturamentoDia)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-2 flex items-center justify-between border-t border-line px-3 pb-1 pt-3">
            <span className="text-xs text-muted">Total do dia</span>
            <Badge tone="success">{formatBRL(totalDia)}</Badge>
          </div>
        </>
      )}
    </Dropdown>
  );
}
