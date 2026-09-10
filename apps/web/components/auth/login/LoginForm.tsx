"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/Button";
import { CartaoAuth, atrasoCampo } from "@/components/auth/shared/CartaoAuth";
import { CampoAuth } from "@/components/auth/shared/CampoAuth";
import { CampoSenha } from "@/components/auth/shared/CampoSenha";
import { AvisoErro } from "@/components/auth/shared/AvisoErro";
import { MarcaMobile } from "@/components/auth/shared/MarcaMobile";
import { IconMail, IconArrowRight } from "@/components/ui/icons";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(true);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    setErro("");
    setEnviando(true);

    const { error } = await authClient.signIn.email({
      email,
      password: senha,
      rememberMe: lembrar,
    });

    if (error) {
      setErro(error.message ?? "E-mail ou senha incorretos.");
      setEnviando(false);
      return;
    }

    // `refresh` revalida o layout do dashboard, que roda `getSession()` no
    // servidor — sem isso o push cairia num layout renderizado sem sessão.
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <>
      <MarcaMobile />

      <CartaoAuth
        eyebrow="Acesso ao painel"
        titulo="Bem-vindo de volta"
        descricao="Entre para ver o pulso do seu salão hoje."
        rodape={
          <>
            Ainda não tem conta?{" "}
            <Link
              href="/cadastro"
              className="font-semibold text-primary underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              Criar meu salão
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div
            className="animate-fade-up"
            style={{ animationDelay: atrasoCampo(0) }}
          >
            <CampoAuth
              label="E-mail"
              name="email"
              type="email"
              placeholder="voce@salao.com.br"
              autoComplete="email"
              icon={<IconMail width={17} height={17} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/*
            O rótulo e o link dividem a linha, então o campo não pode usar a
            prop `label` do CampoSenha. O `group` fica aqui fora para que o
            rótulo continue acendendo quando o input recebe foco.
          */}
          <div
            className="group animate-fade-up flex flex-col gap-1.5"
            style={{ animationDelay: atrasoCampo(1) }}
          >
            <div className="flex items-baseline justify-between gap-3">
              <label
                htmlFor="senha"
                className="eyebrow text-[0.625rem] text-muted transition-colors group-focus-within:text-primary"
              >
                Senha
              </label>
              <Link
                href="/esqueci-senha"
                className="text-xs font-medium text-primary underline-offset-4 transition-colors hover:text-accent hover:underline"
              >
                Esqueci a senha
              </Link>
            </div>
            <CampoSenha
              id="senha"
              name="senha"
              placeholder="••••••••"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <label
            className="flex animate-fade-up cursor-pointer items-center gap-2.5 text-sm text-muted transition-colors hover:text-ink"
            style={{ animationDelay: atrasoCampo(2) }}
          >
            <input
              type="checkbox"
              name="lembrar"
              checked={lembrar}
              onChange={(e) => setLembrar(e.target.checked)}
              className="h-4 w-4 rounded-[5px] border-line accent-[hsl(var(--primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            />
            Manter conectado neste dispositivo
          </label>

          {erro && <AvisoErro>{erro}</AvisoErro>}

          <div
            className="animate-fade-up pt-1"
            style={{ animationDelay: atrasoCampo(3) }}
          >
            <Button
              type="submit"
              size="lg"
              className="group w-full"
              disabled={enviando}
            >
              {enviando ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-fg/30 border-t-primary-fg" />
                  Entrando…
                </>
              ) : (
                <>
                  Entrar no painel
                  <IconArrowRight
                    width={17}
                    height={17}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </>
              )}
            </Button>
          </div>
        </form>
      </CartaoAuth>
    </>
  );
}
