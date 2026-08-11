import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconArrowUp, IconWallet } from "@/components/ui/icons";
import { formatBRL } from "@/lib/utils/format";

const dias = ["S", "T", "Q", "Q", "S", "S", "D"];

interface Props {
  hoje: number;
  metaDia: number;
  semana: number;
  variacaoSemana: number;
  serie: number[];
}

export function FaturamentoCard({ hoje, metaDia, variacaoSemana, serie }: Props) {
  const max = Math.max(...serie, 1);
  const progresso = metaDia > 0 ? Math.min(100, Math.round((hoje / metaDia) * 100)) : 0;

  return (
    <Card className="flex flex-col justify-between overflow-hidden p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-muted">
            <IconWallet width={17} height={17} />
            <span className="text-sm font-medium">Faturamento hoje</span>
          </div>
          <p className="mt-3 font-display text-4xl text-ink nums">{formatBRL(hoje)}</p>
        </div>
        <Badge tone={variacaoSemana >= 0 ? "success" : "danger"}>
          <IconArrowUp width={13} height={13} />
          {variacaoSemana}%
        </Badge>
      </div>

      {metaDia > 0 && (
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Meta do dia</span>
            <span className="nums">{formatBRL(metaDia)}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-primary-soft">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              style={{ width: `${progresso}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-muted">
            <span className="font-semibold text-ink">{progresso}%</span> da meta alcançada
          </p>
        </div>
      )}

      <div className="mt-6 flex items-end gap-1.5">
        {serie.map((valor, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className="w-full rounded-md bg-primary/15 transition-colors hover:bg-primary/30"
              style={{ height: `${Math.round((valor / max) * 56) + 6}px` }}
              title={formatBRL(valor)}
            />
            <span className="text-[0.65rem] text-muted">{dias[i]}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
