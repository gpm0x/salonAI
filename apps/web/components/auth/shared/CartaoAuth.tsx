import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/*
  A casca das telas de autenticação.

  O painel de marca à esquerda é arte-direção cheia — auroras, grade de
  blueprint, grão, monograma sangrando. Um formulário solto no fundo ao lado
  dele lê como rascunho. Aqui a coluna do formulário vira objeto: uma ficha
  erguida do papel, translúcida o bastante para as auroras do fundo passarem
  por baixo, com um fio de brasa na borda superior e marcas de registro nos
  cantos — o mesmo vocabulário de precisão da grade que corre atrás.
*/

/** Ritmo de entrada. Os campos continuam a contagem via `atrasoCampo`. */
const ATRASO_BASE = 200;

export function atrasoCampo(indice: number): string {
  return `${ATRASO_BASE + indice * 55}ms`;
}

/*
  Marcas de registro nos cantos, como as de prova de impressão. São dois
  filetes de 10px por canto: o suficiente para o olho registrar "isto foi
  alinhado", sem virar moldura.
*/
function MarcasDeRegistro() {
  const cantos = [
    "left-3 top-3 border-l border-t",
    "right-3 top-3 border-r border-t",
    "left-3 bottom-3 border-b border-l",
    "right-3 bottom-3 border-b border-r",
  ];
  return (
    <>
      {cantos.map((posicao) => (
        <span
          key={posicao}
          aria-hidden
          className={cn(
            "pointer-events-none absolute h-2.5 w-2.5 rounded-[3px] border-accent/25",
            posicao,
          )}
        />
      ))}
    </>
  );
}

interface CartaoAuthProps {
  /** Versalete acima do título — a assinatura tipográfica do painel. */
  eyebrow: string;
  titulo: ReactNode;
  descricao?: ReactNode;
  children: ReactNode;
  /** Rodapé separado por filete: o link para a tela irmã. */
  rodape?: ReactNode;
  className?: string;
}

export function CartaoAuth({
  eyebrow,
  titulo,
  descricao,
  children,
  rodape,
  className,
}: CartaoAuthProps) {
  return (
    <div
      className={cn(
        "relative animate-fade-up rounded-3xl border border-line bg-surface/80 p-6 shadow-card backdrop-blur-md sm:p-8",
        className,
      )}
    >
      {/*
        Fio de brasa na aresta de cima. Fica em `-top-px` para pousar sobre a
        borda do cartão, não abaixo dela — assim a linha acende o próprio
        contorno em vez de parecer um segundo traço.
      */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-accent to-transparent"
      />
      <MarcasDeRegistro />

      <header className="relative">
        <p
          className="eyebrow animate-fade-up text-accent"
          style={{ animationDelay: "60ms" }}
        >
          {eyebrow}
        </p>
        <h1
          className="mt-2 animate-fade-up font-display text-[1.9rem] leading-[1.12] text-balance text-ink"
          style={{ animationDelay: "110ms" }}
        >
          {titulo}
        </h1>
        {descricao && (
          <p
            className="mt-2 animate-fade-up text-sm leading-relaxed text-muted"
            style={{ animationDelay: "160ms" }}
          >
            {descricao}
          </p>
        )}
      </header>

      <div className="relative">{children}</div>

      {rodape && (
        <footer
          className="relative mt-7 animate-fade-up border-t border-line pt-5 text-center text-sm text-muted"
          style={{ animationDelay: "520ms" }}
        >
          {rodape}
        </footer>
      )}
    </div>
  );
}
