"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import {
  equipe,
  periodoMetaMeta,
  tipoMetaMeta,
  RESPONSAVEL_SALAO,
  type Meta,
  type PeriodoMeta,
  type TipoMeta,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils/cn";

interface Props {
  open: boolean;
  onClose: () => void;
  onSalvar: (m: Meta) => void;
  // quando presente, o modal funciona em modo de edição
  meta?: Meta | null;
  // período já selecionado na tela — vira o padrão de uma meta nova
  periodoPadrao?: PeriodoMeta;
}

const periodos = Object.keys(periodoMetaMeta) as PeriodoMeta[];
const tipos = Object.keys(tipoMetaMeta) as TipoMeta[];

const vazio = {
  titulo: "",
  periodo: "diaria" as PeriodoMeta,
  tipo: "faturamento" as TipoMeta,
  alvo: "",
  responsavel: RESPONSAVEL_SALAO,
  observacao: "",
  ativa: true,
};

// sugestões por período — dão um ponto de partida em vez de um campo em branco
const sugestoes: Record<PeriodoMeta, Record<TipoMeta, number>> = {
  diaria: {
    faturamento: 2500,
    atendimentos: 24,
    novos_clientes: 3,
    ticket_medio: 180,
    ocupacao: 85,
  },
  semanal: {
    faturamento: 15000,
    atendimentos: 140,
    novos_clientes: 18,
    ticket_medio: 190,
    ocupacao: 85,
  },
  mensal: {
    faturamento: 76000,
    atendimentos: 600,
    novos_clientes: 60,
    ticket_medio: 210,
    ocupacao: 88,
  },
};

