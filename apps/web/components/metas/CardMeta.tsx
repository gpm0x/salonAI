import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconEdit, IconTrash, IconUser, IconStore } from "@/components/ui/icons";
import {
  calcMeta,
  statusMetaMeta,
  tipoMetaMeta,
  periodoMetaMeta,
  RESPONSAVEL_SALAO,
  type Meta,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils/cn";

interface Props {
  meta: Meta;
  onEditar: (m: Meta) => void;
  onExcluir: (m: Meta) => void;
}

// a barra usa a cor do status para que a leitura funcione sem ler o texto
const barras: Record<ReturnType<typeof calcMeta>["status"], string> = {
  batida: "bg-success",
  no_ritmo: "bg-primary",
  atencao: "bg-gradient-to-r from-accent to-gold-solid",
  atrasada: "bg-danger",
};

/*
  Um card por meta.

  O número grande é o realizado; o que decide se está bom é a marca vertical na
  barra — a fatia do período já percorrida. Barra à esquerda dela significa
  atrasado, à direita significa adiantado. O rodapé traduz o que falta em ritmo
  necessário e projeta o fechamento mantendo o ritmo atual.
*/
export function CardMeta({ meta, onEditar, onExcluir }: Props) {
  const c = calcMeta(meta);
  const t = tipoMetaMeta[meta.tipo];
  const status = statusMetaMeta[c.status];
  const doSalao = meta.responsavel === RESPONSAVEL_SALAO;

  return (
    <Card
      className={cn(
        "group flex flex-col p-6 transition-shadow hover:shadow-card",
        !meta.ativa && "opacity-60",
      )}
    >
      {/* Identificação */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-ink">
            {meta.titulo}
          </h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-xs text-muted">
            <span>{t.label}</span>
            <span aria-hidden>·</span>
            <span>{periodoMetaMeta[meta.periodo].label}</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Badge tone={meta.ativa ? status.tone : "neutral"}>
            {meta.ativa ? status.label : "Pausada"}
          </Badge>
        </div>
      </div>

      {/* Realizado × alvo */}
      <div className="mt-4 flex flex-wrap items-baseline gap-x-2">
        <p className="font-display text-3xl text-ink nums">
          {t.formatar(meta.atual)}
        </p>
        <span className="text-sm text-muted nums">de {t.formatar(meta.alvo)}</span>
      </div>

      {/* Barra + marca do ritmo esperado a esta altura do período */}
      <div className="relative mt-4 h-2.5 rounded-full bg-primary-soft">
        <div
          className={cn("h-full rounded-full transition-all", barras[c.status])}
          style={{ width: `${c.barraPct}%` }}
        />
        <span
          className="absolute -top-1 w-0.5 -translate-x-1/2 rounded-full bg-ink/40"
          style={{ left: `${c.ritmoPct}%`, height: "1.125rem" }}
          title={`Esperado a esta altura: ${t.formatar(c.esperado)}`}
        />
      </div>

      <p className="mt-2 text-xs text-muted">
        <span className="font-semibold text-ink nums">{c.progressoPct}%</span> da
        meta ·{" "}
        {c.status === "batida" ? (
          <span className="text-success">meta batida</span>
        ) : (
          <>
            <span className="nums">{t.formatar(Math.abs(c.diferenca))}</span>{" "}
            {c.diferenca >= 0 ? "acima" : "abaixo"} do esperado com{" "}
            <span className="nums">{c.ritmoPct}%</span> do período corrido
          </>
        )}
      </p>

      {/* O que falta e onde isso fecha */}
      <dl className="mt-auto grid grid-cols-2 gap-3 pt-5">
        <div className="rounded-2xl bg-primary-soft/60 px-3.5 py-2.5">
          <dt className="text-xs text-muted">Falta</dt>
          <dd className="text-sm font-semibold text-ink nums">
            {c.falta > 0 ? t.formatar(c.falta) : "—"}
          </dd>
        </div>
        <div className="rounded-2xl bg-primary-soft/60 px-3.5 py-2.5">
          <dt className="text-xs text-muted">Projeção de fechamento</dt>
          <dd className="text-sm font-semibold text-ink nums">
            {t.formatar(c.projecao)}{" "}
            <span className="font-normal text-muted">({c.projecaoPct}%)</span>
          </dd>
        </div>
      </dl>

      {meta.observacao && (
        <p className="mt-3 text-xs leading-relaxed text-muted">
          {meta.observacao}
        </p>
      )}

      {/* Responsável + ações */}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
        <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted">
          {doSalao ? (
            <IconStore width={14} height={14} />
          ) : (
            <IconUser width={14} height={14} />
          )}
          <span className="truncate">{meta.responsavel}</span>
        </span>
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => onEditar(meta)}
            aria-label={`Editar ${meta.titulo}`}
            title="Editar"
            className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-primary-soft hover:text-primary"
          >
            <IconEdit width={16} height={16} />
          </button>
          <button
            onClick={() => onExcluir(meta)}
            aria-label={`Excluir ${meta.titulo}`}
            title="Excluir"
            className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-danger/10 hover:text-danger"
          >
            <IconTrash width={16} height={16} />
          </button>
        </div>
      </div>
    </Card>
  );
}
