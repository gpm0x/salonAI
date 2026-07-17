import { IconBell, IconSearch, IconStore } from "@/components/ui/icons";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-line bg-bg/80 px-5 backdrop-blur-md lg:px-8">
      {/* Seletor de unidade */}
      <button className="flex items-center gap-2.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-medium text-ink transition-colors hover:border-primary/40">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-primary-soft text-primary">
          <IconStore width={14} height={14} />
        </span>
        Studio Centro
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="text-muted"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Busca */}
      <div className="relative hidden flex-1 max-w-sm md:block">
        <IconSearch
          width={17}
          height={17}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          placeholder="Buscar cliente, serviço, profissional…"
          className="h-10 w-full rounded-full border border-line bg-surface pl-10 pr-4 text-sm text-ink placeholder:text-muted/70 focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          className="relative grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-ink/70 transition-colors hover:text-ink"
          aria-label="Notificações"
        >
          <IconBell width={19} height={19} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent ring-2 ring-surface" />
        </button>

        <div className="flex items-center gap-2.5 rounded-full border border-line bg-surface py-1 pl-1 pr-3.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-fg">
            GM
          </span>
          <div className="hidden text-left leading-tight sm:block">
            <p className="text-sm font-medium text-ink">Gabriel Mota</p>
            <p className="text-[0.7rem] text-muted">Proprietário</p>
          </div>
        </div>
      </div>
    </header>
  );
}
