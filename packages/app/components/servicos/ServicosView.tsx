"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { KpiCard } from "@/components/shared/KpiCard";
import {
  IconPlus,
  IconSearch,
  IconSparkles,
  IconWallet,
  IconChart,
  IconClock,
  IconEdit,
  IconTrash,
} from "@/components/ui/icons";
import { NovoServicoModal } from "@/components/servicos/NovoServicoModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  servicos as seed,
  calcResumoServicos,
  formatBRL,
  type Servico,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils/cn";

export function ServicosView() {
  const [servicos, setServicos] = useState<Servico[]>(seed);
  const [modalAberto, setModalAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todas");

  const categorias = useMemo(
    () => ["Todas", ...Array.from(new Set(servicos.map((s) => s.categoria)))],
    [servicos],
  );

  const lista = useMemo(() => {
    const t = busca.trim().toLowerCase();
    return servicos
      .filter((s) => categoria === "Todas" || s.categoria === categoria)
      .filter((s) => !t || s.nome.toLowerCase().includes(t) || s.categoria.toLowerCase().includes(t))
      .sort((a, b) => b.realizadosMes - a.realizadosMes);
  }, [busca, categoria, servicos]);

  const r = useMemo(() => calcResumoServicos(servicos), [servicos]);
  const maxReceita = Math.max(
    ...servicos.map((s) => s.preco * s.realizadosMes),
    1,
  );

  const [editando, setEditando] = useState<Servico | null>(null);
  const [excluindo, setExcluindo] = useState<Servico | null>(null);

  // cria ou atualiza conforme o modo do modal
  function salvar(s: Servico) {
    setServicos((atual) =>
      atual.some((x) => x.id === s.id)
        ? atual.map((x) => (x.id === s.id ? s : x))
        : [s, ...atual],
    );
  }

  function abrirNovo() {
    setEditando(null);
    setModalAberto(true);
  }

  function abrirEdicao(s: Servico) {
    setEditando(s);
    setModalAberto(true);
  }

  function confirmarExclusao() {
    if (!excluindo) return;
    setServicos((atual) => atual.filter((x) => x.id !== excluindo.id));
    setExcluindo(null);
  }

  return (
    <div className="mx-auto max-w-7xl animate-fade-up space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Serviços</h1>
          <p className="mt-1 text-sm text-muted">
            Catálogo do salão: preços, duração, comissão e desempenho.
          </p>
        </div>
        <Button size="md" onClick={abrirNovo}>
          <IconPlus width={17} height={17} />
          Novo serviço
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={<IconSparkles width={19} height={19} />}
          label="Serviços no catálogo"
          valor={String(r.total)}
          variacao={9}
          sufixo={`${r.ativos} ativos · ${r.categorias} categorias`}
        />
        <KpiCard
          icon={<IconWallet width={19} height={19} />}
          label="Receita dos serviços"
          valor={formatBRL(r.receita)}
          variacao={16}
          sufixo="no mês"
        />
        <KpiCard
          icon={<IconChart width={19} height={19} />}
          label="Ticket médio"
          valor={formatBRL(r.ticketMedio)}
          variacao={7}
          sufixo="por serviço realizado"
        />
        <KpiCard
          icon={<IconSparkles width={19} height={19} />}
          label="Mais vendido"
          valor={r.maisVendido.nome}
          variacao={12}
          sufixo={`${r.maisVendido.realizadosMes}x no mês`}
        />
      </div>

      {/* Busca + categorias */}
      <Card className="flex flex-col gap-4 p-5">
        <div className="relative w-full lg:max-w-sm">
          <IconSearch
            width={17}
            height={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar serviço…"
            className="h-10 w-full rounded-full border border-line bg-surface pl-10 pr-4 text-sm text-ink placeholder:text-muted/70 focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categorias.map((c) => (
            <button
              key={c}
              onClick={() => setCategoria(c)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                categoria === c
                  ? "bg-primary text-primary-fg shadow-soft"
                  : "border border-line bg-surface text-ink/70 hover:border-primary/40 hover:text-ink",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </Card>

      {/* Tabela de serviços */}
      <Card className="p-6">
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full min-w-[940px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-2 pb-3 font-medium">Serviço</th>
                <th className="px-2 pb-3 font-medium">Categoria</th>
                <th className="px-2 pb-3 text-center font-medium">Duração</th>
                <th className="px-2 pb-3 text-right font-medium">Preço</th>
                <th className="px-2 pb-3 text-center font-medium">Comissão</th>
                <th className="px-2 pb-3 text-center font-medium">No mês</th>
                <th className="px-2 pb-3 font-medium">Receita gerada</th>
                <th className="px-2 pb-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((s) => {
                const receita = s.preco * s.realizadosMes;
                return (
                  <tr
                    key={s.id}
                    className="border-t border-line transition-colors hover:bg-primary-soft/30"
                  >
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-ink">{s.nome}</span>
                        {!s.ativo && <Badge tone="neutral">Inativo</Badge>}
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <Badge tone="primary">{s.categoria}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-2 py-3 text-center text-muted nums">
                      <span className="inline-flex items-center gap-1">
                        <IconClock width={13} height={13} />
                        {s.duracao} min
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-2 py-3 text-right font-semibold text-ink nums">
                      {formatBRL(s.preco)}
                    </td>
                    <td className="px-2 py-3 text-center text-muted nums">
                      {s.comissao}%
                    </td>
                    <td className="px-2 py-3 text-center font-medium text-ink nums">
                      {s.realizadosMes}
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-primary-soft">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                            style={{
                              width: `${Math.round((receita / maxReceita) * 100)}%`,
                            }}
                          />
                        </div>
                        <span className="shrink-0 text-xs font-medium text-ink nums">
                          {formatBRL(receita)}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => abrirEdicao(s)}
                          aria-label={`Editar ${s.nome}`}
                          title="Editar"
                          className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-primary-soft hover:text-primary"
                        >
                          <IconEdit width={16} height={16} />
                        </button>
                        <button
                          onClick={() => setExcluindo(s)}
                          aria-label={`Excluir ${s.nome}`}
                          title="Excluir"
                          className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                        >
                          <IconTrash width={16} height={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {lista.length === 0 && (
            <p className="py-10 text-center text-sm text-muted">
              Nenhum serviço encontrado.
            </p>
          )}
        </div>

        <p className="mt-4 text-xs text-muted">
          Mostrando <span className="font-semibold text-ink">{lista.length}</span>{" "}
          de {servicos.length} serviços
        </p>
      </Card>

      <NovoServicoModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onSalvar={salvar}
        servico={editando}
      />

      <ConfirmDialog
        open={excluindo !== null}
        titulo="Excluir serviço"
        mensagem={`Tem certeza que deseja excluir “${excluindo?.nome}” do catálogo? Agendamentos já feitos não serão afetados.`}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setExcluindo(null)}
      />
    </div>
  );
}
