import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconArrowUp, IconArrowDown } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";

/*
  Faixa de KPIs.

  As quatro linhas de um KpiCard (ícone/variação, rótulo, valor e sufixo) são
  trilhas DESTE grid — cada card entra como `subgrid` e empresta as linhas do
  pai em vez de criar as suas. Resultado: um rótulo que quebra em duas linhas
  ("Faturamento consolidado") empurra a linha inteira, e os valores de todos os
  cards continuam apoiados na mesma base. Sem subgrid, cada card resolveria a
  altura sozinho e os números sairiam desalinhados na horizontal.
*/
export function KpiGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface KpiCardProps {
  icon: ReactNode;
  label: string;
  valor: string;
  variacao: number;
  // quando true, uma queda é considerada positiva (ex.: despesas)
  quedaBoa?: boolean;
  sufixo?: string;
}

export function KpiCard({
  icon,
  label,
  valor,
  variacao,
  quedaBoa = false,
  sufixo = "vs. mês anterior",
}: KpiCardProps) {
  const subiu = variacao >= 0;
  const positivo = quedaBoa ? !subiu : subiu;

  return (
    // row-span-4 = as quatro linhas abaixo; gap-y-1 sobrescreve o gap do pai
    // apenas dentro do card (o respiro entre as faixas continua sendo gap-5).
    <Card className="row-span-4 grid grid-rows-subgrid gap-y-1 p-6">
      {/* 1 — ícone e variação, ancorados no topo */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
          {icon}
        </span>
        <Badge tone={positivo ? "success" : "danger"}>
          {subiu ? (
            <IconArrowUp width={13} height={13} />
          ) : (
            <IconArrowDown width={13} height={13} />
          )}
          {Math.abs(variacao)}%
        </Badge>
      </div>

      {/* 2 — rótulo */}
      <p className="text-sm font-medium text-muted">{label}</p>

      {/* 3 — valor (mesma base em toda a faixa, graças ao subgrid) */}
      <p className="font-display text-3xl text-ink nums">{valor}</p>

      {/* 4 — sufixo */}
      <p className="text-xs text-muted">{sufixo}</p>
    </Card>
  );
}
