import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconArrowDown, IconArrowUp, IconGauge } from "@/components/ui/icons";
import { faturamento, metaDoDia, formatBRL } from "@/lib/mock-data";
import { cn } from "@/lib/utils/cn";

// 6.5 → "6h30"
function formatHoras(horas: number) {
  const h = Math.floor(horas);
  const m = Math.round((horas - h) * 60);
  return m ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
}

/*
  O card de faturamento diz quanto já entrou; este diz se a meta ainda é
  alcançável e o que fazer para chegar lá. As mesmas três faixas dos cards de
  cima — identificação, número e corpo — para entrar no subgrid da visão geral.
*/
export function MetaDoDia({ className }: { className?: string }) {
  const falta = Math.max(0, faturamento.metaDia - faturamento.hoje);
  const progresso = Math.min(
    100,
    Math.round((faturamento.hoje / faturamento.metaDia) * 100),
  );

  // onde o faturamento costuma estar a esta hora — é o que separa "atrasado"
  // de "só ainda não deu tempo"
  const marcaRitmo = Math.min(
    100,
    Math.round((metaDoDia.esperadoAgora / faturamento.metaDia) * 100),
  );
  const noRitmo = faturamento.hoje >= metaDoDia.esperadoAgora;
  const difRitmo = Math.abs(faturamento.hoje - metaDoDia.esperadoAgora);

  // o que falta traduzido em ações: quantos clientes e quanto por hora
  const atendimentos = Math.ceil(falta / metaDoDia.ticketMedio);
  const porHora = Math.round(falta / metaDoDia.horasRestantes / 10) * 10;

  const projecaoPct = Math.round(
    (metaDoDia.projecao / faturamento.metaDia) * 100,
  );

  return (
    <Card
      className={cn("grid grid-rows-[auto_auto_1fr] gap-y-3 p-6", className)}
    >
      {/* 1 — identificação */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-muted">
          <IconGauge width={17} height={17} />
          <span className="text-sm font-medium">Meta do dia</span>
        </div>
        <Badge tone={noRitmo ? "success" : "danger"}>
          {noRitmo ? (
            <IconArrowUp width={13} height={13} />
          ) : (
            <IconArrowDown width={13} height={13} />
          )}
          {noRitmo ? "No ritmo" : "Abaixo do ritmo"}
        </Badge>
      </div>

      {/* 2 — número: o que ainda falta, não o que já foi (isso o card ao lado
          já mostra) */}
      <div className="flex flex-wrap items-baseline gap-x-1.5">
        <p className="font-display text-3xl text-ink nums">
          {formatBRL(falta)}
        </p>
        <span className="text-sm text-muted">para bater a meta</span>
      </div>

      {/* 3 — ritmo, tradução em ação e projeção de fechamento */}
      <div className="flex flex-col gap-3">
        {/* A marca vertical é o ritmo esperado a esta hora: barra à esquerda
            dela = atrasado, à direita = adiantado. */}
        <div className="relative h-2 rounded-full bg-primary-soft">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${progresso}%` }}
          />
          <span
            className="absolute -top-1 h-4 w-0.5 -translate-x-1/2 rounded-full bg-ink/40"
            style={{ left: `${marcaRitmo}%` }}
            title={`Ritmo esperado a esta hora: ${formatBRL(metaDoDia.esperadoAgora)}`}
          />
        </div>

        <p className="text-xs text-muted">
          <span className="font-semibold text-ink nums">{progresso}%</span> de{" "}
          {formatBRL(faturamento.metaDia)} ·{" "}
          <span className="nums">{formatBRL(difRitmo)}</span>{" "}
          {noRitmo ? "acima" : "abaixo"} do esperado a esta hora
        </p>

        <div className="mt-auto flex flex-col gap-3">
          {/* O que falta, traduzido em decisões do dono */}
          <dl className="flex flex-col gap-1.5 rounded-2xl bg-primary-soft/60 px-3.5 py-2.5">
            <div className="flex items-baseline justify-between gap-2">
              <dt className="text-xs text-muted">Faltam cerca de</dt>
              <dd className="text-sm font-semibold text-ink nums">
                {atendimentos} atendimentos
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <dt className="text-xs text-muted">
                Ritmo nas {formatHoras(metaDoDia.horasRestantes)} restantes
              </dt>
              <dd className="text-sm font-semibold text-ink nums">
                {formatBRL(porHora)}/h
              </dd>
            </div>
          </dl>

          <p className="text-xs text-muted">
            Projeção de fechamento:{" "}
            <span className="font-semibold text-ink nums">
              {formatBRL(metaDoDia.projecao)}
            </span>{" "}
            <span className="nums">({projecaoPct}% da meta)</span>
          </p>
        </div>
      </div>
    </Card>
  );
}
