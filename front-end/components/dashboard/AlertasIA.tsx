import { Card } from "@/components/ui/Card";
import { IconSparkles } from "@/components/ui/icons";
import { alertas, type AlertaIA } from "@/lib/mock-data";

const tomConfig: Record<
  AlertaIA["tom"],
  { dot: string; ring: string; label: string }
> = {
  risco: { dot: "bg-danger", ring: "bg-danger/10", label: "Atenção" },
  oportunidade: {
    dot: "bg-success",
    ring: "bg-success/10",
    label: "Oportunidade",
  },
  info: { dot: "bg-accent", ring: "bg-accent/10", label: "Insight" },
};

export function AlertasIA() {
  return (
    <Card className="relative flex flex-col overflow-hidden p-6">
      {/* brilho decorativo */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />

      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-accent">
          <IconSparkles width={17} height={17} />
        </span>
        <div>
          <h3 className="text-base font-semibold text-ink">Alertas da IA</h3>
          <p className="text-xs text-muted">
            Sugestões geradas a partir do seu movimento
          </p>
        </div>
      </div>

      <ul className="mt-5 space-y-4">
        {alertas.map((a, i) => {
          const t = tomConfig[a.tom];
          return (
            <li key={i} className="flex gap-3">
              <span
                className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full ${t.ring}`}
              >
                <span className={`h-2 w-2 rounded-full ${t.dot}`} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">{a.titulo}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">
                  {a.descricao}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
