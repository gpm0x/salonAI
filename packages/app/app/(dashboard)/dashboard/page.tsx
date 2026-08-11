import { apiFetch } from "@/lib/api-server";
import { getSession } from "@/lib/auth/session";
import { AgendamentosDia } from "@/components/dashboard/AgendamentosDia";
import { FaturamentoCard } from "@/components/dashboard/FaturamentoCard";
import { TaxaOcupacao } from "@/components/dashboard/TaxaOcupacao";
import { TempoMedioAtendimento } from "@/components/dashboard/TempoMedioAtendimento";
import { AgendaHoje } from "@/components/dashboard/AgendaHoje";
import { AlertasIA } from "@/components/dashboard/AlertasIA";
import { DesempenhoProfissionais } from "@/components/dashboard/DesempenhoProfissionais";

interface DashboardMetrics {
  resumoDia: {
    variacao: number;
    novosClientes: number;
    proximo: { hora: string; cliente: string } | null;
    porStatus: Array<{ status: string; total: number }>;
  };
  faturamento: { hoje: number; metaDia: number; semana: number; variacaoSemana: number; serie: number[] };
  ocupacao: { taxa: number; cadeirasOcupadas: number; cadeirasTotais: number; variacao: number };
  tempoMedio: { minutos: number; variacao: number; porServico: Array<{ nome: string; minutos: number }> };
  agendaHoje: Array<{ hora: string; cliente: string; servico: string; profissional: string; status: string }>;
  profissionais: Array<{ nome: string; especialidade: string | null; atendimentos: number; faturamento: number; ocupacao: number }>;
}

interface DashboardInsights {
  data: Array<{ id: string; area: string; tom: string; titulo: string; descricao: string }>;
}

const hoje = new Date().toLocaleDateString("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

const EMPTY_METRICS: DashboardMetrics = {
  resumoDia: { variacao: 0, novosClientes: 0, proximo: null, porStatus: [] },
  faturamento: { hoje: 0, metaDia: 0, semana: 0, variacaoSemana: 0, serie: [0, 0, 0, 0, 0, 0, 0] },
  ocupacao: { taxa: 0, cadeirasOcupadas: 0, cadeirasTotais: 1, variacao: 0 },
  tempoMedio: { minutos: 0, variacao: 0, porServico: [] },
  agendaHoje: [],
  profissionais: [],
};

export default async function Page() {
  const [session, metrics, insights] = await Promise.all([
    getSession(),
    apiFetch<DashboardMetrics>("/api/dashboard/metrics"),
    apiFetch<DashboardInsights>("/api/dashboard/insights"),
  ]);

  const m = metrics ?? EMPTY_METRICS;
  const alertas = insights?.data ?? [];
  const userName = session?.user?.name?.split(" ")[0] ?? "você";

  return (
    <div className="mx-auto max-w-7xl animate-fade-up space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm capitalize text-muted">{hoje}</p>
          <h1 className="mt-1 font-display text-3xl text-ink">Bom te ver, {userName}</h1>
          <p className="mt-1 text-sm text-muted">Aqui está o pulso do seu salão hoje.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AgendamentosDia {...m.resumoDia} />
        <FaturamentoCard {...m.faturamento} />
        <TaxaOcupacao {...m.ocupacao} />
        <TempoMedioAtendimento {...m.tempoMedio} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AgendaHoje agendamentos={m.agendaHoje} />
        </div>
        <div className="space-y-5">
          <AlertasIA alertas={alertas} />
          <DesempenhoProfissionais profissionais={m.profissionais} />
        </div>
      </div>
    </div>
  );
}
