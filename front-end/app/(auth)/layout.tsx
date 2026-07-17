import { IconScissors, IconSparkles, IconGauge } from "@/components/ui/icons";

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
    <div className="relative z-10 grid min-h-screen lg:grid-cols-2">
      {/* Painel de marca */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-fg lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(600px 400px at 80% 10%, hsl(var(--accent) / 0.35), transparent 60%), radial-gradient(500px 500px at 10% 90%, hsl(var(--accent) / 0.18), transparent 55%)",
          }}
        />
        <div className="relative flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary">
            <IconScissors width={20} height={20} />
          </span>
          <span className="font-display text-2xl">Ateliê</span>
        </div>

        <div className="relative">
          <h2 className="max-w-md font-display text-4xl leading-tight text-balance">
            A gestão do seu salão,{" "}
            <span className="italic text-accent">com elegância</span> e
            inteligência.
          </h2>
          <ul className="mt-8 space-y-3">
            {destaques.map(({ Icon, texto }) => (
              <li key={texto} className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-fg/10 text-accent">
                  <Icon width={16} height={16} />
                </span>
                <span className="text-sm text-primary-fg/85">{texto}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-primary-fg/50">
          © {new Date().getFullYear()} Ateliê · Gestão de salões e barbearias
        </p>
      </aside>

      {/* Área do formulário */}
      <main className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm animate-fade-up">{children}</div>
      </main>
    </div>
  );
}
