"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { navPrincipal, rotaAtiva } from "@/components/shared/nav";
import { IconScissors, IconSettings, IconLogout } from "@/components/ui/icons";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-surface/70 px-4 py-6 backdrop-blur-sm lg:flex">
      {/* Marca */}
      <Link href="/dashboard" className="flex items-center gap-2.5 px-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-fg">
          <IconScissors width={18} height={18} />
        </span>
        <span className="wordmark text-xl leading-none text-ink">
          Salon AI
        </span>
      </Link>

      <nav className="mt-9 flex flex-1 flex-col gap-1">
        <p className="eyebrow px-3 pb-2 text-muted/70">
          Gestão
        </p>
        {navPrincipal.map(({ href, label, Icon }) => {
          const active = rotaAtiva(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-fg shadow-soft"
                  : "text-ink/70 hover:bg-primary-soft/60 hover:text-ink",
              )}
            >
              <Icon
                width={18}
                height={18}
                className={cn(
                  active
                    ? "text-primary-fg/80"
                    : "text-muted group-hover:text-primary",
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 space-y-1 border-t border-line pt-4">
        <Link
          href="/configuracoes"
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
            pathname.startsWith("/configuracoes")
              ? "bg-primary-soft text-primary"
              : "text-ink/70 hover:bg-primary-soft/60 hover:text-ink",
          )}
        >
          <IconSettings width={18} height={18} className="text-muted" />
          Configurações
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:bg-danger/10 hover:text-danger"
        >
          <IconLogout width={18} height={18} className="text-muted" />
          Sair
        </Link>
      </div>
    </aside>
  );
}
