"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { servicos, formatBRL, type Servico } from "@/lib/mock-data";

interface Props {
  open: boolean;
  onClose: () => void;
  onSalvar: (s: Servico) => void;
  // quando presente, o modal funciona em modo de edição
  servico?: Servico | null;
}

const categoriasExistentes = Array.from(
  new Set(servicos.map((s) => s.categoria)),
);

const vazio = {
  nome: "",
  categoria: categoriasExistentes[0] ?? "",
  novaCategoria: "",
  duracao: "45",
  preco: "",
  comissao: "40",
  ativo: true,
};

export function NovoServicoModal({
  open,
  onClose,
  onSalvar,
  servico = null,
}: Props) {
  const [form, setForm] = useState(vazio);
  const [erros, setErros] = useState<Record<string, string>>({});
  const editando = servico !== null;

  useEffect(() => {
    if (!open) return;
    setErros({});
    setForm(
      servico
        ? {
            nome: servico.nome,
            categoria: servico.categoria,
            novaCategoria: "",
            duracao: String(servico.duracao),
            preco: String(servico.preco),
            comissao: String(servico.comissao),
            ativo: servico.ativo,
          }
        : vazio,
    );
  }, [open, servico]);

  function set<K extends keyof typeof vazio>(k: K, v: (typeof vazio)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    if (erros[k]) setErros((e) => ({ ...e, [k]: "" }));
  }

  const usandoNova = form.categoria === "__nova__";

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!form.nome.trim()) e.nome = "Informe o nome do serviço.";
    if (usandoNova && !form.novaCategoria.trim())
      e.novaCategoria = "Informe o nome da categoria.";
    const preco = Number(form.preco);
    if (!form.preco || Number.isNaN(preco) || preco <= 0)
      e.preco = "Informe um preço válido.";
    const duracao = Number(form.duracao);
    if (!duracao || duracao <= 0) e.duracao = "Informe a duração.";
    setErros(e);
    if (Object.keys(e).length) return;

    onSalvar({
      // ao editar, preserva id e o histórico de realizados
      id: servico?.id ?? `s-${Date.now()}`,
      nome: form.nome.trim(),
      categoria: usandoNova ? form.novaCategoria.trim() : form.categoria,
      duracao,
      preco,
      comissao: Number(form.comissao) || 0,
      realizadosMes: servico?.realizadosMes ?? 0,
      ativo: form.ativo,
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

  const comissaoValor =
    Number(form.preco) * (Number(form.comissao) / 100) || 0;

  return (
    <Modal
      open={open}
      onClose={fechar}
      title={editando ? "Editar serviço" : "Novo serviço"}
      description={
        editando
          ? "Altere os dados do serviço no catálogo."
          : "Adicione um serviço ao catálogo do salão."
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Nome do serviço *"
            name="nome"
            placeholder="Ex.: Corte + Hidratação"
            value={form.nome}
            onChange={(e) => set("nome", e.target.value)}
            autoFocus
          />
          {erros.nome && <p className="mt-1 text-xs text-danger">{erros.nome}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="categoria" className={labelCls}>
            Categoria
          </label>
          <select
            id="categoria"
            className={selectCls}
            value={form.categoria}
            onChange={(e) => set("categoria", e.target.value)}
          >
            {categoriasExistentes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value="__nova__">+ Nova categoria…</option>
          </select>
        </div>

        {usandoNova && (
          <div>
            <Input
              label="Nome da nova categoria *"
              name="novaCategoria"
              placeholder="Ex.: Estética facial"
              value={form.novaCategoria}
              onChange={(e) => set("novaCategoria", e.target.value)}
            />
            {erros.novaCategoria && (
              <p className="mt-1 text-xs text-danger">{erros.novaCategoria}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Input
              label="Duração (min) *"
              name="duracao"
              type="number"
              min={5}
              step={5}
              value={form.duracao}
              onChange={(e) => set("duracao", e.target.value)}
            />
            {erros.duracao && (
              <p className="mt-1 text-xs text-danger">{erros.duracao}</p>
            )}
          </div>
          <div>
            <Input
              label="Preço (R$) *"
              name="preco"
              type="number"
              min={0}
              step={5}
              placeholder="0"
              value={form.preco}
              onChange={(e) => set("preco", e.target.value)}
            />
            {erros.preco && (
              <p className="mt-1 text-xs text-danger">{erros.preco}</p>
            )}
          </div>
          <Input
            label="Comissão (%)"
            name="comissao"
            type="number"
            min={0}
            max={100}
            value={form.comissao}
            onChange={(e) => set("comissao", e.target.value)}
          />
        </div>

        {/* Prévia da comissão */}
        {Number(form.preco) > 0 && (
          <div className="flex items-center justify-between rounded-2xl bg-primary-soft/50 px-4 py-3 text-sm">
            <span className="text-muted">Comissão por atendimento</span>
            <span className="font-semibold text-ink nums">
              {formatBRL(comissaoValor)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between rounded-2xl border border-line px-4 py-3">
          <div>
            <p className="text-sm font-medium text-ink">Serviço ativo</p>
            <p className="text-xs text-muted">
              Serviços inativos não aparecem no agendamento online.
            </p>
          </div>
          <Toggle
            checked={form.ativo}
            onChange={(v) => set("ativo", v)}
            label="Serviço ativo"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={fechar}>
            Cancelar
          </Button>
          <Button type="submit">
            {editando ? "Salvar alterações" : "Cadastrar serviço"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
