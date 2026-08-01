import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconArrowUp, IconArrowDown, IconWallet } from "@/components/ui/icons";
import {
  financeiroMensal,
  resumoFinanceiro,
  formatBRL,
} from "@/lib/mock-data";

export function TicketMedioChart() {
  const tickets = financeiroMensal.map((m) => ({
    mes: m.mes,
    valor: Math.round(m.receita / m.atendimentos),
  }));
  const max = Math.max(...tickets.map((t) => t.valor));
  const min = Math.min(...tickets.map((t) => t.valor));
  const range = max - min || 1;
  const subiu = resumoFinanceiro.variacaoTicket >= 0;

  return (
    <Card className="flex flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <IconWallet width={18} height={18} className="text-primary" />
          <h3 className="text-base font-semibold text-ink">Ticket médio</h3>
        </div>
        <Badge tone={subiu ? "success" : "danger"}>
          {subiu ? (
            <IconArrowUp width={13} height={13} />
          ) : (
            <IconArrowDown width={13} height={13} />
          )}
          {Math.abs(resumoFinanceiro.variacaoTicket)}%
        </Badge>
      </div>

      <p className="mt-3 font-display text-3xl text-ink nums">
        {formatBRL(resumoFinanceiro.ticketMedio)}
      </p>
      <p className="text-xs text-muted">média por atendimento neste mês</p>

      {/* mini-gráfico de barras da evolução */}
      <div className="mt-6 flex items-end gap-1.5">
        {tickets.map((t, i) => {
          const altura = 12 + ((t.valor - min) / range) * 52;
          const ultimo = i === tickets.length - 1;
          return (
            <div
              key={t.mes}
              className="flex flex-1 flex-col items-center gap-1.5"
            >
              <div
                className={`w-full rounded-md transition-colors ${
                  ultimo
                    ? "bg-gradient-to-t from-primary to-accent"
                    : "bg-primary/15 hover:bg-primary/30"
                }`}
                style={{ height: `${altura}px` }}
                title={`${t.mes}: ${formatBRL(t.valor)}`}
              />
              <span className="text-[0.6rem] text-muted">{t.mes}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
