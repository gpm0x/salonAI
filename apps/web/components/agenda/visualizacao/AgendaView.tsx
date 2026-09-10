"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconPlus, IconCalendar, IconCheck, IconBell, IconWallet } from "@/components/ui/icons";
import { KpiCard, KpiGrid } from "@/components/shared/KpiCard";
import { QuadroAgenda } from "@/components/agenda/visualizacao/QuadroAgenda";
import { NovoAgendamentoModal } from "@/components/agenda/formularios/NovoAgendamentoModal";
import {
  agendaDoDia as seed,
  calcResumoAgenda,
  formatBRL,
  type AgendamentoAgenda,
} from "@/lib/mock-data";

const hoje = new Date().toLocaleDateString("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export function AgendaView() {
  const [agendamentos, setAgendamentos] = useState<AgendamentoAgenda[]>(seed);
  const [modalAberto, setModalAberto] = useState(false);

  const r = useMemo(() => calcResumoAgenda(agendamentos), [agendamentos]);

  function adicionar(novo: AgendamentoAgenda) {
    setAgendamentos((atual) => [...atual, novo]);
  }

  return (
    <div className="mx-auto max-w-7xl animate-fade-up space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm capitalize text-muted">{hoje}</p>
          <h1 className="mt-1 font-display text-3xl text-ink">Agenda</h1>
          <p className="mt-1 text-sm text-muted">
            Todos os agendamentos do dia, por profissional e status.
          </p>
        </div>
        <Button size="md" onClick={() => setModalAberto(true)}>
          <IconPlus width={17} height={17} />
          Novo agendamento
        </Button>
      </div>

      {/* Resumo do dia */}
      <KpiGrid>
        <KpiCard
          icon={<IconCalendar width={19} height={19} />}
          label="Agendamentos hoje"
          valor={String(r.total)}
          variacao={8}
          sufixo={`${r.concluidos} já concluídos`}
        />
        <KpiCard
          icon={<IconCheck width={19} height={19} />}
          label="Confirmados"
          valor={String(r.confirmados)}
          variacao={5}
          sufixo="prontos para atender"
        />
        {/*
          Ocupação já é o KPI de capacidade das telas de equipe e unidades —
          aqui a pergunta é outra: quem ainda não respondeu e quanto do dia
          depende disso. É o único número desta faixa que vira uma ação agora.
        */}
        <KpiCard
          icon={<IconBell width={19} height={19} />}
          label="Aguardando confirmação"
          valor={String(r.aguardando)}
          variacao={-33}
          quedaBoa
          sufixo={`${formatBRL(r.valorAguardando)} dependem de resposta`}
        />
        <KpiCard
          icon={<IconWallet width={19} height={19} />}
          label="Faturamento previsto"
          valor={formatBRL(r.faturamentoPrevisto)}
          variacao={11}
          sufixo="se todos comparecerem"
        />
      </KpiGrid>

      {/* Quadro */}
      <QuadroAgenda agendamentos={agendamentos} />

      {/* Modal */}
      <NovoAgendamentoModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onSalvar={adicionar}
      />
    </div>
  );
}
