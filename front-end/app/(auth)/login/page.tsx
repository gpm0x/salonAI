import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { IconScissors } from "@/components/ui/icons";

export default function Page() {
  return (
    <div>
      {/* Marca (mobile) */}
      <div className="mb-8 flex items-center gap-2.5 lg:hidden">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-fg">
          <IconScissors width={18} height={18} />
        </span>
        <span className="font-display text-xl text-ink">Ateliê</span>
      </div>

      <h1 className="font-display text-3xl text-ink">Entrar</h1>
      <p className="mt-1.5 text-sm text-muted">
        Bem-vindo de volta. Acesse o painel do seu salão.
      </p>

      <form className="mt-8 space-y-4">
        <Input
          label="E-mail"
          name="email"
          type="email"
          placeholder="voce@salao.com.br"
          autoComplete="email"
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="senha"
              className="text-xs font-medium uppercase tracking-wide text-muted"
            >
              Senha
            </label>
            <Link
              href="#"
              className="text-xs font-medium text-primary hover:text-accent"
            >
              Esqueci a senha
            </Link>
          </div>
          <Input
            id="senha"
            name="senha"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        <Button type="submit" size="lg" className="w-full">
          Entrar no painel
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Ainda não tem conta?{" "}
        <Link
          href="/cadastro"
          className="font-semibold text-primary hover:text-accent"
        >
          Criar salão
        </Link>
      </p>
    </div>
  );
}
