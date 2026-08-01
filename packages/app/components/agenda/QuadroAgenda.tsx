"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconClock } from "@/components/ui/icons";
import {
  statusAgendamentoMeta,
  horaFim,
  formatBRL,
  type StatusAgendamento,
  type AgendamentoAgenda,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils/cn";

const statusFiltros: { chave: "todos" | StatusAgendamento; label: string }[] = [
  { chave: "todos", label: "Todos os status" },
  { chave: "confirmado", label: "Confirmados" },
  { chave: "em_atendimento", label: "Em atendimento" },
  { chave: "aguardando", label: "Aguardando" },
  { chave: "concluido", label: "Concluídos" },
];

function iniciais(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export function QuadroAgenda({
  agendamentos,
}: {
  agendamentos: AgendamentoAgenda[];
}) {
  const [prof, setProf] = useState("Todos");
  const [status, setStatus] = useState<"todos" | StatusAgendamento>("todos");

  const profissionais = useMemo(
    () => ["Todos", ...Array.from(new Set(agendamentos.map((a) => a.profissional)))],
    [agendamentos],
  );

  const lista = useMemo(() => {
    return agendamentos
      .filter((a) => prof === "Todos" || a.profissional === prof)
      .filter((a) => status === "todos" || a.status === status)
      .sort((a, b) => a.inicio.localeCompare(b.inicio));
  }, [prof, status, agendamentos]);

  return (
    <Card className="flex flex-col p-6">
      {/* Filtros */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {profissionais.map((p) => (
            <button
              key={p}
              onClick={() => setProf(p)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                prof === p
                  ? "bg-primary text-primary-fg shadow-soft"
                  : "border border-line bg-surface text-ink/70 hover:border-primary/40 hover:text-ink",
              )}
            >
              {p === "Todos" ? "Toda a equipe" : p.split(" ")[0]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFiltros.map((f) => (
            <button
              key={f.chave}
              onClick={() => setStatus(f.chave)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                status === f.chave
                  ? "bg-ink text-bg"
                  : "bg-primary-soft/50 text-ink/60 hover:text-ink",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <ul className="mt-6 space-y-3">
        {lista.map((a) => {
          const meta = statusAgendamentoMeta[a.status];
          return (
            <li
              key={a.id}
              className="flex items-stretch gap-4 rounded-2xl border border-line bg-bg/40 p-3.5 transition-colors hover:border-primary/40"
            >
              {/* Horário */}
              <div className="flex w-16 shrink-0 flex-col items-center justify-center border-r border-line pr-3 text-center">
                <span className="font-display text-lg leading-none text-ink nums">
                  {a.inicio}
                </span>
                <span className="mt-1 text-[0.65rem] text-muted nums">
                  {horaFim(a.inicio, a.duracao)}
                </span>
              </div>

              {/* Barra de status */}
              <span className={cn("w-1 shrink-0 rounded-full", meta.dot)} />

              {/* Conteúdo */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{a.cliente}</p>
                    <p className="truncate text-sm text-muted">{a.servico}</p>
                  </div>
                  <Badge tone={meta.tone}>{meta.label}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-[0.55rem] font-semibold text-primary-fg">
                      {iniciais(a.profissional)}
                    </span>
                    {a.profissional.split(" ")[0]}
                  </span>
                  <span className="flex items-center gap-1">
                    <IconClock width={13} height={13} />
                    {a.duracao} min
                  </span>
                  <span className="font-semibold text-ink nums">
                    {formatBRL(a.valor)}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {lista.length === 0 && (
        <p className="py-10 text-center text-sm text-muted">
          Nenhum agendamento para esse filtro.
        </p>
      )}
    </Card>
  );
}
