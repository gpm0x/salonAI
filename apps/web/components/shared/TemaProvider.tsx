"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  CHAVE_TEMA,
  aplicarTema,
  lerTemaSalvo,
  resolverTema,
  temaDoSistema,
  type Tema,
  type TemaResolvido,
} from "@/lib/utils/tema";

interface ContextoTema {
  /** Preferência escolhida pelo usuário. */
  tema: Tema;
  /** Tema efetivamente aplicado ("sistema" já resolvido). */
  resolvido: TemaResolvido;
  definirTema: (tema: Tema) => void;
  alternarTema: () => void;
  /** false até o primeiro efeito no cliente — evita hidratação divergente. */
  montado: boolean;
}

const Contexto = createContext<ContextoTema | null>(null);

export function TemaProvider({ children }: { children: React.ReactNode }) {
  // O valor real vem do localStorage no primeiro efeito; no servidor o HTML já
  // foi corrigido pelo script anti-flash.
  const [tema, setTema] = useState<Tema>("sistema");
  const [resolvido, setResolvido] = useState<TemaResolvido>("claro");
  const [montado, setMontado] = useState(false);
  const timerTransicao = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const salvo = lerTemaSalvo();
    setTema(salvo);
    setResolvido(resolverTema(salvo));
    setMontado(true);
  }, []);

  // Segue o sistema em tempo real enquanto a preferência for "sistema"
  useEffect(() => {
    if (tema !== "sistema") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const aoMudar = () => {
      const novo = temaDoSistema();
      setResolvido(novo);
      aplicarTema(novo);
    };
    mq.addEventListener("change", aoMudar);
    return () => mq.removeEventListener("change", aoMudar);
  }, [tema]);

  // Sincroniza entre abas abertas
  useEffect(() => {
    const aoStorage = (e: StorageEvent) => {
      if (e.key !== CHAVE_TEMA) return;
      const salvo = lerTemaSalvo();
      setTema(salvo);
      const novo = resolverTema(salvo);
      setResolvido(novo);
      aplicarTema(novo);
    };
    window.addEventListener("storage", aoStorage);
    return () => window.removeEventListener("storage", aoStorage);
  }, []);

  useEffect(() => {
    return () => {
      if (timerTransicao.current) clearTimeout(timerTransicao.current);
    };
  }, []);

  const definirTema = useCallback((novo: Tema) => {
    const alvo = resolverTema(novo);

    // Liga a transição só durante a troca, para não custar em todo hover
    const raiz = document.documentElement;
    raiz.classList.add("trocando-tema");
    if (timerTransicao.current) clearTimeout(timerTransicao.current);
    timerTransicao.current = setTimeout(
      () => raiz.classList.remove("trocando-tema"),
      260,
    );

    setTema(novo);
    setResolvido(alvo);
    aplicarTema(alvo);
    try {
      window.localStorage.setItem(CHAVE_TEMA, novo);
    } catch {
      // sem persistência disponível: o tema vale só para esta sessão
    }
  }, []);

  const alternarTema = useCallback(() => {
    definirTema(resolvido === "escuro" ? "claro" : "escuro");
  }, [definirTema, resolvido]);

  return (
    <Contexto.Provider
      value={{ tema, resolvido, definirTema, alternarTema, montado }}
    >
      {children}
    </Contexto.Provider>
  );
}

export function useTema() {
  const ctx = useContext(Contexto);
  if (!ctx) {
    throw new Error("useTema precisa estar dentro de <TemaProvider>");
  }
  return ctx;
}
