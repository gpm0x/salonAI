"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconSearch, IconEdit, IconTrash } from "@/components/ui/icons";
import {
  formatBRL,
  type Cliente,
  type StatusCliente,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils/cn";

const statusMeta: Record<
  StatusCliente,
  { label: string; tone: "accent" | "success" | "primary" | "neutral" }
> = {
  vip: { label: "VIP", tone: "accent" },
  ativo: { label: "Ativo", tone: "success" },
  novo: { label: "Novo", tone: "primary" },
  inativo: { label: "Inativo", tone: "neutral" },
};

const filtros: { chave: "todos" | StatusCliente; label: string }[] = [
  { chave: "todos", label: "Todos" },
  { chave: "vip", label: "VIP" },
  { chave: "ativo", label: "Ativos" },
  { chave: "novo", label: "Novos" },
  { chave: "inativo", label: "Inativos" },
];

function iniciais(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function formatData(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface ListaClientesProps {
  clientes: Cliente[];
  onEditar: (c: Cliente) => void;
  onExcluir: (c: Cliente) => void;
}

export function ListaClientes({
  clientes,
  onEditar,
  onExcluir,
}: ListaClientesProps) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<"todos" | StatusCliente>("todos");

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return clientes.filter((c) => {
      const casaFiltro = filtro === "todos" || c.status === filtro;
      const casaBusca =
        termo === "" ||
        c.nome.toLowerCase().includes(termo) ||
        c.email.toLowerCase().includes(termo) ||
        c.telefone.includes(termo);
      return casaFiltro && casaBusca;
    });
  }, [busca, filtro, clientes]);

  return (
    <Card className="flex flex-col p-6">
      {/* Busca + filtros */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <IconSearch
            width={17}
            height={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, e-mail ou telefone…"
            className="h-10 w-full rounded-full border border-line bg-surface pl-10 pr-4 text-sm text-ink placeholder:text-muted/70 focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filtros.map((f) => (
            <button
              key={f.chave}
              onClick={() => setFiltro(f.chave)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                filtro === f.chave
                  ? "bg-primary text-primary-fg shadow-soft"
                  : "border border-line bg-surface text-ink/70 hover:border-primary/40 hover:text-ink",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div className="mt-5 -mx-2 overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-2 pb-3 font-medium">Cliente</th>
              <th className="px-2 pb-3 font-medium">Contato</th>
              <th className="px-2 pb-3 font-medium">Última visita</th>
              <th className="px-2 pb-3 text-center font-medium">Visitas</th>
              <th className="px-2 pb-3 text-right font-medium">Total gasto</th>
              <th className="px-2 pb-3 font-medium">Serviço favorito</th>
              <th className="px-2 pb-3 font-medium">Status</th>
              <th className="px-2 pb-3 text-right font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((c: Cliente) => (
              <tr
                key={c.id}
                className="border-t border-line transition-colors hover:bg-primary-soft/30"
              >
                <td className="px-2 py-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-xs font-semibold text-primary-fg">
                      {iniciais(c.nome)}
                    </span>
                    <span className="font-medium text-ink">{c.nome}</span>
                  </div>
                </td>
                <td className="px-2 py-3 text-muted">
                  <span className="block text-ink/80">{c.telefone}</span>
                  <span className="block text-xs text-muted/80">{c.email}</span>
                </td>
                <td className="whitespace-nowrap px-2 py-3 text-muted nums">
                  {formatData(c.ultimaVisita)}
                </td>
                <td className="px-2 py-3 text-center font-medium text-ink nums">
                  {c.totalVisitas}
                </td>
                <td className="whitespace-nowrap px-2 py-3 text-right font-semibold text-ink nums">
                  {formatBRL(c.totalGasto)}
                </td>
                <td className="px-2 py-3 text-muted">
                  {c.servicoFavorito}
                  <span className="block text-xs text-muted/70">
                    {c.profissionalPreferido}
                  </span>
                </td>
                <td className="px-2 py-3">
                  <Badge tone={statusMeta[c.status].tone}>
                    {statusMeta[c.status].label}
                  </Badge>
                </td>
                <td className="px-2 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEditar(c)}
                      aria-label={`Editar ${c.nome}`}
                      title="Editar"
                      className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-primary-soft hover:text-primary"
                    >
                      <IconEdit width={16} height={16} />
                    </button>
                    <button
                      onClick={() => onExcluir(c)}
                      aria-label={`Excluir ${c.nome}`}
                      title="Excluir"
                      className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                    >
                      <IconTrash width={16} height={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {lista.length === 0 && (
          <p className="py-10 text-center text-sm text-muted">
            Nenhum cliente encontrado com esses filtros.
          </p>
        )}
      </div>

      <p className="mt-4 text-xs text-muted">
        Mostrando{" "}
        <span className="font-semibold text-ink">{lista.length}</span> de{" "}
        {clientes.length} clientes
      </p>
    </Card>
  );
}
