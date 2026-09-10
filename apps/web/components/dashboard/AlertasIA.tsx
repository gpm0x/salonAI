import { Card } from "@/components/ui/Card";
import { IconSparkles } from "@/components/ui/icons";
import { alertas, type AlertaIA } from "@/lib/mock-data";
import { cn } from "@/lib/utils/cn";

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

export function AlertasIA({ className }: { className?: string }) {
  return (
    <Card
      className={cn("relative flex flex-col overflow-hidden p-6", className)}
    >
      {/* brilho decorativo */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold-solid/15 blur-3xl" />

      <div className="flex items-start gap-2">
        {/* A IA é a marca dourada do produto */}
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gold-solid text-gold-fg shadow-gilt">
          <IconSparkles width={17} height={17} />
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-ink">Alertas da IA</h3>
          <p className="text-xs text-muted">
            Sugestões geradas a partir do seu movimento
          </p>
        </div>
      </div>

      <ul className="mt-5 flex flex-1 flex-col justify-between gap-4">
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
