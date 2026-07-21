import { Card } from "@/components/ui/Card";
import { IconChart } from "@/components/ui/icons";
import { financeiroMensal, formatBRL } from "@/lib/mock-data";

// dimensões internas do SVG (escala com o container via viewBox)
const W = 760;
const H = 300;
const PAD = { top: 24, right: 16, bottom: 34, left: 56 };
const innerW = W - PAD.left - PAD.right;
const innerH = H - PAD.top - PAD.bottom;

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

export function FaturamentoMensalChart() {
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

  return (
    <Card className="p-6">
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

      <div className="mt-4 w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-[300px] w-full min-w-[520px]"
          role="img"
          aria-label="Gráfico de faturamento mensal: receita e despesa dos últimos 12 meses"
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
            return (
              <g key={m.mes}>
                <circle cx={x} cy={y} r={3} fill="hsl(var(--primary))" />
                <text
                  x={PAD.left + i * stepX}
                  y={H - 12}
                  textAnchor="middle"
                  className="fill-muted"
                  fontSize={11}
                >
                  {m.mes}
                </text>
                {/* faixa transparente com tooltip nativo */}
                <rect
                  x={PAD.left + i * stepX - stepX / 2}
                  y={PAD.top}
                  width={stepX}
                  height={innerH}
                  fill="transparent"
                >
                  <title>{`${m.mes} — Receita ${formatBRL(m.receita)} · Despesa ${formatBRL(m.despesa)}`}</title>
                </rect>
              </g>
            );
          })}
        </svg>
      </div>
    </Card>
  );
}