export function NovaMetaModal({
  open,
  onClose,
  onSalvar,
  meta = null,
  periodoPadrao = "diaria",
}: Props) {
  const [form, setForm] = useState(vazio);
  const [erros, setErros] = useState<Record<string, string>>({});
  const editando = meta !== null;

  useEffect(() => {
    if (!open) return;
    setErros({});
    setForm(
      meta
        ? {
            titulo: meta.titulo,
            periodo: meta.periodo,
            tipo: meta.tipo,
            alvo: String(meta.alvo),
            responsavel: meta.responsavel,
            observacao: meta.observacao ?? "",
            ativa: meta.ativa,
          }
        : { ...vazio, periodo: periodoPadrao },
    );
  }, [open, meta, periodoPadrao]);

  function set<K extends keyof typeof vazio>(k: K, v: (typeof vazio)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    if (erros[k]) setErros((e) => ({ ...e, [k]: "" }));
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!form.titulo.trim()) e.titulo = "Dê um nome para a meta.";
    const alvo = Number(form.alvo);
    if (!form.alvo || Number.isNaN(alvo) || alvo <= 0)
      e.alvo = "Informe um valor maior que zero.";
    if (form.tipo === "ocupacao" && alvo > 100)
      e.alvo = "Ocupação vai até 100%.";
    setErros(e);
    if (Object.keys(e).length) return;

    onSalvar({
      // ao editar, preserva id, o realizado e a posição no período
      id: meta?.id ?? `m-${Date.now()}`,
      titulo: form.titulo.trim(),
      periodo: form.periodo,
      tipo: form.tipo,
      alvo,
      atual: meta?.atual ?? 0,
      responsavel: form.responsavel,
      decorrido: meta?.decorrido ?? decorridoDoPeriodo(form.periodo),
      ativa: form.ativa,
      observacao: form.observacao.trim() || undefined,
    });

    onClose();
  }

  function fechar() {
    setErros({});
    onClose();
  }

  const t = tipoMetaMeta[form.tipo];
  const sugestao = sugestoes[form.periodo][form.tipo];

  const labelCls = "text-xs font-medium uppercase tracking-wide text-muted";
  const selectCls =
    "h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-sm text-ink focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10";

  return (
    <Modal
      open={open}
      onClose={fechar}
      title={editando ? "Editar meta" : "Nova meta"}
      description={
        editando
          ? "Ajuste o alvo, o período ou o responsável desta meta."
          : "Defina o que o salão precisa alcançar e em quanto tempo."
      }
      footer={
        <>
          <Button type="button" variant="outline" onClick={fechar}>
            Cancelar
          </Button>
          <Button type="submit" form="form-meta">
            {editando ? "Salvar alterações" : "Criar meta"}
          </Button>
        </>
      }
    >
      <form id="form-meta" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Nome da meta *"
            name="titulo"
            placeholder="Ex.: Faturamento do dia"
            value={form.titulo}
            onChange={(e) => set("titulo", e.target.value)}
            autoFocus
          />
          {erros.titulo && (
            <p className="mt-1 text-xs text-danger">{erros.titulo}</p>
          )}
        </div>

        {/* Período como escolha visível: é a decisão principal da meta */}
        <div className="flex flex-col gap-1.5">
          <span className={labelCls}>Período *</span>
          <div className="grid grid-cols-3 gap-2">
            {periodos.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => set("periodo", p)}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                  form.periodo === p
                    ? "border-primary bg-primary text-primary-fg shadow-soft"
                    : "border-line bg-surface text-ink/70 hover:border-primary/40 hover:text-ink",
                )}
              >
                {periodoMetaMeta[p].label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted">
            A meta é medida dentro de {periodoMetaMeta[form.periodo].janela} e
            reinicia a cada novo período.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="tipo" className={labelCls}>
              O que medir
            </label>
            <select
              id="tipo"
              className={selectCls}
              value={form.tipo}
              onChange={(e) => set("tipo", e.target.value as TipoMeta)}
            >
              {tipos.map((tp) => (
                <option key={tp} value={tp}>
                  {tipoMetaMeta[tp].label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Input
              label={`Alvo (${t.unidade}) *`}
              name="alvo"
              type="number"
              min={0}
              step={form.tipo === "faturamento" ? 100 : 1}
              placeholder={String(sugestao)}
              value={form.alvo}
              onChange={(e) => set("alvo", e.target.value)}
            />
            {erros.alvo ? (
              <p className="mt-1 text-xs text-danger">{erros.alvo}</p>
            ) : (
              <button
                type="button"
                onClick={() => set("alvo", String(sugestao))}
                className="mt-1 text-xs text-primary hover:underline"
              >
                Usar sugestão: {t.formatar(sugestao)}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="responsavel" className={labelCls}>
            Responsável
          </label>
          <select
            id="responsavel"
            className={selectCls}
            value={form.responsavel}
            onChange={(e) => set("responsavel", e.target.value)}
          >
            <option value={RESPONSAVEL_SALAO}>
              {RESPONSAVEL_SALAO} (equipe inteira)
            </option>
            {equipe
              .filter((p) => p.status === "ativo")
              .map((p) => (
                <option key={p.id} value={p.nome}>
                  {p.nome} · {p.especialidade}
                </option>
              ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="observacao" className={labelCls}>
            Observação
          </label>
          <textarea
            id="observacao"
            rows={3}
            placeholder="Contexto da meta, campanha relacionada, combinados com a equipe…"
            value={form.observacao}
            onChange={(e) => set("observacao", e.target.value)}
            className="w-full resize-none rounded-xl border border-line bg-surface px-3.5 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-line px-4 py-3">
          <div>
            <p className="text-sm font-medium text-ink">Meta ativa</p>
            <p className="text-xs text-muted">
              Metas pausadas ficam guardadas, mas saem do acompanhamento.
            </p>
          </div>
          <Toggle
            checked={form.ativa}
            onChange={(v) => set("ativa", v)}
            label="Meta ativa"
          />
        </div>
      </form>
    </Modal>
  );
}

/*
  Quanto do período já passou no momento em que a meta é criada.

  Sem backend, é o que permite ao card comparar realizado × esperado já na
  primeira renderização: uma meta mensal criada no dia 20 não pode ser cobrada
  como se o mês inteiro estivesse pela frente.
*/
function decorridoDoPeriodo(periodo: PeriodoMeta): number {
  const agora = new Date();

  if (periodo === "diaria") {
    // expediente de referência: 9h às 20h
    const minutos = agora.getHours() * 60 + agora.getMinutes();
    return clamp((minutos - 9 * 60) / (11 * 60));
  }

  if (periodo === "semanal") {
    // semana comercial seg–sáb; domingo conta como semana cheia
    const dia = agora.getDay() === 0 ? 7 : agora.getDay();
    return clamp(dia / 6);
  }

  const diasNoMes = new Date(
    agora.getFullYear(),
    agora.getMonth() + 1,
    0,
  ).getDate();
  return clamp(agora.getDate() / diasNoMes);
}

// mantém entre 1% e 100% — zero faria a projeção dividir por zero
const clamp = (v: number) => Math.min(1, Math.max(0.01, v));
