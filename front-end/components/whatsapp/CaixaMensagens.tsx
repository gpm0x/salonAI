"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/Card";
import { IconSearch, IconSend, IconCheckDouble, IconWhatsApp } from "@/components/ui/icons";
import { conversasWhatsApp, type ConversaWA } from "@/lib/mock-data";
import { cn } from "@/lib/utils/cn";

function iniciais(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function agoraHHMM() {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CaixaMensagens() {
  const [conversas, setConversas] = useState<ConversaWA[]>(conversasWhatsApp);
  const [ativaId, setAtivaId] = useState<string>(conversasWhatsApp[0].id);
  const [busca, setBusca] = useState("");
  const [rascunho, setRascunho] = useState("");

  const listaFiltrada = useMemo(() => {
    const t = busca.trim().toLowerCase();
    if (!t) return conversas;
    return conversas.filter(
      (c) =>
        c.nome.toLowerCase().includes(t) || c.telefone.includes(t),
    );
  }, [busca, conversas]);

  const ativa = conversas.find((c) => c.id === ativaId)!;

  function abrir(id: string) {
    setAtivaId(id);
    // zera não-lidas ao abrir
    setConversas((cs) =>
      cs.map((c) => (c.id === id ? { ...c, naoLidas: 0 } : c)),
    );
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    const texto = rascunho.trim();
    if (!texto) return;
    setConversas((cs) =>
      cs.map((c) =>
        c.id === ativaId
          ? {
              ...c,
              hora: agoraHHMM(),
              mensagens: [
                ...c.mensagens,
                { de: "salao", texto, hora: agoraHHMM(), lida: false },
              ],
            }
          : c,
      ),
    );
    setRascunho("");
  }

  return (
    <Card className="grid grid-cols-1 overflow-hidden md:grid-cols-[300px_1fr]">
      {/* Lista de conversas */}
      <div className="flex max-h-[560px] flex-col border-b border-line md:max-h-none md:border-b-0 md:border-r">
        <div className="p-4">
          <div className="relative">
            <IconSearch
              width={16}
              height={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar conversa…"
              className="h-10 w-full rounded-full border border-line bg-bg/40 pl-9 pr-3 text-sm text-ink placeholder:text-muted/70 focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </div>

        <ul className="flex-1 overflow-y-auto px-2 pb-2">
          {listaFiltrada.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => abrir(c.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-2.5 py-2.5 text-left transition-colors",
                  c.id === ativaId
                    ? "bg-primary-soft/70"
                    : "hover:bg-primary-soft/40",
                )}
              >
                <span className="relative shrink-0">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-sm font-semibold text-primary-fg">
                    {iniciais(c.nome)}
                  </span>
                  {c.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success ring-2 ring-surface" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-ink">
                      {c.nome}
                    </p>
                    <span className="shrink-0 text-[0.7rem] text-muted">
                      {c.hora}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs text-muted">
                      {c.mensagens[c.mensagens.length - 1]?.texto}
                    </p>
                    {c.naoLidas > 0 && (
                      <span className="grid h-5 min-w-[1.25rem] shrink-0 place-items-center rounded-full bg-success px-1 text-[0.65rem] font-semibold text-primary-fg nums">
                        {c.naoLidas}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </li>
          ))}
          {listaFiltrada.length === 0 && (
            <p className="py-8 text-center text-sm text-muted">
              Nenhuma conversa encontrada.
            </p>
          )}
        </ul>
      </div>

      {/* Thread da conversa ativa */}
      <div className="flex max-h-[560px] flex-col">
        {/* Cabeçalho */}
        <div className="flex items-center gap-3 border-b border-line px-5 py-3.5">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-xs font-semibold text-primary-fg">
            {iniciais(ativa.nome)}
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">{ativa.nome}</p>
            <p className="text-xs text-muted">
              {ativa.online ? "online" : ativa.telefone}
            </p>
          </div>
        </div>

        {/* Mensagens */}
        <div className="flex-1 space-y-2 overflow-y-auto bg-bg/30 px-5 py-4">
          {ativa.mensagens.map((m, i) => {
            const meu = m.de === "salao";
            return (
              <div
                key={i}
                className={cn("flex", meu ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[78%] rounded-2xl px-3.5 py-2 text-sm shadow-soft",
                    meu
                      ? "rounded-br-md bg-primary text-primary-fg"
                      : "rounded-bl-md border border-line bg-surface text-ink",
                  )}
                >
                  <p className="whitespace-pre-wrap break-words">{m.texto}</p>
                  <span
                    className={cn(
                      "mt-1 flex items-center justify-end gap-1 text-[0.65rem]",
                      meu ? "text-primary-fg/70" : "text-muted",
                    )}
                  >
                    {m.hora}
                    {meu && (
                      <IconCheckDouble
                        width={13}
                        height={13}
                        className={m.lida ? "text-accent" : ""}
                      />
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Composer */}
        <form
          onSubmit={enviar}
          className="flex items-center gap-2 border-t border-line px-4 py-3"
        >
          <input
            value={rascunho}
            onChange={(e) => setRascunho(e.target.value)}
            placeholder="Digite uma mensagem…"
            className="h-11 flex-1 rounded-full border border-line bg-bg/40 px-4 text-sm text-ink placeholder:text-muted/70 focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10"
          />
          <button
            type="submit"
            aria-label="Enviar mensagem"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-fg transition-colors hover:bg-primary/90 disabled:opacity-50"
            disabled={!rascunho.trim()}
          >
            <IconSend width={19} height={19} />
          </button>
        </form>
      </div>

      {/* rodapé informativo full-width */}
      <div className="col-span-full flex items-center justify-center gap-1.5 border-t border-line py-2 text-[0.7rem] text-muted">
        <IconWhatsApp width={12} height={12} />
        Mensagens sincronizadas via API — protótipo com dados de exemplo
      </div>
    </Card>
  );
}
