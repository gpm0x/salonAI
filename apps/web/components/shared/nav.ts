import {
  IconGauge,
  IconCalendar,
  IconUsers,
  IconScissors,
  IconStore,
  IconWallet,
  IconSparkles,
  IconWhatsApp,
  IconBrain,
  IconTarget,
} from "@/components/ui/icons";

/*
  Fonte única do menu — a barra lateral (lg+) e a gaveta do celular renderizam
  a mesma lista. Duplicar isso significa, na prática, que um item novo entra só
  no desktop e some no celular.
*/
export interface ItemNav {
  href: string;
  label: string;
  Icon: typeof IconGauge;
}

export const navPrincipal: ItemNav[] = [
  { href: "/dashboard", label: "Visão geral", Icon: IconGauge },
  { href: "/agenda", label: "Agenda", Icon: IconCalendar },
  { href: "/metas", label: "Metas", Icon: IconTarget },
  { href: "/clientes", label: "Clientes", Icon: IconUsers },
  { href: "/ia", label: "Inteligência IA", Icon: IconBrain },
  { href: "/whatsapp", label: "WhatsApp", Icon: IconWhatsApp },
  { href: "/profissionais", label: "Profissionais", Icon: IconScissors },
  { href: "/servicos", label: "Serviços", Icon: IconSparkles },
  { href: "/unidades", label: "Unidades", Icon: IconStore },
  { href: "/financeiro", label: "Financeiro", Icon: IconWallet },
];

// Um item está ativo na própria rota e em qualquer sub-rota dela.
export function rotaAtiva(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
