"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { navPrincipal, rotaAtiva } from "@/components/shared/nav";
import {
  IconMenu,
  IconX,
  IconScissors,
  IconSettings,
  IconLogout,
} from "@/components/ui/icons";

/*
  Navegação do celular.

  Abaixo de `lg` a barra lateral some — sem esta gaveta o app simplesmente não
  tem menu no celular. O painel é renderizado num portal em `document.body`
  porque a Topbar usa `backdrop-blur`, e todo elemento com `backdrop-filter`
  vira bloco de contenção dos descendentes `position: fixed`: sem o portal o
  `inset-0` valeria o retângulo de 64px da Topbar, não a viewport.
*/
export function MenuMobile() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  // O portal precisa de `document`, que não existe no render do servidor.
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  // Navegou? Fecha. (O clique no link não desmonta o menu por conta própria.)
  useEffect(() => setAberto(false), [pathname]);

  // ESC fecha e o corpo para de rolar por trás da gaveta
  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    document.addEventListener("keydown", onKey);

    /*
      Girar o aparelho ou alargar a janela até `lg` traz a barra lateral de
      volta e esconde a gaveta por CSS — mas o estado continuaria aberto e o
      `overflow: hidden` abaixo travaria a rolagem numa tela sem nada visível
      para fechar.
    */
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => mq.matches && setAberto(false);
    mq.addEventListener("change", onMq);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      document.body.style.overflow = prev;
    };
  }, [aberto]);

  const linkBase =
    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors";

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        aria-label="Abrir menu"
        aria-expanded={aberto}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink/70 transition-colors hover:border-primary/40 hover:text-ink lg:hidden"
      >
        <IconMenu width={19} height={19} />
      </button>

      {aberto &&
        montado &&
        createPortal(
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu de navegação">
            <button
              aria-label="Fechar menu"
              onClick={() => setAberto(false)}
              className="absolute inset-0 h-full w-full cursor-default animate-fade-in bg-overlay/50 backdrop-blur-sm"
            />

            <aside className="relative flex h-full w-[17rem] max-w-[85vw] animate-slide-in-left flex-col border-r border-line bg-surface px-4 pb-6 pt-[max(1.5rem,env(safe-area-inset-top))] shadow-card">
              <div className="flex items-center justify-between gap-3 px-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2.5"
                  onClick={() => setAberto(false)}
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-fg">
                    <IconScissors width={18} height={18} />
                  </span>
                  <span className="wordmark text-xl leading-none text-ink">
                    Salon AI
                  </span>
                </Link>
                <button
                  onClick={() => setAberto(false)}
                  aria-label="Fechar menu"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-primary-soft/60 hover:text-ink"
                >
                  <IconX width={18} height={18} />
                </button>
              </div>

              <nav className="mt-7 flex-1 space-y-1 overflow-y-auto overscroll-contain">
                <p className="eyebrow px-3 pb-2 text-muted/70">Gestão</p>
                {navPrincipal.map(({ href, label, Icon }) => {
                  const active = rotaAtiva(pathname, href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setAberto(false)}
                      className={cn(
                        linkBase,
                        active
                          ? "bg-primary text-primary-fg shadow-soft"
                          : "text-ink/70 hover:bg-primary-soft/60 hover:text-ink",
                      )}
                    >
                      <Icon
                        width={18}
                        height={18}
                        className={active ? "text-primary-fg/80" : "text-muted"}
                      />
                      {label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-4 space-y-1 border-t border-line pt-4">
                <Link
                  href="/configuracoes"
                  onClick={() => setAberto(false)}
                  className={cn(
                    linkBase,
                    pathname.startsWith("/configuracoes")
                      ? "bg-primary-soft text-primary"
                      : "text-ink/70 hover:bg-primary-soft/60 hover:text-ink",
                  )}
                >
                  <IconSettings width={18} height={18} className="text-muted" />
                  Configurações
                </Link>
                <Link
                  href="/login"
                  onClick={() => setAberto(false)}
                  className={cn(
                    linkBase,
                    "text-ink/70 hover:bg-danger/10 hover:text-danger",
                  )}
                >
                  <IconLogout width={18} height={18} className="text-muted" />
                  Sair
                </Link>
              </div>
            </aside>
          </div>,
          document.body,
        )}
    </>
  );
}
