import { AgendamentosDia } from "@/components/dashboard/AgendamentosDia";
import { FaturamentoCard } from "@/components/dashboard/FaturamentoCard";
import { MetaDoDia } from "@/components/dashboard/MetaDoDia";
import { ComparacaoOntem } from "@/components/dashboard/ComparacaoOntem";
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

      {/*
        Métricas do dia, em ordem de leitura: quanto tem na agenda (e quanto
        dela ainda está vazia), quanto já entrou (e quanto vira lucro), se a
        meta ainda é alcançável e como o dia se compara ao de ontem.

        Os quatro dividem a mesma linha a partir de xl. As três trilhas
        (identificação, número, corpo) são declaradas aqui e cada card as
        adota via subgrid — sem isso, quatro cards de conteúdo tão diferente
        resolveriam a altura sozinhos e os números sairiam desalinhados.
        Abaixo de xl não há linhas compartilhadas: os cards caem para 2×2 (ou
        empilham) e cada um volta a usar as próprias trilhas.
      */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 xl:grid-rows-[auto_auto_1fr]">
        <AgendamentosDia className="xl:row-span-3 xl:grid-rows-subgrid" />
        <FaturamentoCard className="xl:row-span-3 xl:grid-rows-subgrid" />
        <MetaDoDia className="xl:row-span-3 xl:grid-rows-subgrid" />
        <ComparacaoOntem className="xl:row-span-3 xl:grid-rows-subgrid" />
      </div>

      {/*
        Operação do dia — a agenda ocupa dois terços; a coluna da direita é um
        grid de duas linhas (auto + 1fr) para que o card de desempenho estique
        e o rodapé das duas colunas termine na mesma linha.
      */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <AgendaHoje className="lg:col-span-2" />
        <div className="grid gap-5 lg:grid-rows-[auto_1fr]">
          <AlertasIA />
          <DesempenhoProfissionais />
        </div>
      </div>
    </div>
  );
}
