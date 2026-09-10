import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconArrowUp, IconGauge } from "@/components/ui/icons";
import { ocupacao } from "@/lib/mock-data";

export function TaxaOcupacao() {
  const raio = 52;
  const circ = 2 * Math.PI * raio;
  const preenchido = (ocupacao.taxa / 100) * circ;

  return (
    <Card className="flex flex-col p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted">
          <IconGauge width={17} height={17} />
          <span className="text-sm font-medium">Taxa de ocupação</span>
        </div>
        <Badge tone="success">
          <IconArrowUp width={13} height={13} />
          {ocupacao.variacao}%
        </Badge>
      </div>

      <div className="mt-4 flex flex-1 items-center justify-center">
        <div className="relative grid place-items-center">
          <svg width="140" height="140" className="-rotate-90">
            <circle
              cx="70"
              cy="70"
              r={raio}
              fill="none"
              strokeWidth="12"
              className="stroke-primary-soft"
            />
            <circle
              cx="70"
              cy="70"
              r={raio}
              fill="none"
              strokeWidth="12"
              strokeLinecap="round"
              className="stroke-primary"
              strokeDasharray={circ}
              strokeDashoffset={circ - preenchido}
            />
          </svg>
          <div className="absolute text-center">
            <p className="font-display text-3xl text-ink nums">
              {ocupacao.taxa}%
            </p>
            <p className="text-xs text-muted">ocupado</p>
          </div>
        </div>
      </div>

      <p className="mt-2 text-center text-sm text-muted">
        <span className="font-semibold text-ink nums">
          {ocupacao.cadeirasOcupadas}
        </span>{" "}
        de {ocupacao.cadeirasTotais} cadeiras em uso agora
      </p>
    </Card>
  );
}
