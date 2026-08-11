import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconCalendar, IconArrowRight } from "@/components/ui/icons";

type StatusAgendamento = "confirmado" | "aguardando" | "em_atendimento" | "concluido";

const statusConfig: Record<StatusAgendamento, { label: string; tone: "neutral" | "primary" | "accent" | "success" }> = {
  concluido: { label: "Concluído", tone: "success" },
  em_atendimento: { label: "Em atendimento", tone: "accent" },
  confirmado: { label: "Confirmado", tone: "primary" },
  aguardando: { label: "Aguardando", tone: "neutral" },
};

const DEFAULT_STATUS: (typeof statusConfig)[StatusAgendamento] = { label: "Agendado", tone: "neutral" };

export interface AgendamentoView {
  hora: string;
  cliente: string;
  servico: string;
  profissional: string;
  status: string;
}

function iniciais(nome: string) {
  return nome.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

function Linha({ ag }: { ag: AgendamentoView }) {
  const st = statusConfig[ag.status as StatusAgendamento] ?? DEFAULT_STATUS;
  return (
    <li className="flex items-center gap-4 py-3.5">
      <div className="w-12 shrink-0 text-sm font-semibold text-ink nums">{ag.hora}</div>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
        {iniciais(ag.cliente)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{ag.cliente}</p>
        <p className="truncate text-xs text-muted">{ag.servico} · {ag.profissional}</p>
      </div>
      <Badge tone={st.tone}>{st.label}</Badge>
    </li>
  );
}

interface Props {
  agendamentos: AgendamentoView[];
}

export function AgendaHoje({ agendamentos }: Props) {
  return (
    <Card className="flex flex-col p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconCalendar width={18} height={18} className="text-primary" />
          <h3 className="text-base font-semibold text-ink">Agenda de hoje</h3>
        </div>
        <Link href="/agenda" className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-accent">
          Ver agenda
          <IconArrowRight width={15} height={15} />
        </Link>
      </div>

      {agendamentos.length === 0 ? (
        <p className="mt-6 text-center text-sm text-muted">Nenhum agendamento hoje.</p>
      ) : (
        <ul className="mt-2 divide-y divide-line">
          {agendamentos.map((ag, i) => (
            <Linha key={i} ag={ag} />
          ))}
        </ul>
      )}
    </Card>
  );
}
