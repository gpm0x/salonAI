"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { KpiCard } from "@/components/shared/KpiCard";
import { NovaUnidadeModal } from "@/components/unidades/NovaUnidadeModal";
import {
  IconPlus,
  IconStore,
  IconWallet,
  IconGauge,
  IconUsers,
  IconMapPin,
  IconPhone,
  IconClock,
  IconArrowRight,
  IconEdit,
  IconTrash,
} from "@/components/ui/icons";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  unidades as seed,
  calcResumoUnidades,
  formatBRL,
  type Unidade,
} from "@/lib/mock-data";

export function UnidadesView() {
  const [unidades, setUnidades] = useState<Unidade[]>(seed);
  const [modalAberto, setModalAberto] = useState(false);

  const r = useMemo(() => calcResumoUnidades(unidades), [unidades]);
  const maxFat = Math.max(...unidades.map((u) => u.faturamentoMes), 1);

  const [editando, setEditando] = useState<Unidade | null>(null);
  const [excluindo, setExcluindo] = useState<Unidade | null>(null);

  // cria ou atualiza; se for matriz, as demais deixam de ser
  function salvar(u: Unidade) {
    setUnidades((atual) => {
      const base = u.principal
        ? atual.map((x) => ({ ...x, principal: false }))
        : atual;
      return base.some((x) => x.id === u.id)
        ? base.map((x) => (x.id === u.id ? u : x))
        : [...base, u];
    });
  }

  function abrirNova() {
    setEditando(null);
    setModalAberto(true);
  }

  function abrirEdicao(u: Unidade) {
    setEditando(u);
    setModalAberto(true);
  }

  function confirmarExclusao() {
    if (!excluindo) return;
    setUnidades((atual) => atual.filter((x) => x.id !== excluindo.id));
    setExcluindo(null);
  }

  return (
    <div className="mx-auto max-w-7xl animate-fade-up space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Unidades</h1>
          <p className="mt-1 text-sm text-muted">
            Todas as unidades do salão e o desempenho de cada uma.
          </p>
        </div>
        <Button size="md" onClick={abrirNova}>
          <IconPlus width={17} height={17} />
          Nova unidade
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={<IconStore width={19} height={19} />}
          label="Unidades"
          valor={String(r.total)}
          variacao={0}
          sufixo={`${r.ativas} ativas`}
        />
        <KpiCard
          icon={<IconWallet width={19} height={19} />}
          label="Faturamento consolidado"
          valor={formatBRL(r.faturamento)}
          variacao={13}
          sufixo="somando todas as unidades"
        />
        <KpiCard
          icon={<IconGauge width={19} height={19} />}
          label="Ocupação média"
          valor={`${r.ocupacaoMedia}%`}
          variacao={4}
          sufixo="da capacidade total"
        />
        <KpiCard
          icon={<IconUsers width={19} height={19} />}
          label="Profissionais"
          valor={String(r.profissionais)}
          variacao={8}
          sufixo="em todas as unidades"
        />
      </div>

      {/* Cards das unidades */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {unidades.map((u) => (
          <Card key={u.id} className="flex flex-col p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                  <IconStore width={22} height={22} />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-ink">
                      {u.nome}
                    </h3>
                    {u.principal && <Badge tone="accent">Matriz</Badge>}
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{u.cidade}</p>
                </div>
              </div>
              <Badge tone={u.ativa ? "success" : "neutral"}>
                {u.ativa ? "Ativa" : "Inativa"}
              </Badge>
            </div>

            <ul className="mt-5 space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2">
                <IconMapPin
                  width={15}
                  height={15}
                  className="mt-0.5 shrink-0 text-primary"
                />
                {u.endereco}
              </li>
              <li className="flex items-center gap-2">
                <IconPhone width={15} height={15} className="shrink-0 text-primary" />
                <span className="nums">{u.telefone}</span>
              </li>
              <li className="flex items-center gap-2">
                <IconClock width={15} height={15} className="shrink-0 text-primary" />
                {u.horario}
              </li>
            </ul>

            <div className="mt-5 grid grid-cols-3 gap-3 rounded-2xl bg-bg/40 p-3.5 text-center">
              <div>
                <p className="font-display text-lg text-ink nums">
                  {u.profissionais}
                </p>
                <p className="text-[0.68rem] text-muted">profissionais</p>
              </div>
              <div className="border-x border-line">
                <p className="font-display text-lg text-ink nums">{u.cadeiras}</p>
                <p className="text-[0.68rem] text-muted">cadeiras</p>
              </div>
              <div>
                <p className="font-display text-lg text-ink nums">
                  {u.atendimentosMes}
                </p>
                <p className="text-[0.68rem] text-muted">atendimentos</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Faturamento do mês</span>
                <span className="font-semibold text-ink nums">
                  {formatBRL(u.faturamentoMes)}
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-primary-soft">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  style={{
                    width: `${Math.round((u.faturamentoMes / maxFat) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Ocupação</span>
                <span className="font-semibold text-ink nums">{u.ocupacao}%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-primary-soft">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${u.ocupacao}%` }}
                />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <button className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-line py-2.5 text-sm font-medium text-ink/80 transition-colors hover:border-primary/40 hover:bg-primary-soft/50 hover:text-ink">
                Ver detalhes
                <IconArrowRight width={15} height={15} />
              </button>
              <button
                onClick={() => abrirEdicao(u)}
                aria-label={`Editar ${u.nome}`}
                title="Editar"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors hover:border-primary/40 hover:bg-primary-soft hover:text-primary"
              >
                <IconEdit width={16} height={16} />
              </button>
              <button
                onClick={() => setExcluindo(u)}
                aria-label={`Excluir ${u.nome}`}
                title="Excluir"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors hover:border-danger/40 hover:bg-danger/10 hover:text-danger"
              >
                <IconTrash width={16} height={16} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <NovaUnidadeModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onSalvar={salvar}
        unidade={editando}
      />

      <ConfirmDialog
        open={excluindo !== null}
        titulo="Excluir unidade"
        mensagem={`Tem certeza que deseja excluir a unidade ${excluindo?.nome}? Os profissionais vinculados precisarão ser realocados.`}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setExcluindo(null)}
      />
    </div>
  );
}
