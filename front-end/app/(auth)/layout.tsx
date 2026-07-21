import {
  IconScissors,
  IconSparkles,
  IconGauge,
  IconLeaf,
} from "@/components/ui/icons";

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
    <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Painel de marca */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-fg lg:flex">
        {/* Atmosfera: luz difusa + brilho de estufa */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(680px 460px at 82% 6%, hsl(var(--accent) / 0.42), transparent 62%), radial-gradient(560px 560px at 6% 96%, hsl(var(--accent) / 0.16), transparent 58%)",
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
        {/* Monograma botânico gigante, quebrando a grade */}
        <IconLeaf
          className="pointer-events-none absolute -bottom-16 -right-16 h-96 w-96 text-primary-fg/[0.04]"
          strokeWidth={0.8}
        />

        {/* Topo: marca */}
        <div className="relative flex items-center gap-2.5 animate-fade-up">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary shadow-glow">
            <IconScissors width={20} height={20} />
          </span>
          <span className="font-display text-2xl tracking-tight">Salon AI</span>
        </div>

        {/* Meio: manifesto */}
        <div className="relative">
          <span
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-fg/15 bg-primary-fg/5 px-3 py-1 text-xs font-medium text-primary-fg/70 animate-fade-up"
            style={{ animationDelay: "80ms" }}
          >
            <IconLeaf width={13} height={13} className="text-accent" />
            Feito para quem cuida de pessoas
          </span>
          <h2
            className="max-w-md font-display text-[2.75rem] leading-[1.08] text-balance animate-fade-up"
            style={{ animationDelay: "140ms" }}
          >
            A gestão do seu salão,{" "}
            <span className="italic text-accent">com elegância</span> e
            inteligência.
          </h2>
          <ul className="mt-8 space-y-3.5">
            {destaques.map(({ Icon, texto }, i) => (
              <li
                key={texto}
                className="flex items-center gap-3 animate-fade-up"
                style={{ animationDelay: `${220 + i * 70}ms` }}
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-fg/10 text-accent ring-1 ring-inset ring-primary-fg/10">
                  <Icon width={16} height={16} />
                </span>
                <span className="text-sm text-primary-fg/85">{texto}</span>
              </li>
            ))}
          </ul>

          {/* Prova social flutuante, sobreposta */}
          <figure
            className="mt-10 max-w-sm rounded-2xl border border-primary-fg/10 bg-primary-fg/[0.06] p-5 backdrop-blur-sm animate-fade-up"
            style={{ animationDelay: "440ms" }}
          >
            <blockquote className="font-display text-[0.95rem] italic leading-relaxed text-primary-fg/90">
              “Reduzi horários ociosos em 30% no primeiro mês. Hoje eu abro o
              painel antes do café.”
            </blockquote>
            <figcaption className="mt-3 flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-xs font-semibold text-primary">
                CP
              </span>
              <div className="text-xs">
                <p className="font-semibold text-primary-fg">Camila Prado</p>
                <p className="text-primary-fg/55">Studio Prado · São Paulo</p>
              </div>
            </figcaption>
          </figure>
        </div>

        {/* Rodapé */}
        <p className="relative text-xs text-primary-fg/45">
          © {new Date().getFullYear()} Salon AI · Gestão de salões e barbearias
        </p>
      </aside>

      {/* Área do formulário */}
      <main className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm animate-fade-up">{children}</div>
      </main>
    </div>
  );
}
