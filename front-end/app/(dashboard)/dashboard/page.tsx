import { AgendamentosDia } from "@/components/dashboard/AgendamentosDia";
import { FaturamentoCard } from "@/components/dashboard/FaturamentoCard";
import { TaxaOcupacao } from "@/components/dashboard/TaxaOcupacao";
import { TempoMedioAtendimento } from "@/components/dashboard/TempoMedioAtendimento";
import { AgendaHoje } from "@/components/dashboard/AgendaHoje";
import { AlertasIA } from "@/components/dashboard/AlertasIA";
import { DesempenhoProfissionais } from "@/components/dashboard/DesempenhoProfissionais";

const hoje = new Date().toLocaleDateString("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl animate-fade-up space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm capitalize text-muted">{hoje}</p>
          <h1 className="mt-1 font-display text-3xl text-ink">
            Bom te ver, Gabriel
          </h1>
          <p className="mt-1 text-sm text-muted">
            Aqui está o pulso do seu salão hoje.
          </p>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AgendamentosDia />
        <FaturamentoCard />
        <TaxaOcupacao />
        <TempoMedioAtendimento />
      </div>

      {/* Operação do dia */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AgendaHoje />
        </div>
        <div className="space-y-5">
          <AlertasIA />
          <DesempenhoProfissionais />
        </div>
      </div>
    </div>
  );
}
