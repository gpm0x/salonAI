import { Card } from "@/components/ui/Card";
import { IconScissors } from "@/components/ui/icons";
import { profissionais, formatBRL } from "@/lib/mock-data";

function iniciais(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export function DesempenhoProfissionais() {
  return (
    <Card className="flex flex-col p-6">
      <div className="flex items-center gap-2">
        <IconScissors width={18} height={18} className="text-primary" />
        <h3 className="text-base font-semibold text-ink">
          Desempenho da equipe
        </h3>
      </div>

      <ul className="mt-4 space-y-4">
        {profissionais.map((p) => (
          <li key={p.nome} className="flex items-center gap-3.5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-xs font-semibold text-primary-fg">
              {iniciais(p.nome)}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-ink">
                  {p.nome}
                </p>
                <span className="shrink-0 text-sm font-semibold text-ink nums">
                  {formatBRL(p.faturamento)}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-primary-soft">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${p.ocupacao}%` }}
                  />
                </div>
                <span className="shrink-0 text-xs text-muted nums">
                  {p.atendimentos} atend.
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
