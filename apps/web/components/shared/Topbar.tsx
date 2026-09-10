import { MenuMobile } from "@/components/shared/MenuMobile";
import { SeletorUnidade } from "@/components/shared/SeletorUnidade";
import { BuscaGlobal } from "@/components/shared/BuscaGlobal";
import { Notificacoes } from "@/components/shared/Notificacoes";
import { MenuUsuario } from "@/components/shared/MenuUsuario";
import { BotaoTema } from "@/components/shared/SeletorTema";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-line bg-bg/80 px-4 backdrop-blur-md sm:gap-3 sm:px-5 lg:gap-4 lg:px-8">
      {/* Só existe abaixo de lg, onde a barra lateral está escondida */}
      <MenuMobile />
      <SeletorUnidade />
      <BuscaGlobal />

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        {/*
          No celular a barra já disputa espaço com o menu, a unidade, o sino e
          o avatar. O tema sai daqui e continua acessível em
          Configurações → Aparência, que é onde ele é de fato procurado.
        */}
        <BotaoTema className="hidden sm:grid" />
        <Notificacoes />
        <MenuUsuario />
      </div>
    </header>
  );
}
