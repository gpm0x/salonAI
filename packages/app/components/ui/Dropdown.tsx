"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface DropdownProps {
  // recebe o estado aberto para o gatilho poder reagir (ex.: girar a seta)
  trigger: (aberto: boolean) => ReactNode;
  children: ReactNode | ((fechar: () => void) => ReactNode);
  align?: "left" | "right";
  panelClassName?: string;
  ariaLabel?: string;
}

export function Dropdown({
  trigger,
  children,
  align = "right",
  panelClassName,
  ariaLabel,
}: DropdownProps) {
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // fecha ao clicar fora ou apertar ESC
  useEffect(() => {
    if (!aberto) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAberto(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [aberto]);

  const fechar = () => setAberto(false);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={aberto}
        aria-label={ariaLabel}
        onClick={() => setAberto((a) => !a)}
        className="block"
      >
        {trigger(aberto)}
      </button>

      {aberto && (
        <div
          role="menu"
          className={cn(
            "absolute top-[calc(100%+0.5rem)] z-50 animate-fade-in rounded-2xl border border-line bg-surface shadow-card",
            align === "right" ? "right-0" : "left-0",
            panelClassName,
          )}
        >
          {typeof children === "function" ? children(fechar) : children}
        </div>
      )}
    </div>
  );
}
