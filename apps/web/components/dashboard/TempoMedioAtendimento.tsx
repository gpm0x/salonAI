import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconArrowDown, IconClock } from "@/components/ui/icons";
import { tempoMedio } from "@/lib/mock-data";

export function TempoMedioAtendimento() {
  const maxServico = Math.max(...tempoMedio.porServico.map((s) => s.minutos));

  return (
    <Card className="flex flex-col p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted">
          <IconClock width={17} height={17} />
          <span className="text-sm font-medium">Tempo médio</span>
        </div>
        <Badge tone="success">
          <IconArrowDown width={13} height={13} />
          {Math.abs(tempoMedio.variacao)}%
        </Badge>
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <p className="font-display text-4xl text-ink nums">
          {tempoMedio.minutos}
        </p>
        <span className="text-sm text-muted">min / atendimento</span>
      </div>

      <div className="mt-5 space-y-3">
        {tempoMedio.porServico.map((s) => (
          <div key={s.nome}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink/80">{s.nome}</span>
              <span className="text-muted nums">{s.minutos} min</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-primary-soft">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${(s.minutos / maxServico) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
