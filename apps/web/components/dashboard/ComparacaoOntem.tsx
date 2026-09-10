import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconArrowDown, IconArrowUp, IconChart } from "@/components/ui/icons";
import {
  comparativoOntem,
  formatBRL,
  type MetricaComparada,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils/cn";

function formatValor(m: MetricaComparada, valor: number) {
  return m.formato === "brl" ? formatBRL(valor) : String(valor);
}

function variacao(m: MetricaComparada) {
  return m.ontem ? Math.round(((m.hoje - m.ontem) / m.ontem) * 100) : 0;
}

/*
  Comparação com ontem no mesmo recorte de horário. O número grande é a
  diferença de faturamento — a linha que o dono olha primeiro; os quadros
  abaixo explicam de onde ela vem (mais gente, ticket maior, menos falta).
*/
export function ComparacaoOntem({ className }: { className?: string }) {
  const [principal] = comparativoOntem.metricas;
  const diferenca = principal.hoje - principal.ontem;
  const melhor = diferenca >= 0;

  return (
    <Card
      className={cn("grid grid-rows-[auto_auto_1fr] gap-y-3 p-6", className)}
    >
      {/* 1 — identificação */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-muted">
          <IconChart width={17} height={17} />
          <span className="text-sm font-medium">Comparação com ontem</span>
        </div>
        {/* O recorte é parte do dado: dia em andamento contra dia inteiro não
            compararia nada. */}
        <Badge className="shrink-0">até {comparativoOntem.ate}</Badge>
      </div>

      {/* 2 — número */}
      <div className="flex flex-wrap items-baseline gap-x-1.5">
        <p
          className={cn(
            "font-display text-3xl nums",
            melhor ? "text-success" : "text-danger",
          )}
        >
          {melhor ? "+" : "−"}
          {formatBRL(Math.abs(diferenca))}
        </p>
        <span className="text-sm text-muted">
          {melhor ? "a mais" : "a menos"} que ontem a esta hora
        </span>
      </div>

      {/*
        3 — de onde vem a diferença. Lista em vez de quadros: numa coluna
        estreita, duas linhas por métrica (rótulo + variação, depois hoje ×
        ontem) leem melhor do que caixas espremidas lado a lado.
      */}
      <ul className="flex flex-col justify-between gap-3">
        {comparativoOntem.metricas.map((m) => {
          const v = variacao(m);
          const subiu = v >= 0;
          const positivo = m.quedaBoa ? !subiu : subiu;

          return (
            <li key={m.label} className="border-t border-line pt-2 first:border-0 first:pt-0">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-xs text-muted">{m.label}</span>
                <Badge tone={positivo ? "success" : "danger"}>
                  {subiu ? (
                    <IconArrowUp width={13} height={13} />
                  ) : (
                    <IconArrowDown width={13} height={13} />
                  )}
                  {Math.abs(v)}%
                </Badge>
              </div>
              <div className="mt-0.5 flex items-baseline justify-between gap-2">
                <span className="text-sm font-semibold text-ink nums">
                  {formatValor(m, m.hoje)}
                </span>
                <span className="text-xs text-muted nums">
                  ontem {formatValor(m, m.ontem)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
