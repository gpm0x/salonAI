"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dropdown } from "@/components/ui/Dropdown";
import { IconUser, IconSettings, IconWallet, IconStore, IconLogout } from "@/components/ui/icons";
import { authClient } from "@/lib/auth/auth-client";

const itens = [
  { href: "/configuracoes", label: "Configurações", Icon: IconSettings },
  { href: "/configuracoes", label: "Meu perfil", Icon: IconUser },
  { href: "/configuracoes/assinatura", label: "Assinatura", Icon: IconWallet },
  { href: "/unidades", label: "Minhas unidades", Icon: IconStore },
];

function iniciais(nome: string) {
  return nome.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

export function MenuUsuario() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const nome = session?.user?.name ?? "Usuário";
  const email = session?.user?.email ?? "";

  async function sair() {
    await authClient.signOut();
    router.push("/login");
  }

  return (
    <Dropdown
      ariaLabel="Menu do usuário"
      panelClassName="w-[240px] p-2"
      trigger={() => (
        <span className="flex items-center gap-2.5 rounded-full border border-line bg-surface py-1 pl-1 pr-3.5 transition-colors hover:border-primary/40">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-fg">
            {iniciais(nome)}
          </span>
          <span className="hidden text-left leading-tight sm:block">
            <span className="block text-sm font-medium text-ink">{nome}</span>
            <span className="block text-[0.7rem] text-muted">Proprietário</span>
          </span>
        </span>
      )}
    >
      {(fechar) => (
        <>
          <div className="flex items-center gap-3 border-b border-line px-3 pb-3 pt-2">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-fg">
              {iniciais(nome)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{nome}</p>
              <p className="truncate text-xs text-muted">{email}</p>
            </div>
          </div>

          <ul className="py-1">
            {itens.map((i) => (
              <li key={i.label}>
                <Link
                  href={i.href}
                  onClick={fechar}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/80 transition-colors hover:bg-primary-soft/50 hover:text-ink"
                >
                  <i.Icon width={17} height={17} className="text-muted" />
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-t border-line pt-1">
            <button
              onClick={() => { fechar(); sair(); }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/80 transition-colors hover:bg-danger/10 hover:text-danger"
            >
              <IconLogout width={17} height={17} className="text-muted" />
              Sair
            </button>
          </div>
        </>
      )}
    </Dropdown>
  );
}
