"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  // rodapé fixo (ex.: botões de ação) — fica sempre visível, fora da área que rola
  footer?: ReactNode;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: ModalProps) {
  // O portal precisa de `document`, que não existe no render do servidor nem
  // na primeira passada de hidratação — só depois de montar.
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  // Fecha com ESC e trava o scroll do body enquanto aberto
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !montado) return null;

  /*
    Renderizado em `document.body`, não no lugar onde foi chamado.

    Motivo: qualquer ancestral com `transform`, `filter` ou `backdrop-filter`
    vira o bloco de contenção de descendentes `position: fixed` — e os
    wrappers das páginas usam `animate-fade-up`, cuja animação termina com
    `animation-fill-mode: both`, deixando um transform aplicado para sempre.
    Sem o portal, `inset-0` passava a valer o retângulo da página (alto como a
    lista inteira e largo só até `max-w-7xl`) em vez da viewport: o modal caía
    no centro do documento — bem abaixo da dobra — e deslocado para o lado.
  */
  return createPortal(
    // No celular o painel encosta no rodapé (bottom sheet, alcançável com o
    // polegar); do `sm` para cima volta a ser um diálogo centralizado.
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Overlay */}
      <button
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-overlay/50 backdrop-blur-sm animate-fade-in"
      />

      {/* Painel — altura limitada à viewport; só o corpo rola */}
      <div
        className={cn(
          "relative z-10 flex max-h-[92dvh] w-full max-w-lg flex-col animate-fade-up",
          "rounded-t-3xl border border-line bg-surface shadow-card sm:max-h-[88dvh] sm:rounded-3xl",
          // A borda de baixo some quando o painel encosta no rodapé
          "border-b-0 sm:border-b",
          className,
        )}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line p-5 pb-4 sm:p-6 sm:pb-4">
          <div>
            <h2 className="font-display text-xl text-ink">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-muted">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-primary-soft/60 hover:text-ink"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6">
          {children}
        </div>
        {footer && (
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-line p-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6 sm:py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
