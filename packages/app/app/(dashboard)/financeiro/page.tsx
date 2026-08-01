import { Button } from "@/components/ui/Button";
import { IconWallet, IconChart, IconUsers, IconArrowRight } from "@/components/ui/icons";
import { KpiCard } from "@/components/shared/KpiCard";
import { FaturamentoMensalChart } from "@/components/financeiro/FaturamentoMensalChart";
import { TicketMedioChart } from "@/components/financeiro/TicketMedioChart";
import { FormasPagamento } from "@/components/financeiro/FormasPagamento";
import { ReceitaPorCategoria } from "@/components/financeiro/ReceitaPorCategoria";
import { UltimasTransacoes } from "@/components/financeiro/UltimasTransacoes";
import { resumoFinanceiro, formatBRL } from "@/lib/mock-data";

const periodo = new Date().toLocaleDateString("pt-BR", {
  month: "long",
  year: "numeric",
});

export default function Page() {
  const r = resumoFinanceiro;

  return (
    <div className="mx-auto max-w-7xl animate-fade-up space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm capitalize text-muted">{periodo}</p>
          <h1 className="mt-1 font-display text-3xl text-ink">Financeiro</h1>
          <p className="mt-1 text-sm text-muted">
            Acompanhe faturamento, ticket médio e a saúde financeira do salão.
          </p>
        </div>
        <Button variant="outline" size="md">
          Exportar relatório
          <IconArrowRight width={16} height={16} />
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={<IconWallet width={19} height={19} />}
          label="Receita do mês"
          valor={formatBRL(r.receita)}
          variacao={r.variacaoReceita}
        />
        <KpiCard
          icon={<IconChart width={19} height={19} />}
          label="Ticket médio"
          valor={formatBRL(r.ticketMedio)}
          variacao={r.variacaoTicket}
        />
        <KpiCard
          icon={<IconUsers width={19} height={19} />}
          label="Atendimentos"
          valor={String(r.atendimentos)}
          variacao={r.variacaoAtendimentos}
        />
        <KpiCard
          icon={<IconWallet width={19} height={19} />}
          label={`Lucro · margem ${r.margem}%`}
          valor={formatBRL(r.lucro)}
          variacao={r.variacaoLucro}
        />
      </div>

      {/* Gráfico principal + ticket médio */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FaturamentoMensalChart />
        </div>
        <TicketMedioChart />
      </div>

      {/* Formas de pagamento + receita por serviço */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <FormasPagamento />
        <ReceitaPorCategoria />
      </div>

      {/* Transações */}
      <UltimasTransacoes />
    </div>
  );
}
