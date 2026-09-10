import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconCalendar, IconArrowRight } from "@/components/ui/icons";
import {
  agendaHoje,
  type StatusAgendamento,
  type AgendamentoView,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils/cn";

const statusConfig: Record<
  StatusAgendamento,
  { label: string; tone: "neutral" | "primary" | "accent" | "success" }
> = {
  concluido: { label: "Concluído", tone: "success" },
  em_atendimento: { label: "Em atendimento", tone: "accent" },
  confirmado: { label: "Confirmado", tone: "primary" },
  aguardando: { label: "Aguardando", tone: "neutral" },
};

function iniciais(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function Linha({ ag }: { ag: AgendamentoView }) {
  const st = statusConfig[ag.status];
  return (
    // flex-1 distribui as linhas quando o card estica para acompanhar a coluna
    // vizinha — assim a lista não deixa um vazio no rodapé
    <li className="flex flex-1 items-center gap-4 py-3.5">
      <div className="w-12 shrink-0 text-sm font-semibold text-ink nums">
        {ag.hora}
      </div>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
        {iniciais(ag.cliente)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{ag.cliente}</p>
        <p className="truncate text-xs text-muted">
          {ag.servico} · {ag.profissional}
        </p>
      </div>
      <Badge tone={st.tone}>{st.label}</Badge>
    </li>
  );
}

export function AgendaHoje({ className }: { className?: string }) {
  return (
    <Card className={cn("flex flex-col p-6", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <IconCalendar width={18} height={18} className="text-primary" />
          <h3 className="text-base font-semibold text-ink">Agenda de hoje</h3>
        </div>
        <Link
          href="/agenda"
          className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-accent"
        >
          Ver agenda
          <IconArrowRight width={15} height={15} />
        </Link>
      </div>

      <ul className="mt-2 flex flex-1 flex-col divide-y divide-line">
        {agendaHoje.map((ag, i) => (
          <Linha key={i} ag={ag} />
        ))}
      </ul>
    </Card>
  );
}
