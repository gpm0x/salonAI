import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconArrowUp, IconCalendar } from "@/components/ui/icons";
import { resumoDia, type StatusAgendamento } from "@/lib/mock-data";
import { cn } from "@/lib/utils/cn";

const statusConfig: Record<
  StatusAgendamento,
  { label: string; dot: string }
> = {
  // rótulos curtos: a legenda vive em duas colunas de um card estreito
  confirmado: { label: "Confirmados", dot: "bg-primary" },
  aguardando: { label: "Aguardando", dot: "bg-ink/30" },
  em_atendimento: { label: "Atendendo", dot: "bg-accent" },
  concluido: { label: "Concluídos", dot: "bg-success" },
};

const total = resumoDia.porStatus.reduce((soma, s) => soma + s.total, 0);

// quanto do expediente já está vendido — o resto são buracos a preencher
const ocupacaoAgenda = Math.round((total / resumoDia.slotsTotais) * 100);
const livres = resumoDia.slotsTotais - total;

/*
  Três faixas: identificação, número e detalhamento. Quando o card entra na
  visão geral ele troca essas linhas pelas do grid pai (`lg:grid-rows-subgrid`),
  passando a compartilhar a base do número com o card de faturamento.
*/
export function AgendamentosDia({ className }: { className?: string }) {
  return (
    <Card
      className={cn("grid grid-rows-[auto_auto_1fr] gap-y-3 p-6", className)}
    >
      {/* 1 — identificação */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-muted">
          <IconCalendar width={17} height={17} />
          <span className="text-sm font-medium">Agendamentos do dia</span>
        </div>
        <Badge tone="success">
          <IconArrowUp width={13} height={13} />
          {resumoDia.variacao}%
        </Badge>
      </div>

      {/* 2 — número */}
      <div className="flex flex-wrap items-baseline gap-x-1.5">
        <p className="font-display text-3xl text-ink nums">{total}</p>
        <span className="text-sm text-muted">agendamentos</span>
      </div>

      {/* 3 — ocupação, status e os buracos que sobraram na agenda */}
      <div className="flex flex-col gap-3">
        <p className="text-xs text-muted">
          Próximo às{" "}
          <span className="font-medium text-ink nums">
            {resumoDia.proximo.hora}
          </span>{" "}
          · {resumoDia.proximo.cliente} · {resumoDia.novosClientes} novos
          clientes
        </p>

        <p className="text-xs text-muted">
          <span className="font-semibold text-ink nums">{ocupacaoAgenda}%</span>{" "}
          da agenda ocupada
        </p>

        {/*
          A barra cobre o expediente inteiro (slotsTotais), não só o que já foi
          vendido: os segmentos coloridos são os status e a sobra clara à
          direita é a agenda livre. Uma barra só conta as duas histórias.
        */}
        <div className="flex h-2 overflow-hidden rounded-full bg-primary-soft">
          {resumoDia.porStatus.map((s) => (
            <div
              key={s.status}
              className={statusConfig[s.status].dot}
              style={{ width: `${(s.total / resumoDia.slotsTotais) * 100}%` }}
            />
          ))}
        </div>

        <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          {resumoDia.porStatus.map((s) => (
            <li key={s.status} className="flex items-center gap-2 text-xs">
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${statusConfig[s.status].dot}`}
              />
              <span className="truncate text-ink/80">
                {statusConfig[s.status].label}
              </span>
              <span className="ml-auto font-semibold text-ink nums">
                {s.total}
              </span>
            </li>
          ))}
        </ul>

        {/*
          Fecha o card com a única linha que vira ação agora: os buracos do dia.
          Encostado no rodapé (mt-auto) para destacar do detalhamento acima.
        */}
        <div className="mt-auto flex flex-wrap items-center gap-1.5 rounded-2xl bg-accent-soft px-3 py-2.5">
          <span className="text-xs font-medium text-ink/70">
            {livres} horários livres:
          </span>
          {resumoDia.horariosLivres.map((hora) => (
            <span
              key={hora}
              className="rounded-full bg-surface px-2 py-0.5 text-xs font-semibold text-accent nums"
            >
              {hora}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
