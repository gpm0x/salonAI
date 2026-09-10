"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CartaoAuth, atrasoCampo } from "@/components/auth/shared/CartaoAuth";
import { CampoAuth } from "@/components/auth/shared/CampoAuth";
import { CampoSenha } from "@/components/auth/shared/CampoSenha";
import { MedidorSenha } from "@/components/auth/shared/MedidorSenha";
import { PassosAuth } from "@/components/auth/shared/PassosAuth";
import { MarcaMobile } from "@/components/auth/shared/MarcaMobile";
import {
  CodigoInput,
  type StatusCodigo,
} from "@/components/auth/esqueci-senha/CodigoInput";
import {
  IconMail,
  IconArrowRight,
  IconCheck,
} from "@/components/ui/icons";
import { forcaSenha, dicaSenha } from "@/lib/utils/senha";

const TAMANHO_CODIGO = 6;
// Tempo de espera (em segundos) antes de permitir reenviar o código.
const ESPERA_REENVIO = 30;
// Mock enquanto não há API: troque pela verificação real do código.
const CODIGO_DEMO = "123456";

const passos = ["E-mail", "Código", "Nova senha"];

export function EsqueciSenhaForm() {
  const [etapa, setEtapa] = useState<1 | 2 | 3>(1);
  const [concluido, setConcluido] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});

  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [status, setStatus] = useState<StatusCodigo>("digitando");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [espera, setEspera] = useState(0);

  const forca = forcaSenha(senha);

  // Contagem regressiva do reenvio.
  useEffect(() => {
    if (espera <= 0) return;
    const t = setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [espera]);

  // Verifica assim que o código fica completo.
  useEffect(() => {
    if (etapa !== 2 || status !== "digitando" || codigo.length < TAMANHO_CODIGO)
      return;
    setStatus("verificando");
    // troque pela verificação real na API
    const t = setTimeout(() => {
      setStatus(codigo === CODIGO_DEMO ? "sucesso" : "erro");
    }, 750);
    return () => clearTimeout(t);
  }, [codigo, etapa, status]);

  // Encadeia o que vem depois da animação: avança ou libera nova tentativa.
  useEffect(() => {
    if (status === "sucesso") {
      const t = setTimeout(() => setEtapa(3), 1100);
      return () => clearTimeout(t);
    }
    if (status === "erro") {
      const t = setTimeout(() => {
        setCodigo("");
        setStatus("digitando");
      }, 1700);
      return () => clearTimeout(t);
    }
  }, [status]);

  function irParaCodigo() {
    setCodigo("");
    setStatus("digitando");
    setEtapa(2);
    setEspera(ESPERA_REENVIO);
  }

  // ── Passo 1: enviar o código ────────────────
  function enviarCodigo(ev: FormEvent) {
    ev.preventDefault();

    const e: Record<string, string> = {};
    if (!email.trim()) e.email = "Informe seu e-mail.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "E-mail inválido.";
    setErros(e);
    if (Object.keys(e).length) return;

    setEnviando(true);
    // simula o envio do código; troque pela chamada real da API
    setTimeout(() => {
      setEnviando(false);
      irParaCodigo();
    }, 1200);
  }

  function reenviar() {
    if (espera > 0) return;
    setEspera(ESPERA_REENVIO);
    // dispare aqui o reenvio real do código
  }

  // ── Passo 3: trocar a senha ─────────────────
  function trocarSenha(ev: FormEvent) {
    ev.preventDefault();

    const e: Record<string, string> = {};
    if (!senha) e.senha = "Crie uma senha.";
    else if (senha.length < 8)
      e.senha = "A senha precisa ter ao menos 8 caracteres.";
    if (confirmar !== senha) e.confirmar = "As senhas não coincidem.";
    setErros(e);
    if (Object.keys(e).length) return;

    setEnviando(true);
    // simula a troca da senha; troque pela chamada real da API
    setTimeout(() => {
      setEnviando(false);
      setConcluido(true);
    }, 1300);
  }

  // ── Senha alterada ──────────────────────────
  if (concluido) {
    return (
      <div className="relative animate-fade-up rounded-3xl border border-line bg-surface/80 p-7 text-center shadow-card backdrop-blur-md sm:p-8">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-success to-transparent"
        />

        <span className="mx-auto grid h-16 w-16 animate-pop place-items-center rounded-3xl bg-success/15 text-success">
          <IconCheck width={30} height={30} />
        </span>

        <p
          className="eyebrow mt-6 animate-fade-up text-success"
          style={{ animationDelay: "120ms" }}
        >
          Conta protegida
        </p>
        <h1
          className="mt-2 animate-fade-up font-display text-[1.9rem] leading-[1.12] text-ink"
          style={{ animationDelay: "170ms" }}
        >
          Senha alterada
        </h1>
        <p
          className="mt-2 animate-fade-up text-sm leading-relaxed text-muted"
          style={{ animationDelay: "220ms" }}
        >
          Sua nova senha já está valendo. Por segurança, encerramos as outras
          sessões conectadas à sua conta.
        </p>

        <Link
          href="/login"
          className="mt-7 block animate-fade-up"
          style={{ animationDelay: "280ms" }}
        >
          <Button size="lg" className="group w-full">
            Entrar no painel
            <IconArrowRight
              width={17}
              height={17}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <MarcaMobile />

      <CartaoAuth
        eyebrow="Recuperar acesso"
        titulo={
          <>
            {etapa === 1 && "Esqueceu a senha?"}
            {etapa === 2 && "Digite o código"}
            {etapa === 3 && "Criar nova senha"}
          </>
        }
        descricao={
          <>
            {etapa === 1 &&
              "Sem problema. Informe o e-mail da sua conta e enviamos um código de verificação."}
            {etapa === 2 && (
              <>
                Enviamos um código de {TAMANHO_CODIGO} dígitos para{" "}
                <span className="font-medium text-ink">{email}</span>.
              </>
            )}
            {etapa === 3 &&
              "Escolha uma senha nova e diferente das anteriores."}
          </>
        }
        rodape={
          <>
            Lembrou a senha?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              Voltar para o login
            </Link>
          </>
        }
      >
        <PassosAuth
          passos={passos}
          atual={etapa}
          className="mt-6 animate-fade-up"
        />

      {/* ── Passo 1: e-mail ── */}
      {etapa === 1 && (
        <form onSubmit={enviarCodigo} className="mt-6 space-y-4">
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
              autoFocus
              icon={<IconMail width={17} height={17} />}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (erros.email) setErros({});
              }}
              erro={erros.email}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="group w-full"
            disabled={enviando}
          >
            {enviando ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-fg/30 border-t-primary-fg" />
                Enviando código…
              </>
            ) : (
              <>
                Enviar código
                <IconArrowRight
                  width={17}
                  height={17}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </>
            )}
          </Button>
        </form>
      )}

      {/* ── Passo 2: código de verificação ── */}
      {etapa === 2 && (
        <div className="mt-8">
          <CodigoInput
            valor={codigo}
            onChange={setCodigo}
            status={status}
            tamanho={TAMANHO_CODIGO}
          />

          <div className="mt-6 space-y-3 text-center text-sm">
            <p className="text-muted">
              Não recebeu?{" "}
              {espera > 0 ? (
                <span className="nums text-muted/70">
                  reenviar em {espera}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={reenviar}
                  className="font-semibold text-primary transition-colors hover:text-accent"
                >
                  Reenviar código
                </button>
              )}
            </p>
            <button
              type="button"
              onClick={() => {
                setEtapa(1);
                setCodigo("");
                setStatus("digitando");
              }}
              className="text-xs font-medium text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              Usar outro e-mail
            </button>
          </div>
        </div>
      )}

      {/* ── Passo 3: nova senha ── */}
      {etapa === 3 && (
        <form onSubmit={trocarSenha} className="mt-6 space-y-4">
          <div
            className="animate-fade-up"
            style={{ animationDelay: atrasoCampo(0) }}
          >
            <CampoSenha
              label="Nova senha"
              name="senha"
              placeholder="Mínimo de 8 caracteres"
              autoComplete="new-password"
              autoFocus
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                if (erros.senha) setErros((x) => ({ ...x, senha: "" }));
              }}
              erro={erros.senha}
            />
            {senha && !erros.senha && (
              <MedidorSenha forca={forca} dica={dicaSenha(senha)} />
            )}
          </div>

          <div
            className="animate-fade-up"
            style={{ animationDelay: atrasoCampo(1) }}
          >
            <CampoSenha
              label="Confirmar nova senha"
              name="confirmar"
              placeholder="Repita a senha"
              autoComplete="new-password"
              value={confirmar}
              onChange={(e) => {
                setConfirmar(e.target.value);
                if (erros.confirmar) setErros((x) => ({ ...x, confirmar: "" }));
              }}
              erro={erros.confirmar}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="group w-full"
            disabled={enviando}
          >
            {enviando ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-fg/30 border-t-primary-fg" />
                Salvando…
              </>
            ) : (
              <>
                Salvar nova senha
                <IconArrowRight
                  width={17}
                  height={17}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </>
            )}
          </Button>
        </form>
      )}

      </CartaoAuth>
    </>
  );
}
