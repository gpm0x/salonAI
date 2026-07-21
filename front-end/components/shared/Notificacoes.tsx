"use client";

import { useState } from "react";
import { Dropdown } from "@/components/ui/Dropdown";
import {
  IconBell,
  IconCalendar,
  IconWallet,
  IconWhatsApp,
  IconSparkles,
} from "@/components/ui/icons";
import { notificacoesHoje, type TipoNotificacao } from "@/lib/mock-data";
import { cn } from "@/lib/utils/cn";

const meta: Record<
  TipoNotificacao,
  { Icon: typeof IconBell; cor: string }
> = {
  agendamento: { Icon: IconCalendar, cor: "bg-primary-soft text-primary" },
  pagamento: { Icon: IconWallet, cor: "bg-success/12 text-success" },
  mensagem: { Icon: IconWhatsApp, cor: "bg-accent-soft text-accent" },
  alerta: { Icon: IconSparkles, cor: "bg-danger/12 text-danger" },
};

export function Notificacoes() {
  const [lista, setLista] = useState(notificacoesHoje);
  const naoLidas = lista.filter((n) => !n.lida).length;

  function marcarTodas() {
    setLista((ns) => ns.map((n) => ({ ...n, lida: true })));
  }

  return (
    <Dropdown
      ariaLabel="Notificações"
      panelClassName="w-[360px] p-2"
      trigger={() => (
        <span className="relative grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-ink/70 transition-colors hover:text-ink">
          <IconBell width={19} height={19} />
          {naoLidas > 0 && (
            <span className="absolute right-1.5 top-1.5 grid h-4 min-w-[1rem] place-items-center rounded-full bg-accent px-1 text-[0.6rem] font-semibold text-accent-fg ring-2 ring-surface nums">
              {naoLidas}
            </span>
          )}
        </span>
      )}
    >
      <>
        <div className="flex items-center justify-between px-3 pb-2 pt-2">
          <p className="text-sm font-semibold text-ink">Notificações de hoje</p>
          {naoLidas > 0 && (
            <button
              onClick={marcarTodas}
              className="text-xs font-medium text-primary hover:underline"
            >
              Marcar todas como lidas
            </button>
          )}
        </div>

        <ul className="max-h-[380px] space-y-0.5 overflow-y-auto">
          {lista.map((n) => {
            const { Icon, cor } = meta[n.tipo];
            return (
              <li key={n.id}>
                <button
                  onClick={() =>
                    setLista((ns) =>
                      ns.map((x) => (x.id === n.id ? { ...x, lida: true } : x)),
                    )
                  }
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-primary-soft/40",
                    !n.lida && "bg-primary-soft/25",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                      cor,
                    )}
                  >
                    <Icon width={17} height={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-ink">
                        {n.titulo}
                      </span>
                      <span className="shrink-0 text-[0.68rem] text-muted nums">
                        {n.hora}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-muted">
                      {n.descricao}
                    </span>
                  </span>
                  {!n.lida && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {lista.length === 0 && (
          <p className="px-3 py-8 text-center text-sm text-muted">
            Nenhuma notificação hoje.
          </p>
        )}
      </>
    </Dropdown>
  );
}
