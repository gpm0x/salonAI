"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { KpiCard, KpiGrid } from "@/components/shared/KpiCard";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { CardMeta } from "@/components/metas/CardMeta";
import { NovaMetaModal } from "@/components/metas/NovaMetaModal";
import {
  IconPlus,
  IconTarget,
  IconCheck,
  IconGauge,
  IconArrowDown,
} from "@/components/ui/icons";
import {
  metas as seed,
  calcMeta,
  calcResumoMetas,
  periodoMetaMeta,
  RESPONSAVEL_SALAO,
  type Meta,
  type PeriodoMeta,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils/cn";

type Filtro = "todas" | PeriodoMeta;

const filtros: { id: Filtro; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "diaria", label: "Diárias" },
  { id: "semanal", label: "Semanais" },
  { id: "mensal", label: "Mensais" },
];

export function MetasView() {
  const [metas, setMetas] = useState<Meta[]>(seed);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [responsavel, setResponsavel] = useState("Todos");
  const [soAtivas, setSoAtivas] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Meta | null>(null);
  const [excluindo, setExcluindo] = useState<Meta | null>(null);

  const responsaveis = useMemo(
    () => ["Todos", ...Array.from(new Set(metas.map((m) => m.responsavel)))],
    [metas],
  );

  const lista = useMemo(
    () =>
      metas
        .filter((m) => filtro === "todas" || m.periodo === filtro)
        .filter((m) => responsavel === "Todos" || m.responsavel === responsavel)
        .filter((m) => !soAtivas || m.ativa),
    [metas, filtro, responsavel, soAtivas],
  );

  // agrupa por período para que a tela responda "como está o dia / a semana /
  // o mês" em vez de despejar uma lista única sem hierarquia
  const grupos = useMemo(() => {
    const ordem: PeriodoMeta[] = ["diaria", "semanal", "mensal"];
    return ordem
      .map((p) => ({ periodo: p, itens: lista.filter((m) => m.periodo === p) }))
      .filter((g) => g.itens.length > 0);
  }, [lista]);

  const r = useMemo(() => calcResumoMetas(metas), [metas]);

  // a meta ativa mais atrasada — é a que merece decisão hoje
  const critica = useMemo(() => {
    const ativas = metas.filter((m) => m.ativa);
    if (!ativas.length) return null;
    const pior = [...ativas].sort(
      (a, b) => calcMeta(a).projecaoPct - calcMeta(b).projecaoPct,
    )[0];
    return calcMeta(pior).status === "batida" ? null : pior;
  }, [metas]);

  // cria ou atualiza conforme o modo do modal
  function salvar(m: Meta) {
    setMetas((atual) =>
      atual.some((x) => x.id === m.id)
        ? atual.map((x) => (x.id === m.id ? m : x))
        : [m, ...atual],
    );
  }

  function abrirNova() {
    setEditando(null);
    setModalAberto(true);
  }

  function abrirEdicao(m: Meta) {
    setEditando(m);
    setModalAberto(true);
  }

  function confirmarExclusao() {
    if (!excluindo) return;
    setMetas((atual) => atual.filter((x) => x.id !== excluindo.id));
    setExcluindo(null);
  }

  return (
    <div className="mx-auto max-w-7xl animate-fade-up space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Metas</h1>
          <p className="mt-1 text-sm text-muted">
            Defina alvos diários, semanais e mensais e acompanhe se o ritmo do
            salão chega lá.
          </p>
        </div>
        <Button size="md" onClick={abrirNova}>
          <IconPlus width={17} height={17} />
          Nova meta
        </Button>
      </div>

      {/* KPIs */}
      <KpiGrid>
        <KpiCard
          icon={<IconTarget width={19} height={19} />}
          label="Metas ativas"
          valor={String(r.ativas)}
          variacao={0}
          sufixo={`${r.porPeriodo.diaria} diárias · ${r.porPeriodo.semanal} semanais · ${r.porPeriodo.mensal} mensais`}
        />
        <KpiCard
          icon={<IconGauge width={19} height={19} />}
          label="Progresso médio"
          valor={`${r.media}%`}
          variacao={6}
          sufixo="das metas ativas"
        />
        <KpiCard
          icon={<IconCheck width={19} height={19} />}
          label="No ritmo ou batidas"
          valor={String(r.batidas + r.noRitmo)}
          variacao={12}
          sufixo={`${r.batidas} já batidas`}
        />
        <KpiCard
          icon={<IconArrowDown width={19} height={19} />}
          label="Precisam de atenção"
          valor={String(r.atrasadas)}
          variacao={-8}
          quedaBoa
          sufixo="projeção abaixo do alvo"
        />
      </KpiGrid>

      {/* A meta que puxa o resultado para baixo — a decisão do dia */}
      {critica && (
        <Card className="flex flex-wrap items-center justify-between gap-4 border-danger/25 bg-danger/[0.04] p-5">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-danger/12 text-danger">
              <IconTarget width={19} height={19} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">
                {critica.titulo} está no ritmo mais baixo
              </p>
              <p className="mt-0.5 text-sm text-muted">
                Mantendo o ritmo atual, fecha em{" "}
                <span className="font-semibold text-ink nums">
                  {calcMeta(critica).projecaoPct}%
                </span>{" "}
                do alvo {periodoMetaMeta[critica.periodo].janela}.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => abrirEdicao(critica)}>
            Revisar meta
          </Button>
        </Card>
      )}

      {/* Filtros */}
      <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex flex-wrap gap-2">
          {filtros.map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                filtro === f.id
                  ? "bg-primary text-primary-fg shadow-soft"
                  : "border border-line bg-surface text-ink/70 hover:border-primary/40 hover:text-ink",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            aria-label="Filtrar por responsável"
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
            className="h-10 rounded-full border border-line bg-surface px-4 text-sm text-ink focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10"
          >
            {responsaveis.map((resp) => (
              <option key={resp} value={resp}>
                {resp === "Todos"
                  ? "Todos os responsáveis"
                  : resp === RESPONSAVEL_SALAO
                    ? `${RESPONSAVEL_SALAO} (equipe)`
                    : resp}
              </option>
            ))}
          </select>

          <button
            onClick={() => setSoAtivas((v) => !v)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              soAtivas
                ? "bg-primary text-primary-fg shadow-soft"
                : "border border-line bg-surface text-ink/70 hover:border-primary/40 hover:text-ink",
            )}
          >
            Só ativas
          </button>
        </div>
      </Card>

      {/* Metas agrupadas por período */}
      {grupos.map(({ periodo, itens }) => (
        <section key={periodo} className="space-y-4">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-xl text-ink">
              {periodoMetaMeta[periodo].plural}
            </h2>
            <p className="text-xs text-muted">
              medidas {periodoMetaMeta[periodo].janela} ·{" "}
              <span className="nums">{itens.length}</span>{" "}
              {itens.length === 1 ? "meta" : "metas"}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {itens.map((m) => (
              <CardMeta
                key={m.id}
                meta={m}
                onEditar={abrirEdicao}
                onExcluir={setExcluindo}
              />
            ))}
          </div>
        </section>
      ))}

      {grupos.length === 0 && (
        <Card className="flex flex-col items-center gap-3 px-6 py-14 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
            <IconTarget width={22} height={22} />
          </span>
          <p className="text-base font-semibold text-ink">
            Nenhuma meta por aqui
          </p>
          <p className="max-w-sm text-sm text-muted">
            {metas.length === 0
              ? "Crie a primeira meta do salão para começar a acompanhar o ritmo do dia, da semana e do mês."
              : "Nenhuma meta corresponde aos filtros selecionados."}
          </p>
          <Button size="md" onClick={abrirNova} className="mt-1">
            <IconPlus width={17} height={17} />
            Nova meta
          </Button>
        </Card>
      )}

      <NovaMetaModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onSalvar={salvar}
        meta={editando}
        periodoPadrao={filtro === "todas" ? "diaria" : filtro}
      />

      <ConfirmDialog
        open={excluindo !== null}
        titulo="Excluir meta"
        mensagem={`Tem certeza que deseja excluir a meta “${excluindo?.titulo}”? O histórico de resultados do salão não é afetado.`}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setExcluindo(null)}
      />
    </div>
  );
}
