import {
  IconScissors,
  IconSparkles,
  IconGauge,
  IconStar,
} from "@/components/ui/icons";
import { BotaoTema } from "@/components/shared/SeletorTema";

const destaques = [
  { Icon: IconGauge, texto: "Agenda e ocupação em tempo real" },
  { Icon: IconSparkles, texto: "Alertas inteligentes de faturamento" },
  { Icon: IconScissors, texto: "Gestão completa da sua equipe" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="paleta-azul relative z-10 grid min-h-screen grid-cols-[minmax(0,1fr)] lg:grid-cols-[1.05fr_minmax(0,1fr)]">
      {/*
        Fundo próprio destas telas.

        O `body` pinta auroras em vermelhão e ouro (globals.css) atrás de
        tudo. Como aqui a paleta é só azul, não basta recolorir os
        componentes: aquele fundo continuaria vazando pela coluna do
        formulário. Estas duas camadas cobrem o do body e repintam a mesma
        atmosfera — auroras, grade e grão — com os tokens já reescritos.

        `fixed` como no body, para o gradiente não esticar junto com a
        página; `-z-10` mantém as camadas dentro do contexto de empilhamento
        criado pelo `z-10` deste elemento, ou seja, acima do body e abaixo
        do conteúdo.
      */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-bg"
        style={{
          backgroundImage:
            "radial-gradient(1000px 620px at 92% -10%, hsl(var(--accent) / var(--aurora-accent)), transparent 62%), radial-gradient(880px 640px at -8% 2%, hsl(var(--primary) / var(--aurora-primary)), transparent 58%), radial-gradient(760px 520px at 40% 108%, hsl(var(--gold-solid) / var(--aurora-gold)), transparent 60%), repeating-linear-gradient(to right, hsl(var(--ink) / var(--grade)) 0 1px, transparent 1px 88px), repeating-linear-gradient(to bottom, hsl(var(--ink) / var(--grade)) 0 1px, transparent 1px 88px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[var(--grao)]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {/* Painel de marca */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-brand p-12 text-brand-fg lg:flex">
        {/* Atmosfera: brasa vermelhão no alto, ouro rasante no rodapé */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(680px 460px at 82% 6%, hsl(var(--accent) / var(--brand-aurora)), transparent 62%), radial-gradient(600px 520px at 4% 98%, hsl(var(--gold-solid) / calc(var(--brand-aurora) * 0.42)), transparent 60%), radial-gradient(520px 420px at 50% 52%, hsl(var(--primary) / calc(var(--brand-aurora) * 0.3)), transparent 66%)",
          }}
        />
        {/* Grade de blueprint, ancorando o painel */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, hsl(var(--brand-fg)) 0 1px, transparent 1px 76px), repeating-linear-gradient(to bottom, hsl(var(--brand-fg)) 0 1px, transparent 1px 76px)",
          }}
        />
        {/* Grão têxtil */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        {/* Monograma gigante, quebrando a grade */}
        <IconScissors
          className="pointer-events-none absolute -bottom-20 -right-20 h-[26rem] w-[26rem] -rotate-12 text-brand-fg/[0.05]"
          strokeWidth={0.6}
        />

        {/* Topo: marca */}
        <div className="relative flex items-center gap-2.5 animate-fade-up">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-fg shadow-ember">
            <IconScissors width={20} height={20} />
          </span>
          <span className="wordmark text-2xl">
            Salon AI
          </span>
        </div>

        {/* Meio: manifesto */}
        <div className="relative">
          <span
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-fg/15 bg-brand-fg/5 px-3 py-1 text-xs font-medium text-brand-fg/70 animate-fade-up"
            style={{ animationDelay: "80ms" }}
          >
            {/* O painel é sempre meia-noite: aqui vale o ouro cheio */}
            <IconStar width={13} height={13} className="text-gold-solid" />
            Feito para quem cuida de pessoas
          </span>
          <h2
            className="max-w-md font-display text-[2.75rem] leading-[1.08] text-balance animate-fade-up"
            style={{ animationDelay: "140ms" }}
          >
            A gestão do seu salão,{" "}
            <span className="relative inline-block text-accent">
              com elegância
              {/* Traço vermelhão desenhado à mão sob a expressão-chave */}
              <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-accent/70" />
            </span>{" "}
            e inteligência.
          </h2>
          <ul className="mt-8 space-y-3.5">
            {destaques.map(({ Icon, texto }, i) => (
              <li
                key={texto}
                className="flex items-center gap-3 animate-fade-up"
                style={{ animationDelay: `${220 + i * 70}ms` }}
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-fg/10 text-accent ring-1 ring-inset ring-brand-fg/10">
                  <Icon width={16} height={16} />
                </span>
                <span className="text-sm text-brand-fg/85">{texto}</span>
              </li>
            ))}
          </ul>

          {/* Prova social flutuante, sobreposta */}
          <figure
            className="mt-10 max-w-sm rounded-2xl border border-brand-fg/10 bg-brand-fg/[0.06] p-5 backdrop-blur-sm animate-fade-up"
            style={{ animationDelay: "440ms" }}
          >
            <blockquote className="font-display text-[0.95rem] font-medium leading-relaxed tracking-[-0.01em] text-brand-fg/90">
              “Reduzi horários ociosos em 30% no primeiro mês. Hoje eu abro o
              painel antes do café.”
            </blockquote>
            <figcaption className="mt-3 flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-solid text-xs font-bold text-gold-fg">
                CP
              </span>
              <div className="text-xs">
                <p className="font-semibold text-brand-fg">Camila Prado</p>
                <p className="text-brand-fg/55">Studio Prado · São Paulo</p>
              </div>
            </figcaption>
          </figure>
        </div>

        {/* Rodapé */}
        <p className="relative text-xs text-brand-fg/45">
          © {new Date().getFullYear()} Salon AI · Gestão de salões e barbearias
        </p>
      </aside>

      {/* Área do formulário */}
      <main className="relative flex min-w-0 items-center justify-center p-6 sm:p-12">
        {/*
          Halo atrás do cartão. Sem ele a coluna do formulário é um vazio
          chapado ao lado de um painel de marca cheio de atmosfera — o cartão
          parecia largado no meio do nada. O foco de luz dá a ele um lugar,
          usando o mesmo vocabulário de auroras radiais do resto do app.
        */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(620px 500px at 50% 46%, hsl(var(--primary) / 0.09), transparent 70%), radial-gradient(420px 360px at 62% 22%, hsl(var(--accent) / 0.05), transparent 68%)",
          }}
        />
        <BotaoTema className="absolute right-5 top-5 sm:right-8 sm:top-8" />
        <div className="relative w-full min-w-0 max-w-[26.5rem]">{children}</div>
      </main>
    </div>
  );
}
