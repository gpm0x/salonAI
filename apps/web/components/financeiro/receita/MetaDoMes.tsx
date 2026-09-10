import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconArrowDown, IconArrowUp, IconGauge } from "@/components/ui/icons";
import { metaMes, resumoFinanceiro, formatBRL } from "@/lib/mock-data";

// arredonda para a centena mais próxima — projeção com unidade finge precisão
const centena = (v: number) => Math.round(v / 100) * 100;

/*
  A página mostra o que já entrou; este card mostra se o mês fecha onde
  deveria. A projeção extrapola a receita até aqui pelo total de dias úteis,
  então ela responde "no ritmo de hoje, dá?" — não é previsão de modelo.
*/
export function MetaDoMes() {
  const { receita } = resumoFinanceiro;
  const falta = Math.max(0, metaMes.valor - receita);
  const progresso = Math.min(100, Math.round((receita / metaMes.valor) * 100));

  const diasRestantes = metaMes.diasUteis - metaMes.diasCorridos;
  const projecao = centena((receita / metaMes.diasCorridos) * metaMes.diasUteis);
  const projecaoPct = Math.round((projecao / metaMes.valor) * 100);
  const bate = projecao >= metaMes.valor;

  // ritmo até aqui × ritmo necessário no que sobrou
  const mediaAtual = centena(receita / metaMes.diasCorridos);
  const precisaPorDia = diasRestantes ? centena(falta / diasRestantes) : 0;

  // onde a receita deveria estar a esta altura do mês
  const marcaRitmo = Math.round(
    (metaMes.diasCorridos / metaMes.diasUteis) * 100,
  );

  return (
    <Card className="flex flex-col p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <IconGauge width={18} height={18} className="text-primary" />
          <h3 className="text-base font-semibold text-ink">Meta do mês</h3>
        </div>
        <Badge tone={bate ? "success" : "danger"}>
          {bate ? (
            <IconArrowUp width={13} height={13} />
          ) : (
            <IconArrowDown width={13} height={13} />
          )}
          {bate ? "Projeção bate a meta" : "Projeção abaixo da meta"}
        </Badge>
      </div>

      <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
        <p className="font-display text-2xl text-ink nums">
          {formatBRL(falta)}
        </p>
        <span className="text-xs text-muted">
          para fechar {formatBRL(metaMes.valor)}
        </span>
      </div>

      {/* A marca vertical é a fatia do mês já percorrida: barra à direita dela
          significa receita adiantada em relação ao calendário. */}
      <div className="relative mt-4 h-2.5 rounded-full bg-primary-soft">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-gold-solid"
          style={{ width: `${progresso}%` }}
        />
        <span
          className="absolute -top-1 w-0.5 -translate-x-1/2 rounded-full bg-ink/40"
          style={{ left: `${marcaRitmo}%`, height: "1.125rem" }}
          title={`${metaMes.diasCorridos} de ${metaMes.diasUteis} dias úteis`}
        />
      </div>

      <p className="mt-2 text-xs text-muted">
        <span className="font-semibold text-ink nums">{progresso}%</span> da meta
        com <span className="nums">{metaMes.diasCorridos}</span> de{" "}
        <span className="nums">{metaMes.diasUteis}</span> dias úteis corridos
      </p>

      <dl className="mt-auto grid grid-cols-2 gap-3 pt-5">
        <div className="rounded-2xl bg-primary-soft/60 px-3.5 py-2.5">
          <dt className="text-xs text-muted">Média por dia útil</dt>
          <dd className="text-sm font-semibold text-ink nums">
            {formatBRL(mediaAtual)}
          </dd>
        </div>
        <div className="rounded-2xl bg-primary-soft/60 px-3.5 py-2.5">
          <dt className="text-xs text-muted">
            Precisa nos {diasRestantes} dias restantes
          </dt>
          <dd className="text-sm font-semibold text-ink nums">
            {formatBRL(precisaPorDia)}/dia
          </dd>
        </div>
      </dl>

      <p className="mt-3 text-xs text-muted">
        Projeção de fechamento:{" "}
        <span className="font-semibold text-ink nums">
          {formatBRL(projecao)}
        </span>{" "}
        <span className="nums">({projecaoPct}% da meta)</span>
      </p>
    </Card>
  );
}
