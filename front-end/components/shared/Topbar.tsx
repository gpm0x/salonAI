import { SeletorUnidade } from "@/components/shared/SeletorUnidade";
import { BuscaGlobal } from "@/components/shared/BuscaGlobal";
import { Notificacoes } from "@/components/shared/Notificacoes";
import { MenuUsuario } from "@/components/shared/MenuUsuario";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-line bg-bg/80 px-5 backdrop-blur-md lg:px-8">
      <SeletorUnidade />
      <BuscaGlobal />

      <div className="ml-auto flex items-center gap-3">
        <Notificacoes />
        <MenuUsuario />
      </div>
    </header>
  );
}
