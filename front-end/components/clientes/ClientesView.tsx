"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconPlus, IconUsers, IconSparkles, IconWallet } from "@/components/ui/icons";
import { KpiCard } from "@/components/shared/KpiCard";
import { ListaClientes } from "@/components/clientes/ListaClientes";
import { NovoClienteModal } from "@/components/clientes/NovoClienteModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  clientes as seed,
  calcResumoClientes,
  formatBRL,
  type Cliente,
} from "@/lib/mock-data";

export function ClientesView() {
  const [clientes, setClientes] = useState<Cliente[]>(seed);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [excluindo, setExcluindo] = useState<Cliente | null>(null);

  const r = useMemo(() => calcResumoClientes(clientes), [clientes]);

  // cria ou atualiza, conforme o modal esteja em modo de edição
  function salvar(c: Cliente) {
    setClientes((atual) =>
      atual.some((x) => x.id === c.id)
        ? atual.map((x) => (x.id === c.id ? c : x))
        : [c, ...atual],
    );
  }

  function abrirNovo() {
    setEditando(null);
    setModalAberto(true);
  }

  function abrirEdicao(c: Cliente) {
    setEditando(c);
    setModalAberto(true);
  }

  function confirmarExclusao() {
    if (!excluindo) return;
    setClientes((atual) => atual.filter((x) => x.id !== excluindo.id));
    setExcluindo(null);
  }

  return (
    <div className="mx-auto max-w-7xl animate-fade-up space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Clientes</h1>
          <p className="mt-1 text-sm text-muted">
            Todos os clientes cadastrados no salão, com histórico e status.
          </p>
        </div>
        <Button size="md" onClick={abrirNovo}>
          <IconPlus width={17} height={17} />
          Novo cliente
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={<IconUsers width={19} height={19} />}
          label="Total de clientes"
          valor={String(r.total)}
          variacao={12}
          sufixo="na base do salão"
        />
        <KpiCard
          icon={<IconSparkles width={19} height={19} />}
          label="Novos no mês"
          valor={String(r.novosMes)}
          variacao={25}
        />
        <KpiCard
          icon={<IconUsers width={19} height={19} />}
          label="Taxa de retorno"
          valor={`${r.taxaRetorno}%`}
          variacao={4}
          sufixo={`${r.ativos} clientes ativos`}
        />
        <KpiCard
          icon={<IconWallet width={19} height={19} />}
          label="Ticket médio"
          valor={formatBRL(r.ticketMedio)}
          variacao={6}
          sufixo="por visita"
        />
      </div>

      {/* Lista */}
      <ListaClientes
        clientes={clientes}
        onEditar={abrirEdicao}
        onExcluir={setExcluindo}
      />

      {/* Modal de cadastro / edição */}
      <NovoClienteModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onSalvar={salvar}
        cliente={editando}
      />

      {/* Confirmação de exclusão */}
      <ConfirmDialog
        open={excluindo !== null}
        titulo="Excluir cliente"
        mensagem={`Tem certeza que deseja excluir ${excluindo?.nome}? Todo o histórico de visitas será removido. Essa ação não pode ser desfeita.`}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setExcluindo(null)}
      />
    </div>
  );
}
