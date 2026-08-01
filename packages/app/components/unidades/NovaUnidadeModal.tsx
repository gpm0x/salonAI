"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import type { Unidade } from "@/lib/mock-data";

interface Props {
  open: boolean;
  onClose: () => void;
  onSalvar: (u: Unidade) => void;
  // quando presente, o modal funciona em modo de edição
  unidade?: Unidade | null;
}

const vazio = {
  nome: "",
  endereco: "",
  cidade: "",
  telefone: "",
  horario: "Seg a Sáb · 09:00 – 19:00",
  profissionais: "0",
  cadeiras: "1",
  ativa: true,
  principal: false,
};

export function NovaUnidadeModal({
  open,
  onClose,
  onSalvar,
  unidade = null,
}: Props) {
  const [form, setForm] = useState(vazio);
  const [erros, setErros] = useState<Record<string, string>>({});
  const editando = unidade !== null;

  useEffect(() => {
    if (!open) return;
    setErros({});
    setForm(
      unidade
        ? {
            nome: unidade.nome,
            endereco: unidade.endereco,
            cidade: unidade.cidade,
            telefone: unidade.telefone,
            horario: unidade.horario,
            profissionais: String(unidade.profissionais),
            cadeiras: String(unidade.cadeiras),
            ativa: unidade.ativa,
            principal: unidade.principal,
          }
        : vazio,
    );
  }, [open, unidade]);

  function set<K extends keyof typeof vazio>(k: K, v: (typeof vazio)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    if (erros[k]) setErros((e) => ({ ...e, [k]: "" }));
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!form.nome.trim()) e.nome = "Informe o nome da unidade.";
    if (!form.endereco.trim()) e.endereco = "Informe o endereço.";
    if (!form.cidade.trim()) e.cidade = "Informe a cidade.";
    if (!form.telefone.trim()) e.telefone = "Informe o telefone.";
    const cadeiras = Number(form.cadeiras);
    if (!cadeiras || cadeiras <= 0) e.cadeiras = "Informe ao menos 1 cadeira.";
    setErros(e);
    if (Object.keys(e).length) return;

    onSalvar({
      // ao editar, preserva id e os números de faturamento/ocupação
      id: unidade?.id ?? `u-${Date.now()}`,
      nome: form.nome.trim(),
      endereco: form.endereco.trim(),
      cidade: form.cidade.trim(),
      telefone: form.telefone.trim(),
      horario: form.horario.trim(),
      profissionais: Number(form.profissionais) || 0,
      cadeiras,
      faturamentoMes: unidade?.faturamentoMes ?? 0,
      faturamentoDia: unidade?.faturamentoDia ?? 0,
      atendimentosDia: unidade?.atendimentosDia ?? 0,
      atendimentosMes: unidade?.atendimentosMes ?? 0,
      ocupacao: unidade?.ocupacao ?? 0,
      ativa: form.ativa,
      principal: form.principal,
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

  return (
    <Modal
      open={open}
      onClose={fechar}
      title={editando ? "Editar unidade" : "Nova unidade"}
      description={
        editando
          ? "Altere os dados da unidade. O faturamento é preservado."
          : "Cadastre uma nova unidade do salão."
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Nome da unidade *"
            name="nome"
            placeholder="Ex.: Studio Jardins"
            value={form.nome}
            onChange={(e) => set("nome", e.target.value)}
            autoFocus
          />
          {erros.nome && <p className="mt-1 text-xs text-danger">{erros.nome}</p>}
        </div>

        <div>
          <Input
            label="Endereço *"
            name="endereco"
            placeholder="Rua, número — bairro"
            value={form.endereco}
            onChange={(e) => set("endereco", e.target.value)}
          />
          {erros.endereco && (
            <p className="mt-1 text-xs text-danger">{erros.endereco}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Input
              label="Cidade / UF *"
              name="cidade"
              placeholder="São Paulo / SP"
              value={form.cidade}
              onChange={(e) => set("cidade", e.target.value)}
            />
            {erros.cidade && (
              <p className="mt-1 text-xs text-danger">{erros.cidade}</p>
            )}
          </div>
          <div>
            <Input
              label="Telefone *"
              name="telefone"
              placeholder="(11) 0000-0000"
              value={form.telefone}
              onChange={(e) => set("telefone", e.target.value)}
            />
            {erros.telefone && (
              <p className="mt-1 text-xs text-danger">{erros.telefone}</p>
            )}
          </div>
        </div>

        <Input
          label="Horário de funcionamento"
          name="horario"
          placeholder="Seg a Sáb · 09:00 – 19:00"
          value={form.horario}
          onChange={(e) => set("horario", e.target.value)}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Profissionais"
            name="profissionais"
            type="number"
            min={0}
            value={form.profissionais}
            onChange={(e) => set("profissionais", e.target.value)}
          />
          <div>
            <Input
              label="Cadeiras / estações *"
              name="cadeiras"
              type="number"
              min={1}
              value={form.cadeiras}
              onChange={(e) => set("cadeiras", e.target.value)}
            />
            {erros.cadeiras && (
              <p className="mt-1 text-xs text-danger">{erros.cadeiras}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-2xl border border-line px-4 py-3">
            <div>
              <p className="text-sm font-medium text-ink">Unidade ativa</p>
              <p className="text-xs text-muted">
                Unidades inativas não recebem agendamentos.
              </p>
            </div>
            <Toggle
              checked={form.ativa}
              onChange={(v) => set("ativa", v)}
              label="Unidade ativa"
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-line px-4 py-3">
            <div>
              <p className="text-sm font-medium text-ink">Definir como matriz</p>
              <p className="text-xs text-muted">
                A matriz é a unidade padrão do sistema.
              </p>
            </div>
            <Toggle
              checked={form.principal}
              onChange={(v) => set("principal", v)}
              label="Definir como matriz"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={fechar}>
            Cancelar
          </Button>
          <Button type="submit">
            {editando ? "Salvar alterações" : "Cadastrar unidade"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
