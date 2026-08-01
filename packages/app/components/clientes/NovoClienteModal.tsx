"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Cliente, StatusCliente } from "@/lib/mock-data";

interface NovoClienteModalProps {
  open: boolean;
  onClose: () => void;
  onSalvar: (cliente: Cliente) => void;
  // quando presente, o modal funciona em modo de edição
  cliente?: Cliente | null;
}

const profissionaisConhecidos = [
  "Rafael Souza",
  "Camila Prado",
  "Diego Martins",
];

const statusOpcoes: { valor: StatusCliente; label: string }[] = [
  { valor: "novo", label: "Novo" },
  { valor: "ativo", label: "Ativo" },
  { valor: "vip", label: "VIP" },
  { valor: "inativo", label: "Inativo" },
];

const vazio = {
  nome: "",
  email: "",
  telefone: "",
  status: "novo" as StatusCliente,
  servicoFavorito: "",
  profissionalPreferido: "",
  aniversario: "",
};

const hojeISO = "2026-07-18";

export function NovoClienteModal({
  open,
  onClose,
  onSalvar,
  cliente = null,
}: NovoClienteModalProps) {
  const [form, setForm] = useState(vazio);
  const [erros, setErros] = useState<Record<string, string>>({});
  const editando = cliente !== null;

  // preenche o formulário ao abrir em modo de edição
  useEffect(() => {
    if (!open) return;
    setErros({});
    setForm(
      cliente
        ? {
            nome: cliente.nome,
            email: cliente.email === "—" ? "" : cliente.email,
            telefone: cliente.telefone,
            status: cliente.status,
            servicoFavorito:
              cliente.servicoFavorito === "—" ? "" : cliente.servicoFavorito,
            profissionalPreferido:
              cliente.profissionalPreferido === "—"
                ? ""
                : cliente.profissionalPreferido,
            aniversario: cliente.aniversario,
          }
        : vazio,
    );
  }, [open, cliente]);

  function set<K extends keyof typeof vazio>(campo: K, valor: (typeof vazio)[K]) {
    setForm((f) => ({ ...f, [campo]: valor }));
    if (erros[campo]) setErros((e) => ({ ...e, [campo]: "" }));
  }

  function validar() {
    const e: Record<string, string> = {};
    if (!form.nome.trim()) e.nome = "Informe o nome do cliente.";
    if (!form.telefone.trim()) e.telefone = "Informe um telefone de contato.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "E-mail inválido.";
    setErros(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!validar()) return;

    const novo: Cliente = {
      // ao editar, preserva id e todo o histórico do cliente
      id: cliente?.id ?? `c-${Date.now()}`,
      nome: form.nome.trim(),
      email: form.email.trim() || "—",
      telefone: form.telefone.trim(),
      status: form.status,
      dataCadastro: cliente?.dataCadastro ?? hojeISO,
      ultimaVisita: cliente?.ultimaVisita ?? hojeISO,
      totalVisitas: cliente?.totalVisitas ?? 0,
      totalGasto: cliente?.totalGasto ?? 0,
      servicoFavorito: form.servicoFavorito.trim() || "—",
      profissionalPreferido: form.profissionalPreferido || "—",
      aniversario: form.aniversario || "01-01",
    };

    onSalvar(novo);
    setForm(vazio);
    setErros({});
    onClose();
  }

  function fechar() {
    setForm(vazio);
    setErros({});
    onClose();
  }

  const labelCls =
    "text-xs font-medium uppercase tracking-wide text-muted";
  const selectCls =
    "h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-sm text-ink focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10";

  return (
    <Modal
      open={open}
      onClose={fechar}
      title={editando ? "Editar cliente" : "Novo cliente"}
      description={
        editando
          ? "Altere os dados do cliente. O histórico de visitas é preservado."
          : "Cadastre um cliente manualmente. Depois isso também será automático."
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Nome completo *"
            name="nome"
            placeholder="Ex.: Ana Beatriz Souza"
            value={form.nome}
            onChange={(e) => set("nome", e.target.value)}
            autoFocus
          />
          {erros.nome && (
            <p className="mt-1 text-xs text-danger">{erros.nome}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Input
              label="Telefone *"
              name="telefone"
              placeholder="(11) 90000-0000"
              value={form.telefone}
              onChange={(e) => set("telefone", e.target.value)}
            />
            {erros.telefone && (
              <p className="mt-1 text-xs text-danger">{erros.telefone}</p>
            )}
          </div>
          <div>
            <Input
              label="E-mail"
              name="email"
              type="email"
              placeholder="cliente@email.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
            {erros.email && (
              <p className="mt-1 text-xs text-danger">{erros.email}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="status" className={labelCls}>
              Status
            </label>
            <select
              id="status"
              className={selectCls}
              value={form.status}
              onChange={(e) => set("status", e.target.value as StatusCliente)}
            >
              {statusOpcoes.map((s) => (
                <option key={s.valor} value={s.valor}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Aniversário"
            name="aniversario"
            type="text"
            placeholder="MM-DD (ex.: 03-11)"
            value={form.aniversario}
            onChange={(e) => set("aniversario", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Serviço favorito"
            name="servicoFavorito"
            placeholder="Ex.: Corte, Coloração…"
            value={form.servicoFavorito}
            onChange={(e) => set("servicoFavorito", e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="profissional" className={labelCls}>
              Profissional preferido
            </label>
            <select
              id="profissional"
              className={selectCls}
              value={form.profissionalPreferido}
              onChange={(e) => set("profissionalPreferido", e.target.value)}
            >
              <option value="">Sem preferência</option>
              {profissionaisConhecidos.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={fechar}>
            Cancelar
          </Button>
          <Button type="submit">
            {editando ? "Salvar alterações" : "Cadastrar cliente"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
