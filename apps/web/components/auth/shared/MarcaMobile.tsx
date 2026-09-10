import { IconScissors, IconStar } from "@/components/ui/icons";

/*
  Cabeçalho de marca do celular.

  Abaixo de `lg` o painel de marca inteiro é escondido — manifesto, destaques,
  depoimento. Sobrava um chip cinza e um formulário nu, sem nada que dissesse
  para quem é o produto. Este bloco devolve o mínimo: o selo em vermelhão com
  o mesmo brilho do painel (era aço, destoando) e a linha de posicionamento.
*/
export function MarcaMobile() {
  return (
    <div className="mb-7 animate-fade-up lg:hidden">
      <div className="flex items-center gap-2.5">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-fg shadow-ember">
          <IconScissors width={20} height={20} />
        </span>
        <span className="wordmark text-2xl text-ink">Salon AI</span>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
        <IconStar width={12} height={12} className="shrink-0 text-gold" />
        Feito para quem cuida de pessoas
      </p>
    </div>
  );
}
