"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconPlus, IconUsers, IconSparkles, IconWallet, IconClock } from "@/components/ui/icons";
import { KpiCard, KpiGrid } from "@/components/shared/KpiCard";
import { ListaClientes } from "@/components/clientes/visualizacao/ListaClientes";
import { NovoClienteModal } from "@/components/clientes/formularios/NovoClienteModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  calcResumoClientes,
  formatBRL,
  DIAS_PARA_RISCO,
  type Cliente,
  type StatusCliente,
} from "@/lib/mock-data";
import {
  useClientes,
  useCriarCliente,
  useAtualizarCliente,
  useRemoverCliente,
} from "@/lib/api/hooks";
import type { ClientItem } from "@/lib/api/types";

/*
  A API devolve os campos opcionais como `null`; a UI foi escrita esperando
  string. Coalescer aqui mantém o mapeamento num ponto só, em vez de espalhar
  `?? ""` por ListaClientes e pelo modal.
*/
function paraCliente(item: ClientItem): Cliente {
  return {
    id: item.id,
    nome: item.nome,
    email: item.email ?? "",
    telefone: item.telefone ?? "",
    status: (item.status as StatusCliente) ?? "ativo",
    dataCadastro: item.dataCadastro,
    ultimaVisita: item.ultimaVisita ?? item.dataCadastro,
    totalVisitas: item.totalVisitas,
    totalGasto: item.totalGasto,
    servicoFavorito: item.servicoFavorito ?? "—",
    profissionalPreferido: item.profissionalPreferido ?? "—",
    aniversario: item.aniversario ?? "",
  };
}

export function ClientesView() {
  const { data: itens, isLoading, isError } = useClientes();
  const criar = useCriarCliente();
  const atualizar = useAtualizarCliente();
  const remover = useRemoverCliente();

  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [excluindo, setExcluindo] = useState<Cliente | null>(null);

  const clientes = useMemo(() => (itens ?? []).map(paraCliente), [itens]);

  // dados reais → o resumo é relativo a hoje, não à data congelada do mock
  const r = useMemo(() => calcResumoClientes(clientes, new Date()), [clientes]);

  // cria ou atualiza, conforme o modal esteja em modo de edição
  function salvar(c: Cliente) {
    const payload = {
      nome: c.nome,
      email: c.email || undefined,
      telefone: c.telefone || undefined,
      aniversario: c.aniversario || undefined,
    };

    if (clientes.some((x) => x.id === c.id)) {
      atualizar.mutate({ id: c.id, ...payload, status: c.status });
    } else {
      criar.mutate(payload);
    }
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
    remover.mutate(excluindo.id);
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
      <KpiGrid>
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
        {/*
          Antes aqui morava "taxa de retorno" — uma porcentagem que só dizia
          quantos cadastros não estavam marcados como inativos, e que nenhuma
          decisão seguia. Este número é uma fila de contatos: quem passou de
          DIAS_PARA_RISCO sem aparecer e quanto essa turma já deixou no caixa.
        */}
        <KpiCard
          icon={<IconClock width={19} height={19} />}
          label="Clientes em risco"
          valor={String(r.emRisco)}
          variacao={-18}
          quedaBoa
          sufixo={`${DIAS_PARA_RISCO}+ dias sem voltar · ${formatBRL(r.valorEmRisco)} em histórico`}
        />
        <KpiCard
          icon={<IconWallet width={19} height={19} />}
          label="Ticket médio"
          valor={formatBRL(r.ticketMedio)}
          variacao={6}
          sufixo="por visita"
        />
      </KpiGrid>

      {/* Lista */}
      {isLoading ? (
        <p className="py-12 text-center text-sm text-muted">
          Carregando clientes…
        </p>
      ) : isError ? (
        <p className="py-12 text-center text-sm text-danger">
          Não foi possível carregar os clientes. Verifique se a API está no ar
          em {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333"}.
        </p>
      ) : (
        <ListaClientes
          clientes={clientes}
          onEditar={abrirEdicao}
          onExcluir={setExcluindo}
        />
      )}

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
