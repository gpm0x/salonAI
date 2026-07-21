import { Card } from "@/components/ui/Card";
import { IconWallet } from "@/components/ui/icons";
import { formasPagamento, formatBRL } from "@/lib/mock-data";

// stroke SVG para cada fatia, na mesma ordem/paleta das classes .cor
const strokes: Record<string, string> = {
  Pix: "hsl(var(--primary))",
  Crédito: "hsl(var(--accent))",
  Débito: "hsl(var(--success))",
  Dinheiro: "hsl(var(--ink) / 0.3)",
};

const R = 52;
const CIRC = 2 * Math.PI * R;

export function FormasPagamento() {
  const total = formasPagamento.reduce((s, f) => s + f.valor, 0);

  let acumulado = 0;
  const segmentos = formasPagamento.map((f) => {
    const fracao = f.valor / total;
    const dash = fracao * CIRC;
    const offset = -acumulado * CIRC;
    acumulado += fracao;
    return { ...f, dash, offset, pct: Math.round(fracao * 100) };
  });

  return (
    <Card className="flex flex-col p-6">
      <div className="flex items-center gap-2">
        <IconWallet width={18} height={18} className="text-primary" />
        <h3 className="text-base font-semibold text-ink">
          Receita por forma de pagamento
        </h3>
      </div>

      <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row">
        <div className="relative shrink-0">
          <svg viewBox="0 0 140 140" className="h-36 w-36 -rotate-90">
            <circle
              cx="70"
              cy="70"
              r={R}
              fill="none"
              stroke="hsl(var(--line))"
              strokeWidth={14}
            />
            {segmentos.map((s) => (
              <circle
                key={s.nome}
                cx="70"
                cy="70"
                r={R}
                fill="none"
                stroke={strokes[s.nome]}
                strokeWidth={14}
                strokeDasharray={`${s.dash} ${CIRC - s.dash}`}
                strokeDashoffset={s.offset}
                strokeLinecap="butt"
              >
                <title>{`${s.nome}: ${formatBRL(s.valor)} (${s.pct}%)`}</title>
              </circle>
            ))}
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <p className="text-[0.65rem] text-muted">Total</p>
              <p className="font-display text-lg text-ink nums">
                {formatBRL(total)}
              </p>
            </div>
          </div>
        </div>

        <ul className="flex-1 space-y-3 self-stretch">
          {segmentos.map((s) => (
            <li key={s.nome} className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${s.cor}`} />
              <span className="flex-1 text-sm text-ink">{s.nome}</span>
              <span className="text-sm font-medium text-ink nums">
                {formatBRL(s.valor)}
              </span>
              <span className="w-9 text-right text-xs text-muted nums">
                {s.pct}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
