import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { IconScissors, IconMail, IconArrowRight } from "@/components/ui/icons";

export default function Page() {
  return (
    <div>
      {/* Marca (mobile) */}
      <div className="mb-8 flex items-center gap-2.5 lg:hidden">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-fg">
          <IconScissors width={18} height={18} />
        </span>
        <span className="font-display text-xl text-ink">Salon AI</span>
      </div>

      <h1 className="font-display text-[2rem] leading-tight text-ink">
        Bem-vindo de volta
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        Acesse o painel e veja o pulso do seu salão hoje.
      </p>

      <form className="mt-8 space-y-4">
        <Input
          label="E-mail"
          name="email"
          type="email"
          placeholder="voce@salao.com.br"
          autoComplete="email"
          icon={<IconMail width={17} height={17} />}
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              Senha
            </span>
            <Link
              href="#"
              className="text-xs font-medium text-primary transition-colors hover:text-accent"
            >
              Esqueci a senha
            </Link>
          </div>
          <PasswordInput
            name="senha"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted">
          <input
            type="checkbox"
            name="lembrar"
            defaultChecked
            className="h-4 w-4 rounded border-line text-primary accent-[hsl(var(--primary))] focus:ring-2 focus:ring-primary/30"
          />
          Manter conectado neste dispositivo
        </label>

        <Button type="submit" size="lg" className="group w-full">
          Entrar no painel
          <IconArrowRight
            width={17}
            height={17}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted/70">
        <span className="h-px flex-1 bg-line" />
        ou
        <span className="h-px flex-1 bg-line" />
      </div>

      <p className="text-center text-sm text-muted">
        Ainda não tem conta?{" "}
        <Link
          href="/cadastro"
          className="font-semibold text-primary transition-colors hover:text-accent"
        >
          Criar meu salão
        </Link>
      </p>
    </div>
  );
}
