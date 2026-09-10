import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconArrowUp, IconWallet } from "@/components/ui/icons";
import { faturamento, formatBRL } from "@/lib/mock-data";
import { cn } from "@/lib/utils/cn";

const dias = ["S", "T", "Q", "Q", "S", "S", "D"];

// altura da coluna mais alta do mini-gráfico, em px
const ALTURA_MAX = 72;

/*
  Mesmas três faixas do AgendamentosDia — identificação, número e corpo — para
  que os dois cards da visão geral dividam as mesmas linhas do grid pai.
*/
export function FaturamentoCard({ className }: { className?: string }) {
  const max = Math.max(...faturamento.serie);
  const progresso = Math.min(
    100,
    Math.round((faturamento.hoje / faturamento.metaDia) * 100),
  );

  // o que sobra depois da comissão da equipe e do custo dos produtos
  const lucro =
    faturamento.hoje - faturamento.comissoes - faturamento.custoProdutos;
  const margem = Math.round((lucro / faturamento.hoje) * 100);

  return (
    <Card
      className={cn(
        "grid grid-rows-[auto_auto_1fr] gap-y-3 overflow-hidden p-6",
        className,
      )}
    >
      {/* 1 — identificação */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-muted">
          <IconWallet width={17} height={17} />
          <span className="text-sm font-medium">Faturamento hoje</span>
        </div>
        <Badge tone="success">
          <IconArrowUp width={13} height={13} />
          {faturamento.variacaoSemana}%
        </Badge>
      </div>

      {/* 2 — número */}
      <div className="flex flex-wrap items-baseline gap-x-1.5">
        <p className="font-display text-3xl text-ink nums">
          {formatBRL(faturamento.hoje)}
        </p>
        <span className="text-sm text-muted">
          de {formatBRL(faturamento.metaDia)}
        </span>
      </div>

      {/* 3 — meta e série da semana; o gráfico encosta no rodapé do card */}
      <div className="flex flex-col gap-4">
        <div>
          <div className="h-2 overflow-hidden rounded-full bg-primary-soft">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-gold-solid"
              style={{ width: `${progresso}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-muted">
            <span className="font-semibold text-ink nums">{progresso}%</span> da
            meta do dia alcançada
          </p>
        </div>

        {/*
          Faturado não é ganho: o painel abre o caminho do dinheiro até o que
          de fato sobra no caixa depois de pagar a equipe e os produtos.
        */}
        <div className="rounded-2xl bg-primary-soft/60 px-3.5 py-2.5">
          <p className="text-xs text-muted">Lucro estimado do dia</p>
          <div className="flex flex-wrap items-baseline gap-x-2">
            <p className="font-display text-2xl text-ink nums">
              {formatBRL(lucro)}
            </p>
            <span className="text-xs text-muted">
              <span className="font-semibold text-success nums">{margem}%</span>{" "}
              de margem
            </span>
          </div>

          {/* As duas deduções que levam do faturado ao lucro */}
          <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-2">
            <div className="flex items-baseline gap-1.5">
              <dt className="text-xs text-muted">Comissões</dt>
              <dd className="text-xs font-semibold text-ink nums">
                −{formatBRL(faturamento.comissoes)}
              </dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt className="text-xs text-muted">Produtos</dt>
              <dd className="text-xs font-semibold text-ink nums">
                −{formatBRL(faturamento.custoProdutos)}
              </dd>
            </div>
          </dl>
        </div>

        {/* Mini-gráfico semanal — as colunas crescem a partir de uma base comum */}
        <div className="mt-auto grid grid-cols-7 items-end gap-1.5">
          {faturamento.serie.map((valor, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div
                className="w-full rounded-md bg-primary/15 transition-colors hover:bg-primary/30"
                style={{ height: `${Math.round((valor / max) * ALTURA_MAX) + 6}px` }}
                title={formatBRL(valor)}
              />
              <span className="text-[0.65rem] text-muted">{dias[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
