"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  clientes,
  servicos,
  equipe,
  formatBRL,
  type AgendamentoAgenda,
} from "@/lib/mock-data";

interface Props {
  open: boolean;
  onClose: () => void;
  onSalvar: (a: AgendamentoAgenda) => void;
}

const vazio = {
  cliente: "",
  servicoId: "",
  profissional: "",
  inicio: "09:00",
};

export function NovoAgendamentoModal({ open, onClose, onSalvar }: Props) {
  const [form, setForm] = useState(vazio);
  const [erros, setErros] = useState<Record<string, string>>({});

  const servicoSel = servicos.find((s) => s.id === form.servicoId);

  function set<K extends keyof typeof vazio>(k: K, v: (typeof vazio)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    if (erros[k]) setErros((e) => ({ ...e, [k]: "" }));
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!form.cliente.trim()) e.cliente = "Informe o cliente.";
    if (!form.servicoId) e.servicoId = "Selecione um serviço.";
    if (!form.profissional) e.profissional = "Selecione um profissional.";
    if (!form.inicio) e.inicio = "Informe o horário.";
    setErros(e);
    if (Object.keys(e).length) return;

    onSalvar({
      id: `a-${Date.now()}`,
      inicio: form.inicio,
      duracao: servicoSel!.duracao,
      cliente: form.cliente.trim(),
      servico: servicoSel!.nome,
      profissional: form.profissional,
      status: "confirmado",
      valor: servicoSel!.preco,
    });

    setForm(vazio);
    setErros({});
    onClose();
  }

  function fechar() {
    setForm(vazio);
    setErros({});
    onClose();
  }

  const labelCls = "text-xs font-medium uppercase tracking-wide text-muted";
  const selectCls =
    "h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-sm text-ink focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10";

  return (
    <Modal
      open={open}
      onClose={fechar}
      title="Novo agendamento"
      description="Agende um horário para um cliente."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Cliente: input com sugestões dos clientes cadastrados */}
        <div>
          <Input
            label="Cliente *"
            name="cliente"
            list="lista-clientes"
            placeholder="Digite ou selecione um cliente"
            value={form.cliente}
            onChange={(e) => set("cliente", e.target.value)}
            autoFocus
          />
          <datalist id="lista-clientes">
            {clientes.map((c) => (
              <option key={c.id} value={c.nome} />
            ))}
          </datalist>
          {erros.cliente && (
            <p className="mt-1 text-xs text-danger">{erros.cliente}</p>
          )}
        </div>

        <div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="servico" className={labelCls}>
              Serviço *
            </label>
            <select
              id="servico"
              className={selectCls}
              value={form.servicoId}
              onChange={(e) => set("servicoId", e.target.value)}
            >
              <option value="">Selecione um serviço</option>
              {servicos
                .filter((s) => s.ativo)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome} — {formatBRL(s.preco)} · {s.duracao} min
                  </option>
                ))}
            </select>
          </div>
          {erros.servicoId && (
            <p className="mt-1 text-xs text-danger">{erros.servicoId}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="profissional" className={labelCls}>
                Profissional *
              </label>
              <select
                id="profissional"
                className={selectCls}
                value={form.profissional}
                onChange={(e) => set("profissional", e.target.value)}
              >
                <option value="">Selecione</option>
                {equipe
                  .filter((p) => p.status === "ativo")
                  .map((p) => (
                    <option key={p.id} value={p.nome}>
                      {p.nome}
                    </option>
                  ))}
              </select>
            </div>
            {erros.profissional && (
              <p className="mt-1 text-xs text-danger">{erros.profissional}</p>
            )}
          </div>

          <div>
            <Input
              label="Horário *"
              name="inicio"
              type="time"
              value={form.inicio}
              onChange={(e) => set("inicio", e.target.value)}
            />
            {erros.inicio && (
              <p className="mt-1 text-xs text-danger">{erros.inicio}</p>
            )}
          </div>
        </div>

        {/* Resumo do serviço escolhido */}
        {servicoSel && (
          <div className="flex items-center justify-between rounded-2xl bg-primary-soft/50 px-4 py-3 text-sm">
            <span className="text-muted">
              Duração: <span className="font-medium text-ink">{servicoSel.duracao} min</span>
            </span>
            <span className="font-semibold text-ink nums">
              {formatBRL(servicoSel.preco)}
            </span>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={fechar}>
            Cancelar
          </Button>
          <Button type="submit">Agendar</Button>
        </div>
      </form>
    </Modal>
  );
}
