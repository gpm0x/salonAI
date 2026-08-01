"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IconCheck, IconArrowRight, IconSparkles } from "@/components/ui/icons";
import { planos, planoAtualId, formatBRL, type Plano } from "@/lib/mock-data";
import { cn } from "@/lib/utils/cn";

export function AbaAssinatura() {
  const [anual, setAnual] = useState(false);
  const [atualId, setAtualId] = useState<Plano["id"]>(planoAtualId);

  const atual = planos.find((p) => p.id === atualId)!;
  const preco = (p: Plano) => (anual ? p.precoAnual : p.precoMensal);
  const ordem = planos.findIndex((p) => p.id === atualId);

  return (
    <div className="space-y-5">
      {/* Plano atual */}
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-ink">
                Plano {atual.nome}
              </h2>
              <Badge tone="success">Ativo</Badge>
            </div>
            <p className="mt-1 text-sm text-muted">
              Renova em 12 de agosto de 2026 · {atual.unidades} ·{" "}
              {atual.profissionais.toLowerCase()}
            </p>
          </div>
          <p className="font-display text-3xl text-ink nums">
            {formatBRL(preco(atual))}
            <span className="text-base text-muted">/mês</span>
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 border-t border-line pt-5">
          <Link href="/configuracoes/assinatura">
            <Button>
              Gerenciar assinatura
              <IconArrowRight width={15} height={15} />
            </Button>
          </Link>
          <Button variant="outline">Ver faturas</Button>
        </div>
      </Card>

      {/* Comparação de planos */}
      <Card className="p-6">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-base font-semibold text-ink">
            Compare os planos
          </h2>
          <p className="mt-1 text-sm text-muted">
            Mude de plano quando quiser. O valor é ajustado proporcionalmente.
          </p>

          {/* Ciclo de cobrança */}
          <div className="mt-5 inline-flex items-center gap-1 rounded-full border border-line bg-bg/50 p-1">
            <button
              onClick={() => setAnual(false)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                !anual
                  ? "bg-primary text-primary-fg shadow-soft"
                  : "text-ink/70 hover:text-ink",
              )}
            >
              Mensal
            </button>
            <button
              onClick={() => setAnual(true)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                anual
                  ? "bg-primary text-primary-fg shadow-soft"
                  : "text-ink/70 hover:text-ink",
              )}
            >
              Anual
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[0.65rem]",
                  anual ? "bg-primary-fg/20" : "bg-success/15 text-success",
                )}
              >
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Cards dos planos */}
        <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {planos.map((p, i) => {
            const ehAtual = p.id === atualId;
            const upgrade = i > ordem;

            return (
              <div
                key={p.id}
                className={cn(
                  "relative flex flex-col rounded-3xl border p-6 transition-colors",
                  ehAtual
                    ? "border-primary bg-primary-soft/30"
                    : p.destaque
                      ? "border-accent/50 bg-surface"
                      : "border-line bg-surface",
                )}
              >
                {/* Selo */}
                {p.destaque && !ehAtual && (
                  <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-accent px-3 py-1 text-[0.7rem] font-semibold text-accent-fg">
                    <IconSparkles width={12} height={12} />
                    Mais popular
                  </span>
                )}
                {ehAtual && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[0.7rem] font-semibold text-primary-fg">
                    Plano atual
                  </span>
                )}

                <div className="mt-2">
                  <h3 className="font-display text-xl text-ink">{p.nome}</h3>
                  <p className="mt-1 min-h-[2.5rem] text-sm text-muted">
                    {p.descricao}
                  </p>
                </div>

                {/* Preço */}
                <div className="mt-4">
                  <p className="font-display text-3xl text-ink nums">
                    {formatBRL(preco(p))}
                    <span className="text-sm text-muted">/mês</span>
                  </p>
                  {anual && (
                    <p className="mt-1 text-xs text-muted nums">
                      {formatBRL(preco(p) * 12)} cobrados por ano
                    </p>
                  )}
                  {!anual && (
                    <p className="mt-1 text-xs text-muted">
                      cobrança mensal, sem fidelidade
                    </p>
                  )}
                </div>

                {/* Limites */}
                <div className="mt-4 space-y-1.5 rounded-2xl bg-bg/50 p-3 text-center text-xs">
                  <p className="font-medium text-ink">{p.unidades}</p>
                  <p className="text-muted">{p.profissionais}</p>
                </div>

                {/* Recursos */}
                <ul className="mt-5 flex-1 space-y-2.5">
                  {p.recursos.map((rec) => (
                    <li key={rec} className="flex items-start gap-2 text-sm">
                      <IconCheck
                        width={15}
                        height={15}
                        className="mt-0.5 shrink-0 text-success"
                      />
                      <span className="text-ink/80">{rec}</span>
                    </li>
                  ))}
                </ul>

                {/* Ação */}
                <div className="mt-6">
                  {ehAtual ? (
                    <Button variant="outline" className="w-full" disabled>
                      Seu plano atual
                    </Button>
                  ) : (
                    <Button
                      variant={p.destaque ? "primary" : "outline"}
                      className="w-full"
                      onClick={() => setAtualId(p.id)}
                    >
                      {upgrade ? "Fazer upgrade" : "Mudar para este plano"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Todos os planos incluem atualizações automáticas e dados criptografados.
          Cancele quando quiser.
        </p>
      </Card>
    </div>
  );
}
