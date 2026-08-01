"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { KpiCard } from "@/components/shared/KpiCard";
import {
  IconBrain,
  IconSparkles,
  IconArrowUp,
  IconArrowDown,
  IconChart,
  IconArrowRight,
  IconUsers,
  IconScissors,
  IconStore,
  IconGauge,
} from "@/components/ui/icons";
import {
  insightsIA,
  resumoIA,
  areaInsightMeta,
  formatBRL,
  type AreaInsight,
  type TomInsight,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils/cn";

const tomMeta: Record<
  TomInsight,
  {
    label: string;
    tone: "success" | "danger" | "primary";
    Icon: typeof IconArrowUp;
    barra: string;
  }
> = {
  oportunidade: {
    label: "Oportunidade",
    tone: "success",
    Icon: IconArrowUp,
    barra: "bg-success",
  },
  risco: { label: "Risco", tone: "danger", Icon: IconArrowDown, barra: "bg-danger" },
  tendencia: {
    label: "Tendência",
    tone: "primary",
    Icon: IconChart,
    barra: "bg-primary",
  },
};

const areaIcone: Record<AreaInsight, typeof IconUsers> = {
  clientes: IconUsers,
  servicos: IconSparkles,
  profissionais: IconScissors,
  unidades: IconStore,
};

const filtrosArea: { chave: "todas" | AreaInsight; label: string }[] = [
  { chave: "todas", label: "Todas as áreas" },
  { chave: "clientes", label: "Clientes" },
  { chave: "servicos", label: "Serviços" },
  { chave: "profissionais", label: "Profissionais" },
  { chave: "unidades", label: "Unidades" },
];

export function InteligenciaView() {
  const [area, setArea] = useState<"todas" | AreaInsight>("todas");
  const [tom, setTom] = useState<"todos" | TomInsight>("todos");
  const [gerando, setGerando] = useState(false);
  const [aplicados, setAplicados] = useState<string[]>([]);

  const lista = useMemo(
    () =>
      insightsIA
        .filter((i) => area === "todas" || i.area === area)
        .filter((i) => tom === "todos" || i.tom === tom)
        .sort((a, b) => b.impacto - a.impacto),
    [area, tom],
  );

  function gerar() {
    setGerando(true);
    setTimeout(() => setGerando(false), 1800);
  }

  const r = resumoIA;

  return (
    <div className="mx-auto max-w-7xl animate-fade-up space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-3xl text-ink">
              Inteligência Artificial
            </h1>
            <Badge tone="accent">
              <IconSparkles width={12} height={12} />
              Beta
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted">
            Insights gerados a partir dos dados de clientes, serviços,
            profissionais e unidades.
          </p>
        </div>
        <Button size="md" onClick={gerar} disabled={gerando}>
          {gerando ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-fg/30 border-t-primary-fg" />
              Analisando…
            </>
          ) : (
            <>
              <IconBrain width={17} height={17} />
              Gerar novos insights
            </>
          )}
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={<IconBrain width={19} height={19} />}
          label="Insights ativos"
          valor={String(r.total)}
          variacao={18}
          sufixo="nas 4 áreas do negócio"
        />
        <KpiCard
          icon={<IconArrowUp width={19} height={19} />}
          label="Potencial de ganho"
          valor={formatBRL(r.impactoPotencial)}
          variacao={22}
          sufixo={`${r.oportunidades} oportunidades`}
        />
        <KpiCard
          icon={<IconArrowDown width={19} height={19} />}
          label="Receita em risco"
          valor={formatBRL(r.receitaEmRisco)}
          variacao={9}
          quedaBoa
          sufixo={`${r.riscos} riscos detectados`}
        />
        <KpiCard
          icon={<IconGauge width={19} height={19} />}
          label="Confiança média"
          valor={`${r.confiancaMedia}%`}
          variacao={4}
          sufixo="das análises"
        />
      </div>

      {/* Filtros */}
      <Card className="flex flex-col gap-4 p-5">
        <div className="flex flex-wrap gap-2">
          {filtrosArea.map((f) => (
            <button
              key={f.chave}
              onClick={() => setArea(f.chave)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                area === f.chave
                  ? "bg-primary text-primary-fg shadow-soft"
                  : "border border-line bg-surface text-ink/70 hover:border-primary/40 hover:text-ink",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { chave: "todos", label: "Todos os tipos" },
              { chave: "oportunidade", label: "Oportunidades" },
              { chave: "risco", label: "Riscos" },
              { chave: "tendencia", label: "Tendências" },
            ] as const
          ).map((f) => (
            <button
              key={f.chave}
              onClick={() => setTom(f.chave)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                tom === f.chave
                  ? "bg-ink text-bg"
                  : "bg-primary-soft/50 text-ink/60 hover:text-ink",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Lista de insights */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {lista.map((i) => {
          const meta = tomMeta[i.tom];
          const AreaIcon = areaIcone[i.area];
          const aplicado = aplicados.includes(i.id);

          return (
            <Card key={i.id} className="flex overflow-hidden">
              {/* Barra lateral por tom */}
              <span className={cn("w-1 shrink-0", meta.barra)} />

              <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary-soft text-primary">
                      <AreaIcon width={16} height={16} />
                    </span>
                    <span className="text-xs font-medium text-muted">
                      {areaInsightMeta[i.area].label}
                    </span>
                  </div>
                  <Badge tone={meta.tone}>
                    <meta.Icon width={12} height={12} />
                    {meta.label}
                  </Badge>
                </div>

                <h3 className="mt-3 text-base font-semibold text-ink">
                  {i.titulo}
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">
                  {i.descricao}
                </p>

                {/* Impacto + confiança */}
                <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl bg-bg/50 px-4 py-3">
                  {i.impacto > 0 && (
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-wide text-muted">
                        {i.tom === "risco" ? "Em risco" : "Potencial"}
                      </p>
                      <p
                        className={cn(
                          "font-display text-lg nums",
                          i.tom === "risco" ? "text-danger" : "text-success",
                        )}
                      >
                        {formatBRL(i.impacto)}
                        <span className="text-xs text-muted">/mês</span>
                      </p>
                    </div>
                  )}
                  <div className="min-w-[120px] flex-1">
                    <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-wide text-muted">
                      <span>Confiança</span>
                      <span className="nums font-medium text-ink">
                        {i.confianca}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-primary-soft">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${i.confianca}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Ação recomendada */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                  <p className="flex items-start gap-1.5 text-sm text-ink/80">
                    <IconSparkles
                      width={15}
                      height={15}
                      className="mt-0.5 shrink-0 text-accent"
                    />
                    {i.acao}
                  </p>
                  <Button
                    size="sm"
                    variant={aplicado ? "outline" : "primary"}
                    disabled={aplicado}
                    onClick={() => setAplicados((a) => [...a, i.id])}
                  >
                    {aplicado ? "Aplicado" : "Aplicar"}
                    {!aplicado && <IconArrowRight width={14} height={14} />}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {lista.length === 0 && (
        <p className="py-10 text-center text-sm text-muted">
          Nenhum insight para esses filtros.
        </p>
      )}

      <p className="text-center text-xs text-muted">
        Os insights são recalculados diariamente com base nos dados do salão.
      </p>
    </div>
  );
}
