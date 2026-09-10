"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CartaoAuth, atrasoCampo } from "@/components/auth/shared/CartaoAuth";
import {
  CampoAuth,
  CLASSES_CAMPO,
  classesEstado,
  MensagemErro,
  RotuloCampo,
} from "@/components/auth/shared/CampoAuth";
import { CampoSenha } from "@/components/auth/shared/CampoSenha";
import { MedidorSenha } from "@/components/auth/shared/MedidorSenha";
import { PassosAuth } from "@/components/auth/shared/PassosAuth";
import { AvisoErro } from "@/components/auth/shared/AvisoErro";
import { MarcaMobile } from "@/components/auth/shared/MarcaMobile";
import {
  IconMail,
  IconUser,
  IconStore,
  IconPhone,
  IconArrowRight,
  IconCheck,
  IconScissors,
  IconSparkles,
  IconUsers,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";
import { forcaSenha, dicaSenha } from "@/lib/utils/senha";
import { authClient } from "@/lib/auth/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

type Tipo = "salao" | "barbearia" | "ambos";

const tipos: { valor: Tipo; label: string; Icon: typeof IconScissors }[] = [
  { valor: "salao", label: "Salão", Icon: IconSparkles },
  { valor: "barbearia", label: "Barbearia", Icon: IconScissors },
  { valor: "ambos", label: "Ambos", Icon: IconStore },
];

const tamanhos = [
  "Sou só eu",
  "2 a 5 profissionais",
  "6 a 15 profissionais",
  "Mais de 15",
];

const PASSOS = ["Sua conta", "Seu salão"];

export function CadastroForm() {
  const router = useRouter();
  const [etapa, setEtapa] = useState<1 | 2>(1);
  const [concluido, setConcluido] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmar: "",
    nomeSalao: "",
    telefone: "",
    tipo: "salao" as Tipo,
    tamanho: tamanhos[1],
    aceite: false,
  });

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    if (erros[k]) setErros((e) => ({ ...e, [k]: "" }));
  }

  const forca = forcaSenha(form.senha);

  function validarEtapa1() {
    const e: Record<string, string> = {};
    if (!form.nome.trim()) e.nome = "Informe seu nome.";
    if (!form.email.trim()) e.email = "Informe seu e-mail.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "E-mail inválido.";
    if (!form.senha) e.senha = "Crie uma senha.";
    else if (form.senha.length < 8)
      e.senha = "A senha precisa ter ao menos 8 caracteres.";
    if (form.confirmar !== form.senha)
      e.confirmar = "As senhas não coincidem.";
    setErros(e);
    return Object.keys(e).length === 0;
  }

  function avancar(ev: FormEvent) {
    ev.preventDefault();
    if (validarEtapa1()) setEtapa(2);
  }

  async function finalizar(ev: FormEvent) {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!form.nomeSalao.trim()) e.nomeSalao = "Informe o nome do salão.";
    if (!form.telefone.trim()) e.telefone = "Informe um telefone.";
    if (!form.aceite) e.aceite = "É preciso aceitar os termos para continuar.";
    setErros(e);
    if (Object.keys(e).length) return;

    setEnviando(true);
    try {
      // 1) Conta + sessão via Better Auth (rota /api/auth do próprio Next).
      const { data, error } = await authClient.signUp.email({
        email: form.email,
        password: form.senha,
        name: form.nome,
      });

      if (error || !data) {
        setErros({ _global: error?.message ?? "Erro ao criar conta." });
        return;
      }

      // 2) Organização na API Fastify, autenticada com o token recém-criado.
      const token = data.token;
      if (!token) throw new Error("Sessão não criada");

      const res = await fetch(`${API_URL}/api/organizations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: form.nomeSalao }),
      });

      if (!res.ok) throw new Error("Erro ao criar organização");

      setConcluido(true);
    } catch {
      setErros({ _global: "Erro ao criar conta. Tente novamente." });
    } finally {
      setEnviando(false);
    }
  }

  // ── Sucesso ─────────────────────────────────
  /*
    O ouro da paleta é reservado a "premium, IA e conquistas". Criar o salão é
    a conquista da jornada — é o único momento destas telas em que ele aparece,
    e por isso marca.
  */
  if (concluido) {
    return (
      <div className="relative animate-fade-up rounded-3xl border border-line bg-surface/80 p-7 text-center shadow-card backdrop-blur-md sm:p-8">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-gold-solid to-transparent"
        />

        <span className="mx-auto grid h-16 w-16 animate-pop place-items-center rounded-3xl bg-gold-solid text-gold-fg shadow-gilt">
          <IconCheck width={30} height={30} />
        </span>

        <p
          className="eyebrow mt-6 animate-fade-up text-gold"
          style={{ animationDelay: "120ms" }}
        >
          Tudo pronto
        </p>
        <h1
          className="mt-2 animate-fade-up font-display text-[1.9rem] leading-[1.12] text-ink"
          style={{ animationDelay: "170ms" }}
        >
          Salão criado
        </h1>
        <p
          className="mt-2 animate-fade-up text-sm leading-relaxed text-muted"
          style={{ animationDelay: "220ms" }}
        >
          Bem-vindo, {form.nome.split(" ")[0]}. O{" "}
          <span className="font-semibold text-ink">{form.nomeSalao}</span> já
          está no ar.
        </p>

        <div
          className="mt-7 animate-fade-up rounded-2xl border border-line bg-bg/50 p-4 text-left"
          style={{ animationDelay: "280ms" }}
        >
          <p className="eyebrow flex items-center gap-2 text-muted">
            <IconSparkles width={13} height={13} className="text-gold" />
            Próximos passos
          </p>
          <ul className="mt-3 space-y-2.5">
            {[
              "Cadastrar seus serviços e preços",
              "Adicionar os profissionais da equipe",
              "Conectar o WhatsApp do salão",
            ].map((p, i) => (
              <li
                key={p}
                className="flex animate-fade-up items-start gap-2.5 text-sm text-ink/85"
                style={{ animationDelay: `${330 + i * 60}ms` }}
              >
                <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-success/15 text-success">
                  <IconCheck width={10} height={10} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="mt-6 animate-fade-up"
          style={{ animationDelay: "520ms" }}
        >
          <Button
            size="lg"
            className="group w-full"
            onClick={() => {
              router.push("/dashboard");
              router.refresh();
            }}
          >
            Ir para o painel
            <IconArrowRight
              width={17}
              height={17}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Button>
        </div>

        <p className="mt-4 text-xs text-muted">
          14 dias grátis. Sem cartão de crédito.
        </p>
      </div>
    );
  }

  // ── Formulário ──────────────────────────────
  return (
    <>
      <MarcaMobile />

      {/* O trilho de etapas já diz onde estamos — o eyebrow carrega o contexto. */}
      <CartaoAuth
        eyebrow={etapa === 1 ? "Nova conta" : "Quase lá"}
        titulo={etapa === 1 ? "Criar meu salão" : "Sobre o seu salão"}
        descricao={
          etapa === 1
            ? "Comece grátis por 14 dias. Sem cartão de crédito."
            : "Só mais alguns dados para deixar tudo pronto."
        }
        rodape={
          <>
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              Entrar
            </Link>
          </>
        }
      >
        <PassosAuth
          passos={PASSOS}
          atual={etapa}
          className="mt-6 animate-fade-up"
        />

        {/* ── Etapa 1: seus dados ── */}
        {etapa === 1 && (
          <form onSubmit={avancar} className="mt-6 space-y-4">
            <div
              className="animate-fade-up"
              style={{ animationDelay: atrasoCampo(0) }}
            >
              <CampoAuth
                label="Seu nome"
                name="nome"
                placeholder="Como podemos te chamar?"
                autoComplete="name"
                icon={<IconUser width={17} height={17} />}
                value={form.nome}
                onChange={(e) => set("nome", e.target.value)}
                erro={erros.nome}
              />
            </div>

            <div
              className="animate-fade-up"
              style={{ animationDelay: atrasoCampo(1) }}
            >
              <CampoAuth
                label="E-mail"
                name="email"
                type="email"
                placeholder="voce@salao.com.br"
                autoComplete="email"
                icon={<IconMail width={17} height={17} />}
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                erro={erros.email}
              />
            </div>

            <div
              className="animate-fade-up"
              style={{ animationDelay: atrasoCampo(2) }}
            >
              <CampoSenha
                label="Senha"
                name="senha"
                placeholder="Mínimo de 8 caracteres"
                autoComplete="new-password"
                value={form.senha}
                onChange={(e) => set("senha", e.target.value)}
                erro={erros.senha}
              />
              {form.senha && !erros.senha && (
                <MedidorSenha forca={forca} dica={dicaSenha(form.senha)} />
              )}
            </div>

            <div
              className="animate-fade-up"
              style={{ animationDelay: atrasoCampo(3) }}
            >
              <CampoSenha
                label="Confirmar senha"
                name="confirmar"
                placeholder="Repita a senha"
                autoComplete="new-password"
                value={form.confirmar}
                onChange={(e) => set("confirmar", e.target.value)}
                erro={erros.confirmar}
              />
            </div>

            <div
              className="animate-fade-up pt-1"
              style={{ animationDelay: atrasoCampo(4) }}
            >
              <Button type="submit" size="lg" className="group w-full">
                Continuar
                <IconArrowRight
                  width={17}
                  height={17}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Button>
            </div>
          </form>
        )}

        {/* ── Etapa 2: dados do salão ── */}
        {etapa === 2 && (
          <form onSubmit={finalizar} className="mt-6 space-y-4">
            <CampoAuth
              label="Nome do salão"
              name="nomeSalao"
              placeholder="Ex.: Studio Centro"
              icon={<IconStore width={17} height={17} />}
              value={form.nomeSalao}
              onChange={(e) => set("nomeSalao", e.target.value)}
              erro={erros.nomeSalao}
            />

            <CampoAuth
              label="Telefone"
              name="telefone"
              placeholder="(11) 90000-0000"
              autoComplete="tel"
              icon={<IconPhone width={17} height={17} />}
              value={form.telefone}
              onChange={(e) => set("telefone", e.target.value)}
              erro={erros.telefone}
            />

            {/*
              Segmentado com ícone: três alvos de toque grandes, e o ícone
              carrega a distinção antes da leitura do rótulo.
            */}
            <fieldset className="min-w-0">
              <legend className="eyebrow mb-1.5 text-[0.625rem] text-muted">
                Tipo de negócio
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {tipos.map(({ valor, label, Icon }) => {
                  const ativo = form.tipo === valor;
                  return (
                    <button
                      key={valor}
                      type="button"
                      aria-pressed={ativo}
                      onClick={() => set("tipo", valor)}
                      className={cn(
                        "flex h-[4.25rem] flex-col items-center justify-center gap-1.5 rounded-xl border text-xs font-medium",
                        "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                        ativo
                          ? "border-primary bg-primary-soft text-primary shadow-soft"
                          : "border-line bg-bg/50 text-muted hover:border-primary/40 hover:text-ink",
                      )}
                    >
                      <Icon
                        width={18}
                        height={18}
                        className={cn(
                          "transition-colors",
                          ativo ? "text-primary" : "text-muted",
                        )}
                      />
                      {label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="group flex min-w-0 flex-col gap-1.5">
              <RotuloCampo htmlFor="tamanho">Tamanho da equipe</RotuloCampo>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted transition-colors duration-200 group-focus-within:text-accent">
                  <IconUsers width={17} height={17} />
                </span>
                <select
                  id="tamanho"
                  value={form.tamanho}
                  onChange={(e) => set("tamanho", e.target.value)}
                  className={cn(CLASSES_CAMPO, classesEstado(), "pl-10")}
                >
                  {tamanhos.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Termos */}
            <div>
              <label className="flex cursor-pointer items-start gap-2.5 text-sm text-muted transition-colors hover:text-ink/80">
                <input
                  type="checkbox"
                  checked={form.aceite}
                  onChange={(e) => set("aceite", e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded-[5px] border-line accent-[hsl(var(--primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                />
                <span className="leading-snug">
                  Li e aceito os{" "}
                  <Link
                    href="#"
                    className="font-medium text-primary underline-offset-4 hover:text-accent hover:underline"
                  >
                    Termos de uso
                  </Link>{" "}
                  e a{" "}
                  <Link
                    href="#"
                    className="font-medium text-primary underline-offset-4 hover:text-accent hover:underline"
                  >
                    Política de privacidade
                  </Link>
                  .
                </span>
              </label>
              {erros.aceite && (
                // alinhado com o texto do rótulo, não com a caixa de seleção
                <div className="mt-1.5 pl-[1.625rem]">
                  <MensagemErro>{erros.aceite}</MensagemErro>
                </div>
              )}
            </div>

            {erros._global && <AvisoErro>{erros._global}</AvisoErro>}

            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setEtapa(1)}
                disabled={enviando}
              >
                Voltar
              </Button>
              <Button
                type="submit"
                size="lg"
                className="group flex-1"
                disabled={enviando}
              >
                {enviando ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-fg/30 border-t-primary-fg" />
                    Criando salão…
                  </>
                ) : (
                  <>
                    Criar meu salão
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
        )}
      </CartaoAuth>
    </>
  );
}
