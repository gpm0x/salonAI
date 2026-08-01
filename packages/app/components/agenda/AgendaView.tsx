"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconPlus, IconCalendar, IconCheck, IconGauge, IconWallet } from "@/components/ui/icons";
import { KpiCard } from "@/components/shared/KpiCard";
import { QuadroAgenda } from "@/components/agenda/QuadroAgenda";
import { NovoAgendamentoModal } from "@/components/agenda/NovoAgendamentoModal";
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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
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
        <KpiCard
          icon={<IconGauge width={19} height={19} />}
          label="Taxa de ocupação"
          valor={`${r.ocupacao}%`}
          variacao={6}
          sufixo="da capacidade da equipe"
        />
        <KpiCard
          icon={<IconWallet width={19} height={19} />}
          label="Faturamento previsto"
          valor={formatBRL(r.faturamentoPrevisto)}
          variacao={11}
          sufixo="se todos comparecerem"
        />
      </div>

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
