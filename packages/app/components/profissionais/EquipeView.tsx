"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { KpiCard } from "@/components/shared/KpiCard";
import {
  IconPlus,
  IconSearch,
  IconUsers,
  IconGauge,
  IconWallet,
  IconStar,
  IconClock,
  IconScissors,
  IconEdit,
  IconTrash,
} from "@/components/ui/icons";
import { NovoProfissionalModal } from "@/components/profissionais/NovoProfissionalModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  equipe as seed,
  calcResumoEquipe,
  formatBRL,
  type StatusProfissional,
  type ProfissionalCompleto,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils/cn";

const statusMeta: Record<
  StatusProfissional,
  { label: string; tone: "success" | "accent" | "neutral" }
> = {
  ativo: { label: "Ativo", tone: "success" },
  ferias: { label: "Férias", tone: "accent" },
  inativo: { label: "Inativo", tone: "neutral" },
};

const filtros: { chave: "todos" | StatusProfissional; label: string }[] = [
  { chave: "todos", label: "Todos" },
  { chave: "ativo", label: "Ativos" },
  { chave: "ferias", label: "Em férias" },
  { chave: "inativo", label: "Inativos" },
];

function iniciais(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export function EquipeView() {
  const [profissionais, setProfissionais] =
    useState<ProfissionalCompleto[]>(seed);
  const [modalAberto, setModalAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<"todos" | StatusProfissional>("todos");

  const lista = useMemo(() => {
    const t = busca.trim().toLowerCase();
    return profissionais.filter((p) => {
      const casaFiltro = filtro === "todos" || p.status === filtro;
      const casaBusca =
        !t ||
        p.nome.toLowerCase().includes(t) ||
        p.especialidade.toLowerCase().includes(t) ||
        p.unidade.toLowerCase().includes(t);
      return casaFiltro && casaBusca;
    });
  }, [busca, filtro, profissionais]);

  const r = useMemo(() => calcResumoEquipe(profissionais), [profissionais]);

  const [editando, setEditando] = useState<ProfissionalCompleto | null>(null);
  const [excluindo, setExcluindo] = useState<ProfissionalCompleto | null>(null);

  function salvar(p: ProfissionalCompleto) {
    setProfissionais((atual) =>
      atual.some((x) => x.id === p.id)
        ? atual.map((x) => (x.id === p.id ? p : x))
        : [p, ...atual],
    );
  }

  function abrirNovo() {
    setEditando(null);
    setModalAberto(true);
  }

  function abrirEdicao(p: ProfissionalCompleto) {
    setEditando(p);
    setModalAberto(true);
  }

  function confirmarExclusao() {
    if (!excluindo) return;
    setProfissionais((atual) => atual.filter((x) => x.id !== excluindo.id));
    setExcluindo(null);
  }

  return (
    <div className="mx-auto max-w-7xl animate-fade-up space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Profissionais</h1>
          <p className="mt-1 text-sm text-muted">
            Sua equipe, desempenho e agenda de trabalho.
          </p>
        </div>
        <Button size="md" onClick={abrirNovo}>
          <IconPlus width={17} height={17} />
          Novo profissional
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={<IconUsers width={19} height={19} />}
          label="Profissionais"
          valor={String(r.total)}
          variacao={10}
          sufixo={`${r.ativos} ativos agora`}
        />
        <KpiCard
          icon={<IconWallet width={19} height={19} />}
          label="Faturamento da equipe"
          valor={formatBRL(r.faturamento)}
          variacao={14}
          sufixo="no mês"
        />
        <KpiCard
          icon={<IconGauge width={19} height={19} />}
          label="Ocupação média"
          valor={`${r.ocupacaoMedia}%`}
          variacao={5}
          sufixo={`${r.atendimentos} atendimentos`}
        />
        <KpiCard
          icon={<IconStar width={19} height={19} />}
          label="Avaliação média"
          valor={String(r.avaliacaoMedia)}
          variacao={2}
          sufixo="de 5 estrelas"
        />
      </div>

      {/* Busca + filtros */}
      <Card className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <IconSearch
            width={17}
            height={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, especialidade ou unidade…"
            className="h-10 w-full rounded-full border border-line bg-surface pl-10 pr-4 text-sm text-ink placeholder:text-muted/70 focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filtros.map((f) => (
            <button
              key={f.chave}
              onClick={() => setFiltro(f.chave)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                filtro === f.chave
                  ? "bg-primary text-primary-fg shadow-soft"
                  : "border border-line bg-surface text-ink/70 hover:border-primary/40 hover:text-ink",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Grid de profissionais */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {lista.map((p) => {
          const meta = statusMeta[p.status];
          return (
            <Card key={p.id} className="flex flex-col p-6">
              {/* Topo */}
              <div className="flex items-start gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-base font-semibold text-primary-fg">
                  {iniciais(p.nome)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-base font-semibold text-ink">
                      {p.nome}
                    </h3>
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted">
                    {p.especialidade}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                    <IconStar width={13} height={13} className="text-accent" />
                    <span className="font-medium text-ink nums">
                      {p.avaliacao}
                    </span>
                    · {p.unidade}
                  </p>
                </div>

                {/* Ações */}
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => abrirEdicao(p)}
                    aria-label={`Editar ${p.nome}`}
                    title="Editar"
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-primary-soft hover:text-primary"
                  >
                    <IconEdit width={16} height={16} />
                  </button>
                  <button
                    onClick={() => setExcluindo(p)}
                    aria-label={`Excluir ${p.nome}`}
                    title="Excluir"
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                  >
                    <IconTrash width={16} height={16} />
                  </button>
                </div>
              </div>

              {/* Métricas */}
              <div className="mt-5 grid grid-cols-3 gap-3 rounded-2xl bg-bg/40 p-3.5 text-center">
                <div>
                  <p className="font-display text-lg text-ink nums">
                    {p.atendimentosMes}
                  </p>
                  <p className="text-[0.68rem] text-muted">atendimentos</p>
                </div>
                <div className="border-x border-line">
                  <p className="font-display text-lg text-ink nums">
                    {formatBRL(p.faturamentoMes)}
                  </p>
                  <p className="text-[0.68rem] text-muted">no mês</p>
                </div>
                <div>
                  <p className="font-display text-lg text-ink nums">
                    {p.comissao}%
                  </p>
                  <p className="text-[0.68rem] text-muted">comissão</p>
                </div>
              </div>

              {/* Ocupação */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Ocupação da agenda</span>
                  <span className="font-semibold text-ink nums">
                    {p.ocupacao}%
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-primary-soft">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${p.ocupacao}%` }}
                  />
                </div>
              </div>

              {/* Serviços */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.servicos.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 rounded-full bg-primary-soft/60 px-2.5 py-1 text-xs text-ink/75"
                  >
                    <IconScissors width={11} height={11} />
                    {s}
                  </span>
                ))}
              </div>

              {/* Jornada */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <IconClock width={14} height={14} />
                  {p.horario}
                </span>
                <div className="flex gap-1">
                  {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => (
                    <span
                      key={d}
                      title={d}
                      className={cn(
                        "grid h-6 w-6 place-items-center rounded-full text-[0.6rem] font-medium",
                        p.dias.includes(d)
                          ? "bg-primary text-primary-fg"
                          : "bg-ink/5 text-muted",
                      )}
                    >
                      {d[0]}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {lista.length === 0 && (
        <p className="py-10 text-center text-sm text-muted">
          Nenhum profissional encontrado com esses filtros.
        </p>
      )}

      <NovoProfissionalModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onSalvar={salvar}
        profissional={editando}
      />

      <ConfirmDialog
        open={excluindo !== null}
        titulo="Excluir profissional"
        mensagem={`Tem certeza que deseja excluir ${excluindo?.nome} da equipe? Os agendamentos futuros precisarão ser reatribuídos.`}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setExcluindo(null)}
      />
    </div>
  );
}
