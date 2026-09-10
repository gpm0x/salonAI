"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { IconChart } from "@/components/ui/icons";
import { financeiroMensal, formatBRL } from "@/lib/mock-data";
import { cn } from "@/lib/utils/cn";

// dimensões internas do SVG (escala com o container via viewBox)
const W = 760;
const H = 300;
const PAD = { top: 24, right: 16, bottom: 34, left: 56 };
const innerW = W - PAD.left - PAD.right;
const innerH = H - PAD.top - PAD.bottom;

// caixa do tooltip, em unidades do viewBox
const TIP = { w: 184, h: 96, gap: 16 };

function buildPath(valores: number[], max: number) {
  const stepX = innerW / (valores.length - 1);
  const pts = valores.map((v, i) => {
    const x = PAD.left + i * stepX;
    const y = PAD.top + innerH - (v / max) * innerH;
    return [x, y] as const;
  });
  const line = pts.map(([x, y]) => `${x},${y}`).join(" ");
  const area =
    `${PAD.left},${PAD.top + innerH} ` +
    pts.map(([x, y]) => `${x},${y}`).join(" ") +
    ` ${PAD.left + innerW},${PAD.top + innerH}`;
  return { pts, line, area };
}

export function FaturamentoMensalChart({ className }: { className?: string }) {
  // índice do mês sob o cursor; null = nenhum
  const [ativo, setAtivo] = useState<number | null>(null);

  const receitas = financeiroMensal.map((m) => m.receita);
  const despesas = financeiroMensal.map((m) => m.despesa);
  const maxVal = Math.max(...receitas) * 1.12;

  const receita = buildPath(receitas, maxVal);
  const despesa = buildPath(despesas, maxVal);

  // linhas de grade horizontais (4 divisões)
  const ticks = Array.from({ length: 5 }, (_, i) => {
    const val = (maxVal / 4) * i;
    const y = PAD.top + innerH - (val / maxVal) * innerH;
    return { y, label: `${Math.round(val / 1000)}k` };
  });

  const stepX = innerW / (receitas.length - 1);

  /*
    Posição da caixa: ao lado do ponto de receita, virando para a esquerda
    quando não couber à direita, e presa dentro da área de plotagem na
    vertical — assim ela nunca escapa do gráfico nos meses de ponta.
  */
  const mes = ativo === null ? null : financeiroMensal[ativo];
  let tip: { x: number; y: number; lucro: number; margem: number } | null = null;
  if (ativo !== null && mes) {
    const [px, py] = receita.pts[ativo];
    const paraEsquerda = px + TIP.gap + TIP.w > W - PAD.right;
    const lucro = mes.receita - mes.despesa;
    tip = {
      x: paraEsquerda ? px - TIP.gap - TIP.w : px + TIP.gap,
      y: Math.min(
        Math.max(py - TIP.h / 2, PAD.top),
        PAD.top + innerH - TIP.h,
      ),
      lucro,
      margem: mes.receita ? Math.round((lucro / mes.receita) * 100) : 0,
    };
  }

  return (
    <Card className={cn("flex flex-col p-6", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <IconChart width={18} height={18} className="text-primary" />
          <h3 className="text-base font-semibold text-ink">
            Faturamento mensal
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Receita
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-danger" />
            Despesa
          </span>
        </div>
      </div>

      {/* o gráfico centraliza na sobra de altura quando o card estica */}
      <div className="mt-4 flex w-full flex-1 items-center overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-[300px] w-full min-w-[520px]"
          role="img"
          aria-label="Gráfico de faturamento mensal: receita e despesa dos últimos 12 meses"
          onMouseLeave={() => setAtivo(null)}
        >
          <defs>
            <linearGradient id="fillReceita" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="hsl(var(--primary))"
                stopOpacity="0.28"
              />
              <stop
                offset="100%"
                stopColor="hsl(var(--primary))"
                stopOpacity="0"
              />
            </linearGradient>
            <filter
              id="sombraTooltip"
              x="-20%"
              y="-20%"
              width="140%"
              height="150%"
            >
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="6"
                floodColor="hsl(var(--shadow))"
                floodOpacity="0.18"
              />
            </filter>
          </defs>

          {/* grade + rótulos do eixo Y */}
          {ticks.map((t, i) => (
            <g key={i}>
              <line
                x1={PAD.left}
                y1={t.y}
                x2={W - PAD.right}
                y2={t.y}
                stroke="hsl(var(--line))"
                strokeWidth={1}
                strokeDasharray={i === 0 ? "0" : "3 4"}
              />
              <text
                x={PAD.left - 10}
                y={t.y + 4}
                textAnchor="end"
                className="fill-muted"
                fontSize={11}
              >
                {t.label}
              </text>
            </g>
          ))}

          {/* guia vertical do mês sob o cursor */}
          {ativo !== null && (
            <line
              x1={receita.pts[ativo][0]}
              y1={PAD.top}
              x2={receita.pts[ativo][0]}
              y2={PAD.top + innerH}
              stroke="hsl(var(--ink))"
              strokeOpacity={0.18}
              strokeWidth={1}
              strokeDasharray="3 4"
              pointerEvents="none"
            />
          )}

          {/* área + linha de receita */}
          <polygon points={receita.area} fill="url(#fillReceita)" />
          <polyline
            points={receita.line}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* linha de despesa */}
          <polyline
            points={despesa.line}
            fill="none"
            stroke="hsl(var(--danger))"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="5 4"
          />

          {/* pontos de receita + rótulos do eixo X */}
          {financeiroMensal.map((m, i) => {
            const [x, y] = receita.pts[i];
            const destacado = ativo === i;
            return (
              <g key={m.mes}>
                <circle
                  cx={x}
                  cy={y}
                  r={destacado ? 5 : 3}
                  fill="hsl(var(--primary))"
                  stroke="hsl(var(--surface))"
                  strokeWidth={destacado ? 2 : 0}
                />
                <text
                  x={x}
                  y={H - 12}
                  textAnchor="middle"
                  className={destacado ? "fill-ink" : "fill-muted"}
                  fontSize={11}
                  fontWeight={destacado ? 600 : 400}
                >
                  {m.mes}
                </text>
              </g>
            );
          })}

          {/* o ponto de despesa só aparece no mês ativo, para não poluir */}
          {ativo !== null && (
            <circle
              cx={despesa.pts[ativo][0]}
              cy={despesa.pts[ativo][1]}
              r={4.5}
              fill="hsl(var(--danger))"
              stroke="hsl(var(--surface))"
              strokeWidth={2}
              pointerEvents="none"
            />
          )}

          {/*
            Faixas de captura do mouse: uma por mês, cobrindo toda a altura da
            plotagem, para o mês responder em qualquer ponto da coluna e não só
            em cima da linha. Ficam depois das linhas para receberem o evento.
          */}
          {financeiroMensal.map((m, i) => {
            const bruta = PAD.left + i * stepX - stepX / 2;
            const inicio = Math.max(PAD.left, bruta);
            const fim = Math.min(PAD.left + innerW, bruta + stepX);
            return (
              <rect
                key={m.mes}
                x={inicio}
                y={PAD.top}
                width={Math.max(0, fim - inicio)}
                height={innerH}
                fill="transparent"
                role="img"
                aria-label={`${m.mes}: receita ${formatBRL(m.receita)}, despesa ${formatBRL(m.despesa)}`}
                onMouseEnter={() => setAtivo(i)}
              />
            );
          })}

          {/* Tooltip — desenhado por último para ficar acima de tudo */}
          {tip && mes && (
            <g pointerEvents="none" filter="url(#sombraTooltip)">
              <rect
                x={tip.x}
                y={tip.y}
                width={TIP.w}
                height={TIP.h}
                rx={12}
                className="fill-surface stroke-line"
                strokeWidth={1}
              />

              {/* cabeçalho: mês e margem do período */}
              <text
                x={tip.x + 12}
                y={tip.y + 21}
                className="fill-ink"
                fontSize={12}
                fontWeight={600}
              >
                {mes.mes}
              </text>
              <text
                x={tip.x + TIP.w - 12}
                y={tip.y + 21}
                textAnchor="end"
                className="fill-muted"
                fontSize={10}
              >
                {tip.margem}% de margem
              </text>

              <circle
                cx={tip.x + 15}
                cy={tip.y + 39}
                r={3.5}
                fill="hsl(var(--primary))"
              />
              <text
                x={tip.x + 25}
                y={tip.y + 43}
                className="fill-muted"
                fontSize={11}
              >
                Receita
              </text>
              <text
                x={tip.x + TIP.w - 12}
                y={tip.y + 43}
                textAnchor="end"
                className="fill-ink"
                fontSize={12}
                fontWeight={600}
              >
                {formatBRL(mes.receita)}
              </text>

              <circle
                cx={tip.x + 15}
                cy={tip.y + 58}
                r={3.5}
                fill="hsl(var(--danger))"
              />
              <text
                x={tip.x + 25}
                y={tip.y + 62}
                className="fill-muted"
                fontSize={11}
              >
                Despesa
              </text>
              <text
                x={tip.x + TIP.w - 12}
                y={tip.y + 62}
                textAnchor="end"
                className="fill-ink"
                fontSize={12}
                fontWeight={600}
              >
                {formatBRL(mes.despesa)}
              </text>

              <line
                x1={tip.x + 12}
                y1={tip.y + 71}
                x2={tip.x + TIP.w - 12}
                y2={tip.y + 71}
                stroke="hsl(var(--line))"
                strokeWidth={1}
              />

              <text
                x={tip.x + 12}
                y={tip.y + 87}
                className="fill-muted"
                fontSize={11}
              >
                Lucro
              </text>
              <text
                x={tip.x + TIP.w - 12}
                y={tip.y + 87}
                textAnchor="end"
                className="fill-success"
                fontSize={12}
                fontWeight={600}
              >
                {formatBRL(tip.lucro)}
              </text>
            </g>
          )}
        </svg>
      </div>
    </Card>
  );
}
