"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IconSearch, IconUsers, IconSparkles, IconScissors } from "@/components/ui/icons";
import { clientes, servicos, equipe, formatBRL } from "@/lib/mock-data";
import { cn } from "@/lib/utils/cn";

type Grupo = "Clientes" | "Serviços" | "Profissionais";

interface Resultado {
  id: string;
  grupo: Grupo;
  titulo: string;
  detalhe: string;
  href: string;
}

const iconePorGrupo: Record<Grupo, typeof IconUsers> = {
  Clientes: IconUsers,
  Serviços: IconSparkles,
  Profissionais: IconScissors,
};

export function BuscaGlobal() {
  const router = useRouter();
  const [termo, setTermo] = useState("");
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // fecha ao clicar fora / ESC
  useEffect(() => {
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
  }, []);

  const resultados = useMemo<Resultado[]>(() => {
    const t = termo.trim().toLowerCase();
    if (!t) return [];

    const rc: Resultado[] = clientes
      .filter(
        (c) =>
          c.nome.toLowerCase().includes(t) ||
          c.email.toLowerCase().includes(t) ||
          c.telefone.includes(t),
      )
      .slice(0, 4)
      .map((c) => ({
        id: c.id,
        grupo: "Clientes",
        titulo: c.nome,
        detalhe: `${c.telefone} · ${c.totalVisitas} visitas`,
        href: "/clientes",
      }));

    const rs: Resultado[] = servicos
      .filter(
        (s) =>
          s.nome.toLowerCase().includes(t) ||
          s.categoria.toLowerCase().includes(t),
      )
      .slice(0, 4)
      .map((s) => ({
        id: s.id,
        grupo: "Serviços",
        titulo: s.nome,
        detalhe: `${s.categoria} · ${formatBRL(s.preco)} · ${s.duracao} min`,
        href: "/servicos",
      }));

    const rp: Resultado[] = equipe
      .filter(
        (p) =>
          p.nome.toLowerCase().includes(t) ||
          p.especialidade.toLowerCase().includes(t),
      )
      .slice(0, 4)
      .map((p) => ({
        id: p.id,
        grupo: "Profissionais",
        titulo: p.nome,
        detalhe: `${p.especialidade} · ${p.unidade}`,
        href: "/profissionais",
      }));

    return [...rc, ...rs, ...rp];
  }, [termo]);

  const grupos = useMemo(() => {
    const mapa = new Map<Grupo, Resultado[]>();
    for (const r of resultados) {
      if (!mapa.has(r.grupo)) mapa.set(r.grupo, []);
      mapa.get(r.grupo)!.push(r);
    }
    return Array.from(mapa.entries());
  }, [resultados]);

  function ir(href: string) {
    setAberto(false);
    setTermo("");
    router.push(href);
  }

  return (
    <div className="relative hidden max-w-sm flex-1 md:block" ref={ref}>
      <IconSearch
        width={17}
        height={17}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        value={termo}
        onChange={(e) => {
          setTermo(e.target.value);
          setAberto(true);
        }}
        onFocus={() => setAberto(true)}
        placeholder="Buscar cliente, serviço, profissional…"
        className="h-10 w-full rounded-full border border-line bg-surface pl-10 pr-4 text-sm text-ink placeholder:text-muted/70 focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10"
      />

      {aberto && termo.trim() !== "" && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 animate-fade-in overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
          {grupos.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted">
              Nada encontrado para “{termo}”.
            </p>
          ) : (
            <div className="max-h-[380px] overflow-y-auto p-2">
              {grupos.map(([grupo, itens]) => {
                const Icone = iconePorGrupo[grupo];
                return (
                  <div key={grupo} className="mb-1 last:mb-0">
                    <p className="px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-widest text-muted">
                      {grupo}
                    </p>
                    <ul>
                      {itens.map((r) => (
                        <li key={`${r.grupo}-${r.id}`}>
                          <button
                            onClick={() => ir(r.href)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                              "hover:bg-primary-soft/50",
                            )}
                          >
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                              <Icone width={15} height={15} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium text-ink">
                                {r.titulo}
                              </span>
                              <span className="block truncate text-xs text-muted">
                                {r.detalhe}
                              </span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
