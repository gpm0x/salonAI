import type { ReactNode } from "react";
import { IconX } from "@/components/ui/icons";

/*
  Falha de submissão — credencial errada, API fora do ar.

  Um `<p>` vermelho solto entre o campo e o botão se perde: é o mesmo peso
  visual do erro de validação de um campo, quando na verdade fala do
  formulário inteiro. Aqui vira faixa, com fundo e filete próprios.

  `role="alert"` para que o leitor de tela anuncie sem precisar de foco.
*/
export function AvisoErro({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      className="flex animate-fade-in items-start gap-2.5 rounded-xl border border-danger/25 bg-danger/[0.07] px-3.5 py-3 text-sm text-danger"
    >
      <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-danger/15">
        <IconX width={10} height={10} />
      </span>
      <span className="leading-snug">{children}</span>
    </div>
  );
}
