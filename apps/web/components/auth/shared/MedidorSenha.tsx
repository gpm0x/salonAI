"use client";

import { cn } from "@/lib/utils/cn";
import { forcaMeta } from "@/lib/utils/senha";

/*
  Medidor de força da senha.

  Eram quatro barrinhas soltas — quatro objetos que o olho precisa contar para
  extrair um número. Aqui é uma trilha só, que enche e muda de matiz: a leitura
  é periférica, sem contagem. A largura de cada nível não é linear de propósito
  — sair de "fraca" para "razoável" precisa parecer um salto maior do que
  arredondar de "boa" para "excelente".
*/
const LARGURA = ["10%", "30%", "55%", "78%", "100%"];

export function MedidorSenha({
  forca,
  dica,
}: {
  /** 0–4, de `forcaSenha()`. */
  forca: number;
  /** O que falta para subir de nível. */
  dica?: string;
}) {
  const meta = forcaMeta[forca];

  return (
    <div className="mt-2 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-line">
          <div
            className={cn(
              "h-full rounded-full transition-[width,background-color] duration-500 ease-out",
              meta.cor,
            )}
            style={{ width: LARGURA[forca] }}
          />
        </div>
        <span
          className={cn(
            "shrink-0 text-[0.6875rem] font-semibold tabular-nums transition-colors",
            meta.texto,
          )}
        >
          {meta.label}
        </span>
      </div>
      {dica && <p className="mt-1.5 text-xs text-muted">{dica}</p>}
    </div>
  );
}
