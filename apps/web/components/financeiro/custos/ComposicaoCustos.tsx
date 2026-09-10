import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconWallet } from "@/components/ui/icons";
import { custosMes, resumoFinanceiro, formatBRL } from "@/lib/mock-data";

/*
  Para onde o dinheiro vai. O resto da tela olha só a entrada; sem a saída
  decomposta, a margem do KPI é um número sem causa — aqui dá para ver qual
  linha mexer se ela cair.
*/
export function ComposicaoCustos() {
  const total = custosMes.reduce((s, c) => s + c.valor, 0);
  const fixos = custosMes
    .filter((c) => c.tipo === "fixo")
    .reduce((s, c) => s + c.valor, 0);

  // quanto do faturamento o custo come — é o complemento da margem
  const pctReceita = Math.round((total / resumoFinanceiro.receita) * 100);

  return (
    <Card className="flex flex-col p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <IconWallet width={18} height={18} className="text-primary" />
          <h3 className="text-base font-semibold text-ink">
            Para onde vai o dinheiro
          </h3>
        </div>
        <Badge>
          {pctReceita}% da receita
        </Badge>
      </div>

      <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
        <p className="font-display text-2xl text-ink nums">
          {formatBRL(total)}
        </p>
        <span className="text-xs text-muted">
          em custos no mês · {formatBRL(fixos)} são fixos
        </span>
      </div>

      {/* Uma barra empilhada dá a proporção antes de qualquer leitura de número */}
      <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-primary-soft">
        {custosMes.map((c) => (
          <div
            key={c.nome}
            className={c.cor}
            style={{ width: `${(c.valor / total) * 100}%` }}
            title={`${c.nome}: ${formatBRL(c.valor)}`}
          />
        ))}
      </div>

      <ul className="mt-4 flex flex-1 flex-col justify-between gap-3">
        {custosMes.map((c) => (
          <li key={c.nome} className="flex items-center gap-2.5">
            <span className={`h-2 w-2 shrink-0 rounded-full ${c.cor}`} />
            <span className="truncate text-sm text-ink/80">{c.nome}</span>
            <span className="shrink-0 text-xs text-muted">{c.tipo}</span>
            <span className="ml-auto shrink-0 text-sm font-semibold text-ink nums">
              {formatBRL(c.valor)}
            </span>
            <span className="w-9 shrink-0 text-right text-xs text-muted nums">
              {Math.round((c.valor / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
