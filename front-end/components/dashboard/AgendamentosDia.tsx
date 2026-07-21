import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconArrowUp, IconCalendar } from "@/components/ui/icons";
import { resumoDia, type StatusAgendamento } from "@/lib/mock-data";

const statusConfig: Record<
  StatusAgendamento,
  { label: string; dot: string }
> = {
  confirmado: { label: "Confirmados", dot: "bg-primary" },
  aguardando: { label: "Aguardando", dot: "bg-ink/30" },
  em_atendimento: { label: "Em atendimento", dot: "bg-accent" },
  concluido: { label: "Concluídos", dot: "bg-success" },
};

const total = resumoDia.porStatus.reduce((soma, s) => soma + s.total, 0);

export function AgendamentosDia() {
  return (
    <Card className="flex flex-col p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted">
          <IconCalendar width={17} height={17} />
          <span className="text-sm font-medium">Agendamentos do dia</span>
        </div>
        <Badge tone="success">
          <IconArrowUp width={13} height={13} />
          {resumoDia.variacao}%
        </Badge>
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <p className="font-display text-4xl text-ink nums">{total}</p>
        <span className="text-sm text-muted">agendamentos</span>
      </div>

      <p className="mt-1 text-xs text-muted">
        Próximo às{" "}
        <span className="font-medium text-ink nums">
          {resumoDia.proximo.hora}
        </span>{" "}
        · {resumoDia.proximo.cliente} · {resumoDia.novosClientes} novos clientes
      </p>

      {/* Barra proporcional por status */}
      <div className="mt-5 flex h-2 overflow-hidden rounded-full bg-primary-soft">
        {resumoDia.porStatus.map((s) => (
          <div
            key={s.status}
            className={statusConfig[s.status].dot}
            style={{ width: `${(s.total / total) * 100}%` }}
          />
        ))}
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
        {resumoDia.porStatus.map((s) => (
          <li key={s.status} className="flex items-center gap-2 text-xs">
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${statusConfig[s.status].dot}`}
            />
            <span className="text-ink/80">{statusConfig[s.status].label}</span>
            <span className="ml-auto font-semibold text-ink nums">
              {s.total}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
