"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  unidades,
  servicos,
  type ProfissionalCompleto,
  type StatusProfissional,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils/cn";

interface Props {
  open: boolean;
  onClose: () => void;
  onSalvar: (p: ProfissionalCompleto) => void;
  // quando presente, o modal funciona em modo de edição
  profissional?: ProfissionalCompleto | null;
}

const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const vazio = {
  nome: "",
  especialidade: "",
  email: "",
  telefone: "",
  status: "ativo" as StatusProfissional,
  comissao: "40",
  unidade: unidades[0]?.nome ?? "",
  abre: "09:00",
  fecha: "18:00",
  dias: ["Seg", "Ter", "Qua", "Qui", "Sex"] as string[],
  servicos: [] as string[],
};

export function NovoProfissionalModal({
  open,
  onClose,
  onSalvar,
  profissional = null,
}: Props) {
  const [form, setForm] = useState(vazio);
  const [erros, setErros] = useState<Record<string, string>>({});
  const editando = profissional !== null;

  useEffect(() => {
    if (!open) return;
    setErros({});
    if (!profissional) {
      setForm(vazio);
      return;
    }
    const [abre = "09:00", fecha = "18:00"] = profissional.horario
      .split("–")
      .map((s) => s.trim());
    setForm({
      nome: profissional.nome,
      especialidade: profissional.especialidade,
      email: profissional.email === "—" ? "" : profissional.email,
      telefone: profissional.telefone,
      status: profissional.status,
      comissao: String(profissional.comissao),
      unidade: profissional.unidade,
      abre,
      fecha,
      dias: profissional.dias,
      servicos: profissional.servicos.filter((s) => s !== "—"),
    });
  }, [open, profissional]);

  function set<K extends keyof typeof vazio>(k: K, v: (typeof vazio)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    if (erros[k]) setErros((e) => ({ ...e, [k]: "" }));
  }

  function toggleItem(campo: "dias" | "servicos", valor: string) {
    setForm((f) => ({
      ...f,
      [campo]: f[campo].includes(valor)
        ? f[campo].filter((x) => x !== valor)
        : [...f[campo], valor],
    }));
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!form.nome.trim()) e.nome = "Informe o nome.";
    if (!form.especialidade.trim()) e.especialidade = "Informe a especialidade.";
    if (!form.telefone.trim()) e.telefone = "Informe o telefone.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "E-mail inválido.";
    if (form.dias.length === 0) e.dias = "Selecione ao menos um dia.";
    setErros(e);
    if (Object.keys(e).length) return;

    onSalvar({
      // ao editar, preserva id, histórico e desempenho
      id: profissional?.id ?? `p-${Date.now()}`,
      nome: form.nome.trim(),
      especialidade: form.especialidade.trim(),
      email: form.email.trim() || "—",
      telefone: form.telefone.trim(),
      status: form.status,
      desde: profissional?.desde ?? "2026-07-19",
      atendimentosMes: profissional?.atendimentosMes ?? 0,
      faturamentoMes: profissional?.faturamentoMes ?? 0,
      ocupacao: profissional?.ocupacao ?? 0,
      comissao: Number(form.comissao) || 0,
      avaliacao: profissional?.avaliacao ?? 0,
      servicos: form.servicos.length ? form.servicos : ["—"],
      dias: form.dias,
      horario: `${form.abre} – ${form.fecha}`,
      unidade: form.unidade,
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
      title={editando ? "Editar profissional" : "Novo profissional"}
      description={
        editando
          ? "Altere os dados e a jornada. O desempenho é preservado."
          : "Cadastre um membro da equipe e defina a jornada de trabalho."
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Nome completo *"
            name="nome"
            placeholder="Ex.: Ana Souza"
            value={form.nome}
            onChange={(e) => set("nome", e.target.value)}
            autoFocus
          />
          {erros.nome && <p className="mt-1 text-xs text-danger">{erros.nome}</p>}
        </div>

        <div>
          <Input
            label="Especialidade *"
            name="especialidade"
            placeholder="Ex.: Coloração & Mechas"
            value={form.especialidade}
            onChange={(e) => set("especialidade", e.target.value)}
          />
          {erros.especialidade && (
            <p className="mt-1 text-xs text-danger">{erros.especialidade}</p>
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
              placeholder="profissional@salonai.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
            {erros.email && (
              <p className="mt-1 text-xs text-danger">{erros.email}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="unidade" className={labelCls}>
              Unidade
            </label>
            <select
              id="unidade"
              className={selectCls}
              value={form.unidade}
              onChange={(e) => set("unidade", e.target.value)}
            >
              {unidades.map((u) => (
                <option key={u.id} value={u.nome}>
                  {u.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="status" className={labelCls}>
              Status
            </label>
            <select
              id="status"
              className={selectCls}
              value={form.status}
              onChange={(e) =>
                set("status", e.target.value as StatusProfissional)
              }
            >
              <option value="ativo">Ativo</option>
              <option value="ferias">Férias</option>
              <option value="inativo">Inativo</option>
            </select>
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

        {/* Jornada */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Entrada"
            name="abre"
            type="time"
            value={form.abre}
            onChange={(e) => set("abre", e.target.value)}
          />
          <Input
            label="Saída"
            name="fecha"
            type="time"
            value={form.fecha}
            onChange={(e) => set("fecha", e.target.value)}
          />
        </div>

        <div>
          <p className={labelCls}>Dias de trabalho *</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {DIAS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => toggleItem("dias", d)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  form.dias.includes(d)
                    ? "bg-primary text-primary-fg"
                    : "border border-line bg-surface text-ink/70 hover:border-primary/40",
                )}
              >
                {d}
              </button>
            ))}
          </div>
          {erros.dias && <p className="mt-1 text-xs text-danger">{erros.dias}</p>}
        </div>

        <div>
          <p className={labelCls}>Serviços que executa</p>
          <div className="mt-2 flex max-h-32 flex-wrap gap-2 overflow-y-auto">
            {Array.from(new Set(servicos.map((s) => s.nome))).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleItem("servicos", s)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  form.servicos.includes(s)
                    ? "bg-accent text-accent-fg"
                    : "border border-line bg-surface text-ink/70 hover:border-primary/40",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={fechar}>
            Cancelar
          </Button>
          <Button type="submit">
            {editando ? "Salvar alterações" : "Cadastrar profissional"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
