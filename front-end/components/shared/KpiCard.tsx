import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconArrowUp, IconArrowDown } from "@/components/ui/icons";

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
    <Card className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary-soft text-primary">
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
      <div>
        <p className="text-sm font-medium text-muted">{label}</p>
        <p className="mt-1 font-display text-3xl text-ink nums">{valor}</p>
        <p className="mt-1 text-xs text-muted">{sufixo}</p>
      </div>
    </Card>
  );
}
