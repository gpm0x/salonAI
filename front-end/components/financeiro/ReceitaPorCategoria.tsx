import { Card } from "@/components/ui/Card";
import { IconScissors } from "@/components/ui/icons";
import { receitaPorCategoria, formatBRL } from "@/lib/mock-data";

export function ReceitaPorCategoria() {
  const total = receitaPorCategoria.reduce((s, c) => s + c.valor, 0);
  const max = Math.max(...receitaPorCategoria.map((c) => c.valor));

  return (
    <Card className="flex flex-col p-6">
      <div className="flex items-center gap-2">
        <IconScissors width={18} height={18} className="text-primary" />
        <h3 className="text-base font-semibold text-ink">
          Receita por serviço
        </h3>
      </div>

      <ul className="mt-5 space-y-4">
        {receitaPorCategoria.map((c) => {
          const pct = Math.round((c.valor / total) * 100);
          return (
            <li key={c.nome}>
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium text-ink">
                  {c.nome}
                </span>
                <span className="shrink-0 text-sm font-semibold text-ink nums">
                  {formatBRL(c.valor)}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-2.5">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-primary-soft">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${Math.round((c.valor / max) * 100)}%` }}
                  />
                </div>
                <span className="w-24 shrink-0 text-right text-xs text-muted nums">
                  {c.atendimentos} atend. · {pct}%
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
